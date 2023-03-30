import { spawn } from 'child_process';
import { makeSpawn } from './execute';

const spawnproc = makeSpawn({ spawn });

export { spawnproc };
