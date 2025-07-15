"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdminUser = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdminUser = async () => {
    // Check if an admin user already exists
    const existingAdmin = await user_model_1.User.findOne({ isAdmin: true });
    if (existingAdmin)
        return; // Exit if an admin already exists
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
    await user_model_1.User.create({
        name: 'Admin User',
        email: 'ekeleolu1@gmail.com',
        password: hashedPassword,
        isAdmin: true,
    });
    console.log('✅ Static admin account created.');
};
exports.seedAdminUser = seedAdminUser;
