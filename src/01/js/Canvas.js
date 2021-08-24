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

    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(0, 0, 400);
    this.scene.add(this.light);

    this.renderer.render(this.scene, this.camera);

    this.render();
    console.log(performance);

    this.targetX = 0;
    this.nowX = 0;
    this.ease = 0.05;
  }

  init(element) {
    console.log("init");
    this.element = element;
    const rect = this.element.getBoundingClientRect();

    const depth = 1000;
    const geo = new THREE.BoxGeometry(rect.width, rect.height, depth);

    const mat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

    this.mesh = new THREE.Mesh(geo, mat);

    const center = new THREE.Vector2(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2
    );
    const diff = new THREE.Vector2(
      center.x - this.w / 2,
      center.y - this.h / 2
    );
    this.targetX = diff.x;
    this.nowX = -center.x * 2;
    this.mesh.position.set(-center.x * 2, -(diff.y + this.scrollY), -depth / 2);
    this.offsetY = this.mesh.position.y;
    console.log(this.mesh);

    this.scene.add(this.mesh);
  }

  remove() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
  }

  mouseMoved(x, y) {
    this.mouse.x = x - this.w / 2;
    this.mouse.y = -y + this.h / 2;

    this.light.position.x = this.mouse.x;
    this.light.position.y = this.mouse.y;
  }

  scrolled(y) {
    this.scrollY = y;
    console.log(this.scrollY);
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    if (this.mesh) {
      this.mesh.position.y = this.offsetY + this.scrollY;
      this.nowX += (this.targetX - this.nowX) * this.ease;
      console.log("this.nowX: ", this.nowX);
      this.mesh.position.x = this.nowX;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
