import Page00 from "./00";
import Page01 from "./01";
import Page02 from "./02";
import Page03 from "./03";
import Page04 from "./04";
import Page05 from "./05";
import Page06 from "./06";
import Page07 from "./07";
import Page08 from "./08";
import Page09 from "./09";
import Page10 from "./10";
import Page11 from "./11";
import Page12 from "./12";
import Page13 from "./13";
import Page14 from "./14";
import Page15 from "./15";
import Page16 from "./16";

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
    case "07":
      return new Page07();
    case "08":
      return new Page08();
    case "09":
      return new Page09();
    case "10":
      return new Page10();
    case "11":
      return new Page11();
    case "12":
      return new Page12();
    case "13":
      return new Page13();
    case "14":
      return new Page14();
    case "15":
      return new Page15();
    case "16":
      return new Page16();
    default:
      break;
  }
});
