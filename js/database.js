const supabaseUrl = "https://bwdcakcjcksgbxundxcc.supabase.co";
const supabaseKey = "sb_publishable_sD-DOVsIxrusDxeTIy8k1w_Zg0oZAqb";

// ✅ INSTANT LOAD (NO DELAY)
const db = supabase.createClient(supabaseUrl, supabaseKey);

// ✅ MAKE GLOBAL
window.db = db;

console.log("✅ Supabase connected");