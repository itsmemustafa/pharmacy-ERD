import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const model = new Supabase.ai.Session("gte-small");

serve(async (req) => {
  const { input } = await req.json();
  const embedding = await model.run(input, { mean_pool: true, normalize: true });
  
  return new Response(JSON.stringify({ embedding }), {
    headers: { "Content-Type": "application/json" },
  });
});