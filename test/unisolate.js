var
  GlobalId = require("../index"),
  should = require("should");

describe("unisolate", function() {
  it("unisolate flat array of objects", function() {
    var g = new GlobalId({
      userId: 1,
      keys: ["globalId", "parentId"]
    });
    var expected = [
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
    var arr = [
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
    g.unIsolate(arr);
    should.deepEqual(arr, expected);
  });

  it("unisolate array of objects with nested arrays/objects", function() {
    var g = new GlobalId({
      userId: 1,
      keys: ["globalId", "parentId"]
    });
    var expected = [
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
    var arr = [
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
    g.unIsolate(arr);
    should.deepEqual(arr, expected);
  });

  it("unisolate object which have field of array of strings", function() {
    var obj = {
      globalId: ["1-test", "1-guid"]
    };
    var g = new GlobalId({
      userId: 1,
      keys: ["globalId"]
    });
    g.unIsolate(obj);
    var expected = {
      globalId: ['test', 'guid']
    };
    obj.should.eql(expected);
  });

  it("should not isolate string not formatted like isolate global_id", function() {
    var obj = {
      globalId: ["1-test-hello", "1-guid"]
    };
    var g = new GlobalId({
      userId: 1,
      keys: ["globalId"]
    });
    g.unIsolate(obj);
    var expected = {
      globalId: ['1-test-hello', 'guid']
    };
    obj.should.eql(expected);
  });
});