"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const JWT_SECRET = process.env.JWT_SECRET;
const register = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    try {
        const existing = await user_model_1.User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: 'User already exists' });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = new user_model_1.User({
            name,
            email,
            password: hashed,
            isAdmin: isAdmin || false,
        });
        await user.save();
        res.status(201).json({ message: 'Registered successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login Attempt:', { email });
    try {
        // 1. Find the user by email
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // 2. Compare passwords
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // 3. Generate JWT token
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error('❌ JWT_SECRET not defined in environment');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        }, JWT_SECRET, { expiresIn: '7d' });
        // 4. Send HTTP-only cookie + user data
        res
            .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
            .status(200)
            .json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    }
    catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Login failed' });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 1000 * 60 * 15);
        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();
        // Email sender (use real SMTP credentials or Mailtrap)
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail', // or use your SMTP
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const resetUrl = `http://localhost:5000/reset-password/${token}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. It expires in 15 minutes.</p>`,
        });
        res.json({ message: 'Reset link sent to your email.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send reset email.' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await user_model_1.User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });
        if (!user)
            return res.status(400).json({ message: 'Invalid or expired token' });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        user.password = hashed;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        res.json({ message: 'Password reset successful.' });
    }
    catch (err) {
        res.status(500).json({ message: 'Reset failed.' });
    }
};
exports.resetPassword = resetPassword;
const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully." });
};
exports.logout = logout;
