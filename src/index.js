import Page00 from "./00";

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
    default:
      break;
  }
});
