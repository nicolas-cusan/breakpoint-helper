# breakpoint-helper

Small helper library to work with layout breakpoints\* in Javascript.

> \*window widths at which styles/functionality changes to adapt for wider/narrower screens

## Core functionality

- Easily check if a breakpoint is active referencing it by name instead of value
- Listen to breakpoint changes and add/remove functionality accordingly
- Works with `px` and `em` breakpoints
- Supports `min-width` and `max-width`
- Define your own breakpoint names and values
- Share CSS breakpoints with Javascript so they only need to be maintained in one place (optional)

## Introduction

In CSS it is common practice to give layout breakpoints, used in width-based media queries, names, such as `'mobile'`, `'tablet'`, `'desktop'` or `'sm'`, `'md'`, `'lg'`, to be able to easily reference them instead of having to remember exact values.

Often times the the CSS breakpoints apply styling changes that need to be mirrored in Javascript, e.g. display cards in a slider on small screens (with Javascript) and as a grid on larger screens (without Javascript).

**breakpoint-helper** is a thin wrapper around `window.matchMedia` that aims to make working with layout breakpoints in Javascript more convenient by: allowing to reference the breakpoints by name instead of by value (`'sm'` vs. `765`), providing a convenient API to set and remove event listeners on media queries and (optionally) share breakpoints defined in CSS with Javascript.

## Installation

