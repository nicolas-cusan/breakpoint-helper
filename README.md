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

## Members

<dl>
<dt><a href="#breakpoints">breakpoints</a> ⇒ <code>Object.&lt;function()&gt;</code></dt>
<dd><p>Main instance function</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getBreakpoints">getBreakpoints()</a> ⇒ <code>Object</code></dt>
<dd><p>Get all breakpoints.</p>
</dd>
<dt><a href="#getMediaQuery">getMediaQuery(breakpoint, [isMax])</a> ⇒ <code>String</code></dt>
<dd><p>Get a <code>min-</code> or <code>max-width</code> media query by name.</p>
</dd>
<dt><a href="#isMatching">isMatching(breakpoint, [isMax])</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if a breakpoint is currently active/matching</p>
</dd>
<dt><a href="#listen">listen(options, callback)</a> ⇒ <code>Object</code></dt>
<dd><p>Listen to a breakpoint change</p>
</dd>
<dt><a href="#listenAll">listenAll(callback, [options])</a> ⇒ <code>Object</code></dt>
<dd><p>Listen to all breakpoints (or a subset via options)</p>
</dd>
</dl>

<a name="breakpoints"></a>

## breakpoints ⇒ <code>Object.&lt;function()&gt;</code>

Main instance function

**Kind**: global variable
**Returns**: <code>Object.&lt;function()&gt;</code> - Returns an object containing methods

| Param  | Type                                       | Description                                               |
| ------ | ------------------------------------------ | --------------------------------------------------------- |
| config | <code>Object</code> \| <code>String</code> | Abject containing the breakpoints, `'meta'` or `'custom'` |

<a name="getBreakpoints"></a>

## getBreakpoints() ⇒ <code>Object</code>

Get all breakpoints.

**Kind**: global function
**Returns**: <code>Object</code> - Object containing all breakpoints.
<a name="getMediaQuery"></a>

## getMediaQuery(breakpoint, [isMax]) ⇒ <code>String</code>

Get a `min-` or `max-width` media query by name.

**Kind**: global function
**Returns**: <code>String</code> - A media query

| Param      | Type                 | Default            | Description       |
| ---------- | -------------------- | ------------------ | ----------------- |
| breakpoint | <code>string</code>  |                    | A breakpoint name |
| [isMax]    | <code>boolean</code> | <code>false</code> | Use `max-width`   |

<a name="isMatching"></a>

## isMatching(breakpoint, [isMax]) ⇒ <code>boolean</code>

Check if a breakpoint is currently active/matching

**Kind**: global function
**Returns**: <code>boolean</code> - Whether the breakpoint is matching or not

| Param      | Type                 | Default            | Description     |
| ---------- | -------------------- | ------------------ | --------------- |
| breakpoint | <code>string</code>  |                    | Breakpoint name |
| [isMax]    | <code>boolean</code> | <code>false</code> | Use `max-width` |

<a name="listen"></a>

## listen(options, callback) ⇒ <code>Object</code>

Listen to a breakpoint change

**Kind**: global function
**Returns**: <code>Object</code> - Returns an object containing a `on` and `off` method to enable and disable the listener

| Param               | Type                  | Default            | Description                                      |
| ------------------- | --------------------- | ------------------ | ------------------------------------------------ |
| options             | <code>Object</code>   |                    |                                                  |
| options.name        | <code>string</code>   |                    | Breakpoint name to listen to                     |
| [options.isMax]     | <code>boolean</code>  | <code>false</code> | Use `max-width`                                  |
| [options.immediate] | <code>string</code>   | <code>true</code>  | Call the callback function on invocation         |
| callback            | <code>function</code> |                    | Function called when the breakpoint is triggered |

<a name="listenAll"></a>

## listenAll(callback, [options]) ⇒ <code>Object</code>

Listen to all breakpoints (or a subset via options)

**Kind**: global function
**Returns**: <code>Object</code> - Returns an object containing a `on` and `off` method to enable and disable the listener

| Param               | Type                  | Default            | Description                                                                                                                               |
| ------------------- | --------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| callback            | <code>function</code> |                    | Callback function that is called every time a breakpoint is triggered, receives an array containing the breakpoint names in reverse order |
| [options]           | <code>Object</code>   |                    | Listener options                                                                                                                          |
| [options.isMax]     | <code>boolean</code>  | <code>false</code> | Use `max-width`                                                                                                                           |
| [options.immediate] | <code>string</code>   | <code>true</code>  | Call the callback function on invocation                                                                                                  |
