const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Substitua pelos seus valores reais
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_API_KEY || "";

// Criação do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;

