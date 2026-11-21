// Generates src/environments/environment.ts from environment variables.
// Runs before `npm run build` (see "prebuild" in package.json), so hosts like
// Vercel can build without the git-ignored environment.ts file.
// If API_URL is not set (e.g. local dev), the existing file is left untouched.
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
const { API_URL, SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!API_URL) {
  console.log('[set-env] API_URL not set; keeping existing environment.ts');
  process.exit(0);
}

const missing = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[set-env] Missing env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const contents = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(API_URL)},
  supabaseUrl: ${JSON.stringify(SUPABASE_URL)},
  supabaseAnonKey: ${JSON.stringify(SUPABASE_ANON_KEY)}
};
`;
fs.writeFileSync(target, contents);
console.log('[set-env] Wrote src/environments/environment.ts');
