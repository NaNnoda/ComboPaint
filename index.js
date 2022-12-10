// src/OffScreenCanvasWrapper.ts
var OffScreenCanvasWrapper = class {
  constructor(width, height, ctxId) {
    this._canvas = new OffscreenCanvas(width, height);
    this._ctx = this._canvas.getContext(ctxId);
    if (!this._ctx) {
      throw new Error(`Failed to get context ${ctxId}`);
    }
  }
  get width() {
    return this.canvas.width;
  }
  set width(width) {
    this.canvas.width = width;
  }
  get height() {
    return this.canvas.height;
  }
  set height(height) {
    this.canvas.height = height;
  }
  get canvas() {
    return this._canvas;
  }
  get ctx() {
    return this._ctx;
  }
};

// src/OffScreenCanvasWrapper2D.ts
var OffScreenCanvasWrapper2D = class extends OffScreenCanvasWrapper {
  constructor(width, height) {
    super(width, height, "2d");
  }
  get ctx() {
    return this._ctx;
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    return this;
  }
  fill(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
    return this;
  }
};

// src/Layers/CPLayer.ts
var CPLayer = class extends OffScreenCanvasWrapper2D {
  constructor(width, height, name = "New Layer") {
    super(width, height);
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

// src/Layers/NullLayer.ts
var _NullLayer = class extends CPLayer {
  static getInstance() {
    if (!_NullLayer.instance) {
      _NullLayer.instance = new _NullLayer(1, 1, "Null Layer");
    }
    return _NullLayer.instance;
  }
};
var NullLayer = _NullLayer;
NullLayer.instance = null;
var nullLayer = NullLayer.getInstance();

// src/Document/ComboPaintDocument.ts
var ComboPaintDocument = class extends OffScreenCanvasWrapper2D {
  constructor(size, layers = []) {
    super(size[0], size[1]);
    this.layers = [];
    this.selectedLayer = nullLayer;
    this.addLayers(...layers);
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
    if (this.selectedLayer == nullLayer) {
      this.selectedLayer = layer;
    }
  }
  addLayers(...layers) {
    for (let layer of layers) {
      this.addLayer(layer);
    }
    if (this.selectedLayer == null && layers.length > 0) {
      this.selectedLayer = layers[0];
    }
  }
  render() {
    this.clear();
    for (let layer of this.layers) {
      if (layer.visible) {
        this.drawLayer(layer);
      }
    }
  }
  drawLayer(layer) {
    this.ctx.globalAlpha = layer.opacity;
    this.ctx.globalCompositeOperation = layer.blendMode;
    layer.render();
    this.ctx.drawImage(layer.canvas, 0, 0);
  }
};

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
  addXY(x, y) {
    return new Vec2(this.x + x, this.y + y);
  }
  add(other) {
    this.addXY(other.x, other.y);
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

// src/Events/ViewerEventsHandler.ts
var ViewerEventsHandler = class extends EventHandler {
  constructor(viewer) {
    super();
    this.lastMousePoint = null;
    this.lastPointerPoint = null;
    this.isMidDragging = false;
    this.registerEvent("midDrag", this.onMidDrag.bind(this));
    this.registerEvent("wheel", this.onWheel.bind(this));
    let canvas = viewer.canvas;
    canvas.addEventListener("wheel", (e) => {
      this.triggerEvent("wheel", e);
    });
    canvas.addEventListener("mousedown", (e) => {
      if (e.button === 1) {
        this.isMidDragging = true;
        this.lastMousePoint = e;
      }
    });
    canvas.addEventListener("mouseup", (e) => {
      if (e.button === 1) {
        this.isMidDragging = false;
      }
      this.lastMousePoint = null;
    });
    canvas.addEventListener("mousemove", (e) => {
      if (this.isMidDragging) {
        this.triggerEvent("midDrag", e);
      }
      this.lastMousePoint = e;
    });
    this.pointerEvent = PointerEventHandler.createFromHTMLElement(canvas);
    this.pointerEvent.registerEvent("raw", this.onRawPointer.bind(this));
    this.viewer = viewer;
  }
  onRawPointer(e) {
    this.lastPointerPoint = e;
    let pos = this.viewer.viewToDocCoords(e.offsetX, e.offsetY);
    if (e.button !== 1) {
      this.viewer.paintToolEventHandler.triggerEvent("raw", e, pos);
    }
  }
  onMidDrag(e) {
  }
  onWheel(e) {
  }
};

// src/Layers/BackgroundLayer.ts
var BackgroundLayer = class extends CPLayer {
  constructor(width, height, fillStyle = "checkerboard") {
    super(width, height, "Background");
    this.fillStyle = fillStyle;
    this.render();
  }
  drawCheckerboard(color1, color2, size) {
    this.ctx.fillStyle = color1;
    this.ctx.fillRect(0, 0, this.width, this.height);
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
      this.drawCheckerboard("#ffffff", "#cbcbcb", 10);
    } else {
      this.ctx.fillStyle = this.fillStyle;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }
};

// src/DocViewer.ts
var DocViewer = class extends CanvasWrapper {
  constructor(canvas) {
    super(canvas);
    this.background = NullLayer.getInstance();
    this.paintToolEventHandler = new PaintToolEventHandler();
    this.events = new ViewerEventsHandler(this);
    this.setUpEventHandlers();
    this._state = new TranslateState();
    if (this.doc) {
      console.log("Doc is not null");
      console.log(this.doc);
      this.viewDoc(this.doc);
    }
  }
  viewDoc(doc) {
    this._state = new TranslateState();
    let offset = new Vec2(0, 0);
    let scale = 3;
    offset.x = this.width / 2 - doc.width / 2 * scale;
    offset.y = this.height / 2 - doc.height / 2 * scale;
    this.state.offset = offset;
    this.state.scale = new Vec2(scale);
    console.log("setting background");
    this.background = new BackgroundLayer(doc.width, doc.height);
  }
  setUpEventHandlers() {
    this.events.registerEvent("midDrag", (e) => {
      let offset = this.state.offset;
      let lastE = this.events.lastMousePoint;
      if (lastE === null) {
        return;
      }
      let dx = e.clientX - lastE.clientX;
      let dy = e.clientY - lastE.clientY;
      console.log({ dx, dy });
      this.state.offset = offset.addXY(dx, dy);
      this.render();
    });
    this.events.registerEvent("wheel", (e) => {
      let isTouchPad = e.deltaMode === 1;
      console.log(e.deltaMode);
      if (isTouchPad) {
        this.offsetCanvas(0, e.deltaY);
        this.offsetCanvas(e.deltaX, 0);
        return;
      }
      console.log("not touchpad");
      this.zoomRelativeToMouse(1 - e.deltaY / 1e3);
      console.log(this.state.scale);
      this.render();
    });
  }
  render() {
    console.log("Rendering");
    this.ctx.fillStyle = "#cfcfcf";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.renderBackground();
    this.renderDoc();
    this.renderForeground();
  }
  get state() {
    return this._state;
  }
  get doc() {
    return GlobalValues.currDoc;
  }
  viewToDocCoords(x, y) {
    return new Vec2(
      (x - this.state.offset.x) / this.state.scale.x,
      (y - this.state.offset.y) / this.state.scale.y
    );
  }
  zoomRelativeToMouse(zoom) {
    if (this.events.lastPointerPoint === null) {
      return;
    }
    let x = this.events.lastPointerPoint.x;
    let y = this.events.lastPointerPoint.y;
    this.relativeZoom(x, y, zoom);
  }
  offsetCanvas(x, y) {
    this.state.offset = this.state.offset.addXY(x, y);
  }
  relativeZoom(x, y, zoom) {
    if (this.state.scale.x > 100) {
      if (zoom > 1) {
        return;
      }
    }
    let oldScale = this.state.scale;
    let newScale = new Vec2(oldScale.x * zoom, oldScale.y * zoom);
    let oldOffset = this.state.offset;
    let newOffset = new Vec2(
      oldOffset.x + (x - oldOffset.x) * (1 - zoom),
      oldOffset.y + (y - oldOffset.y) * (1 - zoom)
    );
    this.state.scale = newScale;
    this.state.offset = newOffset;
  }
  get mousePos() {
    return this.events.lastMousePoint;
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
    this.ctx.imageSmoothingEnabled = !this.scaleBiggerThan(1);
    this.ctx.drawImage(this.doc.canvas, 0, 0);
    this.ctx.restore();
  }
  scaleBiggerThan(n) {
    return this.state.scale.x > n || this.state.scale.y > n;
  }
  renderBackground() {
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
    this.ctx.save();
    this.ctx.translate(this.state.offset.x, this.state.offset.y);
    this.ctx.scale(this.state.scale.x, this.state.scale.y);
    this.ctx.imageSmoothingEnabled = !this.scaleBiggerThan(1);
    if (this.background == nullLayer) {
      console.log("Background is null");
    } else {
      this.ctx.drawImage(this.background.canvas, 0, 0);
    }
    this.ctx.restore();
  }
  renderForeground() {
    if (this.scaleBiggerThan(9)) {
      this.ctx.save();
      this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
      this.ctx.lineWidth = 0.5;
      let startingX = Math.max(
        this.state.offset.x % this.state.scale.x,
        this.state.offset.x
      );
      let startingY = Math.max(
        this.state.offset.y % this.state.scale.y,
        this.state.offset.y
      );
      let endX = this.state.offset.x + this.doc.width * this.state.scale.x;
      if (endX > this.width) {
        endX = this.width;
      }
      let endY = this.state.offset.y + this.doc.height * this.state.scale.y;
      if (endY > this.height) {
        endY = this.height;
      }
      for (let i = startingX; i < endX; i += this.state.scale.x) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, startingY);
        this.ctx.lineTo(i, endY);
        this.ctx.stroke();
      }
      for (let i = startingY; i < endY; i += this.state.scale.y) {
        this.ctx.beginPath();
        this.ctx.moveTo(startingX, i);
        this.ctx.lineTo(endX, i);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }
};
var TranslateState = class {
  constructor() {
    this.offset = new Vec2(0, 0);
    this.scale = new Vec2(1, 1);
  }
};

// src/GlobalValues.ts
var _GlobalValues = class {
  static get currDoc() {
    return _GlobalValues._currDoc;
  }
  static set currDoc(doc) {
    _GlobalValues._currDoc = doc;
    _GlobalValues.viewer.viewDoc(doc);
    if (!this.allDocsSet.has(doc)) {
      this.addDoc(doc);
    }
  }
  static addDoc(doc) {
    _GlobalValues.allDocs.push(doc);
    _GlobalValues.allDocsSet.add(doc);
  }
  static removeDoc(doc) {
    if (!this.allDocsSet.has(doc)) {
      console.log("Doc not found");
      return;
    }
    let index = _GlobalValues.allDocs.indexOf(doc);
    if (index !== -1) {
      _GlobalValues.allDocs.splice(index, 1);
    }
    _GlobalValues.allDocsSet.delete(doc);
    if (_GlobalValues.currDoc === doc) {
      if (_GlobalValues.allDocs.length > 0) {
        _GlobalValues.currDoc = _GlobalValues.allDocs[0];
      }
    }
  }
  static get allDocsSet() {
    return _GlobalValues._allDocsSet;
  }
  static get allDocs() {
    return _GlobalValues._allDocs;
  }
  static get currTool() {
    return _GlobalValues._currTool;
  }
  static set currTool(tool) {
    _GlobalValues._currTool = tool;
    tool.eventHandler = this.viewer.paintToolEventHandler;
  }
  static get viewer() {
    return _GlobalValues._viewer;
  }
  static set viewer(viewer) {
    _GlobalValues._viewer = viewer;
  }
  static get currLayer() {
    if (_GlobalValues.currDoc.selectedLayer === null) {
      console.log("No layer selected");
      return NullLayer.getInstance();
    }
    return _GlobalValues.currDoc.selectedLayer;
  }
  static set currLayer(layer) {
    _GlobalValues.currDoc.selectedLayer = layer;
  }
  static init(canvas, doc = null, tool = null) {
    if (doc === null) {
      doc = new ComboPaintDocument(
        [3200, 1800],
        [new CPLayer(3200, 1800, "Layer 1").fill("#ffffff")]
      );
    }
    if (tool === null) {
      tool = new BasicPen();
    }
    _GlobalValues.viewer = new DocViewer(canvas);
    _GlobalValues.currDoc = doc;
    if (this.currDoc.selectedLayer !== null) {
      this.currLayer = this.currDoc.selectedLayer;
    }
    _GlobalValues.allDocs.push(doc);
    _GlobalValues.currTool = tool;
    this.currDoc.render();
    this.viewer.render();
  }
};
var GlobalValues = _GlobalValues;
GlobalValues._allDocs = [];
GlobalValues._allDocsSet = /* @__PURE__ */ new Set();

// src/PaintTools/PaintTool.ts
var PaintTool = class {
  constructor(eventHandler = null, name = null) {
    this._eventHandler = null;
    if (name === null) {
      name = this.constructor.name;
    }
    this.name = name;
  }
  get layer() {
    if (GlobalValues.currDoc.selectedLayer === null) {
      throw new Error("Layer not set");
    }
    return GlobalValues.currDoc.selectedLayer;
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
    this._eventHandler.bind(this);
  }
  get canvas() {
    if (this.layer === null) {
      throw new Error("Layer not set");
    }
    return this.layer.canvas;
  }
  get doc() {
    return GlobalValues.currDoc;
  }
  get viewer() {
    return GlobalValues.viewer;
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
  commitChanges() {
    this.doc.render();
    this.viewer.render();
  }
};

// src/PaintTools/PaintTool2D.ts
var PaintTool2D = class extends PaintTool {
  get ctx() {
    if (this.layer === null) {
      throw new Error("Layer not set");
    }
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
  commitChanges() {
    super.commitChanges();
    this.viewer.render();
  }
};

// src/PaintTools/BasicPen.ts
var BasicPen = class extends PaintTool2D {
  onPressedMove(point) {
    super.onPressedMove(point);
    let lastPoint = this.eventHandler.lastPoint;
    if (lastPoint !== null) {
      this.setFillRGB(0, 0, 0);
      this.drawLine(lastPoint.x, lastPoint.y, point.x, point.y);
      this.commitChanges();
    }
  }
};

// src/Main.ts
function main() {
  let viewCanvas = document.getElementById("viewCanvas");
  viewCanvas.width = 800;
  viewCanvas.height = 600;
  let width = 3200;
  let height = 1800;
  let layer1 = new CPLayer(width, height, "Layer 1");
  let layer2 = new CPLayer(width, height, "red");
  layer2.ctx.fillStyle = "red";
  layer2.ctx.fillRect(0, 0, width / 2, 10);
  layer2.opacity = 0.2;
  if (viewCanvas === null) {
    throw new Error("viewCanvas is null");
  }
  GlobalValues.init(
    viewCanvas,
    new ComboPaintDocument(
      [width, height],
      [layer1, layer2]
    ),
    new BasicPen()
  );
}
main();
console.log("Main.ts loaded");
//# sourceMappingURL=index.js.map
