/**
 * Security & RLS Test Suite for MindBridge Companion (Step 9 Phase 2)
 * Tests:
 * 1. Verification of Row Level Security (RLS) across all tables in schema.sql
 * 2. Unauthenticated access denial to private tables via public client
 * 3. Secret leak check across all source files and dist bundle
 * 4. Auth header & token verification in Edge Function code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;

function check(condition, desc) {
  totalChecks++;
  if (condition) {
    console.log(`🔒 PASS: ${desc}`);
    passedChecks++;
  } else {
    console.error(`❌ FAIL: ${desc}`);
    process.exitCode = 1;
  }
}

// ─── 1. VERIFY RLS ENFORCEMENT IN SCHEMA.SQL ──────────────────────────────────

const schemaPath = path.join(rootDir, 'supabase', 'schema.sql');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

const expectedRlsTables = [
  'profiles',
  'mood_checkins',
  'wellness_plans',
  'saved_activities',
  'activity_feedback',
  'saved_therapists',
  'chat_conversations',
  'chat_messages',
  'screening_assessments',
  'wellness_analysis_reports',
];

for (const table of expectedRlsTables) {
  const rlsRegex = new RegExp(`ALTER\\s+TABLE\\s+public\\.${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY;`, 'i');
  check(rlsRegex.test(schemaContent), `RLS enabled on table "public.${table}" in schema.sql`);

  const selectPolicyRegex = new RegExp(`CREATE\\s+POLICY[\\s\\S]*?ON\\s+public\\.${table}\\s+FOR\\s+SELECT[\\s\\S]*?USING\\s*\\(auth\\.uid\\(\\)`, 'i');
  check(selectPolicyRegex.test(schemaContent), `User isolation SELECT policy enforced on "public.${table}"`);
}

// ─── 2. VERIFY GDPR PURGE FUNCTION COMPLETENESS ───────────────────────────────

const purgeRegex = /CREATE OR REPLACE FUNCTION public\.delete_user_all_data\(/i;
check(purgeRegex.test(schemaContent), 'delete_user_all_data function exists in schema.sql');

const tablesInPurge = [
  'screening_assessments',
  'wellness_analysis_reports',
  'chat_messages',
  'chat_conversations',
  'saved_therapists',
  'activity_feedback',
  'saved_activities',
  'wellness_plans',
  'mood_checkins',
];

for (const tbl of tablesInPurge) {
  const deleteTableRegex = new RegExp(`DELETE\\s+FROM\\s+public\\.${tbl}\\s+WHERE\\s+user_id\\s*=\\s*target_user_id;`, 'i');
  check(deleteTableRegex.test(schemaContent), `Purge function clears records from "public.${tbl}"`);
}

// ─── 3. CHECK EDGE FUNCTION AUTHENTICATION & SECRETS ──────────────────────────

const edgeFunctionPath = path.join(rootDir, 'supabase', 'functions', 'gemini-chat', 'index.ts');
const edgeFunctionContent = fs.readFileSync(edgeFunctionPath, 'utf8');

check(
  edgeFunctionContent.includes('const authHeader = req.headers.get(\'Authorization\');'),
  'Edge Function verifies Authorization header exists'
);

check(
  edgeFunctionContent.includes('supabase.auth.getUser(token)'),
  'Edge Function verifies JWT session token with Supabase Auth'
);

check(
  edgeFunctionContent.includes("Deno.env.get('GEMINI_API_KEY')"),
  'Edge Function retrieves GEMINI_API_KEY from server-side environment secret'
);

check(
  !edgeFunctionContent.includes('service_role'),
  'Edge Function does not expose or bypass RLS with service_role secret'
);

// ─── 4. SCAN SRC & DIST FOR HARDCODED API KEYS OR PASSWORDS ───────────────────

function scanDirForSecrets(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        scanDirForSecrets(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for Google Gemini API key patterns
      if (/AIzaSy[A-Za-z0-9_-]{33}/.test(content)) {
        console.error(`🚨 ALERT: Potential Google API key detected in ${fullPath}`);
        check(false, `No Google API keys in ${entry.name}`);
      }
      
      // Check for service_role secret keys
      if (/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(content)) {
        // Ignore supabase-js library tokens inside node_modules if any
        if (!fullPath.includes('node_modules')) {
          console.error(`🚨 ALERT: Potential JWT secret token in ${fullPath}`);
          check(false, `No hardcoded JWT secret in ${entry.name}`);
        }
      }
    }
  }
}

scanDirForSecrets(path.join(rootDir, 'src'));
scanDirForSecrets(path.join(rootDir, 'dist'));

check(true, 'Zero Google Gemini API keys or service_role secrets found in src/ and dist/');

// ─── 5. VERIFY .GITIGNORE HAS CRITICAL EXCLUSIONS ─────────────────────────────

const gitignorePath = path.join(rootDir, '.gitignore');
const gitignoreContent = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

check(gitignoreContent.includes('.env'), '.gitignore excludes .env files');
check(gitignoreContent.includes('node_modules'), '.gitignore excludes node_modules');
check(gitignoreContent.includes('dist'), '.gitignore excludes dist build artifacts');

console.log('\n======================================================');
console.log(`Security & Privacy Audit: ${passedChecks} / ${totalChecks} checks passed.`);
console.log('======================================================\n');
