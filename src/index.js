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
