import { User } from '../models/user';

const users: Map<string, User> = new Map();

export const db = {
    getAll: () => Array.from(users.values()),
    get: (id: string) => users.get(id),
    add: (user: User) => users.set(user.id, user),
    update: (id: string, user: User) => users.set(id, user),
    delete: (id: string) => users.delete(id),
    has: (id: string) => users.has(id)
};