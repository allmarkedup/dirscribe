'use strict';

const Path           = require("path");
const chai           = require("chai");
const chaiAsPromised = require("chai-as-promised");
const dirscribe      = require("../.");

chai.use(chaiAsPromised);

const expect = chai.expect;

describe("when the target exists", function(){

    it("can describe directories", function(){
        const p = dirscribe('test/fixtures/root-directory')
        expect(p).to.be.fulfilled;
        expect(p).to.eventually.have.property('path');
        expect(p).to.eventually.have.property('children');
        // p.then(x => console.log(JSON.stringify(x, null, 2)))
    });

    it("can describe files", function(){
        const p = dirscribe('test/fixtures/root-directory/file-1.md')
        expect(p).to.be.fulfilled;
        expect(p).to.eventually.have.property('path');
        expect(p).to.eventually.not.have.property('children');
    });

});

describe("when the target does not exist", function(){

    it("return a rejected promise", function(){
        const promise = dirscribe('test/fixtures/doesnt-exist');
        expect(promise).to.be.rejected;
    });

});
