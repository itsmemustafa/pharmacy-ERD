import "../loadEnv.js";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  // Normalize URL: user might paste the REST endpoint (including /rest/v1)
  // The functions client expects the project root (e.g. https://<ref>.supabase.co)
  let normalizedUrl = supabaseUrl.trim();
  // remove trailing slash
  normalizedUrl = normalizedUrl.replace(/\/+$/g, "");
  // remove accidental /rest/v1 suffix
  normalizedUrl = normalizedUrl.replace(/\/rest\/v1$/i, "");

  if (normalizedUrl !== supabaseUrl) {
    console.warn(
      "Normalized SUPABASE_URL from",
      supabaseUrl,
      "to",
      normalizedUrl,
    );
  }

  supabase = createClient(normalizedUrl, supabaseServiceKey);
} else {
  console.warn(
    "Supabase embedding client disabled: set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env to enable semantic search.",
  );
}

const generateEmbedding = async (text) => {
  if (!supabase) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_KEY are required to generate embeddings. Set them in .env or disable semantic search.",
    );
  }

  try {
    // Ensure we send a JSON string body and explicit content-type
    const res = await supabase.functions.invoke("embed", {
      body: JSON.stringify({ input: text }),
      headers: { "Content-Type": "application/json" },
    });

    const { data, error, status } = res || {};

    if (
      error ||
      (typeof status === "number" && (status < 200 || status >= 300))
    ) {
      console.error("Supabase Edge Function error:", { status, error, data });
      throw new Error(
        `Edge Function returned status ${status || "unknown"}: ${error?.message || JSON.stringify(data)}`,
      );
    }

    let payload = data;
    if (typeof data === "string") {
      try {
        payload = JSON.parse(data);
      } catch (e) {
        // leave as string
      }
    }

    if (!payload || !payload.embedding) {
      console.error("Unexpected Edge Function response payload:", payload);
      throw new Error("Unexpected response from embedding function");
    }

    return payload.embedding;
  } catch (err) {
    console.error('Failed invoking Supabase edge function "embed":', err);
    throw err;
  }
};

export default generateEmbedding;
