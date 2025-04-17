# proc-log

Emits 'log' events on the process object which a log output listener can
consume and print to the terminal.

This is used by various modules within the npm CLI stack in order to send
log events that can be consumed by a listener on the process object.

## API

* `log.error(...args)` calls `process.emit('log', 'error', ...args)`
  The highest log level.  For printing extremely serious errors that
  indicate something went wrong.
* `log.warn(...args)` calls `process.emit('log', 'warn', ...args)`
  A fairly high log level.  Things that the user needs to be aware of, but
  which won't necessarily cause improper functioning of the system.
* `log.notice(...args)` calls `process.emit('log', 'notice', ...args)`
  Notices which are important, but not necessarily dangerous or a cause for
  excess concern.
* `log.info(...args)` calls `process.emit('log', 'info', ...args)`
  Informative messages that may benefit the user, but aren't particularly
  important.
* `log.verbose(...args)` calls `process.emit('log', 'verbose', ...args)`
  Noisy output that is more detail that most users will care about.
* `log.silly(...args)` calls `process.emit('log', 'silly', ...args)`
  Extremely noisy excessive logging messages that are typically only useful
  for debugging.
* `log.http(...args)` calls `process.emit('log', 'http', ...args)`
  Information about HTTP requests made and/or completed.
* `log.pause()` calls `process.emit('log', 'pause')`  Used to tell
  the consumer to stop printing messages.
* `log.resume()` calls `process.emit('log', 'resume')`
  Used to tell the consumer that it is ok to print messages again.
* `log.LEVELS` an array of strings of all log method names

## Examples

Every method calls `process.emit('log', level, ...otherArgs)` internally.
So in order to consume those events you need to do `process.on('log', fn)`.

### Colorize based on level

Here's an example of how to consume `proc-log` events and colorize them
based on level:

```js
const chalk = require('chalk')

process.on('log', (level, ...args) => {
  if (level === 'error') {
    console.log(chalk.red(level), ...args)
  } else {
    console.log(chalk.blue(level), ...args)
  }
})
```

### Pause and resume

`pause` and `resume` are included so you have the ability to tell your consumer
that you want to pause or resume your display of logs. In the npm CLI we use
this to buffer all logs on init until we know the correct loglevel to display.
But we  also setup a second handler that writes everything to a file even if
paused.

```js
let paused = true
const buffer = []

// this handler will buffer and replay logs only
// after `procLog.resume()` is called
process.on('log', (level, ...args) => {
  if (level === 'resume') {
    buffer.forEach((item) => console.log(...item))
    paused = false
    return
  } 

  if (paused) {
    buffer.push([level, ...args])
  } else {
    console.log(level, ...args)
  }
})

// this handler will write everything to a file
process.on('log', (...args) => {
  fs.appendFileSync('debug.log', args.join(' '))
})
```