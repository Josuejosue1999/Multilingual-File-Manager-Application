const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma utilisateur
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Convertir l'email en minuscules pour éviter les doublons
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'], // Validation pour une adresse email valide
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
    try {
        // Vérifiez si le mot de passe a été modifié
        if (!this.isModified('password')) return next();

        // Génération du hash
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour vérifier le mot de passe
UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Suppression du mot de passe des objets utilisateur lors de la récupération
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; // Supprime le champ `password`
    return user;
};

// Suppression du mot de passe lors des réponses JSON
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password; // Supprime le champ `password`
        return ret;
    },
});

// Méthode statique pour rechercher un utilisateur par email ou nom d'utilisateur
UserSchema.statics.findByCredentials = async function (identifier, password) {
    try {
        const user = await this.findOne({
            $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return user;
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema);
