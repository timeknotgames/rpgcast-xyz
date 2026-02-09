import { Pool } from '@neondatabase/serverless';
import * as schema from './schema.js';
export declare const pool: Pool | null;
export declare const db: (import("drizzle-orm/neon-serverless").NeonDatabase<typeof schema> & {
    $client: any;
}) | null;
/** Check if persistence is available */
export declare function isPersistenceEnabled(): boolean;
/** Initialize the crying_depths schema (run on first startup) */
export declare function initializeSchema(): Promise<void>;
