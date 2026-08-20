import { execSync, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

// ─────────────────────────────────────────────────────────────
// docker.ts — Docker Compose wrapper utilities
// Wraps docker and docker-compose CLI for container lifecycle management
// ─────────────────────────────────────────────────────────────

const COMPOSE_FILE_PATH = path.resolve(
  process.env.COMPOSE_FILE_PATH ?? path.join(process.cwd(), '..', 'docker', 'docker-compose.yml')
);

export interface DeployOptions {
  storeName: string;
  storeWhatsappPhone: string;
  storeCurrency: string;
  storeAdminPin: string;
  storePrimaryColor?: string;
  storeAccentColor?: string;
  storeTagline?: string;
  storeLogoUrl?: string;
  storePort?: number;
  projectName?: string;
}

export interface ContainerStatus {
  name: string;
  status: string;
  ports: string;
  health: string;
  url: string;
}

/**
 * Generates a deterministic project name from the store name
 */
export function toProjectName(storeName: string): string {
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 32);
}

/**
 * Writes a .env file for a specific store instance
 */
export function writeEnvFile(opts: DeployOptions): string {
  const projectName = opts.projectName ?? toProjectName(opts.storeName);
  const envPath = path.join(os.tmpdir(), `.env.${projectName}`);
  const port = opts.storePort ?? allocateFreePort();

  const lines = [
    `COMPOSE_PROJECT_NAME=${projectName}`,
    `STORE_NAME=${opts.storeName}`,
    `STORE_CURRENCY=${opts.storeCurrency}`,
    `STORE_WHATSAPP_PHONE=${opts.storeWhatsappPhone}`,
    `STORE_PRIMARY_COLOR=${opts.storePrimaryColor ?? '#D4B48C'}`,
    `STORE_ACCENT_COLOR=${opts.storeAccentColor ?? '#3A332D'}`,
    `STORE_ADMIN_PIN=${opts.storeAdminPin}`,
    `STORE_LOGO_URL=${opts.storeLogoUrl ?? ''}`,
    `STORE_TAGLINE=${opts.storeTagline ?? 'Joyería Online'}`,
    `STORE_PORT=${port}`,
    `MCP_PORT=${port + 1}`,
  ];

  fs.writeFileSync(envPath, lines.join('\n') + '\n', 'utf8');
  return envPath;
}

/**
 * Deploys a store using docker compose up -d
 */
export function deployStore(opts: DeployOptions): { url: string; adminUrl: string; projectName: string } {
  const projectName = opts.projectName ?? toProjectName(opts.storeName);
  const envFile = writeEnvFile({ ...opts, projectName });
  const port = opts.storePort ?? allocateFreePort();

  const result = spawnSync(
    'docker',
    [
      'compose',
      '--file', COMPOSE_FILE_PATH,
      '--env-file', envFile,
      '--project-name', projectName,
      'up', '-d', '--build',
    ],
    { stdio: 'pipe', encoding: 'utf8' }
  );

  if (result.status !== 0) {
    throw new Error(`Docker Compose failed:\n${result.stderr}`);
  }

  return {
    url: `http://localhost:${port}`,
    adminUrl: `http://localhost:${port}/admin`,
    projectName,
  };
}

/**
 * Retrieves the status of all containers for a project
 */
export function getStoreStatus(projectName: string): ContainerStatus[] {
  const result = spawnSync(
    'docker',
    [
      'compose',
      '--project-name', projectName,
      'ps', '--format', 'json',
    ],
    { stdio: 'pipe', encoding: 'utf8' }
  );

  if (result.status !== 0) {
    throw new Error(`Could not get status for project "${projectName}": ${result.stderr}`);
  }

  const lines = result.stdout.trim().split('\n').filter(Boolean);
  return lines.map(line => {
    try {
      const parsed = JSON.parse(line);
      return {
        name: parsed.Name ?? parsed.Service ?? 'unknown',
        status: parsed.Status ?? 'unknown',
        ports: parsed.Publishers ? JSON.stringify(parsed.Publishers) : parsed.Ports ?? '',
        health: parsed.Health ?? 'N/A',
        url: '',
      };
    } catch {
      return { name: line, status: 'unknown', ports: '', health: 'N/A', url: '' };
    }
  });
}

/**
 * Stops and removes containers for a project
 */
export function stopStore(projectName: string): void {
  spawnSync('docker', ['compose', '--project-name', projectName, 'down'], { stdio: 'inherit' });
}

/**
 * Allocates a free port starting from 3100
 */
let _portCounter = 3100;
function allocateFreePort(): number {
  return _portCounter++;
}
