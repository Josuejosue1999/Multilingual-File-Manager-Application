const request = require('supertest');
const app = require('../src/app'); // Remplacez par le chemin vers votre fichier principal

describe('Authentication API', () => {
    let server;

    beforeAll(() => {
        server = app.listen(5001); // Lancer l'application sur un port de test
    });

    afterAll((done) => {
        server.close(done); // Fermer le serveur après les tests
    });

    it('should register a new user', async () => {
        const response = await request(server).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
        expect(response.body.user).toHaveProperty('id');
    });

    it('should not register a user with an existing email', async () => {
        const response = await request(server).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Email already exists');
    });

    it('should authenticate a valid user', async () => {
        const response = await request(server).post('/api/auth/login').send({
            username: 'testuser',
            password: 'password123',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body.user).toHaveProperty('username', 'testuser');
    });

    it('should reject invalid login credentials', async () => {
        const response = await request(server).post('/api/auth/login').send({
            username: 'testuser',
            password: 'wrongpassword',
        });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
});
