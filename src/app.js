const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('../config/db');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const i18nextFsBackend = require('i18next-fs-backend');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Charger les variables d'environnement
dotenv.config();

// Connecter la base de données
connectDB();

// Initialiser l'application
const app = express();

// Middleware de sécurité
app.use(helmet());

// Activer CORS pour permettre les requêtes inter-origines
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Journalisation des requêtes pour le diagnostic
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware pour analyser le JSON et les données encodées en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurer i18n
i18next
    .use(i18nextFsBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: { loadPath: process.env.I18N_BACKEND_LOAD_PATH || './locales/{{lng}}/translation.json' }, // Localisation des fichiers de traduction
        fallbackLng: process.env.DEFAULT_LANGUAGE || 'en',
        preload: process.env.SUPPORTED_LANGUAGES ? process.env.SUPPORTED_LANGUAGES.split(',') : ['en', 'fr', 'es'], // Langues prises en charge
        detection: {
            order: ['querystring', 'cookie', 'header'], // Ordre de détection de langue
            caches: ['cookie'], // Cache de langue dans les cookies
        },
    });

app.use(i18nextMiddleware.handle(i18next));

// Servir les fichiers `locales` publiquement
app.use('/locales', express.static(path.join(__dirname, '../locales')));

// Vérification et création du répertoire `uploads`
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('[INFO] Uploads directory created.');
} else {
    console.log('[INFO] Uploads directory verified.');
}
app.use('/uploads', express.static(uploadsPath));

// Servir les fichiers statiques (comme le front-end)
app.use(express.static(path.join(__dirname, '../public')));

// Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// Ajouter Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ajouter la route pour obtenir la langue actuelle
app.get('/api/i18n/language', (req, res) => {
    const currentLanguage = req.language || process.env.DEFAULT_LANGUAGE || 'en';
    res.status(200).json({ currentLanguage });
});

// Ajouter la route pour définir la langue préférée
app.post('/api/i18n/language', (req, res) => {
    const { language } = req.body;
    const supportedLanguages = process.env.SUPPORTED_LANGUAGES ? process.env.SUPPORTED_LANGUAGES.split(',') : ['en', 'fr', 'es'];
    if (!supportedLanguages.includes(language)) {
        return res.status(400).json({ message: 'Unsupported language' });
    }
    res.cookie('i18next', language);
    res.status(200).json({ message: 'Language updated successfully', language });
});

// Gestion des erreurs 404 (route non trouvée)
app.use((req, res) => {
    console.error(`[404] Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

// Gestion des erreurs générales
app.use((err, req, res, next) => {
    console.error(`[500] Internal server error: ${err.stack}`);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    console.log(`Locales available at http://localhost:${PORT}/locales`);
});
