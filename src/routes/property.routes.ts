import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/isAdmin.middleware';
import { upload } from '../middleware/upload.middleware';
import { createProperty, deleteProperty, getProperties, getProperty, getPropertyBySlug, updateProperty } from '../controllers/property.controller';



const routes = express.Router();

routes.get('/', getProperties);
routes.get('/:id', getProperty);
routes.get('/slug/:slug', getPropertyBySlug);
routes.post('/', authenticate, isAdmin, upload.single('image'), createProperty);
routes.put('/:id', authenticate, isAdmin, upload.single('image'), updateProperty);
routes.delete('/:id', authenticate, isAdmin, deleteProperty);

export default routes;
