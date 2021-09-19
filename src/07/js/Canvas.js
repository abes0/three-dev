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

    noise.seed(Math.random());

    this.segments = 100;
    this.amount = 30;

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
    const time = Date.now() / 4000;
    const points = [];
    for (let j = 0; j < this.amount; j++) {
      for (let i = 0; i < this.segments; i++) {
        const x = -(((this.w + 100) / this.segments) * i - this.w / 2);
        const px = i / 20;
        const y = 0;

        const z = j * 10;
        const p = new THREE.Vector3(x, y, z);
        points.push(p);
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial();
      const mesh = new THREE.Line(geo, mat);
      this.group.add(mesh);
    }
  }

  mouseMoved(e) {
    if (this.stateMouseDown) {
      this.targetX = e.x - this.w / 2;
      this.targetY = -e.y + this.h / 2;
      this.diffX = (this.targetX - this.startX) * this.friction;
      this.diffY = (this.targetY - this.startY) * this.friction;
    }
  }

  onMouseDown(e) {
    this.stateMouseDown = true;
    this.startX = e.x - this.w / 2;
    this.startY = -e.y + this.h / 2;
    this.color = "#f00";
  }

  onMouseUp(e) {
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

    // 慣性
    this.nowX += (this.diffX - this.nowX) * this.ease;
    this.nowY += (this.diffY - this.nowY) * this.ease;

    const distance =
      Math.sqrt(this.nowX * this.nowX + this.nowY * this.nowY) * 0.005;

    this.group.children.forEach((item, index) => {
      if (item) {
        item.geometry.attributes.position.needsUpdate = true;

        const positions = item.geometry.attributes.position.array;
        const time = Date.now() / 4000;

        for (let i = 0; i < this.segments; i++) {
          const x = ((this.w + 100) / this.segments) * i - this.w / 2;
          const px = i / 50;
          const y =
            (this.h / 4) * (distance * (index / 3)) * noise.perlin2(px, time);

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
        }
      }

      this.color = chroma
        .scale(["#fff", "#f00"])
        .domain([0, 1])(distance)
        .rgb();
      item.material.color.r = this.color[0] / 255;
      item.material.color.g = this.color[1] / 255;
      item.material.color.b = this.color[2] / 255;
    });

    this.renderer.render(this.scene, this.camera);
  }
}
