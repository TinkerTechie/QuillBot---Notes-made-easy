const OpenAI = require('openai');
require('dotenv').config();

const openai = (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here')
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

async function processText(text, mode) {
    let systemPrompt = "You are a helpful AI writing assistant.";

    // Mode-specific instructions
    const prompts = {
        paraphrase: "You are a professional editor. Paraphrase the following text to make it clearer and more concise, maintaining the original meaning. Do not add conversational filler.",
        summarize: "Summarize the following text into a concise paragraph, capturing the key points.",
        formal: "Rewrite the following text to sound more professional, objective, and formal suitable for business or academic contexts.",
        simple: "Rewrite the following text using simple vocabulary and sentence structures that are easy to understand (5th-grade reading level).",
        creative: "Rewrite the following text in a more creative, evocative, and engaging style.",
        expand: "Expand upon the following text, adding more descriptive details, context, and depth while maintaining the original intent.",
        shorten: "Shorten the following text significantly, removing valid redundancy and flowery language without losing the core message.",
        continue: "Continue writing the following text naturally, picking up from where it left off, maintaining the existing style, tone, and context. Write about 2-3 sentences max to keep it responsive.",
    };

    systemPrompt = prompts[mode] || prompts.paraphrase;

    // MOCK RESPONSE FOR DEMO if Key is missing or default
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        console.warn("⚠️  Using Mock Response (No API Key provided)");
        await new Promise(r => setTimeout(r, 1000)); // Simulate delay
        return `[MOCK AI OUTPUT for ${mode}]: ${text} (This is a simulated response because the OpenAI API Key is not configured. Please add your key in server/.env to get real AI responses.)`;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
        throw new Error("Failed to generate content from AI. Ensure your API Key is correct.");
    }
}

module.exports = { processText };
