var
  GlobalId = require("../index"),
  should = require("should");

describe("Get user from guid", function() {
  it("get user from valid globalid", function() {
    var userId = GlobalId.getUser("612-guid");
    userId.should.equal(612);
  });
  it("get user from not valid guid", function() {
    var userId = GlobalId.getUser("notisolatedguid");
    should.equal(userId, null);
  });
});