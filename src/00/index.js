// import "./style.scss";
import Canvas from "./js/Canvas";
import "./style.scss";

export default class Page00 {
  constructor() {
    // import("./style.scss");
    console.log("00");
    const canvas = new Canvas();

    canvas.scrolled(window.scrollY);

    const title = document.querySelectorAll(".title");

    [].slice.call(title).map((titleItem) => {
      console.log(titleItem);
      titleItem.addEventListener("mouseenter", (e) => {
        console.log(e.target);
        canvas.init(e.target);
      });
      titleItem.addEventListener("mouseleave", () => {
        canvas.remove();
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
