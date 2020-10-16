# breakpoint-helper

[![npm][npm-image]][npm-url] [![license][license-image]][license-url]

Small helper library to work with layout breakpoints\* in Javascript.

## Core functionality

- Easily check if a breakpoint is active referencing it by name instead of value.
- Listen to breakpoint changes and add/remove functionality accordingly.
- Works with `px` and `em` breakpoints.
- Supports `min-width` and `max-width`.
- Define your own breakpoint names and values.
- Share CSS breakpoints with Javascript so they only need to be maintained in one place (optional).

## Introduction

In CSS it is common practice to give layout breakpoints, used in width-based media queries, names, such as `'mobile'`, `'tablet'`, `'desktop'` or `'sm'`, `'md'`, `'lg'`, to be able to easily reference them instead of having to remember exact values.

Often times the the CSS breakpoints apply styling changes that need to be mirrored in Javascript, e.g. display cards in a slider on small screens (with Javascript) and as a grid on larger screens (without Javascript).

**breakpoint-helper** is a thin wrapper around `window.matchMedia` that aims to make working with layout breakpoints in Javascript more convenient by allowing to reference the breakpoints by name instead of by value (`'sm'` vs. `765px`) and providing a convenient API to set and remove event listeners on media queries.

## Installation

Install via [npm][npm-url] or yarn:

```shell
npm install --save breakpoint-helper
# or
yarn add breakpoint-helper
```

## Usage

The breakpoint-helper exports a factory function to create a breakpoint-helper instance. The factory function expects to receive the breakpoints it should work. There are different ways to provide the breakpoints, the best choice depends on the specific project setup.

> **NOTE:** All initialization options expect the breakpoints to be ordered from small to large.

### Initialize with Javascript object

The breakpoints can defined in an object where the object keys represent the breakpoint names and the values the screen widths. The values should be of type `string` and include a CSS unit, both `px` and `em` are supported.

```js
import breakpointHelper from 'breakpoint-helper';

const bph = breakpointHelper({
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
});
```

