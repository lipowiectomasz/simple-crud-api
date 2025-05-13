import request from 'supertest';
import app from '../src/app';

describe('User API', () => {
    let createdUserId: string;

    it('GET /api/users should return an empty array initially', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('POST /api/users should create a user', async () => {
        const newUser = {
            username: 'John Doe',
            age: 30,
            hobbies: ['reading', 'gaming']
        };
        const res = await request(app).post('/api/users').send(newUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toMatchObject(newUser);
        createdUserId = res.body.id;
    });

    it('GET /api/users/:id should return the created user', async () => {
        const res = await request(app).get(`/api/users/${createdUserId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdUserId);
    });

    it('PUT /api/users/:id should update the user', async () => {
        const updatedData = {
            username: 'Jane Doe',
            age: 28,
            hobbies: ['coding']
        };
        const res = await request(app).put(`/api/users/${createdUserId}`).send(updatedData);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: createdUserId, ...updatedData });
    });

    it('DELETE /api/users/:id should delete the user', async () => {
        const res = await request(app).delete(`/api/users/${createdUserId}`);
        expect(res.status).toBe(204);
    });

    it('GET /api/users/:id after deletion should return 404', async () => {
        const res = await request(app).get(`/api/users/${createdUserId}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'User not found');
    });

    it('GET /non-existing-route should return 404', async () => {
        const res = await request(app).get('/non-existing-route');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Endpoint not found');
    });

    it('should return 400 for invalid UUID', async () => {
        const res = await request(app).get('/api/users/not-a-uuid');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid UUID');
    });
});