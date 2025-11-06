const { GoogleGenAI } =require( "@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const Gemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const chat = ai.chats.create({model: "gemini-2.5-flash"});

    let response = await chat.sendMessage({message:prompt});
    console.log(response.text);
    let data=response.text

    res.json({ Message: data });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
};

module.exports = Gemini;
