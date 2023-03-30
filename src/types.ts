import { Writable as streamWritable, Readable } from 'stream';
import { ChildProcessByStdio } from 'child_process';


export interface PiCameraOutput {
  jpeg: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessByStdio<null, Readable, Readable>>;
  still: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessByStdio<null, Readable, Readable>>;
  vid: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessByStdio<null, Readable, Readable>>;
  raw: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessByStdio<null, Readable, Readable>>;
}

export interface PiCameraConfig {
  [key: string]: string | number | boolean | streamWritable;
}

export interface Commands {
  Flags: Array<string>;
  Options: Array<string>;
}
