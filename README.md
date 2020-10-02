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
  mobile: '416px',
  tabletSmall: '600px',
  tablet: '768px',
  desktopSmall: '1024px',
  dekstop: '1280px',
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
  'xs': 374px,
  'sm': 586px,
  'md': 768px,
  'lg': 984px,
  'xl': 1190px,
  'xxl': 1390px,
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
  --bph-xs: 274px;
  --bph-sm: 486px;
  --bph-md: 668px;
  --bph-lg: 884px;
  --bph-xl: 1090px;
  --bph-xxl: 1290px;
}
```

When initializing your instance pass `"custom"` as option:

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph('custom');
```

## Methods

<a name="module_breakpoint-helper"></a>

## breakpoint-helper

Helper module to work with css media query breakpoints in javascript.
`bph` = Break-Point-Helper

- [breakpoint-helper](#module_breakpoint-helper)
  - _static_
    - [.bph([config])](#module_breakpoint-helper.bph) ⇒ <code>Object</code>
    - [.listenCallback](#module_breakpoint-helper.listenCallback) ⇒ <code>void</code>
  - _inner_
    - [~getBreakpoints()](#module_breakpoint-helper..getBreakpoints) ⇒ <code>Object</code>
    - [~getMediaQuery(breakpoint, [isMax])](#module_breakpoint-helper..getMediaQuery)
    - [~isMatching(breakpoint, [isMax])](#module_breakpoint-helper..isMatching) ⇒ <code>boolean</code>
    - [~listen(options, callback)](#module_breakpoint-helper..listen) ⇒ <code>Object</code>
    - [~listenAll(callback, [options])](#module_breakpoint-helper..listenAll) ⇒ <code>Object</code>

<a name="module_breakpoint-helper.bph"></a>

### breakpoint-helper.bph([config]) ⇒ <code>Object</code>

Main instance function

**Kind**: static method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)
**Returns**: <code>Object</code> - Returns all methods

| Param    | Type                                       | Default                       | Description                                                          |
| -------- | ------------------------------------------ | ----------------------------- | -------------------------------------------------------------------- |
| [config] | <code>string</code> \| <code>Object</code> | <code>&quot;meta&quot;</code> | Can be `'meta'`, `'custom'`, or an object containing the breakpoints |

<a name="module_breakpoint-helper.listenCallback"></a>

### breakpoint-helper.listenCallback ⇒ <code>void</code>

Callback function for [~listen](~listen) that is called every time the breakpoint is triggered,
it receives a `MediaQueryList` object as an argument that allows to check if the media query is matching

**Kind**: static typedef of [<code>breakpoint-helper</code>](#module_breakpoint-helper)

| Param      | Type                        | Description                                        |
| ---------- | --------------------------- | -------------------------------------------------- |
| mq         | <code>MediaQueryList</code> |                                                    |
| mq.matches | <code>MediaQueryList</code> | Boolean to indicate if the media query is matching |

**Example**

```js
// Destructure `mq` to know it the media query is matching
function myCallback({ matches }) {
  if (matches) {
    // Do something if matching
  }
}
```

<a name="module_breakpoint-helper..getBreakpoints"></a>

### breakpoint-helper~getBreakpoints() ⇒ <code>Object</code>

Get all breakpoints.

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)
**Returns**: <code>Object</code> - Object containing all breakpoints.
<a name="module_breakpoint-helper..getMediaQuery"></a>

### breakpoint-helper~getMediaQuery(breakpoint, [isMax])

Get a `min-` or `max-width` media query by name.

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)

| Param      | Type                 | Default            | Description       |
| ---------- | -------------------- | ------------------ | ----------------- |
| breakpoint | <code>string</code>  |                    | A breakpoint name |
| [isMax]    | <code>boolean</code> | <code>false</code> | Use `max-width`   |

<a name="module_breakpoint-helper..isMatching"></a>

### breakpoint-helper~isMatching(breakpoint, [isMax]) ⇒ <code>boolean</code>

Check if a breakpoint is currently active/matching

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)

| Param      | Type                 | Default            | Description     |
| ---------- | -------------------- | ------------------ | --------------- |
| breakpoint | <code>string</code>  |                    | Breakpoint name |
| [isMax]    | <code>boolean</code> | <code>false</code> | Use `max-width` |

<a name="module_breakpoint-helper..listen"></a>

### breakpoint-helper~listen(options, callback) ⇒ <code>Object</code>

Listen to a breakpoint change

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)
**Returns**: <code>Object</code> - Returns an object containing a `on` and `off` method to enable and disable the listener

| Param               | Type                        | Default            | Description                                          |
| ------------------- | --------------------------- | ------------------ | ---------------------------------------------------- |
| options             | <code>Object</code>         |                    |                                                      |
| options.name        | <code>string</code>         |                    | Breakpoint name to listen to                         |
| [options.isMax]     | <code>string</code>         | <code>false</code> | Use `max-width`                                      |
| [options.immediate] | <code>string</code>         | <code>true</code>  | Call the callback function on invocation             |
| callback            | <code>listenCallback</code> |                    | The callback called when the breakpoint is triggered |

<a name="module_breakpoint-helper..listenAll"></a>

### breakpoint-helper~listenAll(callback, [options]) ⇒ <code>Object</code>

Listen to all breakpoints (or a subset via options)

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)
**Returns**: <code>Object</code> - Returns an object containing a `on` and `off` method to enable and disable the listener

| Param     | Type                  | Description                                                                                                                               |
| --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| callback  | <code>function</code> | Callback function that is called every time a breakpoint is triggered, receives an array containing the breakpoint names in reverse order |
| [options] | <code>Object</code>   | Listener options                                                                                                                          |
