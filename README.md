# fluent-ffmpeg-util
Solve common problems you may encounter when using [fluent-ffmpeg](https://npmjs.org/package/fluent-ffmpeg).

This package is recommended for projects which are already using fluent-ffmpeg, for new projects it
is advised to use [eloquent-ffmpeg](https://github.com/FedericoCarboni/eloquent-ffmpeg#readme).

### Multiple Streams
You can use any number of output and input streams by using `handleInputStream()` or
`handleOutputStream()`, they return an object with the following shape:
 - path: the output to give to fluent-ffmpeg.
 - close(): closes the underlying server, this is dealt with automatically if no error occurs.
```ts
var ffmpeg = require('fluent-ffmpeg');
var util = require('fluent-ffmpeg-util');
var fs = require('fs');
var input = util.handleInputStream(fs.createReadStream('input.webm'));
var output = util.handleOutputStream(fs.createReadStream('output.mkv'));
ffmpeg()
    .input(input.path)
    .output(output.path)
    .toFormat('matroska')
    .on('error', function () {
        input.close();
        output.close();
    })
    .run();
```

### Multiple Destinations
To write the output file to multiple destinations use `tee()`, you can also pass streams directly to
it and they'll be handled using `handleOutputStream()`.
```ts
var ffmpeg = require('fluent-ffmpeg');
var util = require('fluent-ffmpeg-util');
var fs = require('fs');
ffmpeg()
    .input('input.webm')
    .output(util.tee('output.mkv', fs.createReadStream('output1.mkv')))
    .toFormat('matroska')
    .run();
```

### Pause & Resume
To pause/resume a fluent-ffmpeg command use `pause()` or `resume()`, this is a cross-platform
alternative to using `command.kill('SIGSTOP')` and `command.kill('SIGCONT')`.
```ts
var ffmpeg = require('fluent-ffmpeg');
var util = require('fluent-ffmpeg-util');
var fs = require('fs');
var command = ffmpeg()
    .input('input.webm')
    .output(util.tee('output.mkv', fs.createReadStream('output1.mkv')))
    .toFormat('matroska')
    .on('start', function () {
        if (util.pause(command))
            console.log('ffmpeg paused');
        if (util.resume(command))
            console.log('ffmpeg resumed');
    });
command.run();
```

### Abort
To gracefully interrupt a command in fluent-ffmpeg use `abort()`, it allows ffmpeg to end the files
correctly but it doesn't guarantee a non-zero exit code. FFmpeg may still encounter an error while
ending the files, so errors should still be handled.
```ts
var ffmpeg = require('fluent-ffmpeg');
var util = require('fluent-ffmpeg-util');
var fs = require('fs');
var command = ffmpeg()
    .input('input.webm')
    .output(util.tee('output.mkv', fs.createReadStream('output1.mkv')))
    .toFormat('matroska')
    .on('start', function () {
        util.abort(command);
    });
command.run();
```
