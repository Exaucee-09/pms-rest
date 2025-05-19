const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Database connection
const mysqlPool = require('../db/mysql');
const pgPool = require('../db/postgres');

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - license_plate
 *               - model
 *               - color
 *             properties:
 *               license_plate:
 *                 type: string
 *               model:
 *                 type: string
 *               color:
 *                 type: string
 *               owner_email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
    const { license_plate, model, color, owner_email } = req.body;

    try {
        await mysqlPool.query(
            'INSERT INTO vehicles (license_plate, model, color, owner_email) VALUES (?, ?, ?, ?)',
            [license_plate, model, color, owner_email]
        );

        res.json({ msg: 'Vehicle added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', auth, async (req, res) => {
    try {
        const [vehicles] = await mysqlPool.query('SELECT * FROM vehicles');
        res.json(vehicles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/vehicles/{license_plate}:
 *   get:
 *     summary: Get vehicle by license plate
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: license_plate
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle details
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
router.get('/:license_plate', auth, async (req, res) => {
    try {
        const [vehicle] = await mysqlPool.query('SELECT * FROM vehicles WHERE license_plate = ?', [req.params.license_plate]);

        if (vehicle.length === 0) {
            return res.status(404).json({ msg: 'Vehicle not found' });
        }

        res.json(vehicle[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;