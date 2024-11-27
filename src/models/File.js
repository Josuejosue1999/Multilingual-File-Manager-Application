const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Lien avec le modèle `User`
        required: false, // Facultatif si le fichier n'est pas lié à un utilisateur
    },
    name: {
        type: String,
        required: [true, 'File name is required'],
        trim: true,
    },
    path: {
        type: String,
        required: [true, 'File path is required'],
    },
    mimeType: {
        type: String,
        required: [true, 'File MIME type is required'],
    },
    size: {
        type: Number,
        required: [true, 'File size is required'],
        validate: {
            validator: (value) => value > 0,
            message: 'File size must be greater than 0',
        },
    },
    description: {
        type: String,
        required: false,
        trim: true, // Supprime les espaces inutiles au début/à la fin
        maxlength: [255, 'Description must be less than 255 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Méthode statique pour récupérer les fichiers d'un utilisateur
FileSchema.statics.findByUser = async function (userId) {
    return this.find({ user: userId }).exec();
};

// Suppression automatique du fichier lié dans le système de fichiers lors de la suppression dans MongoDB
const fs = require('fs');
const path = require('path');

FileSchema.pre('remove', function (next) {
    const filePath = path.resolve(this.path);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err.message);
        } else {
            console.log(`Successfully deleted file: ${filePath}`);
        }
        next();
    });
});

module.exports = mongoose.model('File', FileSchema);
