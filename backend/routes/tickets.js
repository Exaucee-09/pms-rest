// routes/tickets.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mysqlPool = require('../db/mysql');
const { sendTicketEmail } = require('../utils/mailer');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
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
 *               - spot_id
 *               - user_email
 *             properties:
 *               license_plate:
 *                 type: string
 *               spot_id:
 *                 type: integer
 *               user_email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
    const { license_plate, spot_id, user_email } = req.body;

    try {
        const [result] = await mysqlPool.query(
            'INSERT INTO tickets (license_plate, spot_id, user_email, entry_time) VALUES (?, ?, ?, NOW())',
            [license_plate, spot_id, user_email]
        );

        const [ticket] = await mysqlPool.query(
            'SELECT * FROM tickets WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(ticket[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Finalize a ticket (set exit time and calculate amount)
 *     tags: [Tickets]
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
 *         description: Ticket finalized successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, async (req, res) => {
    try {
        // Get ticket with entry time
        const [ticket] = await mysqlPool.query(
            'SELECT * FROM tickets WHERE id = ? AND exit_time IS NULL',
            [req.params.id]
        );

        if (ticket.length === 0) {
            return res.status(404).json({ msg: 'Ticket not found or already finalized' });
        }

        // Calculate duration and amount ($5 per hour)
        const exitTime = new Date();
        const entryTime = new Date(ticket[0].entry_time);
        const durationHours = (exitTime - entryTime) / (1000 * 60 * 60);
        const amount = Math.ceil(durationHours) * 5; // Round up to nearest hour

        // Update ticket
        await mysqlPool.query(
            'UPDATE tickets SET exit_time = ?, amount = ? WHERE id = ?',
            [exitTime, amount, req.params.id]
        );

        // Get updated ticket
        const [updatedTicket] = await mysqlPool.query(
            'SELECT * FROM tickets WHERE id = ?',
            [req.params.id]
        );

        // Send email notification
        await sendTicketEmail(updatedTicket[0]);

        res.json(updatedTicket[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;