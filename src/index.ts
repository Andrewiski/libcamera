import {
  jpegCommands,
  stillCommands,
  vidCommands,
  rawCommands,
} from './libCamera.config';

import buildMakeLibCamera from './libCamera';
const makeLibCamera = buildMakeLibCamera({
  jpegCommands,
  stillCommands,
  vidCommands,
  rawCommands,
});

export const libcamera = makeLibCamera();
export default libcamera;
