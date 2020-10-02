# breakpoint-helper

Small helper library to share and use your css layout breakpoints with javascript.

## Core functionality

- Share breakpoints between CSS an Javascript so they only need to be maintained in one place
- Easily check if a breakpoint is active referencing it by name instead of value
- Listen to breakpoint changes and add/remove functionality accordingly
- Works with `px` and `em` breakpoints

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

export default bph(/* options */);
```

Use your instance:

```js
// src/modules/myModule.js;

import bph from 'src/utils/bph.js';

console.log(bph.isMatching('my-breakpoint-name'));

bph.listen({ name: 'my-breakpoint-name' }, ({ mathes }) => {
  if (matches) {
    // Do something every time this breakpoint is matching
  }
});
```

## How to get your CSS breakpoints into your Javascript

There are three options to provide the breakpoint names and values to breakpoint-helper. The naming strategies and implementations to name your breakpoints might differ depending on your preferences and the technologies you use.

### 1. Serialized `font-family`

This is the default method for providing the breakpoints to breakpoint-helper. breakpoint-helper will create a `<meta>` element in the document's `<head>` tag with the class `ff-bph` and read its `font-famliy` CSS value. The value should be a serialized string of breakpoints names and values:

```css
.ff-bph {
  font-family: 'xs=374px&sm=586px&md=768px&lg=984px&xl=1190px&xxl=1390px';
}
```

For convenience breakpoint-helper provides a Sass function that will serialize a map for you:

```scss
// main.scss
@import './node_modules/bph/dist/bph';

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

As this is the default the instance can be initialized without parameters, or if you want to be explicit use `"meta"` as option:

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';

export default bph();
// is wquivalent to
export default bph('meta');
```

### 2. Custom properties

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

### 3. Object

You can also pass an object to the main instance function.

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

This method is convenient when using a styling system that defines breakpoints in Javascript, e.g. [TailwindCSS](https://tailwindcss.com/).

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

```js
// src/utils/bph.js
import bph from 'breakpoint-helper';
import config from './tailwind.config.js';

export default bph(config.theme.screens);
```
