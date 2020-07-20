# opti-status

[![NPM version](https://flat.badgen.net/npm/v/opti-status)](https://www.npmjs.com/package/opti-status)

Get the optimization status of a function from the point of view of V8 engine.

## Installation

    $ npm install opti-status


## Usage

```js
const optiStatus = require("opti-status");

const myFunc = () => {
    // ...
};

console.log(optiStatus(myFunc).message);
```

## API

### `optiStatus(func, [...args])`

The main function accept a function or a string as first argument and as many additional arguments as you want.
The passed function will be called with the additional arguments as parameters.
Return an object containing the original status code, the passed function and a human readable message explaining the status.

example:
```js
{
    status: 49,
    function: [Function],
    message: "This is a function, optimized and turbo-fanned.",
}
```

### `optiStatus.statuses`

The set of possible statuses according to V8. You need to use a bitwise comparison of the status code to know if each flag is active or not.

example:

```js
if (optiStatus(func).status & optiStatus.statuses.isOptimized) {
    console.log("Great work!");
}
```


## License

[MIT](license)
