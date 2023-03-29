import { Writable as streamWritable } from 'stream';
import { Execute } from './utils/types';
import { PiCameraOutput, PiCameraConfig, Commands } from './types';
import { ChildProcessWithoutNullStreams } from 'child_process';

export default function buildMakeLibCamera({
  execute,
  jpegCommands,
  stillCommands,
  vidCommands,
  rawCommands,
}: {
  execute: Execute;
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
          execute,
          config,
        });
      },
      still: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeStill({
          Flags: stillCommands.Flags,
          Options: stillCommands.Options,
          execute,
          config,
        });
      },
      vid: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeVid({
          Flags: vidCommands.Flags,
          Options: vidCommands.Options,
          execute,
          config,
        });
      },
      raw: ({ config }: { config: PiCameraConfig }) => {
        config = configShouldBeAnObject({ config });
        return makeRaw({
          Flags: rawCommands.Flags,
          Options: rawCommands.Options,
          execute,
          config,
        });
      },
    });
  };
}

function runCommand({
  execute,
  cmdCommand,
  config,
}: {
  execute: Execute;
  cmdCommand: string;
  config: PiCameraConfig;
}) {
  try {
    let results = execute.runCommand({ cmdCommand });
    results.then(function(exResults){
      let resultsType = typeof SpeechRecognitionResultList;
      if(resultsType !== 'string'){
        let childProcess = (exResults as ChildProcessWithoutNullStreams);
        let stdOut = childProcess.stdout;
        let myStreamWritable = (config.output as streamWritable);
        stdOut.pipe(myStreamWritable, {end:true});
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
    }
    );
    results.catch((err: unknown) => {
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
  execute,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  execute: Execute;
  config: PiCameraConfig;
}) {
  const cmdCommand = createTakePictureCommand({
    baseType: 'libcamera-jpeg',
    Flags,
    Options,
    execute,
    config,
  });

  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    console.log('cmdCommand = ', cmdCommand);
    return cmdCommand;
  }
  return runCommand({ execute, cmdCommand, config });
}

function makeStill({
  Flags,
  Options,
  execute,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  execute: Execute;
  config: PiCameraConfig;
}) {
  try {
    const cmdCommand = createTakePictureCommand({
      baseType: 'libcamera-still',
      Flags,
      Options,
      execute,
      config,
    });

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      console.log('cmdCommand = ', cmdCommand);
      return cmdCommand;
    }
    return runCommand({ execute, cmdCommand, config });
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
  execute,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  execute: Execute;
  config: PiCameraConfig;
}) {
  try {
    const cmdCommand = createTakePictureCommand({
      baseType: 'libcamera-vid',
      Flags,
      Options,
      execute,
      config,
    });

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      console.log('cmdCommand = ', cmdCommand);
      return cmdCommand;
    }
    return runCommand({ execute, cmdCommand, config });
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
  execute,
  config,
}: {
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  execute: Execute;
  config: PiCameraConfig;
}) {
  try {
    const cmdCommand = createTakePictureCommand({
      baseType: 'libcamera-raw',
      Flags,
      Options,
      execute,
      config,
    });

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      console.log('cmdCommand = ', cmdCommand);
      return cmdCommand;
    }
    return runCommand({ execute, cmdCommand,config });
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
  execute,
  config,
}: {
  baseType:
    | 'libcamera-jpeg'
    | 'libcamera-still'
    | 'libcamera-vid'
    | 'libcamera-raw';
  Flags: Commands['Flags'];
  Options: Commands['Options'];
  execute: Execute;
  config: PiCameraConfig;
}) {
  const cmdCommand = execute.cmdCommand({
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
    } else if (Options.includes(key)) 
    {
      if(key === "output" 
        && config[key] !== null 
        && typeof config[key] === 'object' 
        && typeof config[key].pipe === 'function'    
        )
      {
        //This is a request to output the data to a stream object
        if(config[key].writable !== false
          && typeof config[key]._write === 'function'
          && typeof config[key]._writableState === 'object')
        {
          outputIsStream = true;
          //-o -
          //configArray.push(`--${key}`, config[key]);
          configArray.push(`-o`, "-");
        }else{
          throw new Error("Stream is not writable");
        } 
        
      }else{
        configArray.push(`--${key}`, config[key]);
      }
    }
  });
  if(outputIsStream){
    config.outputIsStream = true;
  }
  return configArray;
}
