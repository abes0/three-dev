import Page00 from "./00";
import Page01 from "./01";

// const router = {
//   "00": () => new Page00(),
// };

document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/")[1];
  // router[path];
  // console.log(path, router[path]);
  // router[path];
  switch (path) {
    case "00":
      return new Page00();
    case "01":
      return new Page01();
    default:
      break;
  }
});
