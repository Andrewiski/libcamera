import { ChildProcessByStdio } from 'child_process';
import { Readable } from 'stream';
export interface Spawn {
  runCommand: ({
    cmdCommand,
    options,
  }: {
    cmdCommand: string;
    options?: any;
  }) => Promise<ChildProcessByStdio<null, Readable, Readable>>;

  cmdCommand: ({
    base,
    params,
  }: {
    base: string;
    params: Array<string>;
  }) => string;
}
