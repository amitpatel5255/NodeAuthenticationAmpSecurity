function verifyToken(req, res, next) {
    const token = req.session.token || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, token missing' });
    }

    jwt.verify(token,  process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Access denied, invalid token' });
        }
        req.user = decoded;
        next();
    });
}

// Example of using middleware
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route', user: req.user });
});
