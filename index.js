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
    this.pos = pos;
    this.pressure = pressure;
  }
  static pointerEventToPointerPoint(e) {
    return new PointerPoint(new Vec2(e.offsetX, e.offsetY), e.pressure);
  }
  get x() {
    return this.pos.x;
  }
  get y() {
    return this.pos.y;
  }
};
var PointerEventHandler = class extends EventHandler {
  constructor() {
    super();
    this.wasDown = false;
    this.lastPoint = null;
    console.log("PointerEventHandler created");
    this.registerEvent("raw", this.onRaw.bind(this));
  }
  static createFromHTMLElement(element) {
    let handler = new PointerEventHandler();
    PointerEventHandler.bindWithElement(handler, element);
    return handler;
  }
  static bindWithElement(handler, element) {
    element.addEventListener("pointerdown", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerup", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointermove", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerenter", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerleave", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerover", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointerout", handler.rawPointerEvent.bind(handler));
    element.addEventListener("pointercancel", handler.rawPointerEvent.bind(handler));
  }
  rawPointerEvent(rawEvent) {
    this.triggerEvent("raw", rawEvent);
  }
  onRaw(rawEvent, customPos = null) {
    let point = PointerPoint.pointerEventToPointerPoint(rawEvent);
    if (customPos !== null) {
      point.pos = customPos;
    }
    switch (rawEvent.type) {
      case "pointerdown":
        this.triggerEvent("down", point);
        this.wasDown = true;
        break;
      case "pointerup":
        this.triggerEvent("up", point);
        this.wasDown = false;
        break;
      case "pointermove":
        this.triggerEvent("move", point);
        if (this.wasDown) {
          this.triggerEvent("pressedMove", point);
        }
        break;
      case "pointerenter":
        this.triggerEvent("enter", point);
        break;
      case "pointerleave":
        this.triggerEvent("leave", point);
        this.wasDown = false;
        break;
    }
    this.lastPoint = point;
  }
};

