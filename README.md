# Dirscribe

Describe a recursive directory structure as a nested JSON object.

Supports filtering, post-processing and the ability to supply a custom callback to determine the structure of the JSON objects.

## Installation

```shell
$ npm install @allmarkedup/dirscribe --save
```

## Usage

The `dirscribe` module exports a single function with the following signature:

```js
dirscribe(<path-to-directory> [,opts]);
```
And returns a promise. Internally, dirscribe uses [Bluebird](http://bluebirdjs.com/) for promise creation.

### Basic example

```js
const dirscribe = require('@allmarkedup/dirscribe');

const fileTree = dirscribe('test/fixtures/root-directory'); // returns a Promise

fileTree.then(tree => console.dir(tree));

// Outputs:
// { root: '',
//   dir: 'test/fixtures',
//   base: 'root-directory',
//   ext: '',
//   name: 'root-directory',
//   path: 'test/fixtures/root-directory',
//   stat:
//    { dev: 16777220,
//      mode: 16877,
//      nlink: 5,
//      uid: 501,
//      gid: 20,
//      ... },
//   children:
//    [ { root: '',
//        dir: 'test/fixtures/root-directory',
//        base: 'file-1.md',
//        ext: '.md',
//        name: 'file-1',
//        path: 'test/fixtures/root-directory/file-1.md',
//        stat: [Object]
//      },
//      { root: '',
//        dir: 'test/fixtures/root-directory',
//        base: 'sub-directory-1',
//        ext: '',
//        name: 'sub-directory-1',
//        path: 'test/fixtures/root-directory/sub-directory-1',
//        stat: [Object],
//        children: [Object]},
//      { root: '',
//        dir: 'test/fixtures/root-directory',
//        base: 'sub-directory-2',
//        ext: '',
//        name: 'sub-directory-2',
//        path: 'test/fixtures/root-directory/sub-directory-2',
//        stat: [Object],
//        children: [Object] } ] }
```

### Example with options

```js
const dirscribe = require('@allmarkedup/dirscribe');

const fileTree = dirscribe('path/to/directory', {
    build: (filePath, stat) => ({
        path:     filePath,
        modified: new Date(stat.mtime).getTime(),
        type:     stat.isDirectory() ? 'dir' : 'file'
    }),
    after: items => items.sort((a, b) =>  b.modified - a.modified )
});

fileTree.then(tree => console.dir(tree));

// Outputs:
// { path: 'test/fixtures/root-directory',
//   modified: 1453901431000,
//   type: 'dir',
//   children:
//    [ { path: 'test/fixtures/root-directory/sub-directory-2',
//        modified: 1453901475000,
//        type: 'dir',
//        children: [Object] },
//      { path: 'test/fixtures/root-directory/sub-directory-1',
//        modified: 1453901444000,
//        type: 'dir',
//        children: [Object] },
//      { path: 'test/fixtures/root-directory/file-1.md',
//        modified: 1453899612000,
//        type: 'file' } ] }
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
    build: (filePath, stat) => ({
        path:     filePath,
        modified: new Date(stat.mtime).getTime(),
        type:     stat.isDirectory() ? 'dir' : 'file'
    })
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
