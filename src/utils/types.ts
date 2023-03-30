import { ExecException, ChildProcessWithoutNullStreams } from 'child_process';

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
export interface ExecuteResult {
  error: ExecException | null,
  stdout: any, 
  stderr: any,
  childProcess: ChildProcessWithoutNullStreams | null
}