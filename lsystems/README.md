# lsystem

Code for messing around with L-Systems in JavaScript.

I didn't use the existing implementations as they are old-fashioned,
not modular, not documented, have no automated tests, and are
not powerful enough.

## Setup dev env

To setup for development work:

  npm install .

`grunt` runs the Jasmine specs.

## Build for the browser

Install dev env (see above).

TODO requirejs build for browser version

## Run in the browser

To run in the browser, you need to either configure require as follows:

  paths: {
    'lodash': '&lt;path to lodash&gt;',
    'uuid': '&lt;path to uuid&gt;'
  },
  shim: {
    'lodash': { exports: '_' },
    'uuid': { exports: 'UUID' }
  }

Or import the two scripts in the lib directory using &lt;script&gt; tags.

The lib directory contains the necessary library files which you
can include in your project.

The examples directory uses turtlewax to draw some images using
"sentences" generated by various L-Systems.