// src/Events/PaintToolEventHandler.ts
var PaintToolEventHandler = class extends PointerEventHandler {
  constructor() {
    super();
    this._tool = null;
  }
  get tool() {
    if (this._tool === null) {
      throw new Error("Tool not set");
    }
    return this._tool;
  }
  set tool(tool) {
    this._tool = tool;
  }
  bind(tool) {
    this.tool = tool;
    this.registerEvent("down", this.onDown.bind(this));
    this.registerEvent("up", this.onUp.bind(this));
    this.registerEvent("pressedMove", this.onPressedMove.bind(this));
    this.registerEvent("move", this.onMove.bind(this));
  }
  onDown(point) {
    this.tool.onDown(point);
  }
  onUp(point) {
    this.tool.onUp(point);
  }
  onPressedMove(point) {
    this.tool.onPressedMove(point);
  }
  onMove(point) {
    this.tool.onMove(point);
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
    let scale = 3;
    offset.x = this.width / 2 - this.doc.width / 2 * scale;
    offset.y = this.height / 2 - this.doc.height / 2 * scale;
    this.state.offset = offset;
    this.state.scale = new Vec2(scale);
    this.paintToolEventHandler = new PaintToolEventHandler();
    this.viewPointerHandler = PointerEventHandler.createFromHTMLElement(this.canvas);
    this.viewPointerHandler.registerEvent("raw", this.triggerPaintTool.bind(this));
  }
  triggerPaintTool(raw) {
    let pos = this.viewToDocCoords(raw.offsetX, raw.offsetY);
    this.paintToolEventHandler.triggerEvent("raw", raw, pos);
  }
  setDocument(doc) {
    this._doc = doc;
  }
  render() {
    console.log("Rendering");
    this.ctx.fillStyle = "#c4c4c4";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.renderBorder();
    this.renderDoc();
    console.log("Rendered");
  }
  get state() {
    return this._state;
  }
  get doc() {
    return this._doc;
  }
  viewToDocCoords(x, y) {
    return new Vec2(
      (x - this.state.offset.x) / this.state.scale.x,
      (y - this.state.offset.y) / this.state.scale.y
    );
  }
  docToViewCoords(x, y) {
    return new Vec2(
      x * this.state.scale.x + this.state.offset.x,
      y * this.state.scale.y + this.state.offset.y
    );
  }
  renderDoc() {
    this.ctx.save();
    this.ctx.translate(this.state.offset.x, this.state.offset.y);
    this.ctx.scale(this.state.scale.x, this.state.scale.y);
    this.doc.render();
    if (this.state.scale.x > 1 || this.state.scale.y > 1) {
      this.ctx.imageSmoothingEnabled = false;
    } else {
      this.ctx.imageSmoothingEnabled = true;
    }
    this.ctx.drawImage(this.doc.canvas, 0, 0);
    this.ctx.restore();
  }
  renderBorder() {
    this.ctx.save();
    this.ctx.filter = "blur(4px)";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.state.offset.x,
      this.state.offset.y + 1,
      this.doc.width * this.state.scale.x,
      this.doc.height * this.state.scale.y + 1
    );
    this.ctx.restore();
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
    this.selectedLayer = null;
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
    if (this.selectedLayer == null) {
      this.selectedLayer = layer;
    }
  }
  addLayers(...layers) {
    for (let layer of layers) {
      this.addLayer(layer);
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let layer of this.layers) {
      console.log("Rendering layer " + layer.name);
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

// src/Layers/CPLayer.ts
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

// src/Layers/BackgroundLayer.ts
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

// src/PaintTools/PaintTool.ts
var PaintTool = class {
  constructor(eventHandler = null, name = null) {
    this._eventHandler = null;
    this.selectedLayer = null;
    this._layer = null;
    this._doc = null;
    this._viewer = null;
    if (name === null) {
      name = this.constructor.name;
    }
    this.name = name;
  }
  setLayer(layer) {
    console.debug("Setting layer to " + layer.name);
    this._layer = layer;
  }
  get layer() {
    if (this._layer === null) {
      throw new Error("Layer not set");
    }
    return this._layer;
  }
  get eventHandler() {
    if (this._eventHandler === null) {
      throw new Error("Event handler not set");
    }
    return this._eventHandler;
  }
  set eventHandler(eventHandler) {
    console.log("Setting event handler");
    this._eventHandler = eventHandler;
  }
  get canvas() {
    return this.layer.canvas;
  }
  get doc() {
    if (this._doc === null) {
      throw new Error("Doc not set");
    }
    return this._doc;
  }
  set doc(doc) {
    this._doc = doc;
  }
  get viewer() {
    if (this._viewer === null) {
      throw new Error("Viewer not set");
    }
    return this._viewer;
  }
  set viewer(viewer) {
    this._viewer = viewer;
  }
  static createFromStandardDoc(eventHandler, doc, viewer) {
    let tool = new this(eventHandler);
    tool.doc = doc;
    tool.viewer = viewer;
    tool.eventHandler = viewer.paintToolEventHandler;
    return tool;
  }
  onDown(point) {
    console.log("Down");
  }
  onUp(point) {
    console.log("Up");
  }
  onPressedMove(point) {
    console.log("PressedMove");
  }
  onMove(point) {
    console.log("Move");
  }
};

// src/PaintTools/PaintTool2D.ts
var PaintTool2D = class extends PaintTool {
  get ctx() {
    return this.layer.ctx;
  }
  setFillStyle(style) {
    this.ctx.fillStyle = style;
  }
  setFillRGB(r, g, b) {
    this.setFillStyle(`rgb(${r}, ${g}, ${b})`);
  }
  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
  drawLineFromPoint(p1, p2) {
    this.drawLine(p1.x, p1.y, p2.x, p2.y);
  }
  drawCircle(x, y, radius) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
};

// src/PaintTools/BasicPen.ts
var BasicPen = class extends PaintTool2D {
  onPressedMove(point) {
    super.onPressedMove(point);
    let lastPoint = this.eventHandler.lastPoint;
    if (lastPoint !== null) {
      console.log("Drawing line from " + lastPoint.x + ", " + lastPoint.y + " to " + point.x + ", " + point.y);
      this.setFillRGB(0, 0, 0);
      this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
      this.viewer.render();
    }
  }
};

// src/Main.ts
function main() {
  let viewCanvas = document.getElementById("viewCanvas");
  let width = 100;
  let height = 100;
  let layer0 = new BackgroundLayer(width, height, "checkerboard");
  let layer1 = new CPLayer(width, height, "Layer 1");
  layer1.ctx.strokeStyle = "black";
  layer1.ctx.moveTo(10, 10);
  layer1.ctx.lineTo(width - 10, height - 10);
  layer1.ctx.stroke();
  let layer2 = new CPLayer(width, height, "red");
  layer2.ctx.fillStyle = "red";
  layer2.ctx.fillRect(0, 0, width, height);
  layer2.opacity = 0.2;
  console.debug("Creating document");
  console.debug("Adding layers");
  let paintToolEventHandler = new PaintToolEventHandler();
  PointerEventHandler.bindWithElement(paintToolEventHandler, viewCanvas);
  let pen = new BasicPen();
  pen.setLayer(layer1);
  let doc = new ComboPaintDocument(width, height);
  doc.addLayer(layer0);
  doc.addLayer(layer1);
  doc.addLayer(layer2);
  doc.render();
  let docViewer = new DocViewer(viewCanvas, doc);
  pen.doc = doc;
  pen.viewer = docViewer;
  pen.eventHandler = docViewer.paintToolEventHandler;
  docViewer.render();
}
main();
console.log("Main.ts loaded");
//# sourceMappingURL=index.js.map
