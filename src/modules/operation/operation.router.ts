import { Router } from 'express';
import { success } from '../../utils/response';
import { operationService } from './operation.service';

const router = Router();

// Placeholder route - GET /api/operations
router.get('/', async (req, res, next) => {
  try {
    // Placeholder response
    success(res, [], 'Operations endpoint - ready for implementation');
  } catch (error) {
    next(error);
  }
});

export default router;

