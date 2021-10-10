// import "./style.scss";
import Canvas from "./js/Canvas";
import "./style.scss";

export default class Page09 {
  constructor() {
    // const canvas = new Canvas();
    // window.addEventListener("mousemove", canvas.mouseMoved.bind(canvas));
    // window.addEventListener("mousedown", canvas.onMouseDown.bind(canvas));
    // window.addEventListener("mouseup", canvas.onMouseUp.bind(canvas));
    // window.addEventListener("scroll", (e) => {
    //   canvas.scrolled(window.scrollY);
    // });
    this.el = document.querySelector("#canvas-container");
    this.count = 0;
    this.center = { x: 0, y: 0 };
    // this.el.style.background = `red`;
    this.el.style.backgroundImage = "conic-gradient(blue, red);";
    console.log(this.el.style.backgroundImage);
    // this.render();
  }
  render() {
    requestAnimationFrame(() => this.render());
    this.count++;

    this.center.x = Math.sin(this.count) * 100;
    this.center.y = Math.cos(this.count) * 100;
    // console.log(this.center);

    this.el.style.backgroundImage = `repeating-conic-gradient(
      at ${this.center.x}% ${this.center.y}%
      hsl(0, 100%, 50%) 0,
      hsl(90, 100%, 50%) 5deg,
      hsl(180, 100%, 50%) 10deg,
      hsl(270, 100%, 50%) 15deg,
      hsl(360, 100%, 50%) 20deg
    );`;
    console.log(this.el.style.backgroundImage);
  }
}
