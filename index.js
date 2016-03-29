#!/usr/bin/env node

const concat = require('concat-stream')
const pad = require('pad')
var errors = {}

if (process.stdin.isTTY) {
  console.log('\nTo use this module, pipe output from `standard` into it:\n\nstandard | standard-summary')
  process.exit(1)
}

process.stdin.pipe(concat(function (buffer) {
  buffer
    .toString()
    .split('\n')
    .forEach(line => {
      if (!line || !line.match(/: /)) return
      var error = line.split(': ')[1].replace(/\.$/, '')
      var count = errors[error] || 0
      errors[error] = count + 1
    })

  Object.keys(errors)
    .sort((a, b) => errors[b] - errors[a])
    .forEach(error => {
      var count = errors[error]
      console.log(pad(String(count), 6), error)
    })
}))
