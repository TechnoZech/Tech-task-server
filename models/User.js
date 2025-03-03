const db = require('../config/db');

const createUserTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(50),
        lastName VARCHAR(50),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role ENUM('admin', 'customer'),
        isVerified BOOLEAN DEFAULT false,
        verificationToken VARCHAR(255)
    )`;
    db.query(sql, (err) => {
        if (err) throw err;
        console.log("User Table Created");
    });
};

createUserTable();
module.exports = db;