Install via [npm](http://npmjs.org):

```shell
npm install breakpoint-helper
```

## Usage

Instantiate breakpoint-helper and use the methods returned from the instance to work with your breakpoints. (There a different ways to let breakpoint-helper know what breakpoints to use, [see below](#user-content-share-your-breakpoints-between-css-and-javascript)).

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph({
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
});
```

Use the instance in your code:

```js
// src/modules/myModule.js;

import bph from 'src/utils/bph.js';

console.log(bph.isMatching('md'));

bph.listen({ name: 'md' }, ({ mathes }) => {
  if (matches) {
    // Do something every time this breakpoint is matching
  }
});
```

## Options to provide CSS breakpoints

There are three options to provide the breakpoint names and values to breakpoint-helper. What implementation to choose depends on the particular project setup.

**NOTE:** All implementations expect the breakpoints to be ordered from small to large.

### 1. Javascript object

Breakpoints can be passed in as a object where the object keys represent the breakpoint names and the values the breakpoints screen widths.

The values should be of type `String` and include a CSS unit, both `px` and `em` are supported.

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph({
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
});
```

This method is convenient when using a styling system that defines breakpoints in Javascript, e.g. [Tailwind CSS](https://tailwindcss.com/).

```js
// tailwind.config.js

module.exports = {
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
import bph from 'breakpoint-helper';
import config from './tailwind.config.js';

export default bph(config.theme.screens);
```

### 2. Serialized `font-family` (share CSS breakpoints with Javascript)

To use breakpoints defined in CSS, pass the string `'meta'` as argument to your breakpoint-helper instance:

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph('meta');
```

To make this method work there needs to be a `.breakpoint-helper` class in your stylesheet whose `font-family` value is a serialized string of breakpoints names and values:

```css
.breakpoint-helper {
  font-family: 'xs=416px&sm=600px&md=768px&lg=1024px&xl=1280px&xxl=1520px';
}
```

Under the hood breakpoint-helper will create a `<meta>` element in the document's `<head>` tag with the class `breakpoint-helper`, read the `font-famliy` CSS value and deserialize the value to learn about the breakpoints.

As serializing the breakpoints manually is not very convenient, breakpoint-helper provides a Sass function for it:

```scss
// main.scss
@import './node_modules/bph/dist/bph'; // path may vary depending on implementation

// _vars.scss
$bps: (
  'xs': 416px,
  'sm': 600px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  'xxl': 1520px,
);

// _bph.scss
.ff-bph {
  font-family: '#{breakpoint-string($bps)}';
}
```

### 3. Custom properties

To use breakpoints defined as CSS custom properties, pass the string `'custom'` as argument to your breakpoint-helper instance:

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph('custom');
```

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

## Methods

A breakpoint-helper instance returns the methods to work with the breakpoints.

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

const instance = bph({
  xs: '416px',
  sm: '600px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1520px',
});

// For convenience you can export the methods using destructuring:
export const {
  getBreakpoints,
  getMediaQuery,
  isMatching,
  listen,
  listenAll,
} = instance;

export default instance;
```

**NOTE:** The following code examples assume the use of the instance above.

### getBreakpoints()

Get all breakpoints the instance is working with. Useful for debugging or passing breakpoint values to other libraries.

#### Returns

- `Object` - Object containing all instance breakpoints.

#### Example

```js
import bph from './src/utils/bph';

const breakpoints = bph.getBreakpoints();

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

### getMediaQuery(name, [useMax=false])

Get a `min-width` or `max-width` media query by breakpoint name.

#### Arguments

- **`name`** `{string}`: The breakpoint name.
- **`[useMax=false]`** `{boolean}`: Use `max-width` instead of `min-width`<sup>[1](#note-1)</sup>.

#### Returns

- `{string}` - A media query string.

#### Example

```js
import bph from './src/utils/bph';

const mq = bph.getMediaquery('md');
console.log(mq);
// "(min-width: 768px)"

const mqMax = bph.getMediaquery('md', true);
console.log(mqMax);
// "(max-width: 767px)"
```

### isMatching(name, [useMax=false])

Check if a breakpoint is currently matching

#### Arguments

- **`name`** `{string}`: Breakpoint name.
- **`[useMax=false]`** `{boolean}`: Use `max-width` instead of `min-width`.

#### Returns

- `boolean` - Whether the breakpoint is matching or not.

#### Example

```js
// Import instance
import bph from './src/utils/bph';

if (bph.isMatching('md')) {
  // Do something
} else {
  // Do something else
}
```

### listen(options, callback) ⇒ `Object`

Listen to a breakpoint change and execute a callback function. The callback function will receive a `MediaQueryList` object as parameter that can be used to check wether the breakpoint media query is matching or not. The callback function is called once on invocation, it is possible to opt out of this behavior via options.

**Returns**: `Object` - Returns an object containing a `on` and `off` method to enable and disable the listener

| Param               | Type       | Default | Description                                      |
| ------------------- | ---------- | ------- | ------------------------------------------------ |
| options             | `Object`   |         |                                                  |
| options.name        | `string`   |         | Breakpoint name to listen to                     |
| [options.useMax]    | `boolean`  | `false` | Use `max-width`                                  |
| [options.immediate] | `string`   | `true`  | Call the callback function on invocation         |
| callback            | `function` |         | Function called when the breakpoint is triggered |

#### Example

```js
// Import instance
import bph from './src/utils/bph';

const listener = bph.listen({ name: 'md' }, callback);

// Destructure the `MediaQueryList.matches` property for convenience
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

### listenAll(callback, [options]) ⇒ `Object`

Listen to all breakpoints matching or un-matching and execute a callback function. The callback function will receive an array of the matching breakpoint names in reverse order. Than means the largest (or smallest when using `useMax`) comes first in the array. If no breakpoints are matching

**Returns**: `Object` - Returns an object containing a `on` and `off` method to enable and disable the listener

| Param               | Type       | Default                                  | Description                                                                                                                               |
| ------------------- | ---------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| callback            | `function` |                                          | Callback function that is called every time a breakpoint is triggered, receives an array containing the breakpoint names in reverse order |
| [options]           | `Object`   |                                          | Listener options                                                                                                                          |
| [options.keys]      | `Array`    | All breakpoints defined for the instance | Array of breakpoint names to listen for. All breakpoint names should match a breakpoint defined in the instance                           |
| [options.useMax]    | `boolean`  | `false`                                  | Use `max-width`                                                                                                                           |
| [options.immediate] | `string`   | `true`                                   | Call the callback function on invocation                                                                                                  |

#### Example

```js
// Import instance
import bph from './src/utils/bph';

const listener = bph.listenAll(callback);

const callback = (bps) => {
  // Get the first breakpoint in the `bps` array.
  const match = bps[0];

  // If the largest matching breakpoint is 'lg', the array will look
  // like this: `['lg', 'md', 'sm', 'xs',]`. The larges matching breakpoint
  // name is the first in the array.

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

```js
// Import instance
import bph from './src/utils/bph';

const listener = bph.listenAll(callback, {
  // Only listen to the breakpoints 'xl', 'lg' and 'sm'.
  listenTo: ['xl', 'lg', 'sm'],
  // Use `max-width` media queries instead of `min-width`
  useMax: true,
});

const callback = (bps) => {
  // Get the first breakpoint in the `bps` array.
  const match = bps[0];

  // As the listener is using `max-width` media queries the smallest matching
  // breakpoint will be first in the array e.g. ['sm', 'lg', 'xl'].

  switch (match) {
    case 'xl':
      // Do something if the breakpoint is 'xl'
      break;
    case 'lg':
      // Do something if the breakpoint is 'xl'
      break;
    case 'sm':
      // Do something if the breakpoint is 'sm'
      break;

    default:
      // Do something no breakpoint is matching
      break;
  }
};

// Remove the event listener
listener.off();

// Activate it again
listener.on();
```

## Notes

<a name="note-1"></a>

- When using `useMax` breakpoint-helper will subtract `1px` from the breakpoint value to prevent overlap. If the breakpoint value is defined in `em`s `0.0635em` is subtracted (the equivalent of `1px` in `em` using a `16px` base).
