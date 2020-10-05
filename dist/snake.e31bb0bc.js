// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Block.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Block;

var _index = require("./index");

//basic entity 
function Block(x, y, type, color) {
  this.x = x || 0;
  this.y = y || 0;
  this.w = 20;
  this.h = 20;
  this.type = type || '';
  this.color = color || 'black'; //draw block

  this.draw = function () {
    _index.ctx.fillStyle = this.color;

    _index.ctx.fillRect(this.x, this.y, this.w, this.h);

    _index.ctx.strokeStyle = 'black';

    _index.ctx.strokeRect(this.x, this.y, this.w, this.h);
  };
}
},{"./index":"index.js"}],"LinkedList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LinkedList;

function LinkedList() {
  var head = undefined;
  var tail = undefined;
  var size = 0;

  this.add = function (item) {
    if (!head) {
      head = new Node(item);
      tail = head;
    } else {
      var n = new Node(item);
      tail.next = n;
      tail = n;
    }

    size++;
  };

  this.remove = function () {
    if (!head) return;
    var first = head.item;
    head = head.next;
    size--;
    return first;
  }; // this.removeTail = function () {
  //     if (!head) return;
  //     const last = tail.item;
  //     if (size == 1) {
  //         head = null;
  //         tail = null;
  //         return last;
  //     } else if (size > 1) {
  //         while(head.next)
  //     }
  // }


  this.getSize = function () {
    return size;
  };

  this.isEmpty = function () {
    return size == 0;
  };
}

function Node(item) {
  this.item = item;
  this.next = undefined;
}
},{}],"Keyboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = InputPublisher;

var _LinkedList = _interopRequireDefault(require("./LinkedList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//fan out keydown publisher actions
function InputPublisher(event, subscriptions) {
  var queue = new _LinkedList.default();

  var init = function init() {
    //create eventlistener for keydown 
    //check for direction keys and set lastPressed
    document.addEventListener(event, function (e) {
      if (subscriptions.includes(e.key)) {
        queue.add(e.key);
      }
    });
  };

  this.getNext = function () {
    return queue.remove();
  };

  this.isEmpty = function () {
    return queue.isEmpty();
  };

  init();
}
},{"./LinkedList":"LinkedList.js"}],"Snake.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Snake;

var _Block = _interopRequireDefault(require("./Block"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Snake(x, y) {
  this.v = 20; //velocity

  this.x = x;
  this.y = y;
  this.alive = true; //default body 

  var body = [new _Block.default(this.x, this.y, 'snake', 'green'), new _Block.default(this.x - 20, this.y - 20, 'snake', 'green')]; //draw snake blocks

  this.draw = function () {
    body.forEach(function (block) {
      return block.draw();
    });
  }; //eat block


  this.eat = function (block) {
    switch (block.type) {
      //eat:
      //food snake grows
      case 'food':
        block.color = 'green';
        block.type = 'snake';
        body.push(block);
        break;
      //snake dies if it eats self (assumed to be the only snake)

      case 'snake':
        this.setAlive(false);
        break;

      default:
        //noop
        console.log("can't eat that");
    }
  };

  this.setAlive = function (alive) {
    this.alive = alive;
  };

  this.getBody = function () {
    return body;
  };

  this.isAlive = function () {
    return this.alive;
  };

  this.moveLeft = function () {
    var tail = body.pop();
    this.x -= this.v;
    tail.x = this.x;
    tail.y = this.y;
    body = [tail].concat(body);
  };

  this.moveRight = function () {
    var tail = body.pop();
    this.x += this.v;
    tail.x = this.x;
    tail.y = this.y;
    body = [tail].concat(body);
  };

  this.moveUp = function () {
    var tail = body.pop();
    this.y -= this.v;
    tail.x = this.x;
    tail.y = this.y;
    body = [tail].concat(body);
  };

  this.moveDown = function () {
    var tail = body.pop();
    this.prevX = this.x;
    this.prevY = this.y;
    this.y += this.v;
    tail.x = this.x;
    tail.y = this.y;
    body = [tail].concat(body);
  };

  this.draw = this.draw.bind(this);
  this.moveLeft = this.moveLeft.bind(this);
  this.moveRight = this.moveRight.bind(this);
  this.moveUp = this.moveUp.bind(this);
  this.moveDown = this.moveDown.bind(this);
  this.isAlive = this.isAlive.bind(this);
  this.setAlive = this.setAlive.bind(this);
  this.getBody = this.getBody.bind(this);
}
},{"./Block":"Block.js"}],"Game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Block = _interopRequireDefault(require("./Block"));

var _Keyboard = _interopRequireDefault(require("./Keyboard.js"));

