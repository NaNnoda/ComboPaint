// src/CanvasWrapper.ts
var CanvasWrapper = class {
  constructor(canvas = null, ctxId = "2d") {
    this.canvas = document.createElement("canvas");
    this._actualCtx = null;
    this._is2d = false;
    this._isGl = false;
    this.setCanvas(canvas, ctxId);
  }
  setCanvas(canvas = null, ctxId = "2d") {
    if (typeof canvas === "string") {
      canvas = document.getElementById(canvas);
      if (!canvas) {
        throw new Error("Failed to get canvas");
      }
    } else if (canvas === null) {
      canvas = document.createElement("canvas");
    }
    this.canvas = canvas;
    this.setCtx(ctxId);
  }
  get ctx() {
    if (this._is2d) {
      return this._actualCtx;
    }
    throw new Error("Context is not 2d");
  }
  set ctx(ctx) {
    console.log("You should not be setting the context");
  }
  get gl() {
    if (this._isGl) {
      return this._actualCtx;
    }
    throw new Error("Context is not WebGL");
  }
  setCtx(ctxId) {
    this._actualCtx = this.canvas.getContext(ctxId);
    if (this._actualCtx === null) {
      throw new Error(`Failed to get context [${ctxId}]`);
    }
    if (ctxId === "2d") {
      this._is2d = true;
    }
    if (ctxId === "webgl") {
      this._isGl = true;
    }
  }
  set width(width) {
    this.canvas.width = width;
  }
  set height(height) {
    this.canvas.height = height;
  }
  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
};

// src/MathUtils/Vec2.ts
var Vec2 = class {
  constructor(val1, val2 = void 0) {
    this.x = val1;
    if (val2 === void 0) {
      this.y = val1;
    } else {
      this.y = val2;
    }
  }
  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  sub(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }
  mul(other) {
    return new Vec2(this.x * other.x, this.y * other.y);
  }
  div(other) {
    return new Vec2(this.x / other.x, this.y / other.y);
  }
  scale(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
  length() {
    return Math.sqrt(this.dot(this));
  }
  normalize() {
    return this.scale(1 / this.length());
  }
  rotate(angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }
  angleTo(other) {
    return other.angle() - this.angle();
  }
};

// src/DocViewer.ts
var DocViewer = class extends CanvasWrapper {
  constructor(canvas, doc) {
    super(canvas);
    this._doc = doc;
    this.setDocument(doc);
    this._state = new TranslateState();
    let offset = new Vec2(0, 0);
    let scale = 2;
    offset.x = this.width / 2 - this.doc.width / 2 * scale;
    offset.y = this.height / 2 - this.doc.height / 2 * scale;
    this.state.offset = offset;
    this.state.scale = new Vec2(scale);
  }
  get state() {
    return this._state;
  }
  get doc() {
    return this._doc;
  }
  setDocument(doc) {
    this._doc = doc;
  }
  render() {
    console.log("Rendering");
    this.ctx.fillStyle = "#c4c4c4";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.renderDoc();
    this.renderBorder();
    console.log("Rendered");
  }
  renderDoc() {
    this.ctx.save();
    this.ctx.translate(this.state.offset.x, this.state.offset.y);
    this.ctx.scale(this.state.scale.x, this.state.scale.y);
    this.ctx.drawImage(this.doc.canvas, 0, 0);
    this.ctx.restore();
  }
  renderBorder() {
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(
      this.state.offset.x,
      this.state.offset.y,
      this.doc.width * this.state.scale.x,
      this.doc.height * this.state.scale.y
    );
  }
};
var TranslateState = class {
  constructor() {
    this.offset = new Vec2(0, 0);
    this.scale = new Vec2(1, 1);
  }
};

// src/ComboPaintDocument.ts
var ComboPaintDocument = class extends CanvasWrapper {
  constructor(height = 100, width = 100) {
    super();
    this.layers = [];
    this.width = width;
    this.height = height;
  }
  get height() {
    return this.canvas.height;
  }
  set height(height) {
    this.canvas.height = height;
  }
  get width() {
    return this.canvas.width;
  }
  set width(width) {
    this.canvas.width = width;
  }
  addLayer(layer, index = this.layers.length) {
    this.layers.splice(index, 0, layer);
  }
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let layer of this.layers) {
      if (layer.visible) {
        this.ctx.globalAlpha = layer.opacity;
        console.log(this.ctx.globalCompositeOperation);
        this.ctx.globalCompositeOperation = layer.blendMode;
        layer.render();
        this.ctx.drawImage(layer.canvas, 0, 0);
      }
    }
  }
  toImage() {
    return this.canvas.toDataURL();
  }
};

