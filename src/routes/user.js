import express from 'express';
import { updateUserProfile , getUsersByRole} from '../controllers/userController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

// PUT /api/user/update - update funnyName and avatar
router.put('/update', authenticateJWT, updateUserProfile);

router.get("/", authenticateJWT, getUsersByRole);

export default router;