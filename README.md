# Dirscribe

Describe a recursive directory structure as a nested JSON object.

Supports filtering, post-processing and the ability to supply a custom callback to determine the structure of the JSON objects.

Each call to the `dirscribe` function **returns a Promise**.

## Installation

```bash
$ npm install @allmarkedup/dirscribe --save
```

## Usage

```js
const dirscribe = require('@allmarkedup/dirscribe');

const fileTree1 = dirscribe('path/to/directory');

// returns a promise that when fulfilled resolves to:
//
// {
//   "root": "",
//   "dir": "path/to",
//   "base": "directory",
//   "ext": "",
//   "name": "directory",
//   "path": "path/to/directory",
//   "stat": {
//     "dev": 16777220,
//     "mode": 16877,
//     "nlink": 5,
//     "uid": 501,
//     ...
//   },
//   "children": [
//     {
//       "root": "",
//       "dir": "path/to/directory",
//       "base": "file-1.json",
//       "ext": ".json",
//       "name": "file-1",
//       "path": "path/to/directory/file-2.json",
//       "stat": {
//         ...
//       }
//     },
//     {
//       "root": "",
//       "dir": "path/to/directory",
//       "base": "file-2.json",
//       "ext": ".json",
//       "name": "file-2",
//       "path": "path/to/directory/file-2.json",
//       "stat": {    ...
//       }
//     },
//     ...
//   ]
// }

const opts = {
    filter: filePath => ! (/(^|\/)\.[^\/\.]/g).test(filePath), // ignore hidden files
};
const fileTree2 = dirscribe('path/to/directory', opts);
```

## Options

### opts.filter

A callback filter function that is called with the filePath as it's only argument. This is called before the build function.

```js
const opts = {
    filter: filePath => ! (/(^|\/)\.[^\/\.]/g).test(filePath), // ignore hidden files
};
```

### opts.build

A function that gets called for each item and must return a JSON representation of that item. Function is called with the file path and the [stat object](https://nodejs.org/api/fs.html#fs_class_fs_stats) for that file.

This can be used to customise the properties you want on each of the JSON objects representing a file/directory.

Note that for directories, children are appended to the returned object after the build function has been called.

```js
const opts = {
    build: function(filePath, stat){
        return {
            path: filePath,
            mtime: stat.mtime
        };
    }
};
```

The default build function looks as follows:

```js
function build(filePath, stat) {
    const p = Path.parse(filePath);
    p.path = filePath;
    p.stat = stat;
    return p;
}
```

### opts.after

A callback function to be run after each directories items have been converted into JSON objects. Receives an array of JSON objects representing the contents of that directory. The function should return the final list of objects.

This is a good place to do any sorting or post-filtering of items.

```js
const opts = {
    after: items => items.slice(0, 3), // limit results to three per directory
};
```

### opts.recursive

Whether to recurse down through directories or not. Defaults to `true`.

```js
const opts = {
    recursive: false, // only runs through the top level directory
};
```

### opts.childrenKey

The key to use for the array of children that gets appended to objects representing directories.

```js
const opts = {
    childrenKey: 'kids',
};

// {
//     path: 'path/to/directory'
//     kids: [
//         {
//             path: 'path/to/directory/foo.txt'
//             ...
//         }
//     ]
// }
```
