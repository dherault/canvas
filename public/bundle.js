/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

const canvasElement = document.getElementById('canvas');
const _ = canvas.getContext('2d');

let width, height;

canvas.width = width = window.innerWidth - 20;
canvas.height = height = window.innerHeight - 20;

/* State */

const state = {
  width,
  height,
  mousePos: { x: 0, y: 0 },
  viewBoxOrigin: { x: 0, y: 0 },
  previousViewBoxOrigin: { x: 0, y: 0 },
  viewBoxRelativeSize: 0.5,
  isMouseDown: false,
  panOrigin: { x: 0, y: 0 },
};

canvas.addEventListener('mousemove', e => {
  state.mousePos = fromViewBox(state, {
    x: e.clientX,
    y: e.clientY,
  });
  draw(state);
});

canvas.addEventListener('mousedown', e => {
  state.isMouseDown = true;
  state.panOrigin = state.mousePos;
});

canvas.addEventListener('mouseup', e => {
  state.isMouseDown = false;
  state.previousViewBoxOrigin = state.viewBoxOrigin;
});

canvas.addEventListener('mousemove', e => {
  if (state.isMouseDown) {
    const nextX = state.previousViewBoxOrigin.x + state.panOrigin.x - state.mousePos.x;
    const nextY = state.previousViewBoxOrigin.y + state.panOrigin.y - state.mousePos.y;
    const r = 1 - 1 * state.viewBoxRelativeSize;

    state.viewBoxOrigin = {
      x: Math.max(0, Math.min(state.width * r, nextX)),
      y: Math.max(0, Math.min(state.height * r, nextY)),
    };

    draw(state);
  }
});

canvas.addEventListener('wheel', e => {
  state.viewBoxRelativeSize += e.deltaY / 1000;
  state.viewBoxRelativeSize = Math.max(0.1, Math.min(1, state.viewBoxRelativeSize));

  const r = 1 - 1 * state.viewBoxRelativeSize;

  state.viewBoxOrigin = {
    x: Math.max(0, Math.min(state.width * r, state.viewBoxOrigin.x)),
    y: Math.max(0, Math.min(state.height * r, state.viewBoxOrigin.y)),
  };

  draw(state);
});

/* Shapes creation */

const shapes = [];
const randomColor = () => '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1,6);

for (let i = 0; i < 200; i++) {
  shapes.push({ x: Math.random() * width, y: Math.random() * height, color: randomColor() });
}

/* Draw */

function isWithinViewbox(state, pOrigin, width, height) {
  if (
    pOrigin.x + width < state.viewBoxOrigin.x ||
    pOrigin.y + height < state.viewBoxOrigin.y ||
    pOrigin.x > state.viewBoxOrigin.x + state.viewBoxRelativeSize * state.width ||
    pOrigin.y > state.viewBoxOrigin.y + state.viewBoxRelativeSize * state.height
  ) {
    return false;
  }

  return true;
}

function toViewBox(state, p) {
  return {
    x: (p.x - state.viewBoxOrigin.x) / state.viewBoxRelativeSize,
    y: (p.y - state.viewBoxOrigin.y) / state.viewBoxRelativeSize,
  };
}

function fromViewBox(state, p) {
  return {
    x: p.x * state.viewBoxRelativeSize + state.viewBoxOrigin.x,
    y: p.y * state.viewBoxRelativeSize + state.viewBoxOrigin.y,
  };
}

function draw(state) {
  _.clearRect(0, 0, state.width, state.height);

  shapes.forEach(shape => {
    if (isWithinViewbox(state, { x: shape.x - 5, y: shape.y - 5 }, 10, 10)) {
      const viewBoxCenter = toViewBox(state, shape);

      _.fillStyle = shape.color;
      _.beginPath();
      _.arc(
        viewBoxCenter.x,
        viewBoxCenter.y,
        10 / state.viewBoxRelativeSize,
        0,
        2 * Math.PI
      );
      _.closePath()
      _.fill();
    }
  });

  _.font = '16px sans-serif';
  _.fillStyle = 'black';
  _.fillText(`width height: ${state.width} ${state.height}`, 10, 30);
  _.fillText(`viewBoxOrigin: ${Math.round(state.viewBoxOrigin.x)} ${Math.round(state.viewBoxOrigin.y)}`, 10, 50);
  _.fillText(`mousePos: ${Math.round(state.mousePos.x)} ${Math.round(state.mousePos.y)}`, 10, 70);
}

draw(state);


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map