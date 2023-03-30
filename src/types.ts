import { Writable as streamWritable } from 'stream';
import { ExecuteResult } from './utils/types';

export interface PiCameraOutput {
  jpeg: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ExecuteResult>;
  still: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ExecuteResult>;
  vid: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ExecuteResult>;
  raw: ({
    config,
  }: {
    config: PiCameraConfig;
  }) => string | Promise<ExecuteResult>;
}

export interface PiCameraConfig {
  [key: string]: string | number | boolean | streamWritable;
}

export interface Commands {
  Flags: Array<string>;
  Options: Array<string>;
}
