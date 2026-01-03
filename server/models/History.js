const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    originalText: {
        type: String,
        required: true,
    },
    processedText: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        required: true,
        enum: ['paraphrase', 'summarize', 'formal', 'simple', 'creative', 'expand', 'shorten', 'continue'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('History', HistorySchema);
