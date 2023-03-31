import { Writable, Readable } from 'stream';
import {
  ChildProcessByStdio,
  ChildProcessWithoutNullStreams,
  ChildProcess,
} from 'child_process';

export interface PiCameraOutput {
  jpeg: ({
    config,
  }: {
    config: PiCameraConfig;
  }) =>
    | string
    | Promise<
        | ChildProcess
        | ChildProcessWithoutNullStreams
        | ChildProcessByStdio<Writable, Readable, Readable>
        | ChildProcessByStdio<Writable, Readable, null>
        | ChildProcessByStdio<Writable, null, Readable>
        | ChildProcessByStdio<null, Readable, Readable>
        | ChildProcessByStdio<Writable, null, null>
        | ChildProcessByStdio<null, Readable, null>
        | ChildProcessByStdio<null, null, Readable>
        | ChildProcessByStdio<null, null, null>
      >;
  still: ({
    config,
  }: {
    config: PiCameraConfig;
  }) =>
    | string
    | Promise<
        | ChildProcess
        | ChildProcessWithoutNullStreams
        | ChildProcessByStdio<Writable, Readable, Readable>
        | ChildProcessByStdio<Writable, Readable, null>
        | ChildProcessByStdio<Writable, null, Readable>
        | ChildProcessByStdio<null, Readable, Readable>
        | ChildProcessByStdio<Writable, null, null>
        | ChildProcessByStdio<null, Readable, null>
        | ChildProcessByStdio<null, null, Readable>
        | ChildProcessByStdio<null, null, null>
      >;
  vid: ({
    config,
  }: {
    config: PiCameraConfig;
  }) =>
    | string
    | Promise<
        | ChildProcess
        | ChildProcessWithoutNullStreams
        | ChildProcessByStdio<Writable, Readable, Readable>
        | ChildProcessByStdio<Writable, Readable, null>
        | ChildProcessByStdio<Writable, null, Readable>
        | ChildProcessByStdio<null, Readable, Readable>
        | ChildProcessByStdio<Writable, null, null>
        | ChildProcessByStdio<null, Readable, null>
        | ChildProcessByStdio<null, null, Readable>
        | ChildProcessByStdio<null, null, null>
      >;
  raw: ({
    config,
  }: {
    config: PiCameraConfig;
  }) =>
    | string
    | Promise<
        | ChildProcess
        | ChildProcessWithoutNullStreams
        | ChildProcessByStdio<Writable, Readable, Readable>
        | ChildProcessByStdio<Writable, Readable, null>
        | ChildProcessByStdio<Writable, null, Readable>
        | ChildProcessByStdio<null, Readable, Readable>
        | ChildProcessByStdio<Writable, null, null>
        | ChildProcessByStdio<null, Readable, null>
        | ChildProcessByStdio<null, null, Readable>
        | ChildProcessByStdio<null, null, null>
      >;
}

export interface PiCameraConfig {
  [key: string]: string | number | boolean | Readable | Writable;
}

export interface Commands {
  Flags: Array<string>;
  Options: Array<string>;
}

export interface Command {
  base: string;
  params: Array<string>;
}
