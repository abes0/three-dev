import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import CRolloverMesh from "./cRolloverMesh";

export default class Canvas {
  constructor() {
    //マウス座標
    this.mouse = new THREE.Vector2(0, 0);

    //スクロール量
    this.scrollY = 0;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const container = document.getElementById("canvas-container");
    container.appendChild(this.renderer.domElement);

    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = this.h / 2 / Math.tan(fovRad);
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.w / this.h,
      1,
      dist * 2
    );
    this.camera.position.z = dist;

    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(0, 0, dist);
    this.scene.add(this.light);

    this.renderer.render(this.scene, this.camera);

    this.render();
    // console.log(performance);

    this.targetX = 0;
    this.nowX = 0;
    this.ease = 0.05;

    this.meshList = {};
  }

  init(el) {
    const id = el.getAttribute("data-hover-item");
    this.meshList[id] = new CRolloverMesh({
      el: el,
      group: this.group,
      id: id,
      scrollY: this.scrollY,
      width: this.w,
      height: this.h,
    });
  }

  rollOut(el) {
    const id = el.getAttribute("data-hover-item");
    if (typeof this.meshList[id] !== "undefined") {
      this.meshList[id]._eRollOut();
    }
  }

  mouseMoved(x, y) {
    this.mouse.x = x - this.w / 2;
    this.mouse.y = -y + this.h / 2;

    this.light.position.x = this.mouse.x;
    this.light.position.y = this.mouse.y;
  }

  scrolled(y) {
    this.scrollY = y;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    if (typeof this.meshList !== "undefined") {
      Object.keys(this.meshList).forEach((key) => {
        this.meshList[key].animation(this.scrollY);
      });
    }
    this.renderer.render(this.scene, this.camera);
  }
}
