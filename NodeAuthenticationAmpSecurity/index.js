const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const { connectDB  } = require('./util');


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Initialize MongoDB connection
connectDB().catch(err => console.error(err));

app.use('/', indexRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
