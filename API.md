<a name="module_breakpoint-helper"></a>

## breakpoint-helper
Helper module to work with css media query breakpoints in javascript.
`bph` = Break-Point-Helper


* [breakpoint-helper](#module_breakpoint-helper)
    * _static_
        * [.bph([config])](#module_breakpoint-helper.bph) ⇒ <code>Object</code>
        * [.listenCallback](#module_breakpoint-helper.listenCallback) ⇒ <code>void</code>
    * _inner_
        * [~getBreakpoints()](#module_breakpoint-helper..getBreakpoints) ⇒ <code>Object</code>
        * [~getMediaQuery(breakpoint, [isMax])](#module_breakpoint-helper..getMediaQuery)
        * [~isMatching(breakpoint, [isMax])](#module_breakpoint-helper..isMatching) ⇒ <code>boolean</code>
        * [~listen(options, callback)](#module_breakpoint-helper..listen) ⇒ <code>Object</code>
        * [~listenAll(callback, [options])](#module_breakpoint-helper..listenAll) ⇒ <code>Object</code>

<a name="module_breakpoint-helper.bph"></a>

### breakpoint-helper.bph([config]) ⇒ <code>Object</code>
Main instance function

**Kind**: static method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)  
**Returns**: <code>Object</code> - Returns all methods  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [config] | <code>string</code> \| <code>Object</code> | <code>&quot;meta&quot;</code> | Can be `'meta'`, `'custom'`, or an object containing the breakpoints |

<a name="module_breakpoint-helper.listenCallback"></a>

### breakpoint-helper.listenCallback ⇒ <code>void</code>
Callback function for [~listen](~listen) that is called every time the breakpoint is triggered,
it receives a `MediaQueryList` object as an argument that allows to check if the media query is matching

**Kind**: static typedef of [<code>breakpoint-helper</code>](#module_breakpoint-helper)  

| Param | Type | Description |
| --- | --- | --- |
| mq | <code>MediaQueryList</code> |  |
| mq.matches | <code>MediaQueryList</code> | Boolean to indicate if the media query is matching |

**Example**  
```js
// Destructure `mq` to know it the media query is matching
function myCallback({matches}) {
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

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| breakpoint | <code>string</code> |  | A breakpoint name |
| [isMax] | <code>boolean</code> | <code>false</code> | Use `max-width` |

<a name="module_breakpoint-helper..isMatching"></a>

### breakpoint-helper~isMatching(breakpoint, [isMax]) ⇒ <code>boolean</code>
Check if a breakpoint is currently active/matching

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| breakpoint | <code>string</code> |  | Breakpoint name |
| [isMax] | <code>boolean</code> | <code>false</code> | Use `max-width` |

<a name="module_breakpoint-helper..listen"></a>

### breakpoint-helper~listen(options, callback) ⇒ <code>Object</code>
Listen to a breakpoint change

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)  
**Returns**: <code>Object</code> - Returns an object containing a `on` and `off` method to enable and disable the listener  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.name | <code>string</code> |  | Breakpoint name to listen to |
| [options.isMax] | <code>string</code> | <code>false</code> | Use `max-width` |
| [options.immediate] | <code>string</code> | <code>true</code> | Call the callback function on invocation |
| callback | <code>listenCallback</code> |  | The callback called when the breakpoint is triggered |

<a name="module_breakpoint-helper..listenAll"></a>

### breakpoint-helper~listenAll(callback, [options]) ⇒ <code>Object</code>
Listen to all breakpoints (or a subset via options)

**Kind**: inner method of [<code>breakpoint-helper</code>](#module_breakpoint-helper)  
**Returns**: <code>Object</code> - Returns an object containing a `on` and `off` method to enable and disable the listener  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function that is called every time a breakpoint is triggered, receives an array containing the breakpoint names in reverse order |
| [options] | <code>Object</code> | Listener options |

