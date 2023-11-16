### Usage Example
```html
<div data-style="foo"></div>
<button class="bar">Click me</button>
```
```js
const fooState = {
    color: "red"
}

/**
 * useStyle accepts 3 params
 * 1. The name of the style
 * 2. A style object
 * 3. A state object
 * 
 * It returns a object that for now just have the refresh method, this method will rebuild the properties of the style
 */
const fooStyle = useStyle(
    "foo",
    {
        width: "400px",
        height: (style) => style.width,
        background: (_, state) => state.color,

        // It supports pseudo selectors
        ":hover": {
            opacity: 0.65
        }
    },
    fooState // state object
);

document
    .querySelector("button.bar")
    .addEventListener("click", () => {
        fooState.color = "blue";
        fooStyle.refresh(); // refresh computed properties in the style
    });
```