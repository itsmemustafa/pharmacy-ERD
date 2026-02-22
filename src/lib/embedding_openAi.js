import OpenAI from "openai";
import env from "dotenv";
env.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding; // returns [0.23, -0.51, 0.88...] 1536 numbers
};
export default generateEmbedding;
