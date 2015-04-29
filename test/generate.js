var
  GlobalId = require("../index"),
  should = require("should");

describe("Generate guids", function() {
  it("generate isolated guid", function() {
    var g = new GlobalId(1);
    var guid = g.gen();
    guid.should.match(/^1-[a-z0-9]{16}$/i);
  });
  it("generate not isolated guid", function() {
    var g = new GlobalId();
    var guid = g.gen();
    guid.should.match(/^[a-z0-9]{16}$/i);
  });
});