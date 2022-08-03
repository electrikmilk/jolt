# Jolt

A simple reactive Javascript framework.

Combine JS files:

```console
php mix.php
```

---

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
			let previousMessage = App.Data('message');
			App.data.message = 'Goodbye, World!';
			App.Data('message', 'Goodbye');
			App.Data({
				message: 'Goodbye'
			});
		}
	}
});
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

Create your own custom tags:

```javascript
App.registerTag('tag', (node) => {
	// do stuff with node object...
});
```

Create your own nodes (reactive tags):

```javascript
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

## Prototypes

 - String
   - `listAdd(value,separator)`
   - `listRemove(value,separator)`
   - `trimChar(character)`
   - `trimPrefix(str)`
   - `trimSuffix(str)`
   - `stripTags()`
 - Array
   - `end()`
   - `pluck(key)`
   - `remove(key)`
   - `removeAll(key)`

## Helper methods

```javascript
App.random.id(optional: prefix)
App.random.number(max)
```

## User Object

```javascript
// example
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