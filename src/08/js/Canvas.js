import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import chroma from "chroma-js";
import noise from "simplenoise";

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
      antialias: true,
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

    this.render();

    this.init();
  }

  init() {
    const geo = new THREE.PlaneGeometry(this.w, this.h, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xaabbcc,
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.group.add(mesh);
  }

  mouseMoved(e) {
    console, log("mouseMoved");
  }

  onMouseDown(e) {
    console, log("onMouseDown");
  }

  onMouseUp(e) {
    console.log("onMouseUp");
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
  }
}
