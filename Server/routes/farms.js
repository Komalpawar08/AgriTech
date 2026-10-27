import express from 'express';
import { getFarms, createFarm, deleteFarm } from '../controllers/farmController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getFarms);
router.post('/', createFarm);
router.delete('/:id', deleteFarm);

export default router;
