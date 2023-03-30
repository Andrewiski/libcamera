import {
  jpegCommands,
  stillCommands,
  vidCommands,
  rawCommands,
} from './libCamera.config';
import { spawnproc as spawn } from './utils';

import buildMakeLibCamera from './libCamera';
const makeLibCamera = buildMakeLibCamera({
  spawn,
  jpegCommands,
  stillCommands,
  vidCommands,
  rawCommands,
});

export const libcamera = makeLibCamera();
export default libcamera;
