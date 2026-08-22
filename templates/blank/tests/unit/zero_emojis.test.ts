import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Regex detecting all Unicode Emoji ranges
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

function scanDirForEmojis(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirForEmojis(fullPath, fileList);
    } else if (/\.(tsx|ts|jsx|js|html|json|css)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

describe('Design System Integrity: Zero-Emoji Static Audit', () => {
  it('enforces 0 emojis across all application source code, components, and data', () => {
    const srcDir = path.resolve(__dirname, '../../src');
    const functionsDir = path.resolve(__dirname, '../../functions');

    const sourceFiles = [...scanDirForEmojis(srcDir), ...scanDirForEmojis(functionsDir)];
    const violations: { file: string; line: number; char: string }[] = [];

    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        const match = line.match(EMOJI_REGEX);
        if (match) {
          violations.push({
            file: path.relative(path.resolve(__dirname, '../..'), filePath),
            line: index + 1,
            char: match[0],
          });
        }
      });
    }

    expect(violations).toEqual([]);
  });
});
