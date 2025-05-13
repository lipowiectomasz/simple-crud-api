import { Request, Response } from 'express';
import { v4 as uuidv4, validate as isUUID } from 'uuid';
import { db } from '../db/memoryDb';

export const getAllUsers = (_req: Request, res: Response) => {
    res.status(200).json(db.getAll());
};

export const getUser = (_req: Request, res: Response) => {
    const { userId } = _req.params;
    if (!isUUID(userId)){
        res.status(400).json({ message: 'Invalid UUID' });
        return;
    }
    const user = db.get(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.status(200).json(user);
};

export const createUser = (_req: Request, res: Response): void => {
    const { username, age, hobbies } = _req.body;

    if (typeof username !== 'string' || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.status(400).json({ message: 'Invalid user data' });
        return;
    }

    const user = { id: uuidv4(), username, age, hobbies };
    db.add(user);
    res.status(201).json(user);
};

export const updateUser = (_req: Request, res: Response): void => {
    const { userId } = _req.params;
    const { username, age, hobbies } = _req.body;

    if (!isUUID(userId)) {
        res.status(400).json({ message: 'Invalid UUID' });
        return;
    }

    if (!db.has(userId)) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    if (typeof username !== 'string' || typeof age !== 'number' || !Array.isArray(hobbies)) {
        res.status(400).json({ message: 'Invalid user data' });
        return;
    }

    const user = { id: userId, username, age, hobbies };
    db.update(userId, user);
    res.status(200).json(user);
};

export const deleteUser = (_req: Request, res: Response): void => {
    const { userId } = _req.params;

    if (!isUUID(userId)) {
        res.status(400).json({ message: 'Invalid UUID' });
        return;
    }

    if (!db.has(userId)) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    db.delete(userId);
    res.sendStatus(204);
};