This method is convenient when using a styling system that defines breakpoints in Javascript, e.g. [Tailwind CSS](https://tailwindcss.com/). Given the following Tailwind config:

```js
// tailwind.config.js
export default {
  theme: {
    // Breakpoints
    screens: {
      xs: '416px',
      sm: '600px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1520px',
    }
    // Other config ...
  }
```

Import the Tailwind CSS config and use the `screen` key that defines the breakpoints when instantiating breakpoint-helper:

```js
// src/utils/bph.js
import breakpointHelper from 'breakpoint-helper';
import config from './path/to/tailwind.config.js';

const bph = breakpointHelper(config.theme.screens);
```

### Initialize with Sass map (share CSS breakpoints with Javascript)

Breakpoint-helper provides a sass mixin that allows the use of a Sass map to define the breakpoints. To use this method use the mixin in your Sass code by passing it the breakpoints as argument:

```scss
// Import the mixin, path may vary depending on implementation
@import './node_modules/breakpoint-helper/dist/bph';

// Define a map of breakpoints
$bps: (
  'xs': 416px,
  'sm': 600px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  'xxl': 1520px,
);

// Use the mixin
@include breakpoint-helper($bps);
```

Then initialize breakpoint-helper with the string `'meta'` as argument:

```js
// src/utils/bph.js
import breakpointHelper from 'breakpoint-helper';

const bph = breakpointHelper('meta');
```

#### What is happening here?

The Sass mixin will create a ruleset for the class `.breakpoint-helper` with a single `font-family` declaration, the `font-family` value will be a serialized string of the breakpoint map:

```css
.breakpoint-helper {
  font-family: 'xs=416px&sm=600px&md=768px&lg=1024px&xl=1280px&xxl=1520px';
}
```

When breakpoint-helper gets initialized it will create a `<meta>` element in the document's `<head>` tag with the class `breakpoint-helper`, read the `font-famliy` CSS value and deserialize it.

> **NOTE:** This method does not require the use of Sass or the mixin per se. All that is required is the class `.breakpoint-helper` with the serialized breakpoints as `font-family` value.

### Initialize using CSS custom properties

Declare the custom properties on the `:root` selector using the prefix `--bph-`:

```css
:root {
  --bph-xs: 416px;
  --bph-sm: 600px;
  --bph-md: 768px;
  --bph-lg: 1024px;
  --bph-xl: 1280px;
  --bph-xxl: 1520px;
}
```

Then initialize breakpoint-helper passing the string `'custom'` as an argument:

```js
// src/utils/bph.js
import breakpointHelper from 'breakpoint-helper';

const bph = breakpointHelper('custom');
```

## Methods

Each breakpoint-helper instance returns methods to work with the breakpoints.

In larger projects it is convenient to create a reusable breakpoint-helper instance module and export the returned methods for easier usage.

```js
import breakpointHelper from 'breakpoint-helper';

// Could be any other of the initialization methods
const instance = breakpointHelper({
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
});

export const {
  getBreakpoints,
  getMediaQuery,
  isMatching,
  listen,
  listenAll,
} = instance;

export default instance;
```

> **NOTE:** The following code examples assume the use of the instance above.

### `getBreakpoints()`

Get all breakpoints as an object. Useful for debugging or passing breakpoint values to other libraries.

#### Returns

- `Object`: Object containing all instance breakpoints.

#### Example

```js
import { getBreakpoints } from './src/utils/bph';

const breakpoints = getBreakpoints();

console.log(breakpoints);
// {
//   xs: '416px',
//   sm: '600px',
//   md: '768px',
//   lg: '1024px',
//   xl: '1280px',
//   xxl: '1520px',
// }
```

### `getMediaQuery(name, [useMax=false])`

Get a `min-width`, `max-width` or `min-width and max-width` media query by breakpoint name.

#### Arguments

- **`name`** `{string|Array}`: Breakpoint name or array of two breakpoint names.<sup>[2](#note-2)</sup>
- **`[useMax=false]`** `{boolean}`: Use `max-width` instead of `min-width`<sup>[3](#note-3)</sup>.

#### Returns

- `{string}`: Media query string.

#### Example

```js
import { getMediaquery } from './src/utils/bph';

const mq = getMediaquery('md');
console.log(mq);
// '(min-width: 768px)'

const mqMax = getMediaquery('md', true);
console.log(mqMax);
// '(max-width: 767px)'

const mqMinMax = getMediaquery(['md', 'lg']);
console.log(mqMax);
// '(min-width: 768px) and (max-width: 1023px)'
```

### `isMatching(name, [useMax=false])`

Check if a breakpoint or breakpoint range is currently matching.

#### Arguments

- **`name`** `{string|Array}`: Breakpoint name or array of two breakpoint names.<sup>[2](#note-2)</sup>
- **`[useMax=false]`** `{boolean}`: Use `max-width` instead of `min-width`<sup>[3](#note-3)</sup>.

#### Returns

- `{boolean}`: Whether the breakpoint or breakpoint range is matching or not.

#### Example

```js
import { isMatching } from './src/utils/bph';

if (isMatching('md')) {
  // Do something
} else {
  // Do something else
}

if (isMatching(['md', 'lg'])) {
  // Screen width is between 'md' and 'lg'
}
```

### `listen(options, callback)`

Listen to a breakpoint or breakpoint range change and execute a callback function. The callback function will receive a `MediaQueryList` object as parameter that can be used to check wether the breakpoint media query is matching or not. The callback function is called once on listener creation, it is possible to opt out of this behavior via options.

#### Arguments

- **`options`** `{Object|string|Array}` Configuration Object, breakpoint name or array of two breakpoint names.
- **`options.name`** `{string}`: Breakpoint name or array of two breakpoint names.<sup>[2](#note-2)</sup>
- **`[options.useMax=false]`** `{boolean}`: Use `max-width` instead of `min-width`<sup>[3](#note-3)</sup>.
- **`[options.immediate=true]`** `{boolean}`: Execute callback function on listener creation.
- **`callback`** `{Function}` : Callback function, receives a `MediaQueryList` as parameter.

#### Returns

- `{Object}`: Object containing the `on` and `off` listener methods.

#### Example

```js
import { listen } from './src/utils/bph';

const listener = listen('md', callback);

// Destructure the `MediaQueryList.matches` property
const callback = ({ matches }) => {
  if (matches) {
    // Do somthing
  } else {
    // Do somthing else
  }
};

// Remove the event listener
listener.off();

// Activate it again
listener.on();
```

Using an options object instead of a breakpoint name:

```js
import { listen } from './src/utils/bph';

const listener = listen(
  {
    name: 'md',
    useMax: true,
    immediate: false,
  },
  callback
);

const callback = ({ matches }) => {
  // ...
};
```

### `listenAll(callback, [options])`

Listen to all breakpoints matching or un-matching and execute a callback function. The callback function will receive an array of the matching breakpoint names in reverse order as a parameter. That means the largest breakpoint name (or smallest when using `options.useMax`) comes first in the array. The array will be empty if no breakpoints are matching.

#### Arguments

- **`callback`** `{Function}` : Callback function, receives an array of breakpoint names as parameter.
- **`[options]`** `{Object}`: Configuration Object.
- **`[options.listenTo]`** `{Array}`: Array of breakpoint names. All are used by default.
- **`[options.useMax=false]`** `{boolean}`: Use `max-width` instead of `min-width`<sup>[3](#note-3)</sup>.
- **`[options.immediate=true]`** `{boolean}`: Execute callback function on listener creation.

#### Returns

- `{Object}`: Object containing the `on` and `off` listener methods.

#### Example

```js
import { listenAll } from './src/utils/bph';

const listener = listenAll(callback);

const callback = (bps) => {
  // Get the first breakpoint in the `bps` array.
  const match = bps[0];

  // If the largest matching breakpoint is 'lg', it will
  // be the first in the array `['lg', 'md', 'sm', 'xs',]`.

  switch (match) {
    case 'lg':
      // Do something if the breakpoint is 'lg'
      break;
    case 'md':
      // Do something if the breakpoint is 'md'
      break;
    case 'sm':
      // Do something if the breakpoint is 'sm'
      break;

    default:
      // Do something if another breakpoint is matching or none is
      break;
  }
};

// Remove the event listener
listener.off();

// Activate it again
listener.on();
```

Limit the breakpoints by passing using `options.listenTo`:

```js
import { listenAll } from './src/utils/bph';

const listener = listenAll(callback, {
  // Only listen to the breakpoints 'xl', 'lg' and 'sm'.
  listenTo: ['xl', 'lg', 'sm'],
  // Use `max-width` media queries instead of `min-width`
  useMax: true,
});

const callback = (bps) => {
  // ...
};
```

## Roadmap

- Codepen or Codesandbox examples.
- Create React hook.
- Add testing.

## Notes

<a name="note-1"></a><sup>1)</sup> Browser window widths at which styles/functionality changes to adapt for wider/narrower screens.

<a name="note-2"></a><sup>2)</sup> The `useMax` argument will be ignored when `name` is an array.

<a name="note-3"></a><sup>3)</sup> When using `useMax` breakpoint-helper will subtract `1px` from the breakpoint value to prevent overlap. If the breakpoint value is defined in `em`s `0.0635em` is subtracted (the equivalent of `1px` in `em` using a `16px` base).

[license-image]: https://img.shields.io/npm/l/breakpoint-helper.svg?style=flat-square
[license-url]: LICENSE
[npm-image]: https://img.shields.io/npm/v/breakpoint-helper.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/breakpoint-helper
