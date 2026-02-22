import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const generateEmbedding = async (text) => {
  const { data, error } = await supabase.functions.invoke("embed", {
    body: { input: text },
  });

  if (error) throw error;
  return data.embedding;
};

export default generateEmbedding;
