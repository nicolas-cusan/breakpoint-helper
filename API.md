## Functions

<dl>
<dt><a href="#bph">bph(config)</a> ⇒ <code>Object.&lt;function()&gt;</code></dt>
<dd><p>Main instance function</p>
</dd>
<dt><a href="#getBreakpoints">getBreakpoints()</a> ⇒ <code>Object</code></dt>
<dd><p>Get all breakpoints.</p>
</dd>
<dt><a href="#getMediaQuery">getMediaQuery(name, [isMax])</a> ⇒ <code>String</code></dt>
<dd><p>Get a <code>min-</code> or <code>max-width</code> media query by name.</p>
</dd>
<dt><a href="#isMatching">isMatching(name, [isMax])</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if a breakpoint is currently active/matching</p>
</dd>
<dt><a href="#listen">listen(options, callback)</a> ⇒ <code>Object</code></dt>
<dd><p>Listen to a breakpoint change</p>
</dd>
<dt><a href="#listenAll">listenAll(callback, [options])</a> ⇒ <code>Object</code></dt>
<dd><p>Listen to all breakpoints (or a subset via options)</p>
</dd>
</dl>

<a name="bph"></a>

## bph(config) ⇒ <code>Object.&lt;function()&gt;</code>

Main instance function

**Kind**: global function
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

## getMediaQuery(name, [isMax]) ⇒ <code>String</code>

Get a `min-` or `max-width` media query by name.

**Kind**: global function
**Returns**: <code>String</code> - A media query

| Param   | Type                 | Default            | Description       |
| ------- | -------------------- | ------------------ | ----------------- |
| name    | <code>string</code>  |                    | A breakpoint name |
| [isMax] | <code>boolean</code> | <code>false</code> | Use `max-width`   |

<a name="isMatching"></a>

## isMatching(name, [isMax]) ⇒ <code>boolean</code>

Check if a breakpoint is currently active/matching

**Kind**: global function
**Returns**: <code>boolean</code> - Whether the breakpoint is matching or not

| Param   | Type                 | Default            | Description     |
| ------- | -------------------- | ------------------ | --------------- |
| name    | <code>string</code>  |                    | Breakpoint name |
| [isMax] | <code>boolean</code> | <code>false</code> | Use `max-width` |

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
