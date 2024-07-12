// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../util');
require('dotenv').config()
//-----------------register page----------------
const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = getDb();
    await db.collection('users').insertOne({ username, password: hashedPassword });

    //---------------------- Generate token--------------------------------
    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '1h' });
    await db.collection('sessions').insertOne({ username, token });

    req.session.token = token;
    res.redirect('/dashboard');
};
//----------------------login-page-------------------------------------------------------
const login = async (req, res) => {
    const { username, password } = req.body;

    const db = getDb();
    const user = await db.collection('users').findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        // Generate token
        const token = jwt.sign({ username: user.username },  process.env.SECRET_KEY, { expiresIn: '1h' });
        await db.collection('sessions').insertOne({ username, token });

        req.session.token = token;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
};
// -----------------log out ----------------------------------
const logout = async (req, res) => {
    const token = req.session.token;

    const db = getDb();
    await db.collection('sessions').deleteOne({ token });

    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard'); // handle error
        }
        res.redirect('/');
    });
};
//------------------all log-out ------ from device-----------------
const logoutAllDevices = async (req, res) => {
    const db = getDb();
    const { username } = req.user;

    await db.collection('sessions').deleteMany({ username });

    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard'); // handle error
        }
        res.redirect('/');
    });
};

//--------------------check token ---------------------
const verifyToken = async (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.redirect('/login');
    }

    const db = getDb();
    const session = await db.collection('sessions').findOne({ token });

    if (!session) {
        return res.redirect('/login');
    }

    jwt.verify(token,  process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/login');
        }
        req.user = decoded;
        next();
    });
};


module.exports = { register, login, logout, logoutAllDevices, verifyToken };
