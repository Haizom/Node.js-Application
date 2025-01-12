const fs = require('fs');
const path = require('path');

const USER_DB = path.join(__dirname, '../users.txt');

// Helper function to read user data from the file
exports.readUsers = () => {
    if (!fs.existsSync(USER_DB)) {
        return {};
    }
    const data = fs.readFileSync(USER_DB, 'utf-8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const users = {};
    lines.forEach(line => {
        const [email, age] = line.split(',');
        users[email] = { email, age };
    });
    return users;
};

// Helper function to write user data to the file
exports.writeUsers = (users) => {
    const data = Object.values(users).map(user => `${user.email},${user.age}`).join('\n');
    fs.writeFileSync(USER_DB, data);
};