import express from 'express';
import {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/usersController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;