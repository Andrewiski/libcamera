import {
  ExecException,
  ExecOptions,
} from 'child_process';
import { Execute, ExecuteResult } from './types';

export default function makeExecute({ exec }: { exec: any }): Execute {
  return Object.freeze({
    runCommand,
    cmdCommand,
  });

  function runCommand({
    cmdCommand,
    options,
  }: {
    cmdCommand: string;
    options?: ExecOptions;
  }): Promise<ExecuteResult> {
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
        let myChildProcess = exec(
          cmdCommand,
          options,
          (error: ExecException | null, stdout: any, stderr: any) => {

            let myResult = {
              error: error,
              stdout: stdout, 
              stderr: stderr,
              childProcess: myChildProcess
            };
            if (error) {
              if (localDebug) {
                console.log('execute error');
                console.log('error=' + error.message);
              }
              // if (stderr) {
              //   reject(stderr.trim());
              // } else {
              //   reject(error);
              // }
              reject(myResult);
            }else{
              resolve(myResult);
            }
            // if (typeof stdout === 'string') {
            //   if (localDebug) {
            //     console.log('execute stdout===string');
            //   }
            //   resolve(stdout.trim());
            // }
            // if (typeof stderr === 'string') {
            //   if (localDebug) {
            //     console.log('execute stderr===string');
            //   }
            //   resolve(stderr.trim());
            // } else {
            //   if (localDebug) {
            //     console.log('execute returning myChildProcess');
            //   }
            //   resolve(myChildProcess as ChildProcessWithoutNullStreams);
            // }
          }
        );
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
