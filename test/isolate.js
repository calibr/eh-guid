var
  GlobalId = require("../index"),
  should = require("should");

describe("isolate", function() {
  it("isolate flat array of objects", function() {
    var g = new GlobalId({
      userId: 1,
      keys: ["globalId", "parentId"]
    });
    var arr = [
      {
        title: "title#1",
        globalId: "guid1",
        parentId: "parent1"
      },
      {
        title: "title#2",
        globalId: "guid2",
        parentId: "parent2"
      }
    ];
    var expected = [
      {
        title: "title#1",
        globalId: "1-guid1",
        parentId: "1-parent1"
      },
      {
        title: "title#2",
        globalId: "1-guid2",
        parentId: "1-parent2"
      }
    ];
    g.isolate(arr);
    should.deepEqual(arr, expected);
  });

  it("should isolate array of mixed data, objects and strings", function() {
    var g = new GlobalId({
      userId: 1,
      keys: ["globalId", "parentId"]
    });
    var arr = [
      {
        title: "title#1",
        globalId: "guid1",
        parentId: "parent1"
      },
      "string",
      "string2",
      {
        title: "title#2",
        globalId: "guid2",
        parentId: "parent2"
      }
    ];
    var expected = [
      {
        title: "title#1",
        globalId: "1-guid1",
        parentId: "1-parent1"
      },
      "1-string",
      "1-string2",
      {
        title: "title#2",
        globalId: "1-guid2",
        parentId: "1-parent2"
      }
    ];
    g.isolate(arr);
    should.deepEqual(arr, expected);
  });


  it("isolate array of objects with nested arrays/objects", function() {
    var g = new GlobalId({
      userId: 1,
      keys: ["globalId", "parentId"]
    });
    var arr = [
      {
        title: "title#1",
        globalId: "guid1",
        parentId: "parent1",
        child: {
          globalId: "child1",
          title: "Child Object#1",
          parentId: "childParent"
        }
      },
      {
        title: "title#2",
        globalId: "guid2",
        parentId: "parent2",
        childArray: [
          {
            globalId: "child2",
            title: "Child Object#2"
          }
        ]
      }
    ];
    var expected = [
      {
        title: "title#1",
        globalId: "1-guid1",
        parentId: "1-parent1",
        child: {
          globalId: "1-child1",
          title: "Child Object#1",
          parentId: "1-childParent"
        }
      },
      {
        title: "title#2",
        globalId: "1-guid2",
        parentId: "1-parent2",
        childArray: [
          {
            globalId: "1-child2",
            title: "Child Object#2"
          }
        ]
      }
    ];
    g.isolate(arr);
    should.deepEqual(arr, expected);
  });
});