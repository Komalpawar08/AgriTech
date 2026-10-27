import express from 'express';
import { getCrops, createCrop, deleteCrop } from '../controllers/cropController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getCrops);
router.post('/', createCrop);
router.delete('/:id', deleteCrop);

export default router;
