import { ChildProcessWithoutNullStreams } from 'child_process';
import { Writable as streamWritable } from 'stream';

export interface PiCameraOutput {
  jpeg: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessWithoutNullStreams | string>;
  still: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessWithoutNullStreams | string>;
  vid: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessWithoutNullStreams | string>;
  raw: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ChildProcessWithoutNullStreams | string>;
}

export interface PiCameraConfig {
  [key: string]: string | number | boolean | streamWritable;
}

export interface Commands {
  Flags: Array<string>;
  Options: Array<string>;
}
