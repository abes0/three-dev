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
      flatShading: true,
    });
    this.mesh = new THREE.LineSegments(geo, line);
    // this.mesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.mesh);
  }

  mouseMoved(x, y) {}

  animation(mesh, id) {
    if (mesh) {
      this.angle[id] += this.speed;
      this.angleZ[id] += this.speedZ;
      const radian = this.angle[id] * (Math.PI / 180);
      const radianZ = this.angleZ[id] * (Math.PI / 180);
      mesh.position.y = Math.cos(radian) * this.size;
      mesh.position.x = Math.sin(radian) * this.size;

      //　時間
      if (
        this.angle[id] % 360 <
          (this.hour + 0.4 + this.minutes / 60) * (360 / 12) &&
        this.angle[id] % 360 >
          (this.hour - 0.4 + this.minutes / 60) * (360 / 12)
      ) {
        mesh.material.color.g = 0.4;
        mesh.material.color.b = 0.4;
      } else {
        mesh.material.color.g = 1;
        mesh.material.color.b = 1;
      }
      if (
        this.angle[id] % 360 <
          (this.hour + 0.1 + this.minutes / 60) * (360 / 12) &&
        this.angle[id] % 360 >
          (this.hour - 0.1 + this.minutes / 60) * (360 / 12)
      ) {
        mesh.material.color.g = 0;
        mesh.material.color.b = 0;
      }

      // 分
      if (
        this.angle[id] % 360 < (this.minutes + 1.5) * (360 / 60) &&
        this.angle[id] % 360 > (this.minutes - 1.5) * (360 / 60)
      ) {
        mesh.material.color.r = 0.4;
        mesh.material.color.b = 0.4;
      } else {
        mesh.material.color.r = 1;
        mesh.material.color.b = 1;
      }
      if (
        this.angle[id] % 360 < (this.minutes + 0.5) * (360 / 60) &&
        this.angle[id] % 360 > (this.minutes - 0.5) * (360 / 60)
      ) {
        mesh.material.color.r = 0;
        mesh.material.color.b = 0;
      }
      mesh.position.z = Math.abs(Math.cos(radianZ) + Math.cos(radianZ)) * 50;
    }
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });
    // for (let j = 1; j < this.scene.children.length; j++) {
    //   this.animation(this.scene.children[j], j - 1);
    // }

    this.renderer.render(this.scene, this.camera);
  }
}
