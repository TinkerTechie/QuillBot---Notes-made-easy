const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const { processText } = require('./ai');
const History = require('./models/History');
const Note = require('./models/Note');
const User = require('./models/User');
const { protect } = require('./middleware/auth');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('📦 Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// --- AUTH ROUTES ---

// @desc    Register user
// @route   POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
app.get('/api/auth/me', protect, async (req, res) => {
    res.json(req.user);
});

// --- AI Processing Route ---
app.post('/api/ai/process', protect, async (req, res) => {
    try {
        const { text, mode } = req.body;
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Please provide some text to process.' });
        }
        const selectedMode = mode || 'paraphrase';
        const result = await processText(text, selectedMode);

        await History.create({
            originalText: text,
            processedText: result,
            mode: selectedMode,
            user: req.user._id // Optional: link history to user
        });

        res.json({ success: true, result, mode: selectedMode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'AI processing failed' });
    }
});

// --- Notes API Routes (Protected) ---

// Get all notes for the logged-in user
app.get('/api/notes', protect, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// Get single note by ID (must belong to user)
app.get('/api/notes/:id', protect, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
        if (!note) return res.status(404).json({ error: 'Note not found or unauthorized' });
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// Create new note
app.post('/api/notes', protect, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = await Note.create({
            title: title || 'Untitled Note',
            content: content || '',
            user: req.user._id
        });
        res.json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// Update note
app.put('/api/notes/:id', protect, async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title, content, updatedAt: new Date() },
            { new: true }
        );
        if (!updatedNote) return res.status(404).json({ error: 'Note not found or unauthorized' });
        res.json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// Delete note
app.delete('/api/notes/:id', protect, async (req, res) => {
    try {
        const result = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!result) return res.status(404).json({ error: 'Note not found or unauthorized' });
        res.json({ success: true, message: 'Note deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
