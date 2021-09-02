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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    this.size = 100;
    this.number = 12;
    this.params = [];

    for (let i = 0; i < this.number; i++) {
      this.init(i);
    }

    this.light = new THREE.DirectionalLight(0xffffff, 1, 100);
    this.light.position.set(300, 300, dist * 2);
    this.scene.add(this.light);

    // this.lightHelper = new THREE.DirectionalLightHelper(this.light, 30);
    // this.scene.add(this.lightHelper);

    this.renderer.render(this.scene, this.camera);

    this.render();
  }

  init(id) {
    let param = {
      size: {
        w: this.random(0, this.w * 0.7),
        h: this.random(0, this.h * 0.7),
      },
      position: {},
    };
    if (this.random(0, 1) > 0.5) {
      param.position.x = this.random(-1, 1);
    } else {
      param.position.y = this.random(-1, 1);
    }

    const geo = new THREE.PlaneGeometry(this.size, this.size, 32, 32);
    const mat = new THREE.MeshToonMaterial({
      color: 0xbb3333,
      // emissive: 0x072534,
      // flatShading: true,
      transparent: true,
      opacity: 0.4,
    });

    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);
    this.params.push(param);
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

  animation(mesh, id) {}

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    for (let j = 0; j < this.number; j++) {
      if (this.scene.children[j]) {
        this.animation(this.scene.children[j], j);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
