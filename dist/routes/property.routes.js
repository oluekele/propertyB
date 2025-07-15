"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const isAdmin_middleware_1 = require("../middleware/isAdmin.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const property_controller_1 = require("../controllers/property.controller");
const routes = express_1.default.Router();
routes.get('/', property_controller_1.getProperties);
routes.get('/:id', property_controller_1.getProperty);
routes.get('/slug/:slug', property_controller_1.getPropertyBySlug);
routes.post('/', auth_middleware_1.authenticate, isAdmin_middleware_1.isAdmin, upload_middleware_1.upload.single('image'), property_controller_1.createProperty);
routes.put('/:id', auth_middleware_1.authenticate, isAdmin_middleware_1.isAdmin, upload_middleware_1.upload.single('image'), property_controller_1.updateProperty);
routes.delete('/:id', auth_middleware_1.authenticate, isAdmin_middleware_1.isAdmin, property_controller_1.deleteProperty);
exports.default = routes;
