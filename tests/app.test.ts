import request from 'supertest';
import app from '../src/app';

describe('Edge Case Tests for /api/users', () => {
    test('POST /api/users - invalid body should return 400', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ username: 123, age: 'twenty', hobbies: 'none' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid user data' });
    });

    test('GET /api/users/invalid-uuid - should return 400', async () => {
        const res = await request(app).get('/api/users/invalid-uuid');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid UUID' });
    });

    test('PUT /api/users/:id - missing fields should return 400', async () => {
        const userRes = await request(app).post('/api/users').send({
            username: 'Test',
            age: 30,
            hobbies: ['reading']
        });

        const res = await request(app)
            .put(`/api/users/${userRes.body.id}`)
            .send({ username: 'NewName' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Invalid user data' });
    });

    test('DELETE /api/users/:id - valid but non-existent UUID should return 404', async () => {
        const fakeUUID = '123e4567-e89b-12d3-a456-426614174000';
        const res = await request(app).delete(`/api/users/${fakeUUID}`);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'User not found' });
    });

    test('GET /non-existent - should return 404', async () => {
        const res = await request(app).get('/non-existent');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'Endpoint not found' });
    });
});
