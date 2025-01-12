const userModel = require('../models/userModel');

// User Registration
exports.addUser = (req, res) => {
    const { email, age } = req.body;
    if (!email || !age) {
        return res.status(400).json({ error: 'Email and age are required' });
    }

    const users = userModel.readUsers();
    if (users[email]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    users[email] = { email, age };
    userModel.writeUsers(users);
    res.status(201).json({ message: 'User added successfully' });
};

// Retrieve User Information
exports.getUser = (req, res) => {
    const { email } = req.params;
    const users = userModel.readUsers();
    if (!users[email]) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(users[email]);
};

// Update User Information
exports.updateUser = (req, res) => {
    const { email } = req.params;
    const { age } = req.body;
    if (!age) {
        return res.status(400).json({ error: 'Age is required' });
    }

    const users = userModel.readUsers();
    if (!users[email]) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[email].age = age;
    userModel.writeUsers(users);
    res.status(200).json({ message: 'User updated successfully' });
};

// Delete User Information
exports.deleteUser = (req, res) => {
    const { email } = req.params;
    const users = userModel.readUsers();
    if (!users[email]) {
        return res.status(404).json({ error: 'User not found' });
    }

    delete users[email];
    userModel.writeUsers(users);
    res.status(200).json({ message: 'User deleted successfully' });
};