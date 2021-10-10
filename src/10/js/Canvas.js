import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import TemplateCanvas from "../../TemplateCanvas";

export default class Canvas extends TemplateCanvas {
  constructor() {
    super();
  }

  init() {
    this.createPlanes();
    // const geo = new THREE.PlaneGeometry(this.w, this.h, 32, 32);
    // console.log(this.geoArray);
    // const mat = new THREE.MeshBasicMaterial({
    //   color: 0xaabbcc,
    //   // clippingPlanes: this.geoArray,
    //   clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, 0, 1), -10)],
    //   // clipShadows: true,
    //   side: THREE.DoubleSide,
    //   stencilWrite: true,
    //   stencilRef: 0,
    //   stencilFunc: THREE.NotEqualStencilFunc,
    //   stencilFail: THREE.ReplaceStencilOp,
    //   stencilZFail: THREE.ReplaceStencilOp,
    //   stencilZPass: THREE.ReplaceStencilOp,
    // });
    // this.mesh = new THREE.Mesh(geo, mat);
    // this.scene.add(this.mesh);
    // this.renderer.localClippingEnabled = true;
  }

  createPlanes() {
    const amount = 20;
    const width = {
      max: 400,
      min: 200,
    };
    const heightRatio = 9 / 16;

    this.xRange = 400;
    this.yRange = 200;

    this.delay = {
      max: 1.5,
      min: 0.0,
    };

    this.meshArray = [];
    this.geoArray = [];
    for (let i = 0; i < amount; i++) {
      const w = this.random(width.max, width.min);
      const h = w * heightRatio;
      const x = this.range(this.xRange);
      const y = this.range(this.yRange);
      const delay = this.random(this.delay.max, this.delay.min);
      const plate = new Plate({
        w,
        h,
        x,
        y,
        delay,
        positionRandom: this.positionRandom.bind(this),
      });
      const { mesh, geo } = plate.create();
      // console.log("mesh", mesh);
      this.meshArray.push(plate);
      this.geoArray.push(geo);
      this.group.add(mesh);
    }
    console.log(this.scene);
  }

  render() {
    // console.log("render");
    // console.log(this.meshArray);
    if (this.meshArray) {
      this.meshArray.forEach((item) => {
        item.render();
      });
    }
  }

  positionRandom() {
    const x = this.range(this.xRange);
    const y = this.range(this.yRange);
    return { x, y };
  }
}

class Plate {
  constructor(option = {}) {
    this.w = option.w;
    this.h = option.h;
    this.x = option.x;
    this.y = option.y;
    this.delay = option.delay;
    this.positionRandom = option.positionRandom;
    this.scale = {
      target: 1,
      now: 0,
      ease: 0.3,
    };
    this.complete = false;
    this.minus = false;
    this.start = false;

    this.clock = new THREE.Clock();
    this.time = 0;
  }
  create() {
    const texture = new THREE.TextureLoader().load(
      "./picture-min.jpg",
      (tex) => {
        console.log(tex);
        return tex;
      }
    );
    const geo = new THREE.PlaneGeometry(this.w, this.h, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      emissive: 0x072534,
      flatShading: true,
      transparent: true,
      opacity: 0.4,
      // map: texture,
      // clippingPlanes: [new THREE.Plane(new THREE.Vector3(1, 0, 0), -10)],

      // side: THREE.DoubleSide,

      // stencilWrite: true,
      // stencilRef: 0,
      // stencilFunc: THREE.NotEqualStencilFunc,
      // stencilFail: THREE.ReplaceStencilOp,
      // stencilZFail: THREE.ReplaceStencilOp,
      // stencilZPass: THREE.ReplaceStencilOp,
    });
    console.log(mat.color);
    mat.color.r = Math.random();
    mat.color.g = Math.random();
    mat.color.b = Math.random();
    this.mesh = new THREE.Mesh(geo, mat);
    // console.log(this.mesh.position);
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = 0;
    this.mesh.scale.x = 0;
    this.mesh.scale.y = 0;
    // this.mesh.rotation.x = 100;
    // this.mesh.rotation.y = 100;
    return { mesh: this.mesh, geo };
  }
  // scale() {
  // const tl = gsap.timeline()
  // tl.to(this.mesh, {scale: 1}).to({})
  // }
  render() {
    // this.scale.now += (1 - this.scale.now) * this.scale.ease;
    const delta = this.clock.getDelta();
    this.time += delta;
    // console.log(this.time);

    if (this.delay < this.time) {
      this.start = true;
    }
    if (this.start) {
      if (this.minus) {
        this.scale.now += (0 - this.scale.now) * this.scale.ease;
      } else {
        this.scale.now += (1 - this.scale.now) * this.scale.ease;
      }
    }

    if (this.scale.now > 0.999) {
      this.minus = true;
    }

    if (this.scale.now < 0.001) {
      this.start = false;
      this.minus = false;
      this.changePosition();
    }

    // console.log(this.scale.now);
    this.mesh.scale.x = this.scale.now;
    this.mesh.scale.y = this.scale.now;
    // this.mesh.rotation.x += 0.1;
    // this.mesh.rotation.y += 0.1;
    // this.mesh.rotation.z += 0.1;
  }

  changePosition() {
    const { x, y } = this.positionRandom();
    this.mesh.position.x = x;
    this.mesh.position.y = y;
  }
}
