import { Writable as streamWritable } from 'stream';
import { Spawn } from './utils/types';
import { PiCameraOutput, PiCameraConfig, Commands } from './types';

export default function buildMakeLibCamera({
  spawn,
  jpegCommands,
  stillCommands,
  vidCommands,
  rawCommands,
}: {
  spawn: Spawn;
  jpegCommands: Commands;
  stillCommands: Commands;
  vidCommands: Commands;
  rawCommands: Commands;
}) {
  return function makeLibCamera(): PiCameraOutput {
    return Object.freeze({
      jpeg: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeJpeg({
          Flags: jpegCommands.Flags,
          Options: jpegCommands.Options,
          spawn,
          config,
        });
      },
      still: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeStill({
          Flags: stillCommands.Flags,
          Options: stillCommands.Options,
          spawn,
          config,
        });
      },
      vid: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeVid({
          Flags: vidCommands.Flags,
          Options: vidCommands.Options,
          spawn,
          config,
        });
      },
      raw: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeRaw({
          Flags: rawCommands.Flags,
          Options: rawCommands.Options,
          spawn,
          config,
        });
      },
    });
  };
}
let localDebug = false;
if (
  process.env.NODE_ENV === 'test' ||
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG
) {
  localDebug = true;
}
if (localDebug) {
  console.log('localDebug=true');
}
function runCommand({
  spawn,
  cmdCommand,
  config,
}: {
  spawn: Spawn;
  cmdCommand: string;
  config: PiCameraConfig;
}) {
  try {
    // if (localDebug) {
    console.log('runCommand called');
    //}
    let results = spawn.runCommand({ cmdCommand });
    results.then(function(exResults) {
      //let childProcess = exResults.childProcess;
      if (typeof exResults.stdout !== 'string') {
        console.log('stdOutType=' + typeof exResults.stdout);
        let stdOut = exResults.stdout;
        let myStreamWritable = config.output as streamWritable;
        stdOut.pipe(myStreamWritable, { end: true });
        // Handle output stream events
        // outputStream.target.on('close', function() {
        //  self.logger.debug('Output stream closed, scheduling kill for ffmpeg process');
        //  // Don't kill process yet, to give a chance to ffmpeg to
        //  // terminate successfully first  This is necessary because
        //  // under load, the process 'exit' event sometimes happens
        //  // after the output stream 'close' event.
        //  setTimeout(function() {
        //    emitEnd(new Error('Output stream closed'));
        //    ffmpegProc.kill();
        //  }, 20);
        //  });
        //  outputStream.target.on('error', function(err) {
        //    self.logger.debug('Output stream error, killing ffmpeg process');
        //    var reportingErr = new Error('Output stream error: ' + err.message);
        //    reportingErr.outputStreamError = err;
        //    emitEnd(reportingErr, stdoutRing.get(), stderrRing.get());
        //    ffmpegProc.kill('SIGKILL');
        //  });
      }
    });
    results.catch((err: unknown) => {
      if (localDebug) {
        console.log('run command error');
      }
      if (err instanceof Error) {
        throw new Error(`Things exploded (${err.message})`);
      } else if (typeof err === 'string') {
        throw new Error(err);
      } else {
        throw new Error('Unknown error in run command');
      }
    });
    return results;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Things exploded (${err.message})`);
    } else {
      throw new Error('Unknown error');
    }
  }
}

function makeJpeg({
  Flags,
  Options,
  spawn,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  spawn: Spawn;
  config: PiCameraConfig;
}) {
  const cmdCommand = createTakePictureCommand({
    baseType: 'libcamera-jpeg',
    Flags,
    Options,
    spawn,
    config,
  });

  if (localDebug === true) {
    console.log('cmdCommand = ', cmdCommand);
  }
  return runCommand({ spawn, cmdCommand, config });
}

function makeStill({
  Flags,
  Options,
  spawn,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  spawn: Spawn;
  config: PiCameraConfig;
}) {
  try {
    const cmdCommand = createTakePictureCommand({
      baseType: 'libcamera-still',
      Flags,
      Options,
      spawn,
      config,
    });

    if (localDebug === true) {
      console.log('cmdCommand = ', cmdCommand);
    }
    return runCommand({ spawn, cmdCommand, config });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Things exploded (${err.message})`);
    } else {
      throw new Error('Unknown error');
    }
  }
}

function makeVid({
  Flags,
  Options,
  spawn,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  spawn: Spawn;
  config: PiCameraConfig;
}) {
  try {
    const cmdCommand = createTakePictureCommand({
      baseType: 'libcamera-vid',
      Flags,
      Options,
      spawn,
      config,
    });

    if (localDebug === true) {
      console.log('cmdCommand = ', cmdCommand);
    }
    return runCommand({ spawn, cmdCommand, config });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Things exploded (${err.message})`);
    } else {
      throw new Error('Unknown error in tale Picture');
    }
  }
}

function makeRaw({
  Flags,
  Options,
  spawn,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  spawn: Spawn;
  config: PiCameraConfig;
}) {
  try {
    const cmdCommand = createTakePictureCommand({
      baseType: 'libcamera-raw',
      Flags,
      Options,
      spawn,
      config,
    });

    if (localDebug === true) {
      console.log('cmdCommand = ', cmdCommand);
    }
    return runCommand({ spawn, cmdCommand, config });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Things exploded (${err.message})`);
    } else {
      throw new Error('Unknown error in tale Picture');
    }
  }
}

function createTakePictureCommand({
  baseType,
  Flags,
  Options,
  spawn,
  config,
}: {
  baseType:
    | 'libcamera-jpeg'
    | 'libcamera-still'
    | 'libcamera-vid'
    | 'libcamera-raw';
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  spawn: Spawn;
  config: PiCameraConfig;
}) {
  const cmdCommand = spawn.cmdCommand({
    base: baseType,
    params: prepareConfigOptsAndFlags(config, { Flags, Options }),
  });

  return cmdCommand;
}

function configShouldBeAnObject({ config }: { config: any }) {
  if (config) {
    return config;
  } else {
    return {};
  }
}

function prepareConfigOptsAndFlags(
  config: any,
  { Flags, Options }: { Flags: Commands['Flags']; Options: Commands['Options'] }
): Array<string> {
  const configArray: any = [];
  let outputIsStream = false;
  Object.keys(config).forEach(key => {
    // Only include flags if they're set to true
    if (Flags.includes(key) && config[key]) {
      configArray.push(`--${key}`);
    } else if (Options.includes(key)) {
      if (
        key === 'output' &&
        config[key] !== null &&
        typeof config[key] === 'object' &&
        typeof config[key].pipe === 'function'
      ) {
        //This is a request to output the data to a stream object
        if (
          config[key].writable !== false &&
          typeof config[key]._write === 'function' &&
          typeof config[key]._writableState === 'object'
        ) {
          outputIsStream = true;
          //-o -
          //configArray.push(`--${key}`, config[key]);
          configArray.push(`-o`, '-');
        } else {
          throw new Error('Stream is not writable');
        }
      } else {
        configArray.push(`--${key}`, config[key]);
      }
    }
  });
  if (outputIsStream) {
    config.outputIsStream = true;
  }
  return configArray;
}
