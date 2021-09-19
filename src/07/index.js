// import "./style.scss";
import Canvas from "./js/Canvas";
import "./style.scss";

export default class Page07 {
  constructor() {
    const canvas = new Canvas();

    window.addEventListener("mousemove", canvas.mouseMoved.bind(canvas));

    window.addEventListener("mousedown", canvas.onMouseDown.bind(canvas));

    window.addEventListener("mouseup", canvas.onMouseUp.bind(canvas));

    // window.addEventListener("scroll", (e) => {
    //   canvas.scrolled(window.scrollY);
    // });
  }
}
