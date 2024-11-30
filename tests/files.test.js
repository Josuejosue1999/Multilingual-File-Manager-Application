const request = require('supertest');
const app = require('../src/app'); // Remplacez par le chemin vers votre fichier principal

describe('File Management API', () => {
    let server;

    beforeAll(() => {
        server = app.listen(5001); // Lancer l'application sur un port de test
    });

    afterAll((done) => {
        server.close(done); // Fermer le serveur après les tests
    });

    it('should upload a file', async () => {
        const response = await request(server)
            .post('/api/files/upload')
            .attach('file', `${__dirname}/test-file.txt`) // Ajoutez un fichier de test
            .field('description', 'Sample file for testing');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'File uploaded and queued successfully');
        expect(response.body.file).toHaveProperty('id');
    });

    it('should fetch all files', async () => {
        const response = await request(server).get('/api/files');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('files');
        expect(Array.isArray(response.body.files)).toBe(true);
    });
});
