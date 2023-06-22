class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class LineSegment {
  private FA: number;
  private FB: number;
  private FC: number;
  start: Point;
  end: Point;

  constructor(p1: Point, p2: Point) {
    this.start = p1;
    this.end = p2;
    this.FA = 0;
    this.FB = 0;
    this.FC = 0;

    this.calculateCoefficients(p1, p2);
  }

  private calculateCoefficients(p1: Point, p2: Point): void {
    this.FA = p2.y - p1.y;
    this.FB = p1.x - p2.x;
    this.FC = p1.y * (p2.x - p1.x) - p1.x * (p2.y - p1.y);
  }

  public intersects(segment: LineSegment): string {
    if (this.FA * segment.FB === this.FB * segment.FA) {
      if (this.FC === segment.FC) {
        return "Відрізки накладаються";
      } else {
        return "Прямі паралельні, не перетинаються";
      }
    }

    const x = Math.abs(
      (segment.FB * this.FC - this.FB * segment.FC) /
        (this.FA * segment.FB - segment.FA * this.FB)
    );
    const y = Math.abs(
      (this.FA * segment.FC - segment.FA * this.FC) /
        (this.FA * segment.FB - segment.FA * this.FB)
    );

    if (this.isPointOnSegment(x, y) && segment.isPointOnSegment(x, y)) {
      return `Відрізки перетинаються в точці (
        ${Math.floor(x)}, ${Math.floor(y)})`;
    } else {
      return "Відрізки не перетинаються, прямі перетинаються";
    }
  }

  public isPointOnSegment(x: number, y: number): boolean {
    const minX = Math.min(this.start.x, this.end.x);
    const maxX = Math.max(this.start.x, this.end.x);
    const minY = Math.min(this.start.y, this.end.y);
    const maxY = Math.max(this.start.y, this.end.y);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
}

type drawObjectParams = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

class Canvas {
  private formRef: HTMLFormElement;
  private messageRef: HTMLParagraphElement;
  private x1Input: HTMLInputElement;
  private x2Input: HTMLInputElement;
  private y1Input: HTMLInputElement;
  private y2Input: HTMLInputElement;

  private canvasRef: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private segments: LineSegment[] = [];
  private points: Point[] = [];

  constructor() {
    this.canvasRef = document.getElementById("myCanvas") as HTMLCanvasElement;
    this.ctx = this.canvasRef.getContext("2d") as CanvasRenderingContext2D;

    this.formRef = document.getElementById("form") as HTMLFormElement;
    this.messageRef = document.getElementById(
      "message"
    ) as HTMLParagraphElement;

    this.x1Input = document.getElementById("x1") as HTMLInputElement;
    this.x2Input = document.getElementById("x2") as HTMLInputElement;
    this.y1Input = document.getElementById("y1") as HTMLInputElement;
    this.y2Input = document.getElementById("y2") as HTMLInputElement;

    this.formRef.addEventListener("submit", this.formSubmitHandler.bind(this));
    this.canvasRef.addEventListener(
      "click",
      this.canvasClickHandler.bind(this)
    );
  }

  private canvasClickHandler(e: MouseEvent) {
    const { offsetX, offsetY } = e;
    const point = new Point(offsetX, offsetY);

    this.points.push(point);

    if (this.points.length === 1) {
      this.x1Input.value = String(point.x);
      this.y1Input.value = String(point.y);

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

  private formSubmitHandler(e: SubmitEvent) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    if (!target) {
      return;
    }
    const elements: HTMLFormControlsCollection = target.elements;
    const { startX, startY, endX, endY } = elements as unknown as Record<
      string,
      HTMLInputElement
    >;

    this.draw({
      startX: Number(startX?.value),
      startY: Number(startY?.value),
      endX: Number(endX?.value),
      endY: Number(endY?.value),
    });
    target.reset();
  }

  private draw({ startX, startY, endX, endY }: drawObjectParams) {
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

    const segment = new LineSegment(
      new Point(startX, startY),
      new Point(endX, endY)
    );
    if (isFirstSegment) {
      this.segments[0] = segment;
    } else {
      this.segments[1] = segment;
      console.log(this.segments);

      const message = segment.intersects(this.segments[0]);
      this.messageRef.innerHTML = message;
    }
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
    this.segments = [];
  }
}

new Canvas();
