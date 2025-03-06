const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
// const Gemini = async (req, res) => {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const { prompt } = req.body;

//   const result = await model.generateContent(prompt);
//   const data = result.response.text();
//   console.log(result.response.text());
//   res.send({ Message: data });
// };

const Gemini = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const { prompt } = req.body;
  let data="thank you for using me "
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text:prompt }],
      },
      {
        role: "model",
        parts: [{ text: data }],
      },
    ],
  });
  async function sendMessage(inputText) {
    let result = await chat.sendMessage(inputText);  // Sending dynamic message

    return result.response.text();  // Return the response for further use
  }
  let result = await chat.sendMessage(prompt);
  data = result.response.text();
  res.send({ Message: data });
};

module.exports = Gemini;
