app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user in simulated database
        const user = users.find(user => user.username === username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ username: user.username },  process.env.SECRET_KEY, { expiresIn: '1h' });

        // Store token in session or response as needed
        req.session.token = token;

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
