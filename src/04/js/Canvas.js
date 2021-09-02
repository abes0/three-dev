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
    // this.camera.position.y = dist;
    // this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();

    this.number = 12;
    this.size = this.h / this.number;
    this.params = [];

    // this.prev = {
    //   x: -300,
    //   y: -300,
    // };
    // this.next = {
    //   x: 300,
    //   y: 300,
    // };
    // this.prev = {
    //   x: 0,
    //   y: 0,
    // };
    // this.next = {
    //   x: -this.size,
    //   y: 0,
    // };
    // this.now = {
    //   x: 0,
    //   y: 0,
    // };
    this.max = {
      x: Math.floor(this.w / this.size),
      y: Math.floor(this.h / 2 / this.size),
    };

    this.rate = 0;
    // this.angle = -(Math.PI / 180) * 97;
    this.angle = -Math.PI / 2;
    console.log(this.angle);
    this.diff = this.size * Math.cos(Math.PI / 4) - this.size / 2;
    console.log(this.diff, this.size / 2);

    this.initPlate();

    for (let i = 0; i < this.number; i++) {
      this.init(i);
    }

    // this.light = new THREE.DirectionalLight(0xffffff, 1, 100);
    // this.light.position.set(300, 300, dist * 2);
    // this.light.castShadow = true;

    // this.lightHelper = new THREE.DirectionalLightHelper(this.light, 30);
    // this.scene.add(this.light);
    // this.scene.add(this.lightHelper);

    // this.light.shadow.mapSize.width = 2048;
    // this.light.shadow.mapSize.height = 2048;
    // this.light.shadow.camera.right = 100;
    // this.light.shadow.camera.left = -100;
    // this.light.shadow.camera.top = -100;
    // this.light.shadow.camera.bottom = 100;
    // this.light.shadow.camera.near = 0.5; // default
    // this.light.shadow.camera.far = 500; // default

    this.spotLight = new THREE.SpotLight(0xffffff, 1);
    // this.spotLight.position.set(0, 300, dist);
    // this.spotLight.target = this.;
    // this.spotLight.shadow = new THREE.LightShadow(
    //   new THREE.PerspectiveCamera(20, 1, 1, 250)
    // );
    this.spotLight.position.set(0, 500, 1000);
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.1;
    this.spotLight.decay = 0;
    this.spotLight.distance = 20;

    this.spotLight.intensity = 2.0;
    this.spotLight.distance = dist;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.bias = 0.0001;
    this.spotLight.shadow.focus = 1.0;

    this.spotLight.shadow.mapSize.width = 1024 * 2; // default
    this.spotLight.shadow.mapSize.height = 1024 * 2; // default
    this.spotLight.shadow.camera.near = 0.5; // default
    this.spotLight.shadow.camera.far = 500; // default
    this.spotLight.shadow.focus = 1; // default

    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLightHelper);
    this.shadowCameraHelper = new THREE.CameraHelper(
      this.spotLight.shadow.camera
    );

    // const helper = new THREE.CameraHelper(this.light.shadow.camera);
    // this.scene.add(helper);

    this.renderer.render(this.scene, this.camera);

    this.render();
  }

  initPlate() {
    const geo = new THREE.PlaneGeometry(this.w, this.h, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xaabbcc,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    // console.log(mesh.receiveShadow);
    // mesh.castShadow = true;
    // mesh.position.z = -this.size;
    this.scene.add(mesh);
  }

  init(id) {
    const positionX = Math.floor(this.random(0, this.max.x));
    const positionY = id * this.size - this.h / 2;
    let param = {
      prev: {
        x: positionX * this.size - this.h / 2,
        y: positionY,
      },
      next: {
        x: (positionX - 1) * this.size - this.h / 2,
        y: positionY,
      },
      now: {},
      rotation: {
        prev: 0,
        next: this.angle,
        now: 0,
      },
      diff: {
        amount: this.diff * 2 + 1,
        now: 0,
      },
    };
    // console.log(param);
    // param.now.x = param.prev.x;
    // param.now.y = param.prev.y;
    const geo = new THREE.BoxGeometry(this.size, this.size, this.size);
    const mat = new THREE.MeshToonMaterial({
      color: 0xaabbcc * Math.random(),
      // emissive: 0x072534,
      // flatShading: true,
      transparent: true,
      opacity: 0.4,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = param.prev.x;
    mesh.position.y = param.prev.y;
    mesh.position.z = this.size / 2;
    mesh.castShadow = true;
    // console.log(mesh.castShadow);
    // mesh.receiveShadow = true;
    this.scene.add(mesh);
    // console.log(param);
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

  changePos(mesh, id) {
    // const max = {
    //   x: this.w / 2 - 100,
    //   y: this.h / 2 - 100,
    // };

    // this.next.x = this.random(-max.x, max.x);
    // this.next.y = this.random(-max.y, max.y);
    this.params[id].prev.x = this.params[id].next.x;
    this.params[id].prev.y = this.params[id].next.y;

    // this.next.y += this.size;
    // if (this.next.x < -this.w / 2 - this.size) {
    //   this.next.x += this.w + this.size * 2;
    // } else {
    this.params[id].next.x -= this.size;
    // }

    if (id === this.number - 1) {
      this.rate = 0;
    }
  }

  animation(mesh, id) {
    // console.log(id, mesh.position.x);
    this.params[id].now.x =
      this.params[id].prev.x * (1 - this.rate) +
      this.params[id].next.x * this.rate;

    this.params[id].rotation.now =
      this.params[id].rotation.prev * (1 - this.rate) +
      this.params[id].rotation.next * this.rate;

    this.params[id].diff.now =
      this.rate > 0.5
        ? this.params[id].diff.amount * (1 - this.rate)
        : this.params[id].diff.amount * this.rate;
    // if (id === 0) {
    //   console.log(this.params[id].diff.now);
    // }

    if (this.rate >= 0.999) {
      this.changePos(mesh, id);
    }

    mesh.position.x = this.params[id].now.x;
    mesh.position.z = this.size / 2 + this.params[id].diff.now;
    mesh.rotation.y = this.params[id].rotation.now;
    // if (this.rate >= 0.999) {
    //   mesh.rotation.y = this.angle;
    //   console.log("angle: ", this.angle);
    // } else {
    //   ;
    // }

    if (mesh.position.x < -this.w / 2 - this.size) {
      this.params[id].prev.x += this.w + this.size * 2;
      mesh.position.x = this.params[id].prev.x;
      this.params[id].next.x = this.params[id].prev.x - this.size;
    }

    // mesh.position.x += (this.now.x - mesh.position.x) * 0.07;
    // mesh.position.y += (this.now.y - mesh.position.y) * 0.07;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.rate += (1 - this.rate) * 0.07;
    if (this.rate >= 0.999) {
      this.rate = 1;
    }

    for (let j = 0; j < this.number; j++) {
      if (this.scene.children[j + 3]) {
        this.animation(this.scene.children[j + 1], j);
      }
    }

    this.spotLightHelper.update();
    this.shadowCameraHelper.update();

    this.renderer.render(this.scene, this.camera);
  }
}
