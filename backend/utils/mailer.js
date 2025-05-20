const { text } = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// const sendAccountCreatedEmail = async (email, name, createdAt) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Parking MS - Account created successfully',
//         text:`Hello ${name} Welcome to Parking Management System. Your Account was created successfully.\n Thank you for working with us.`,
//         html: `<p>${name} Welcome to Parking MS  your account has been created successfully at ${createdAt}</p>`
//     }
// }

const sendParkingAssignmentEmail = async (email, spotNumber, licensePlate) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Parking Spot Assigned',
        text: `Your vehicle ${licensePlate} has been assigned to parking spot ${spotNumber}.`,
        html: `<p>Your vehicle <strong>${licensePlate}</strong> has been assigned to parking spot <strong>${spotNumber}</strong>.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendParkingReleaseEmail = async (email, spotNumber, licensePlate) => {
    if(!email){
        console.error('No email provided for notification');
        return;
    }
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Parking Spot Released',
        text: `Your vehicle ${licensePlate} has been released from parking spot ${spotNumber}.`,
        html: `<p>Your vehicle <strong>${licensePlate}</strong> has been released from parking spot <strong>${spotNumber}</strong>.</p>`
    };

    try {
        const res = await transporter.sendMail(mailOptions);
        if(res.accepted) console.log("email sent")
        else console.log(res.response)
        return res;
    } catch (error) {
        console.error('Error sending email:', error);
        return;
    }
};

const sendTicketEmail = async(ticket) => {
    const mailOptions = {
        from: `Parking System <${process.env.EMAIL_USER}>`,
        to: ticket.user_email,
        subject: 'Your Parking Ticket',
        html: `
            <h2>Parking Ticket</h2>
            <p><strong>License Plate:</strong> ${ticket.license_plate}</p>
            <p><strong>Spot ID:</strong> ${ticket.spot_id}</p>
            <p><strong>Entry Time:</strong> ${new Date(ticket.entry_time).toLocaleString()}</p>
            ${ticket.exit_time ? `
                <p><strong>Exit Time:</strong> ${new Date(ticket.exit_time).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${((new Date(ticket.exit_time) - new Date(ticket.entry_time)) / (1000 * 60 * 60)).toFixed(2)} hours</p>
                <p><strong>Amount Due:</strong> $${ticket.amount}</p>
            ` : ''}
            <p>Thank you for using our parking service!</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Ticket email sent');
    } catch (error) {
        console.error('Error sending ticket email:', error);
    }
};

module.exports = {
    sendParkingAssignmentEmail,
    sendParkingReleaseEmail,
    sendTicketEmail
};