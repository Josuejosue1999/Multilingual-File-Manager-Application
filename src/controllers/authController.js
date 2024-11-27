const User = require('../models/User');

// Contrôleur pour l'enregistrement
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Vérification que tous les champs sont fournis
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Vérification si l'utilisateur ou l'email existe déjà
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Création de l'utilisateur
        const newUser = new User({ username, password, email });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Contrôleur pour la connexion
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Vérification que tous les champs sont fournis
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Recherche de l'utilisateur
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Vérification du mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
