// import "./style.scss";
import Canvas from "./js/Canvas";
import "./style.scss";

export default class Page06 {
  constructor() {
    const canvas = new Canvas();

    canvas.scrolled(window.scrollY);

    const title = document.querySelectorAll("[data-hover-item");

    title.forEach((titleItem) => {
      titleItem.addEventListener("mouseenter", (e) => {
        canvas.init(e.target);
      });
      titleItem.addEventListener("mouseleave", (e) => {
        canvas.rollOut(e.target);
      });
    });
    // document.addEventListener("mouseEnter", (e) => {
    //   console.log(e.target);
    //   canvas.init(e.target);
    // });
    window.addEventListener("mousemove", (e) => {
      canvas.mouseMoved(e.clientX, e.clientY);
    });

    window.addEventListener("scroll", (e) => {
      canvas.scrolled(window.scrollY);
    });
  }
}
