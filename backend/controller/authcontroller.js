const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../config/nodemailerConfig');
require('dotenv').config();

// Function to send reset email
const sendResetEmail = (email, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Please use the following link to reset your password: ${process.env.FRONTEND_URL}/resetpassword/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return;
        }
        console.log('Password reset email sent: %s', info.messageId);
    });
};

exports.forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() 

        await user.save();

        sendResetEmail(user.email, resetToken);

        res.send('Password reset email sent');
    } catch (error) {
        console.error('Error in forgotpassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetpassword = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the entire request body

        const { token, password } = req.body;

        if (!token) {
            console.log('Token not provided in the request body.');
            return res.status(400).send('Token must be provided');
        }

        if (!password) {
            console.log('Password not provided in the request body.');
            return res.status(400).send('Password must be provided');
        }

        console.log('Received token:', token);
        console.log('Received password:', password);

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
            console.log('Decoded token:', decoded);
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(400).send('Invalid or expired token');
        }

        const user = await User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('User not found or token expired');
            return res.status(400).send('User not found or token expired');
        }

        console.log('User found:', user);

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.send('Password has been reset successfully');
    } catch (error) {
        console.error('Error in resetpassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
