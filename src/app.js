const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Pour gérer les chemins de fichiers
const connectDB = require('../config/db');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const i18nextFsBackend = require('i18next-fs-backend');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json'); // Swagger JSON
const authRoutes = require('./routes/authRoutes'); // Authentification
const fileRoutes = require('./routes/fileRoutes'); // Gestion des fichiers

// Charger les variables d'environnement
dotenv.config();

// Connecter la base de données
connectDB();

// Initialiser l'application
const app = express();

// Middleware de sécurité
app.use(helmet());

// Activer CORS pour permettre les requêtes inter-origines
app.use(cors());

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
        backend: { loadPath: './locales/{{lng}}/translation.json' },
        fallbackLng: 'en',
        preload: process.env.SUPPORTED_LANGUAGES ? process.env.SUPPORTED_LANGUAGES.split(',') : ['en'],
    });

app.use(i18nextMiddleware.handle(i18next));

// Servir les fichiers statiques (par exemple, les fichiers uploadés)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes principales
app.use('/api/auth', authRoutes); // Routes pour l'authentification
app.use('/api/files', fileRoutes); // Routes pour la gestion des fichiers

// Ajouter Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
});