// src/CPLayer.ts
var CPLayer = class extends CanvasWrapper {
  constructor(width, height, name = "New Layer") {
    super();
    this.width = width;
    this.height = height;
    this.name = name;
    this.visible = true;
    this.opacity = 1;
    this.blendMode = "source-over";
  }
  render() {
  }
};

// src/BackgroundLayer.ts
var BackgroundLayer = class extends CPLayer {
  constructor(width, height, fillStyle = "white") {
    super(width, height, "Background");
    this.fillStyle = fillStyle;
  }
  drawCheckerboard(color1, color2, size) {
    this.ctx.fillStyle = color1;
    this.ctx.fillRect(0, 0, this.width, this.height);
    console.log(this.width);
    this.ctx.fillStyle = color2;
    for (let x = 0; x < this.width; x += size) {
      for (let y = 0; y < this.height; y += size) {
        if (x / size % 2 == y / size % 2) {
          this.ctx.fillRect(x, y, size, size);
        }
      }
    }
  }
  render() {
    if (this.fillStyle == "checkerboard") {
      console.log("checkerboard");
      this.drawCheckerboard("#ffffff", "#cbcbcb", 10);
    } else {
      this.ctx.fillStyle = this.fillStyle;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }
};

// src/Events/EventHandler.ts
var EventHandler = class {
  constructor() {
    this.events = {};
  }
  registerEvent(event, callback) {
    if (this.events[event] === void 0) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  triggerEvent(event, ...args) {
    if (this.events[event] !== void 0) {
      for (let callback of this.events[event]) {
        callback(...args);
      }
    }
  }
  removeEvent(event) {
    delete this.events[event];
  }
  removeCallback(event, callback) {
    if (this.events[event] !== void 0) {
      this.events[event] = this.events[event].filter((value) => {
        return value !== callback;
      });
    }
  }
  removeAllEvents() {
    this.events = {};
  }
};

// src/Events/PointerEventHandler.ts
var PointerPoint = class {
  constructor(pos, pressure) {
    this.pointType = "any";
    this.pos = pos;
    this.pressure = pressure;
  }
  static pointerEventToPointerPoint(e) {
    return new PointerPoint(new Vec2(e.offsetX, e.offsetY), e.pressure);
  }
};
var PointerEventHandler = class extends EventHandler {
  static bindWithElement(element) {
    let handler = new PointerEventHandler();
    element.addEventListener("pointerdown", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerup", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointermove", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerenter", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerleave", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerover", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerout", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointercancel", handler.rawPointerEvent.bind(handler));
    return handler;
  }
  rawPointerEvent(rawEvent) {
    let point = PointerPoint.pointerEventToPointerPoint(rawEvent);
    this.triggerEvent("any", point);
  }
};

// src/Main.ts
function main() {
  let viewCanvas = document.getElementById("viewCanvas");
  let width = 100;
  let height = 100;
  let layer0 = new BackgroundLayer(width, height, "checkerboard");
  let layer1 = new CPLayer(width, height);
  layer1.ctx.strokeStyle = "black";
  layer1.ctx.moveTo(10, 10);
  layer1.ctx.lineTo(width - 10, height - 10);
  layer1.ctx.stroke();
  let layer2 = new CPLayer(width, height);
  layer2.ctx.fillStyle = "red";
  layer2.ctx.fillRect(0, 0, width, height);
  layer2.opacity = 0.2;
  console.debug("Creating document");
  console.debug("Adding layers");
  let pointerHandler = PointerEventHandler.bindWithElement(viewCanvas);
  let doc = new ComboPaintDocument(width, height);
  doc.addLayer(layer0);
  doc.addLayer(layer1);
  doc.addLayer(layer2);
  doc.render();
  let docViewer = new DocViewer(viewCanvas, doc);
  docViewer.render();
}
main();
console.log("Main.ts loaded");
//# sourceMappingURL=index.js.map
