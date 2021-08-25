// import "./style.scss";
import Canvas from "./js/Canvas";
import "./style.scss";

export default class Page01 {
  constructor() {
    const canvas = new Canvas();

    window.addEventListener("mousemove", (e) => {
      canvas.mouseMoved(e.clientX, e.clientY);
    });

    window.addEventListener("scroll", (e) => {
      canvas.scrolled(window.scrollY);
    });
  }
}
