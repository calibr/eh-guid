"use strict";

var
  randomString = require("just.randomstring");

function gen() {
  return randomString(16);
}

function genIsolated(userId) {
  return userId + "-" + gen();
}

function unIsolate(globalId) {
  if(typeof globalId != "string") {
    return globalId;
  }
  if(globalId.indexOf("-") === -1) {
    return globalId;
  }
  return globalId.split("-")[1];
}

function isolate(userId, globalId) {
  return userId + "-" + globalId;
}

function isolateArray(userId, keys, data) {
  for(var i = 0; i != data.length; i++) {
    if(typeof data[i] === "object") {
      isolateObject(userId, keys, data[i]);
    }
    else {
      data[i] = isolate(userId, data[i]);
    }
  }
  return data;
}

function isolateObject(userId, keys, object) {
  for(var key in object) {
    if(key in keys && typeof object[key] === "string") {
      object[key] = isolate(userId, object[key]);
    }
    else {
      if(object[key] instanceof Array) {
        isolateArray(userId, keys, object[key]);
      }
      else if(typeof object[key] == "object") {
        isolateObject(userId, keys, object[key]);
      }
    }
  }
  return object;
}

function unIsolateArrayOfObjects(keys, data) {
  for(var i = 0; i != data.length; i++) {
    if(typeof data[i] === "object") {
      unIsolateObject(keys, data[i]);
    }
  }
}

function unIsolateArrayOfStrings(data) {
  for(var i = 0; i != data.length; i++) {
    if(typeof data[i] === "string") {
      data[i] = unIsolate(data[i]);
    }
  }
}


function unIsolateObject(keys, object) {
  for(var key in object) {
    if(key in keys && typeof object[key] === "string") {
      object[key] = unIsolate(object[key]);
    }
    else if(key in keys && (object[key] instanceof Array)) {
      unIsolateArrayOfStrings(object[key]);
    }
    else {
      if(object[key] instanceof Array) {
        unIsolateArrayOfObjects(keys, object[key]);
      }
      else if(typeof object[key] == "object") {
        unIsolateObject(keys, object[key]);
      }
    }
  }
}

/**
 * get user id from isolated global id
 * @param  {String} globalId - isolated global id
 * @return {Number} - returns user id or null if can't extract it
 */
function getUser(globalId) {
  var userId = globalId.split("-")[0];
  if(isNaN(userId)) {
    return null;
  }
  return parseInt(userId);
}

function GlobalId(options) {
  if(typeof options === "number") {
    options = {
      userId: options
    };
  }
  options = options || {};
  if(options.keys instanceof Array) {
    var keys = {};
    for(var i = 0; i != options.keys.length; i++) {
      keys[options.keys[i]] = true;
    }
    options.keys = keys;
  }
  options.keys = options.keys || {};
  this._options = options;
}

GlobalId.prototype.isolate = function(userId, data) {
  if(typeof userId !== "number") {
    data = userId;
    userId = this._options.userId;
  }
  if(!userId) {
    throw new Error("userId is required");
  }
  if(data instanceof Array) {
    return isolateArray(userId, this._options.keys, data);
  }
  else if(typeof data === "object") {
    return isolateObject(userId, this._options.keys, data);
  }
  else {
    return isolate(userId, data);
  }
};

GlobalId.prototype.unIsolate = function(data) {
  if(data instanceof Array) {
    unIsolateArrayOfObjects(this._options.keys, data);
  }
  else if(typeof data === "object") {
    unIsolateObject(this._options.keys, data);
  }
  else {
    return unIsolate(data);
  }
};

GlobalId.prototype.gen = function() {
  if(this._options.userId) {
    return genIsolated(this._options.userId);
  }
  else {
    return gen();
  }
};

GlobalId.isolate = isolate;
GlobalId.genIsolated = genIsolated;
GlobalId.unIsolate = unIsolate;
GlobalId.gen = gen;
GlobalId.getUser = getUser;

module.exports = GlobalId;