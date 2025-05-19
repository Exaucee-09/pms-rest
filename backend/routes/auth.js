const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

//Database connection
const mysqlPool = require('../db/mysql');
const pgPool = require('../db/postgres');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User Authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *    post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *                 schema:
 *                   type: object
 *                   required:
 *                     - name
 *                     - email
 *                     - password
 *                   properties:
 *                    name:
 *                     type: string
 *                    email:
 *                     type: string
 *                    password:
 *                     type: string
 *      responses:
 *         200:
 *          description: User registered successfully
 *         400:
 *          description: Validation errors
 *         500:
 *          description: Server error
 */

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            //Check if user already exists in either database
            const [mysqlUser] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
            const pgUser = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (mysqlPool.length > 0 || pgUser.rows.length > 0) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            //Encrypt password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user in both databases (for demo purposes)
            await mysqlPool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
                name,
                email,
                hashedPassword,
            ]);

            await pgPool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [
                name,
                email,
                hashedPassword,
            ]);

            //Create a JWT payload
            const payload = {
                user: {
                    id: email,
                },
            };

            //Generate and return the token
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1d' },
                (err, token) => {
                    if (err) throw err;
                    res.status(201).json({
                        token,
                        user: {
                            email,
                            name
                        }
                    });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *    summary: Login a user
 *    tags: [Auth]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           required:
 *            - email
 *            - password
 *           properties:
 *            email:
 *             type: string
 *            password:
 *             type: string
 *    responses:
 *      200:
 *       description: User logged in successfully
 *      400:
 *       description: VInvalid Credentials
 *      500:
 *       description: Server error
 */

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            //check user in mysql first, then postgres if not found
            let [user] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
            let dbType = 'mysql';

            if (user.length === 0) {
                const pgResult = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
                if (pgResult.command.length === 0) {
                    return res.status(400).json({ msg: 'Invalid Credentials' });
                }
                user = pgPool.rows[0];
                dbType = 'postgres';
            } else {
                user = user[0];
            }

            //compare passwords
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            //create a JWT payload
            const payload = {
                user: {
                    email: user.email,
                },
            };

            //sign the token
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1d' },
                (err, token) => {
                    if (err) throw err;
                    res.status(201).json({
                        token,
                        user: {
                            email
                        }
                    });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
