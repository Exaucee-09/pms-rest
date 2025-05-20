const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendParkingAssignmentEmail, sendParkingReleaseEmail } = require('../utils/mailer')

//Database connection
const mysqlPool = require('../db/mysql');
const pgPool = require('../db/postgres');

/**
 * @swagger
 * tags:
 *   name: Parking
 *   description: Parking spot management
 */

/**
 * @swagger
 * /api/parking/spots:
 *   get:
 *     summary: Get all parking spots
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of parking spots
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get('/spots', auth, async (req, res) => {
    try {
        const [spots] = await mysqlPool.query('SELECT * FROM parking_spots');
        res.json(spots);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error')
    }
})

/**
 * @swagger
 * /api/parking/spots:
 *   post:
 *     summary: Add a new parking spot
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spot_number
 *               - is_occupied
 *             properties:
 *               spot_number:
 *                 type: string
 *               is_occupied:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Parking spot added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post('/spots', auth, async (req, res) => {
    const { spot_number, is_occupied } = req.body;

    try {
        await mysqlPool.query('INSERT INTO parking_spots (spot_number, is_occupied) VALUES(?, ?)',
            [
                spot_number,
                is_occupied,
            ]
        );
        res.send({ msg: 'Parking spot added' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

/**
 * @swagger
 * /api/parking/spots/{id}:
 *   put:
 *     summary: Update a parking spot
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spot_number:
 *                 type: string
 *               is_occupied:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Parking spot updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.put('/spots/:id', auth, async (req, res) => {
    const { spot_number, is_occupied } = req.body;
    try {
        await mysqlPool.query('UPDATE parking_spots SET spot_number = ?, is_occupied = ? WHERE id = ?',
            [spot_number, is_occupied, req.params.id]
        );
        res.json({ msg: 'Parking spot updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.send(500).send('Server error')
    }
});

/**
 * @swagger
 * /api/parking/spots/{id}:
 *   delete:
 *     summary: Delete a parking spot
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Parking spot deleted successfully
 *       404:
 *         description: Parking spot not found
 *       500:
 *         description: Server error
 */
router.delete('/spots/:id', auth, async (req, res) => {
    try {
        const [result] = await mysqlPool.query(
            'DELETE FROM parking_spots WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Parking spot not found' });
        }

        res.json({ msg: 'Parking spot deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/parking/assign:
 *   post:
 *     summary: Assign a vehicle to a parking spot
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spot_id
 *               - license_plate
 *             properties:
 *               spot_id:
 *                 type: integer
 *               license_plate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle assigned to spot successfully
 *       400:
 *         description: Spot is already occupied or vehicle not found
 *       404:
 *         description: Spot or vehicle not found
 *       500:
 *         description: Server error
 */
router.post('/assign', auth, async (req, res) => {
    const { spot_id, license_plate } = req.body;

    try {
        // Check if spot exists and is available
        const [spot] = await mysqlPool.query('SELECT * FROM parking_spots WHERE id = ?', [spot_id]);
        if (spot.length === 0) {
            return res.status(404).json({ msg: 'Parking spot not found' });
        }
        if (spot[0].is_occupied) {
            return res.status(400).json({ msg: 'Parking spot is already occupied' });
        }

        // Check if vehicle exists
        const [vehicle] = await mysqlPool.query('SELECT * FROM vehicles WHERE license_plate = ?', [license_plate]);
        if (vehicle.length === 0) {
            return res.status(404).json({ msg: 'Vehicle not found' });
        }

        // Assign vehicle to spot
        await mysqlPool.query(
            'UPDATE parking_spots SET is_occupied = TRUE, vehicle_plate = ? WHERE id = ?',
            [license_plate, spot_id]
        );

        //Send email for successful assignment
        if (vehicle[0].owner_email && spot[0].spot_number && license_plate) {
            try {
                await sendParkingAssignmentEmail(
                    vehicle[0].owner_email,
                    spot[0].spot_number,
                    spot[0].vehicle_plate
                );
                console.log(`Notification sent to ${vehicle[0].owner_email}`);
            } catch (emailError) {
                console.error('Email sending failed: ', emailError.message);
            }

            res.json({ msg: 'Vehicle assigned to spot successfully' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/parking/release/{spot_id}:
 *   put:
 *     summary: Release a parking spot
 *     tags: [Parking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: spot_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Parking spot released successfully
 *       400:
 *         description: Spot is not occupied
 *       404:
 *         description: Spot not found
 *       500:
 *         description: Server error
 */
router.put('/release/:spot_id', auth, async (req, res) => {
    try {
        // Check if spot exists and is occupied
        const [spot] = await mysqlPool.query('SELECT * FROM parking_spots WHERE id = ?', [req.params.spot_id]);
        if (spot.length === 0) {
            return res.status(404).json({ msg: 'Parking spot not found' });
        }
        if (!spot[0].is_occupied) {
            return res.status(400).json({ msg: 'Parking spot is not occupied' });
        }

        // Release the spot
        await mysqlPool.query(
            'UPDATE parking_spots SET is_occupied = FALSE, vehicle_plate = NULL WHERE id = ?',
            [req.params.spot_id]
        );

        const [vehicle] = await mysqlPool.query('SELECT * FROM vehicles WHERE license_plate = ?', [spot[0].vehicle_plate]);
        if (vehicle.length > 0 && vehicle[0].owner_email) {
            try {
                await sendParkingReleaseEmail(
                    vehicle[0].owner_email,
                    spot[0].spot_number,
                    spot[0].vehicle_plate
                );
                console.log(`Notification sent to ${vehicle[0].owner_email}`);
            } catch (emailError) {
                console.error('Email notification failed but spot was released: ', emailError)
            }
        }

        res.json({ msg: 'Parking spot released successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;