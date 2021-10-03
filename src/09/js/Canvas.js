import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import TemplateCanvas from "../../TemplateCanvas";

export default class Canvas extends TemplateCanvas {
  constructor() {
    super();
    this.init();
  }

  init() {
    console.log("Hello");
  }

  render() {}
}
