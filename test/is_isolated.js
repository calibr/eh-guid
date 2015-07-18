var
  GlobalId = require("../index"),
  should = require("should");

describe("Check guid is isolated", function() {
  it("guid should be isolated", function() {
    GlobalId.isIsolated("1-test").should.equal(true);
  });
  it("guid should be not isolated", function() {
    GlobalId.isIsolated("test").should.equal(false);
  });
});