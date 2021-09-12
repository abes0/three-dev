import Page00 from "./00";
import Page01 from "./01";
import Page02 from "./02";
import Page03 from "./03";
import Page04 from "./04";
import Page05 from "./05";
import Page06 from "./06";

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
    case "02":
      return new Page02();
    case "03":
      return new Page03();
    case "04":
      return new Page04();
    case "05":
      return new Page05();
    case "06":
      return new Page06();
    default:
      break;
  }
});
