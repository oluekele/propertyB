"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const mongoose_1 = require("mongoose");
const PropertySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: String },
    location: { type: String },
    beds: Number,
    baths: Number,
    size: String,
    category: { type: String, required: true },
    image: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.Property = (0, mongoose_1.model)('Property', PropertySchema);