var _Snake = _interopRequireDefault(require("./Snake"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//starting food
//last pressed direction for snake to move
//TODO put everything into its own file
//TODO keep track of tiles the snake is on and tiles that are free for rewind feature
//TODO add width and height as params to block to control proper spacing of snake blocks
//TODO create constant for desired block size so that random coordinates and block size scales 
//nice to have
//TODO smooth animation/movement
//TODO rewind snake upon collision
//TODO consider making the blocks smaller? 
var snake = new _Snake.default(100, 100);
var lastTime = 0;

function loop(time) {
  if (time - lastTime > 80) {
    update();
    lastTime = time;
    render();
  }

  requestAnimationFrame(loop);
}

function update() {
  checkIfSnakeHitBoundary();
  checkIfSnakeAteSelf();
  spawnFoodIfNone();
  checkIfAtFood();
  moveSnake();
}

function render() {
  _index.ctx.clearRect(0, 0, _index.ctx.canvas.width, _index.ctx.canvas.height);

  _index.ctx.fillStyle = 'black';
  _index.ctx.font = "15px Arial";

  _index.ctx.fillText("food: " + foodCount, 20, 20);

  food.forEach(function (f) {
    f.draw();
  });
  snake.draw();
  _index.ctx.strokeStyle = 'black';

  _index.ctx.strokeRect(100, 0, 500, 600);
}

var food = [new _Block.default(100, 0, 'food', 'red')];
var foodCount = 0;

function checkIfSnakeHitBoundary() {
  if (snake.x < 100 || snake.x + 20 > 600 || snake.y + 20 > 600 || snake.y < 0) {
    snake.setAlive(false);
  }
}

function checkIfSnakeAteSelf() {
  for (var i = 1; i < snake.getBody().length; i++) {
    if (snake.getBody()[i].x == snake.x && snake.getBody()[i].y == snake.y) {
      snake.setAlive(false);
    }
  }
}

function spawnFoodIfNone() {
  if (food.length == 0) {
    var randomX = Math.random() * (_index.canvas.width - 100 - 20) + 100;
    var randomY = Math.random() * (_index.canvas.height - 100 - 20) + 100;
    randomX = randomX - randomX % 20; //set randomX to a multiple of 20

    randomY = randomY - randomY % 20; //set randomY to a multiple of 20

    food.push(new _Block.default(randomX, randomY, 'food', 'red'));
  }
}

function checkIfAtFood() {
  for (var i = 0; i < food.length; i++) {
    if (food[i].x == snake.x && food[i].y == snake.y) {
      snake.eat(food[i]);
      food = food.slice(0, i).concat(food.slice(i + 1));
      foodCount++;
    }
  }
}

var lastPressedDirection = 'ArrowRight';
var previouslyPressed = lastPressedDirection;
var inputPublisher = new _Keyboard.default('keydown', ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']);

function moveSnake() {
  lastPressedDirection = inputPublisher.getNext() || lastPressedDirection;

  if (snake.isAlive()) {
    switch (lastPressedDirection) {
      case 'ArrowLeft':
        if (previouslyPressed == 'ArrowRight') {
          lastPressedDirection = previouslyPressed;
          snake.moveRight();
        } else {
          snake.moveLeft();
        }

        break;

      case 'ArrowRight':
        if (previouslyPressed == 'ArrowLeft') {
          lastPressedDirection = previouslyPressed;
          snake.moveLeft();
        } else {
          snake.moveRight();
        }

        break;

      case 'ArrowUp':
        if (previouslyPressed == 'ArrowDown') {
          lastPressedDirection = previouslyPressed;
          snake.moveDown();
        } else {
          snake.moveUp();
        }

        break;

      case 'ArrowDown':
        if (previouslyPressed == 'ArrowUp') {
          lastPressedDirection = previouslyPressed;
          snake.moveUp();
        } else {
          snake.moveDown();
        }

        break;

      default: //snake stopped moving

    }
  }

  previouslyPressed = lastPressedDirection;
}

var _default = {
  start: function start() {
    requestAnimationFrame(loop);
  }
};
exports.default = _default;
},{"./Block":"Block.js","./Keyboard.js":"Keyboard.js","./Snake":"Snake.js","./index":"index.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ctx = exports.canvas = void 0;

var _Game = _interopRequireDefault(require("./Game.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.getElementById("canvas");
exports.canvas = canvas;
var ctx = canvas.getContext('2d');
exports.ctx = ctx;
ctx.canvas.width = 600;
ctx.canvas.height = 600;

_Game.default.start();
},{"./Game.js":"Game.js"}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62250" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/snake.e31bb0bc.js.map