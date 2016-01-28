'use strict';

const Path           = require("path");
const chai           = require("chai");
const chaiAsPromised = require("chai-as-promised");
const dirscribe      = require("../.");

chai.use(chaiAsPromised);

const expect = chai.expect;
const testDir = 'test/fixtures/root-directory';

describe("when the target exists", function(){

    it("can describe directories", function(){
        const p = dirscribe(testDir);
        expect(p).to.be.fulfilled;
        expect(p).to.eventually.have.property('path');
        expect(p).to.eventually.have.property('children');
    });

    it("can describe files", function(){
        const p = dirscribe(Path.join(testDir, 'file-1.md'));
        expect(p).to.be.fulfilled;
        expect(p).to.eventually.have.property('path');
        expect(p).to.eventually.not.have.property('children');
    });

    it("supports absolute paths", function(){
        const p = dirscribe(Path.join(__dirname, '../', testDir));
        expect(p).to.be.fulfilled;
        expect(p).to.eventually.have.property('path');
    });

});

describe("when the target does not exist", function(){

    it("return a rejected promise", function(){
        const p = dirscribe('test/fixtures/doesnt-exist');
        expect(p).to.be.rejected;
    });

});
