// import "./style.scss";
import Canvas from "./js/Canvas";
import "./style.scss";

export default class Page04 {
  constructor() {
    const canvas = new Canvas();

    window.addEventListener("mousemove", (e) => {
      canvas.mouseMoved(e.clientX, e.clientY);
    });

    window.addEventListener("mousedown", (e) => {
      canvas.mouseDown();
    });

    window.addEventListener("mouseup", (e) => {
      canvas.mouseUp();
    });

    window.addEventListener("scroll", (e) => {
      canvas.scrolled(window.scrollY);
    });
  }
}
