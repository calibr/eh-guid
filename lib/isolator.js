var
  sequelizeKeyOptsArr = [
    "$ne", "$in", "$not", "$notIn", "$gte", "$gt", "$lte", "$lt",
    "$like", "$ilike", "$iLike", "$notLike", "$notILike", "$eq"
  ],
  sequelizeKeyOpts = {};

sequelizeKeyOptsArr.forEach(function(opt) {
  sequelizeKeyOpts[opt] = true;
  sequelizeKeyOpts[opt.slice(1)] = true;
});

function Isolator(keys, userId, options) {
  this.keys = keys;
  this.userId = userId;
  this.options = options || {};
}

Isolator.isolate = function(userId, globalId) {
  return userId + "-" + globalId;
};

Isolator.prototype.isPathIsolable = function(path) {
  if(path.length === 0) {
    return true;
  }
  var lastKey = path[path.length - 1];
  return lastKey in this.keys;
};

Isolator.prototype.isolate = function(data, path) {
  if(!this.isPathIsolable(path)) {
    return data;
  }
  if(this.options.ignore) {
    if(Array.isArray(this.options.ignore)) {
      if(this.options.ignore.indexOf(data) !== -1) {
        return data;
      }
    }
    else if(this.options.ignore.test(data)) {
      return data;
    }
  }
  return Isolator.isolate(this.userId, data);
};

Isolator.prototype.array = function(data, path) {
  path = path || [];
  for(var i = 0; i != data.length; i++) {
    if(typeof data[i] === "object") {
      this.object(data[i]);
    }
    else if(typeof data[i] === "string") {
      data[i] = this.isolate(data[i], path);
    }
  }
  return data;
};

Isolator.prototype.object = function(object, path) {
  path = path || [];
  for(var key in object) {
    var newPath = path.slice();
    if(!sequelizeKeyOpts[key]) {
      newPath.push(key);
    }
    if(typeof object[key] === "string") {
      object[key] = this.isolate(object[key], newPath);
    }
    else {
      if(object[key] instanceof Array) {
        this.array(object[key], newPath);
      }
      else if(typeof object[key] == "object") {
        this.object(object[key], newPath);
      }
    }
  }
  return object;
};

module.exports = Isolator;