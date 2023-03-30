import { Writable, Readable } from 'stream';
import {
  spawn,
  ChildProcessByStdio,
  SpawnOptionsWithStdioTuple,
  StdioNull,
  StdioPipe,
  ChildProcessWithoutNullStreams,
  ChildProcess,
} from 'child_process';
import { PiCameraOutput, PiCameraConfig, Commands, Command } from './types';

export default function buildMakeLibCamera({
  jpegCommands,
  stillCommands,
  vidCommands,
  rawCommands,
}: {
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
          config,
        });
      },
      still: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeStill({
          Flags: stillCommands.Flags,
          Options: stillCommands.Options,
          config,
        });
      },
      vid: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeVid({
          Flags: vidCommands.Flags,
          Options: vidCommands.Options,
          config,
        });
      },
      raw: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeRaw({
          Flags: rawCommands.Flags,
          Options: rawCommands.Options,
          config,
        });
      },
    });
  };
}
let localDebug = false;
if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
  localDebug = true;
}
if (localDebug) {
  console.log('localDebug=true');
}

function makeJpeg({
  Flags,
  Options,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  config: PiCameraConfig;
}) {
  const cmd : Command = createTakePictureCommand({
    baseType: 'libcamera-jpeg',
    Flags,
    Options,
    config,
  });

  if (localDebug === true) {
    console.log('cmdCommand = ', cmd);
  }
  if (process.env.NODE_ENV === 'test') {
    return parseCommand(cmd);
  }
  return runCommand({ cmd, config });
}

function makeStill({
  Flags,
  Options,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  config: PiCameraConfig;
}) {
  try {
    const cmd : Command = createTakePictureCommand({
      baseType: 'libcamera-still',
      Flags,
      Options,
      config,
    });

    if (localDebug === true) {
      console.log('cmdCommand = ', cmd);
    }
    if (process.env.NODE_ENV === 'test') {
      return parseCommand(cmd);
    }
    return runCommand({ cmd, config });
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
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  config: PiCameraConfig;
}) {
  try {
    const cmd : Command = createTakePictureCommand({
      baseType: 'libcamera-vid',
      Flags,
      Options,
      config,
    });

    if (localDebug === true) {
      console.log('cmdCommand = ', cmd);
    }
    if (process.env.NODE_ENV === 'test') {
      return parseCommand(cmd);
    }
    return runCommand({ cmd, config });
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
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  config: PiCameraConfig;
}) {
  try {
    const cmd : Command = createTakePictureCommand({
      baseType: 'libcamera-raw',
      Flags,
      Options,
      config,
    });

    if (localDebug === true) {
      console.log('cmdCommand = ', cmd);
    }
    if (process.env.NODE_ENV === 'test') {
      return parseCommand(cmd);
    }
    return runCommand({ cmd, config });
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
  config,
}: {
  baseType:
    | 'libcamera-jpeg'
    | 'libcamera-still'
    | 'libcamera-vid'
    | 'libcamera-raw';
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  config: PiCameraConfig;
}) {
  const cmd : Command = {
    base: baseType,
    params: prepareConfigOptsAndFlags(config, { Flags, Options }),
  };

  return cmd;
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

function parseCommand( cmd : Command) {
  if (!cmd.params && cmd.base) {
    return cmd.base;
  }

  if (!Array.isArray(cmd.params)) {
    throw new Error('params must be an Array');
  }

  return cmd.base + ' ' + cmd.params.join(' ');
}

function runCommand({
  cmd,
  config,
}: {
  cmd: Command;
  config: PiCameraConfig;
}): Promise<
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
> {
  try {
    return new Promise((resolve, reject) => {
      try {
        let stdIn: StdioNull | StdioPipe = 'ignore';
        let stdOut: StdioNull | StdioPipe = 'ignore';
        let stdErr: StdioNull | StdioPipe = 'ignore';
        
        if (config.outputIsStream) {
          stdOut = config.output as Writable;
        }
        let spawnOptions: SpawnOptionsWithStdioTuple<
          StdioNull | StdioPipe,
          StdioNull | StdioPipe,
          StdioNull | StdioPipe
        > = {
          argv0: undefined,
          stdio:  [stdIn, stdOut, stdErr], //'overlapped' | 'pipe' | 'ignore' | 'inherit';
          shell: undefined,
          windowsVerbatimArguments: undefined,
          detached: false,
        };
        let myChildProcess:
          | ChildProcess
          | ChildProcessWithoutNullStreams
          | ChildProcessByStdio<Writable, Readable, Readable>
          | ChildProcessByStdio<Writable, Readable, null>
          | ChildProcessByStdio<Writable, null, Readable>
          | ChildProcessByStdio<null, Readable, Readable>
          | ChildProcessByStdio<Writable, null, null>
          | ChildProcessByStdio<null, Readable, null>
          | ChildProcessByStdio<null, null, Readable>
          | ChildProcessByStdio<null, null, null> = spawn(cmd.base, cmd.params, spawnOptions);
        //let stdOut = myChildProcess.stdout;

        //stdOut.pipe(myStreamWritable, { end: true });
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

        resolve(myChildProcess);
      } catch (ex) {
        console.log('spawn error = ', ex);
        reject(ex);
      }
    });
  } catch (err) {
    console.log('Run command error = ', err);
    throw new Error('Error in execute run command');
  }
}
