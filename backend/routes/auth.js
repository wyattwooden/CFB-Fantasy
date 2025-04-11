const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool instance here instead of importing from server.js
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Register new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Log the incoming request
    console.log('Registration attempt:', { username, email });
    
    if (!username || !email || !password) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        // Check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (userExists.rows.length > 0) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert new user
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );
        
        console.log('User created successfully:', newUser.rows[0]);
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error('Registration error:', {
            message: err.message,
            detail: err.detail,
            code: err.code,
            stack: err.stack
        });
        res.status(500).json({ 
            error: 'Server error',
            message: err.message,
            detail: err.detail
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    try {
        // Check if user exists
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (user.rows.length === 0) {
            console.log('Login failed: User not found');
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        
        if (!validPassword) {
            console.log('Login failed: Invalid password');
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Return user data (excluding password)
        const { id, username, email } = user.rows[0];
        console.log('Login successful:', { id, username, email });
        res.json({ id, username, email });
    } catch (err) {
        console.error('Login error:', {
            message: err.message,
            detail: err.detail,
            code: err.code,
            stack: err.stack
        });
        res.status(500).json({ 
            error: 'Server error',
            message: err.message,
            detail: err.detail
        });
    }
});

module.exports = router; 