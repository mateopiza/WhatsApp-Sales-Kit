import { Env } from '../types';
import { StorageEngine } from './interface';
import { D1StorageEngine } from './d1-engine';
import { KVStorageEngine } from './kv-engine';
import { MemoryStorageEngine } from './memory-engine';

// Singleton in-memory fallback for process lifetime
const globalMemoryEngine = new MemoryStorageEngine();

export function getStorageEngine(env?: Env): StorageEngine {
  if (env?.DB) {
    return new D1StorageEngine(env.DB);
  }
  if (env?.CATALOG_KV) {
    return new KVStorageEngine(env.CATALOG_KV);
  }
  return globalMemoryEngine;
}
