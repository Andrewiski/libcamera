import { exec, spawn } from 'child_process';
import {makeExecute, makeSpawn} from './execute';

const execute = makeExecute({ exec });
const spawnproc = makeSpawn({ spawn });

export { execute,spawnproc };
