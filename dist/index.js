"use strict";
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class LineSegment {
    constructor(p1, p2) {
        this.start = p1;
        this.end = p2;
        this.FA = 0;
        this.FB = 0;
        this.FC = 0;
        this.calculateCoefficients(p1, p2);
    }
    calculateCoefficients(p1, p2) {
        this.FA = p2.y - p1.y;
        this.FB = p1.x - p2.x;
        this.FC = p1.y * (p2.x - p1.x) - p1.x * (p2.y - p1.y);
    }
    intersects(segment) {
        if (this.FA * segment.FB === this.FB * segment.FA) {
            if (this.FC === segment.FC) {
                return "Відрізки накладаються";
            }
            else {
                return "Прямі паралельні, не перетинаються";
            }
        }
        const x = Math.abs((segment.FB * this.FC - this.FB * segment.FC) /
            (this.FA * segment.FB - segment.FA * this.FB));
        const y = Math.abs((this.FA * segment.FC - segment.FA * this.FC) /
            (this.FA * segment.FB - segment.FA * this.FB));
        if (this.isPointOnSegment(x, y) && segment.isPointOnSegment(x, y)) {
            return `Відрізки перетинаються в точці (
        ${Math.floor(x)}, ${Math.floor(y)})`;
        }
        else {
            return "Відрізки не перетинаються, прямі перетинаються";
        }
    }
    isPointOnSegment(x, y) {
        const minX = Math.min(this.start.x, this.end.x);
        const maxX = Math.max(this.start.x, this.end.x);
        const minY = Math.min(this.start.y, this.end.y);
        const maxY = Math.max(this.start.y, this.end.y);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
}
class Canvas {
    constructor() {
        this.segments = [];
        this.points = [];
        this.canvasRef = document.getElementById("myCanvas");
        this.ctx = this.canvasRef.getContext("2d");
        this.formRef = document.getElementById("form");
        this.messageRef = document.getElementById("message");
        this.x1Input = document.getElementById("x1");
        this.x2Input = document.getElementById("x2");
        this.y1Input = document.getElementById("y1");
        this.y2Input = document.getElementById("y2");
        this.formRef.addEventListener("submit", this.formSubmitHandler.bind(this));
        this.canvasRef.addEventListener("click", this.canvasClickHandler.bind(this));
    }
    canvasClickHandler(e) {
        const { offsetX, offsetY } = e;
        const point = new Point(offsetX, offsetY);
        this.points.push(point);
        if (this.points.length === 1) {
            this.x1Input.value = String(point.x);
            this.y1Input.value = String(point.y);
            this.x2Input.value = "";
            this.y2Input.value = "";
            return;
        }
        this.x2Input.value = String(point.x);
        this.y2Input.value = String(point.y);
        this.draw({
            startX: this.points[0].x,
            startY: this.points[0].y,
            endX: this.points[1].x,
            endY: this.points[1].y,
        });
        this.points = [];
    }
    formSubmitHandler(e) {
        e.preventDefault();
        const target = e.target;
        if (!target) {
            return;
        }
        const elements = target.elements;
        const { startX, startY, endX, endY } = elements;
        this.draw({
            startX: Number(startX === null || startX === void 0 ? void 0 : startX.value),
            startY: Number(startY === null || startY === void 0 ? void 0 : startY.value),
            endX: Number(endX === null || endX === void 0 ? void 0 : endX.value),
            endY: Number(endY === null || endY === void 0 ? void 0 : endY.value),
        });
        target.reset();
    }
    draw({ startX, startY, endX, endY }) {
        if (this.segments.length === 2) {
            this.clearCanvas();
        }
        const isFirstSegment = this.segments.length === 0;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = isFirstSegment ? "blue" : "red";
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
        const segment = new LineSegment(new Point(startX, startY), new Point(endX, endY));
        if (isFirstSegment) {
            this.segments[0] = segment;
        }
        else {
            this.segments[1] = segment;
            const message = segment.intersects(this.segments[0]);
            this.messageRef.innerHTML = message;
        }
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
        this.segments = [];
    }
}
new Canvas();
//# sourceMappingURL=index.js.map