# reoptions

![NPM Latest Version](https://img.shields.io/npm/v/reoptions)
![Bundle Size](https://img.shields.io/bundlephobia/min/reoptions?label=bundle%20size)
![Downloads Count](https://img.shields.io/npm/dm/reoptions.svg)
![Test Status](https://img.shields.io/github/actions/workflow/status/LacusSolutions/reoptions-js/publish.yml?label=ci/cd)
![Last Update Date](https://img.shields.io/github/last-commit/LacusSolutions/reoptions-js)
![Project License](https://img.shields.io/github/license/LacusSolutions/reoptions-js)

JavaScript package with a function to stringify and remove non-numeric characters of items.

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## Installation

```bash
# using NPM
$ npm install --save reoptions

# using Bun
$ bun add reoptions
```

## Import

```js
// ES Modules
import reoptions from 'reoptions'

// Common JS
const reoptions = require('reoptions')
```

or import it through your HTML file, using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/reoptions@latest/dist/reoptions.min.js"></script>
```

## Usage

```js
reoptions('12345')                  // returns '12345'
reoptions('abc123')                 // returns '123'
reoptions(['a', 'b', 'c', 1, 2, 3]) // returns '123'
reoptions(true)                     // returns ''
reoptions(() => 5 + 3)              // returns '53'
```
