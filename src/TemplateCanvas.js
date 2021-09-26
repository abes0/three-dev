import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import chroma from "chroma-js";
import noise from "simplenoise";

export default class TemplateCanvas {
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
      antialias: true,
      localClippingEnabled: true,
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

    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(400, 400, 400);
    this.scene.add(this.light);

    this.renderer.render(this.scene, this.camera);

    this.rootRender();

    if (this.init) {
      this.init();
    }
  }

  mouseMoved(e) {
    console.log("mouseMoved");
  }

  onMouseDown(e) {
    console.log("onMouseDown");
  }

  onMouseUp(e) {
    console.log("onMouseUp");
  }

  rootRender() {
    requestAnimationFrame(() => {
      this.rootRender();
    });
    if (this.render) {
      this.render();
    }

    this.renderer.render(this.scene, this.camera);
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  randomMinus(min, max) {
    let val = Math.random() * (max - min) + min;
    if (Math.random() > 0.5) {
      val *= -1;
    }
    return val;
  }
  range(val) {
    return this.random(-val, val);
  }
  randomArray(array) {
    return array[this.random(0, arr.length - 1)];
  }
  randomBool(range) {
    return this.randomInt(0, range - 1) === 0;
  }
}
