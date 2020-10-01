# bph

Small helper library to share css breakpoints with javascript.

## The problem

`window.matchMedia` allows the use of media query based logic in Javascript, but keeping breakpoints (window widths at which styles/functionality changes to adapt for wider/narrower screens) in sync between Javascript and CSS need to be done manually.

## The solution

In CSS it is common practice to name breakpoints in some to reference them only by name and avoid the need to remember and repeat a number throughout your codebase. **bph** helps you bridge the gab and bring the CSS breakpoint names to Javascript while also providing some convenience methods to work with them.

## Installation

Install via [npm](http://npmjs.org):

```shell
npm install -d bph
```

## Usage

Create a file to hold the bph instance:

```js
// src/utils/bph.js
import bph from 'bph';

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

## How to get your breakpoints into your Javascript

The naming strategies and implementations to name your breakpoints might differ depending on your preferences and the technologies you use.

There are three strategies to provide the breakpoint names and values to bph:

### 1. Serialized `font-family`

This is the default method for providing the breakpoints to bph. bph will create a `<meta>` element in the document's `<head>` tag with the class `ff-bph` and read its `font-famliy` CSS value. The value should be a serialized string of breakpoints names and values:

```css
.ff-bph {
  font-family: 'xs=374px&sm=586px&md=768px&lg=984px&xl=1190px&xxl=1390px';
}
```

For convenience bph provides a Sass function that will serialize a map for you:

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

As this is the default you the instance can be initialized without parameters, or if you want to be explicit use `"meta"` as option:

```js
// src/utils/bph.js
import bph from 'bph';

// both are equivalent
export default bph();
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
import bph from 'bph';

export default bph('custom');
```
