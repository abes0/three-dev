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
    this.param = [];
    this.geometry = [THREE.OctahedronGeometry, THREE.BoxGeometry];
    this.burstSize = 100;
    this.now = 0;
    this.clickFlag = false;
    this.ease = 0.1;

    for (let i = 0; i < this.number; i++) {
      this.init();
    }
  }

  init() {
    const param = {
      speed: this.random(0.01, 0.1),
      angle: 0,
      color: 0xbbccaa * Math.random(),
      default: {
        x: this.random(-170, 170),
        y: this.random(-170, 170),
        z: this.random(-170, 170),
      },
    };
    param.position = {
      x: param.default.x,
      y: param.default.y,
      z: param.default.z,
    };
    const geoNum = Math.floor(this.random(0, 7));
    let geo;
    switch (geoNum) {
      case 0:
        geo = new THREE.OctahedronGeometry(this.random(20, 40), 1);
        break;
      case 1:
        let size = this.random(20, 50);
        geo = new THREE.BoxGeometry(size, size, size);
        break;
      case 2:
        geo = new THREE.ConeGeometry(
          this.random(20, 50),
          this.random(20, 50),
          this.random(20, 50)
        );
        break;
      case 3:
        let r = this.random(10, 30);
        geo = new THREE.CylinderGeometry(
          r,
          r,
          this.random(40, 80),
          this.random(10, 30)
        );
        break;
      case 4:
        geo = new THREE.TetrahedronGeometry(this.random(20, 50), 0);
        break;
      case 5:
        geo = new THREE.TorusGeometry(
          this.random(10, 30),
          this.random(5, 10),
          this.random(10, 30),
          this.random(10, 20)
        );
        break;
      case 6:
        geo = new THREE.TorusKnotGeometry(
          this.random(20, 50),
          this.random(3, 10),
          this.random(6, 40),
          16
        );
        break;
    }

    const mat = new THREE.MeshToonMaterial({
      color: param.color,
      emissive: 0x072534,
      flatShading: true,
      transparent: true,
      opacity: 0.4,
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(
      param.position.x,
      param.position.y,
      param.position.z
    );
    this.mesh.scale.set(2.0, 2.0, 2.0);
    this.scene.add(this.mesh);
    this.param.push(param);
  }

  rotateX(obj, id) {
    const cos = Math.cos(this.param[id].angle);
    const sin = Math.sin(this.param[id].angle);

    const nowY = this.param[id].default.y > 0 ? this.now : -this.now;
    const nowZ = this.param[id].default.z > 0 ? this.now : -this.now;

    const y =
      (this.param[id].default.y + nowY) * cos +
      (this.param[id].default.z + nowZ) * sin;
    const z =
      (this.param[id].default.z + nowZ) * cos +
      (this.param[id].default.y + nowY) * sin;

    obj.y = y;
    obj.z = z;
  }

  rotateY(obj, id) {
    const cos = Math.cos(this.param[id].angle);
    const sin = Math.sin(this.param[id].angle);

    const nowX = this.param[id].default.x > 0 ? this.now : -this.now;
    const nowZ = this.param[id].default.z > 0 ? this.now : -this.now;

    const x =
      (this.param[id].default.x + nowX) * cos +
      (this.param[id].default.z + nowZ) * sin;
    const z =
      (this.param[id].default.z + nowZ) * cos +
      (this.param[id].default.x + nowX) * sin;

    obj.x = x;
    obj.z = z;
  }

  rotateZ(obj, id) {
    const cos = Math.cos(this.param[id].angle);
    const sin = Math.sin(this.param[id].angle);

    const nowX = this.param[id].default.x > 0 ? this.now : -this.now;
    const nowY = this.param[id].default.y > 0 ? this.now : -this.now;

    const x =
      (this.param[id].default.x + nowX) * cos +
      (this.param[id].default.y + nowY) * sin;
    const y =
      (this.param[id].default.y + nowY) * cos +
      (this.param[id].default.x + nowX) * sin;

    obj.x = x;
    obj.y = y;
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

  mouseDown() {
    this.clickFlag = true;
  }

  mouseUp() {
    this.clickFlag = false;
  }

  animation(mesh, id) {
    if (mesh) {
      this.param[id].angle += this.param[id].speed;
      if (this.clickFlag) {
        this.param[id].angle += this.param[id].speed * 1.5;
      }

      this.rotateZ(mesh.position, id);
      this.rotateX(mesh.position, id);
      this.rotateY(mesh.position, id);

      mesh.rotation.x += 0.05;
      mesh.rotation.y += 0.06;
      mesh.rotation.z += 0.07;
    }
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    if (this.clickFlag) {
      this.now += (this.burstSize - this.now) * this.ease;
    } else {
      this.now += (0 - this.now) * this.ease;
      if (this.now < 0.01) {
        this.now = 0;
      }
    }
    for (let i = 0; i < this.number; i++) {
      this.animation(this.scene.children[i + 1], i);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
