require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error("Missing environment variables:");
  console.error("SUPABASE_URL:", process.env.SUPABASE_URL);
  console.error("SUPABASE_KEY:", process.env.SUPABASE_KEY);
  throw new Error("Required environment variables are missing");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
