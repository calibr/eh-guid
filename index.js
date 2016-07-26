"use strict";

var
  randomString = require("just.randomstring"),
  Isolator = require("./lib/isolator"),
  instauuid = require("instauuid");

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
  var dashIndex = globalId.indexOf("-");
  if(dashIndex === -1) {
    return globalId;
  }
  if(dashIndex !== globalId.lastIndexOf("-")) {
    // it is not isolate global_id
    return globalId;
  }
  return globalId.split("-")[1];
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

/**
 * checks that guid is isolated
 * @param  {String} globalId
 * @return {Boolean}
 */
function isIsolated(globalId) {
  return globalId.split("-").length === 2;
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

GlobalId.prototype.createIsolator = function(userId, options) {
  return new Isolator(this._options.keys, userId, options);
};

GlobalId.prototype.isolate = function(userId, data, options) {
  if(typeof userId !== "number") {
    options = data;
    data = userId;
    userId = this._options.userId;
  }
  if(!userId) {
    throw new Error("userId is required");
  }
  if(data instanceof Array) {
    return this.createIsolator(userId, options).array(data);
  }
  else if(typeof data === "object") {
    return this.createIsolator(userId, options).object(data);
  }
  else {
    return this.createIsolator(userId, options).isolate(data, []);
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

function testUuid() {
  this.counter = this.counter || 0;
  return instauuid({additional: 1, countNumber: this.counter});
}

GlobalId.isolate = Isolator.isolate;
GlobalId.genIsolated = genIsolated;
GlobalId.unIsolate = unIsolate;
GlobalId.gen = gen;
GlobalId.getUser = getUser;
GlobalId.isIsolated = isIsolated;
GlobalId.test = testUuid;

module.exports = GlobalId;