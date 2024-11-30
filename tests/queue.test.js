const uploadQueue = require('../src/queues/uploadQueue');

describe('File Upload Queue', () => {
    it('should process a job successfully', async () => {
        const job = await uploadQueue.add({
            fileId: 'test123',
            filePath: '/path/to/test-file.txt',
            description: 'Test file for queue',
        });

        expect(job.id).toBeDefined();

        await job.finished(); // Attendre que le job se termine

        expect(job.progress()).toBe(100);
        console.log('Job processed successfully:', job.data);
    });

    it('should handle job failures', async () => {
        const job = await uploadQueue.add({
            fileId: 'test123',
            filePath: '/invalid/path/to/file.txt', // Fichier inexistant
            description: 'Invalid file test',
        });

        await expect(job.finished()).rejects.toThrow(); // Vérifie l’échec
    });
});
