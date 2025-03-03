const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendVerificationEmail } = require('../config/mailer');
require('dotenv').config();

const router = express.Router();

//! Customer Registration
router.post('/register/customer', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const sql = "INSERT INTO users (firstName, lastName, email, password, role, verificationToken) VALUES (?, ?, ?, ?, 'customer', ?)";
    db.query(sql, [firstName, lastName, email, hashedPassword, verificationToken], (err) => {
        if (err) return res.status(500).json({ message: "Error registering user" });

        sendVerificationEmail(email, verificationToken);
        res.json({ message: "Registration successful! Please check your email to verify your account." });
    });
});

//! Admin Registration
router.post('/register/admin', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const sql = "INSERT INTO users (firstName, lastName, email, password, role, verificationToken) VALUES (?, ?, ?, ?, 'admin', ?)";
    db.query(sql, [firstName, lastName, email, hashedPassword, verificationToken], (err) => {
        if (err) return res.status(500).json({ message: "Error registering user" });

        sendVerificationEmail(email, verificationToken);
        res.json({ message: "Admin registration successful! Please check your email to verify your account." });
    });
});

// ! Verify Email
router.get('/verify-email/:token', (req, res) => {
    const { token } = req.params;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        db.query("UPDATE users SET isVerified = true WHERE email = ?", [decoded.email], (err) => {
            if (err) return res.status(500).json({ message: "Error verifying email" });
            res.json({ message: "Email verified successfully!" });
        });
    } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
});

//!Admin Login
router.post('/login/admin', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });

        if (results.length === 0) return res.status(401).json({ message: "Invalid Credentials" });

        const user = results[0];

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "You are not allowed to login from here" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, message: "Admin Login Successful" });
    });
});

module.exports = router;
