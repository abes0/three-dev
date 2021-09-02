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
    this.number = 6;
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
    const size = {
      w: this.random(this.w * 0.1, this.w * 0.7),
      h: this.random(this.h * 0.1, this.h * 0.7),
    };

    const target = {
      x: this.random(-this.w * 0.35, this.w * 0.35),
      y: this.random(-this.h * 0.35, this.h * 0.35),
    };

    const dir = {
      x: 0,
      y: 0,
    };
    if (this.random(0, 1) > 0.5) {
      dir.x = this.random(-1, 1);
    } else {
      dir.y = this.random(-1, 1);
    }

    const now = {
      x: dir.x === 0 ? target.x : target.x + this.w * dir.x,
      y: dir.y === 0 ? target.y : target.y + this.h * dir.y,
    };

    const geo = new THREE.PlaneGeometry(size.w, size.h, 32, 32);
    const mat = new THREE.MeshToonMaterial({
      color: 0xbb3333,
      // emissive: 0x072534,
      // flatShading: true,
      transparent: true,
      opacity: 0.4,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = now.x;
    mesh.position.y = now.y;
    this.scene.add(mesh);
    console.table({
      size,
      target,
      dir,
      now,
    });
    this.params.push({
      size,
      target,
      dir,
      now,
    });
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

  animation(mesh, id) {
    const { size, target, dir, now } = this.params[id];
    const x = target.x + dir.x * this.w * (1 - this.scrollProgress);
    const y = target.y + dir.y * this.h * (1 - this.scrollProgress);
    now.x += (x - now.x) * 0.1;
    now.y += (y - now.y) * 0.1;
    mesh.position.x = now.x;
    mesh.position.y = now.y;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.scrollY = window.pageYOffset;
    this.scrollProgress = this.scrollY / (document.body.clientHeight - this.h);
    console.log(this.scrollY, document.body.clientHeight, this.scrollProgress);

    for (let j = 0; j < this.number; j++) {
      // if (this.scene.children[j]) {
      this.animation(this.scene.children[j], j);
      // }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
