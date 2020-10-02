# breakpoint-helper

Small helper library to share and use your css layout breakpoints with javascript.

## Core functionality

- Easily check if a breakpoint is active referencing it by name instead of value
- Listen to breakpoint changes and add/remove functionality accordingly
- Works with `px` and `em` breakpoints
- Optionally share breakpoints between CSS an Javascript so they only need to be maintained in one place

## Introduction

In CSS it is common practice to give layout breakpoints used in width-based media queries names, such as `'mobile'`, `'tablet'`, `'desktop'` or `'sm'`, `'md'`, `'lg'`, to be able to reference them by name instead of having to remember a value. Often times the CSS styles applied at this breakpoints are accompanied by Javascript functionality such as displaying items in a slider only on small screens and a grid on larger screens.

`window.matchMedia` allows the use of media query based logic in Javascript, but keeping breakpoints in sync between Javascript and CSS need to be done manually. breakpoint-helper is a thin wrapper around `window.matchMedia` that helps you share your CSS breakpoints with Javascript and facilitates working with them.

## Installation

Install via [npm](http://npmjs.org):

```shell
npm install breakpoint-helper
```

## Usage

Create a file to hold the breakpoint-helper instance:

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

Use your instance:

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

## Share your breakpoints between CSS and Javascript

There are three options to provide the breakpoint names and values to breakpoint-helper. The naming strategies and implementations to name your breakpoints might differ depending on your preferences and the technologies you use.

### 1. Javascript object

Breakpoints can be passed in as a object where the object keys represent the breakpoint names and the values the breakpoints screen widths. The values should be of type `String` and include a CSS unit, both `px` and `em` are supported.

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

### 2. Serialized `font-family`

With breakpoint-helper breakpoints can be defined in CSS only. breakpoint-helper will create a `<meta>` element in the document's `<head>` tag with the class `breakpoint-helper`, read its `font-famliy` CSS value and create corresponding breakpoint object to work with internally. To make this possible the `font-family` value should be a serialized string of breakpoints names and values:

```css
.breakpoint-helper {
  font-family: 'xs=374px&sm=586px&md=768px&lg=984px&xl=1190px&xxl=1390px';
}
```

For convenience breakpoint-helper provides a Sass function that will serialize a Sass map for you:

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

Initialize your instance passing the string `"meta"` as an argument when instantiating breakpoint-helper.

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph('meta');
```

### 3. Custom properties

This method allows you to declare your breakpoints via CSS custom properties (a.k.a. CSS variables) using the prefix `--bph-` on the `:root` selector.

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

When initializing your instance pass `"custom"` as option:

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph('custom');
```

## Instance methods

A breakpoint-helper instance returns methods to work with your breakpoints. To use the methods you must define an instance and then use the methods returned by it.

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

Te examples below assume that you are using the instance as defined above.

### getBreakpoints() ⇒ `Object

Get all breakpoints the instance is working with. Usually useful for debugging or passing breakpoint values to other libraries.

**Returns**: `Object` - Object containing all breakpoints.

### getMediaQuery(name, [isMax]) ⇒ `String`

Get a `min-` or `max-width` media query by name.

**Returns**: `String` - A media query

| Param   | Type      | Default | Description       |
| ------- | --------- | ------- | ----------------- |
| name    | `string`  |         | A breakpoint name |
| [isMax] | `boolean` | `false` | Use `max-width`   |

#### Example

```js
// Import instance
import bph from './src/utils/bph';

const mq = bph.getMediaquery('md');
console.log(mq);
// "(min-width: 768px)"

const mqMax = bph.getMediaquery('md', true);
console.log(mqMax);
// "(max-width: 768px)"
```

### isMatching(name, [isMax]) ⇒ `boolean`

Check if a breakpoint is currently matching

**Returns**: `boolean` - Whether the breakpoint is matching or not

| Param   | Type      | Default | Description     |
| ------- | --------- | ------- | --------------- |
| name    | `string`  |         | Breakpoint name |
| [isMax] | `boolean` | `false` | Use `max-width` |

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
| [options.isMax]     | `boolean`  | `false` | Use `max-width`                                  |
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

Listen to all breakpoints matching or un-matching and executes a callback function. The callback function receives an array of strings with

**Returns**: `Object` - Returns an object containing a `on` and `off` method to enable and disable the listener

| Param               | Type       | Default | Description                                                                                                                               |
| ------------------- | ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| callback            | `function` |         | Callback function that is called every time a breakpoint is triggered, receives an array containing the breakpoint names in reverse order |
| [options]           | `Object`   |         | Listener options                                                                                                                          |
| [options.isMax]     | `boolean`  | `false` | Use `max-width`                                                                                                                           |
| [options.immediate] | `string`   | `true`  | Call the callback function on invocation                                                                                                  |
