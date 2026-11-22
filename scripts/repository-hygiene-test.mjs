import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// This guard checks path names only. It never opens or prints environment-file contents.
const tracked = execFileSync('git', ['ls-files', '-z'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe']
}).split('\0').filter(Boolean).map(path => path.replaceAll('\\\\', '/'));

const allowedEnvironmentTemplates = new Set([
  '.env.example',
  '.env.production.example'
]);

const forbiddenTrackedFiles = tracked.filter(path => {
  const isEnvironmentFile =
    /(^|\/)\.env(?:\..*)?$/.test(path) &&
    !allowedEnvironmentTemplates.has(path);
  const isGeneratedOrLocalDirectory =
    /(^|\/)(?:node_modules|coverage|\.next|out|VIDO_Backups)(?:\/|$)/i.test(path);
  const isDatabaseBackup = /\.(?:dump|sql\.backup)$/i.test(path);

  return isEnvironmentFile || isGeneratedOrLocalDirectory || isDatabaseBackup;
});

assert.deepEqual(
  forbiddenTrackedFiles,
  [],
  'Repository hygiene failure: a local environment file, generated directory, or database backup is tracked.'
);

function assertIgnoreRules(file, requiredRules) {
  const lines = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  for (const rule of requiredRules) {
    assert(
      lines.includes(rule),
      `Repository hygiene failure: ${file} is missing the ignore rule "${rule}".`
    );
  }
}

assertIgnoreRules('.gitignore', [
  '.env',
  '.env.*',
  '!.env.example',
  '!.env.production.example',
  'node_modules/',
  '*.dump',
  '*.sql.backup',
  'VIDO_Backups/',
  'coverage/'
]);

assertIgnoreRules('.dockerignore', [
  '.git',
  '.env',
  '.env.*',
  'node_modules',
  'VIDO_Backups',
  '*.dump',
  '*.sql.backup'
]);

console.log(
  `PASS: repository hygiene checked ${tracked.length} tracked paths; no local environment files, generated directories, or database backups are tracked, and Git/Docker ignore rules are present.`
);
