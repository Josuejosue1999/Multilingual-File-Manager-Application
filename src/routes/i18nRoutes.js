const express = require('express');
const router = express.Router();
const i18next = require('i18next');

// Route POST pour mettre à jour la langue
router.post('/language', (req, res) => {
    const { language } = req.body;

    if (!['en', 'fr', 'es'].includes(language)) {
        return res.status(400).json({ message: 'Unsupported language' });
    }

    i18next.changeLanguage(language, (err) => {
        if (err) {
            console.error(`[ERROR] Failed to change language: ${err.message}`);
            return res.status(500).json({ message: 'Failed to update language' });
        }

        console.log(`[INFO] Language updated to: ${language}`);
        res.status(200).json({ message: 'Language updated successfully', language });
    });
});

module.exports = router;
