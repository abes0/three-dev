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
    // console.log(performance);

    // this.mesh;
    this.targetX = 0;
    this.targetY = 0;

    this.nowX = 0;
    this.nowY = 0;

    this.vx = 0;
    this.vy = 0;

    this.power = 0.7;
    this.ease = 0.1;

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
  }

  mouseMoved(x, y) {
    this.targetX = x - this.w / 2;
    this.targetY = -y + this.h / 2;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    // console.log(this.mesh);
    if (this.mesh) {
      // 慣性
      this.nowX += (this.targetX - this.nowX) * this.ease;
      this.nowY += (this.targetY - this.nowY) * this.ease;

      //バネ
      // this.vx += (this.targetX - this.nowX) * this.power;
      // this.vy += (this.targetY - this.nowY) * this.power;
      // this.nowX += this.vx *= this.power;
      // this.nowY += this.vy *= this.power;

      const dx = this.targetX - this.nowX;
      const dy = this.targetY - this.nowY;
      const distance = Math.sqrt(dx * dx + dy * dy) / 1000;

      this.mesh.position.x = this.nowX;
      this.mesh.position.y = this.nowY;

      // this.mesh.rotation.z += 0.01;

      console.log(distance);
      if (dx > 0) {
        this.mesh.rotation.y += distance;
      } else {
        this.mesh.rotation.y -= distance;
      }
      if (dy < 0) {
        this.mesh.rotation.x += distance;
      } else {
        this.mesh.rotation.x -= distance;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
