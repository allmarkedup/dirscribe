'use strict';

const Promise  = require('bluebird');
const Path     = require('path');
const fs       = Promise.promisifyAll(require('fs'));

module.exports = function dirscribe(root, opts) {

    opts              = opts || {};
    const filter      = opts.filter || (i => true);
    const after       = opts.after || (i => i);
    const build       = opts.build || buildDefault;
    const recursive   = opts.recursive === false ? false : true;
    const childrenKey = opts.childrenKey || 'children';

    function readdir(dir) {
        return fs.readdirAsync(dir)
                .filter(filter)
                .map(filePath => objectify(Path.join(dir, filePath)))
                .then(after);
    }

    function objectify(filePath) {
        let statCache;
        return fs.statAsync(filePath).then(function (stat) {
            statCache = stat;
            return build(filePath, stat);
        }).then(function (desc) {
            if (recursive && statCache.isDirectory()) {
                return readdir(filePath).then(function (children) {
                    desc.children = children;
                    return desc;
                });
            }

            return desc;
        });
    }

    function buildDefault(filePath, stat) {
        const p = Path.parse(filePath);
        p.path = filePath;
        p.stat = stat;
        return p;
    }

    return objectify(root);
};
