# Jolt

Reactive Javascript framework.

---

## Getting started

Example app:

```javascript
App.create({
	ready: () => {
		console.log('ready!');
	},
	data: {
		message: 'Hello, World!'
	},
	functions: {
		sayGoodbye: () => {
			// Safely access/check for data using the App.Data() method
			let previousMessage = App.Data('message');

			// Multiple ways to set data:
			App.data.message = 'Goodbye, World!';
			App.Data('message', 'Goodbye');

			// Set multiple data properties using one method
			App.Data({
				message: 'Goodbye'
			});
		}
	}
});
```

## Select

```javascript
$('#element') // returns element object
$all('#element') // returns element object(s)
```

## Attributes

Model a property:

```html
<!-- Model an object, generates rows and cells -->
<table model="property"></table>

<!-- Model an array, generates <li> tags -->
<ul model="property"></ul>

<p model="property"></p>

<input type="text" model="property"/>

<input type="range" model="property"/>

<input type="checkbox" model="show"/>
```

Iterate an array property:

```html

<ul>
	<li foreach="item in list">{item}</li>
</ul>

<select model="item">
	<option foreach="item in list" value="{item}">{item}</option>
</select>
```

Model an HTML value:

```html

<div html="property"></div>
```

Conditional:

```html

<div if="show"></div>
```

Replace:

```html
<!-- Any attribute with a "." prefix -->
<div .style="background-image: url( {image} )"></div>
```

## Events

```html

<button type="submit" click="count">Click me!</button>
<input type="text" change="update"/>
<button type="submit" toggle="#myMessage">Toggle Message</button>
<div id="myMessage">Toggle me!</div>
```

## Tags

Inline eval:

```html

<eval>2+2</eval>
```

Inline model a property:

```html

<model>property</model>
```

## Hackable

Create your own tags:

```javascript
App.registerTag('tag', (node) => {
	// do stuff with node object...
});

// Reactive tags
App.registerNode('tag', function (node) {
	// do stuff with node object...
});
```

Create your own attributes:

```javascript
App.registerAttribute('attribute', function (value, node) {
	// do stuff with attribute value or node
});

// Reactive attributes
App.registerReactiveAttribute('attribute', function (value, node) {
	// do stuff with attribute value or node
});
```

Run custom code during the main loop:

```javascript
App.registerLoop(function () {
	// do stuff every time we loop
});
```

## Prototypes

- String
    - `listAdd(value,separator)` - Add item to a comma (or other seperator) seperated string
    - `listRemove(value,separator)` - Remove item from a comma (or other seperator) seperated string
    - `trimChar(character)` - Trim specific character from string
    - `trimPrefix(str)` - Trim specific prefix from beginning of string
    - `trimSuffix(str)` - Trim specific suffix from end of string
    - `stripTags()` - Strip all HTML tags from string
- Array
    - `end()` - Get last item of array
    - `pluck(key)` - Pluck values of a key into a new array
    - `remove(key)` - Remove item from array by key
    - `removeAll(key)` - Remove all items from array with key

## Helper methods

```javascript
App.random.id(optional
:
prefix
) // Create random GUID, add optional prefix
App.random.number(max) // Generate random number, 0 is min, specify your max
```

## User Object

You can access the `User` object at any time to check your user's browser info and more!

```json
{
  "language": "en-US",
  "browser": {
    "name": "chrome",
    "version": "103",
    "fullVersion": "103.0.0",
    "headless": false,
    "webview": false,
    "bot": false
  },
  "engine": {
    "name": "blink",
    "version": "103",
    "fullVersion": "103.0.0"
  },
  "platform": {
    "name": "macos",
    "mobile": false,
    "version": null
  }
}
```

## HTTP Requests

```javascript
// Returns an instance of HTTPRequest
let request = HTTP.request('GET', '/api/endpoint', {
    responseType: 'json',
    data: {
        key: 'value'
    },
    headers: {
        'header':'content'
    }
});

// Send the request, returns a promise
request.send().then((response) => {
    console.log(response.data);
    console.log(response.type);
    console.log(response.status);
    console.log(response.statusText);
}).catch((error) => {
    console.error(error);
});

request.progress(function (percent) {
    console.log(`${percent}%`);
});
```

### Shorthands

```javascript
// Example shorthand:
HTTP.get(url,{options})
    .then((response) => console.log(response))
    .catch((error)=>console.error(error));

// ...and so on:
HTTP.post(url,{options}) // => Promise
HTTP.put(url,{options}) // => Promise
HTTP.patch(url,{options}) // => Promise
HTTP.delete(url,{options}) // => Promise

// Simplest
get(url)
    .then((response) => console.log(response))
    .catch((error)=>console.error(error));
```

## Build

Jolt is not only written in TypeScript, but in multiple files and directories in /src/ to keep development organized. Therefore, it must be combined and compiled.

Compile into `jolt.js` into a build directory:

```console
tsc
```

Compile and minify a `jolt.js` into a build directory:

```console
php jolt build
```
