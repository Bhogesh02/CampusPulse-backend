const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'hackathon-secret-key-2024', {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
