import { Readable } from 'stream'; //import { Writable, Readable, Stream, Pipe } from 'stream';
import { ChildProcessByStdio, SpawnOptions } from 'child_process';
import { Spawn } from './types';

export function makeSpawn({ spawn }: { spawn: any }): Spawn {
  return Object.freeze({
    runCommand,
    cmdCommand,
  });

  function runCommand({
    cmdCommand,
    options,
  }: {
    cmdCommand: string;
    options?: SpawnOptions;
  }): Promise<ChildProcessByStdio<null, Readable, Readable>> {
    try {
      let localDebug = false;
      if (
        process.env.NODE_ENV === 'test' ||
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG
      ) {
        localDebug = true;
        console.log('execute LocalDebug Enabled');
      }
      return new Promise((resolve, reject) => {
        try {
          if (localDebug) {
            console.log('spawn cmdCommand=' + cmdCommand);
          }
          let myChildProcess = spawn(cmdCommand, options);
          resolve(
            myChildProcess as ChildProcessByStdio<null, Readable, Readable>
          );
        } catch (ex) {
          console.log('spawn error = ', ex);
          reject(ex);
        }
      });
    } catch (err) {
      console.log('Run command error = ', err);
      throw new Error('Error in execute run command');
    }
  }
  function cmdCommand({
    base,
    params,
  }: {
    base: string;
    params: Array<string>;
  }) {
    if (!params && base) {
      return base;
    }

    if (!Array.isArray(params)) {
      throw new Error('params must be an Array');
    }

    return base + ' ' + params.join(' ');
  }
}
