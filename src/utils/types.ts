import { ExecException, ChildProcessWithoutNullStreams, ChildProcessByStdio } from 'child_process';
import { Readable } from 'stream';

export interface Execute {
  runCommand: ({
    cmdCommand,
    options,
  }: {
    cmdCommand: string;
    options?: any;
  }) => Promise<ExecuteResult>;

  cmdCommand: ({
    base,
    params,
  }: {
    base: string;
    params: Array<string>;
  }) => string;
}

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

export interface ExecuteResult {
  error: ExecException | null;
  stdout: any;
  stderr: any;
  childProcess: ChildProcessWithoutNullStreams | null;
}
