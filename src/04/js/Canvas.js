import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";

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

    this.number = 12;

    this.posA = {
      x: -300,
      y: -300,
    };
    this.posB = {
      x: 300,
      y: 300,
    };
    this.now = {
      x: 0,
      y: 0,
    };
    this.rate = 0;

    console.log(this.posA, this.posB, this.now);

    // for (let i = 0; i < this.number; i++) {
    this.init();
    // }
  }

  init() {
    const geo = new THREE.OctahedronGeometry(100, 1);
    const mat = new THREE.MeshToonMaterial({
      color: 0xaabbcc,
      emissive: 0x072534,
      flatShading: true,
      transparent: true,
      opacity: 0.4,
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);
  }

  radian(val) {
    return (val * Math.PI) / 180;
  }

  degree(val) {
    return (val * 180) / Math.PI;
  }

  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  mouseMoved(x, y) {}

  animation(mesh) {
    this.rate += 0.01;
    // console.log(this.posA, this.posB, this.now);
    this.now.x = this.posA.x * (1 - this.rate) + this.posB.x * this.rate;
    this.now.y = this.posA.y * (1 - this.rate) + this.posB.y * this.rate;

    if (this.rate >= 1) {
      this.rate = 1;
    }

    mesh.position.x = this.now.x;
    mesh.position.y = this.now.y;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    if (this.mesh) {
      this.animation(this.mesh);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
