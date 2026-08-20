// ─────────────────────────────────────────────────────────────
// tools/monitor.ts — get_store_status MCP Tool
// Reports container health, ports, memory, and logs
// ─────────────────────────────────────────────────────────────
import { z } from 'zod';
import { getStoreStatus } from '../utils/docker.js';
import { spawnSync } from 'node:child_process';

const MonitorSchema = z.object({
  projectName: z.string().min(1, 'projectName is required — use the value returned by deploy_store'),
  showLogs: z.boolean().optional().default(false),
  logLines: z.number().int().min(1).max(200).optional().default(50),
});

export const getStoreStatusTool = {
  name: 'get_store_status',
  description: `Returns the real-time health, ports, URLs, and optionally the recent logs for a deployed store instance.
Use this to check if a store is running correctly, diagnose errors, or get the current URL.`,
  inputSchema: {
    type: 'object',
    required: ['projectName'],
    properties: {
      projectName: {
        type: 'string',
        description: "Docker Compose project name, e.g. 'perla-negra' (returned by deploy_store)",
      },
      showLogs: {
        type: 'boolean',
        description: 'Whether to include recent container logs in the response (default: false)',
      },
      logLines: {
        type: 'number',
        description: 'Number of recent log lines to include (default: 50, max: 200)',
      },
    },
  },
} as const;

export async function handleGetStoreStatus(args: Record<string, unknown>): Promise<string> {
  let config;
  try {
    config = MonitorSchema.parse(args);
  } catch (err: any) {
    const issues = err?.issues?.map((i: any) => `• ${i.path.join('.')}: ${i.message}`).join('\n') ?? String(err);
    return `❌ Parámetros inválidos:\n${issues}`;
  }

  let containers;
  try {
    containers = getStoreStatus(config.projectName);
  } catch (err: any) {
    return `❌ No se encontró el proyecto "${config.projectName}": ${err.message}\n\nVerifica el nombre del proyecto o usa deploy_store para crearlo.`;
  }

  if (containers.length === 0) {
    return `⚠️ No hay contenedores activos en el proyecto "${config.projectName}". Puede estar detenido.`;
  }

  const lines: string[] = [
    `📊 Estado de tienda: **${config.projectName}**`,
    ``,
    ...containers.map(c => [
      `📦 Contenedor: \`${c.name}\``,
      `  Estado: ${c.status}`,
      `  Salud: ${c.health}`,
      `  Puertos: ${c.ports || 'N/A'}`,
    ].join('\n')),
  ];

  if (config.showLogs) {
    const logsResult = spawnSync(
      'docker',
      ['compose', '--project-name', config.projectName, 'logs', '--tail', String(config.logLines)],
      { stdio: 'pipe', encoding: 'utf8' }
    );
    if (logsResult.status === 0 && logsResult.stdout) {
      lines.push('', '📜 **Logs recientes:**', '```', logsResult.stdout.trim(), '```');
    } else {
      lines.push('', `⚠️ No se pudieron obtener los logs: ${logsResult.stderr}`);
    }
  }

  return lines.join('\n');
}
