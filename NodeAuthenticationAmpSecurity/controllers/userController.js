// controllers/userController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../util');

const getAllUsers = async (req, res) => {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.render('users', { users });
};

const createUser = async (req, res) => {
    const { username, password } = req.body;
    const db = getDb();
    await db.collection('users').insertOne({ username, password });
    res.redirect('/users');
};

// Get a single user by ID
const getUser = (userId) => {
    try {
        const objectId = new ObjectId(userId);
  
        return objectId;
    } catch (err) {
        console.error('Error creating ObjectId:', err);
        return null;
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    const db = getDb();
    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: { username, password } });
    res.redirect('/users');
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const db = getDb();
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    res.redirect('/users');
};

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser };
