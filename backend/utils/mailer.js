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
    }
};

module.exports = {
    sendParkingAssignmentEmail,
    sendParkingReleaseEmail
};