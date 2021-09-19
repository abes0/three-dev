import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import chroma from "chroma-js";

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

    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(400, 400, 400);
    this.scene.add(this.light);

    this.renderer.render(this.scene, this.camera);

    this.render();
    // console.log(performance);

    // this.mesh;
    this.stateMouseDown = false;
    this.startX = 0;
    this.startY = 0;

    this.targetX = 0;
    this.targetY = 0;

    this.diffX = 0;
    this.diffY = 0;

    this.nowX = 0;
    this.nowY = 0;

    this.friction = 0.3;
    this.ease = 0.1;

    this.f = chroma.scale();

    this.init();
  }

  init() {
    const geo = new THREE.OctahedronGeometry(100, 1);
    const line = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    const mat = new THREE.MeshPhongMaterial({
      color: 0xaabbcc,
      emissive: 0x072534,
      // side: THREE.DoubleSide,
      flatShading: true,
    });
    // this.mesh = new THREE.LineSegments(geo, line);
    this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);
    console.log(this.mesh.material.color);
  }

  mouseMoved(e) {
    if (this.stateMouseDown) {
      // console.log(e.x, e.y, this.w, this.h);
      this.targetX = e.x - this.w / 2;
      this.targetY = -e.y + this.h / 2;
      this.diffX = (this.targetX - this.startX) * this.friction;
      this.diffY = (this.targetY - this.startY) * this.friction;

      // this.diffX *= this.friction;
      // this.diffY *= this.friction;
      // console.log("mouseMoved", e, { x: this.targetX, y: this.targetY });
    }
  }

  onMouseDown(e) {
    console.log("mousedown", e);
    this.stateMouseDown = true;
    this.startX = e.x - this.w / 2;
    this.startY = -e.y + this.h / 2;
  }

  onMouseUp(e) {
    console.log("mouseup", e);
    this.stateMouseDown = false;
    this.targetX = 0;
    this.targetY = 0;
    this.diffX = 0;
    this.diffY = 0;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    if (this.mesh) {
      // 慣性
      this.nowX += (this.diffX - this.nowX) * this.ease;
      this.nowY += (this.diffY - this.nowY) * this.ease;

      this.mesh.position.x = this.nowX;
      this.mesh.position.y = this.nowY;
      this.mesh.scale.x = 1 + Math.abs(this.nowX) * 0.005;
      this.mesh.scale.y = 1 + Math.abs(this.nowY) * 0.005;

      const distance =
        Math.sqrt(this.nowX * this.nowX + this.nowY * this.nowY) * 0.005;
      console.log("distance", distance);
      this.color = chroma
        .scale(["#abc", "#f00"])
        .domain([0, 1])(distance)
        .rgb();
      this.mesh.material.color.r = this.color[0] / 255;
      this.mesh.material.color.g = this.color[1] / 255;
      this.mesh.material.color.b = this.color[2] / 255;
      console.log(this.color);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
