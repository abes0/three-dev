import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import TemplateCanvas from "../../TemplateCanvas";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";

export default class Canvas extends TemplateCanvas {
  init() {
    this.createPlanes();
  }

  createPlanes() {
    const amount = 60;
    const width = {
      max: 400,
      min: 200,
    };
    const heightRatio = 1604 / 2143;

    this.xRange = 0.8;
    this.yRange = 0.7;
    // console.log(this.w, this.h);

    this.delay = {
      max: 30.0,
      min: 0.0,
    };

    this.meshArray = [];
    this.geoArray = [];
    for (let i = 0; i < amount; i++) {
      const w = 300; //this.random(width.max, width.min);
      const h = w * heightRatio;
      const x = this.range(this.xRange * (this.w / 2));
      const y = this.range(this.yRange * (this.h / 2));
      const delay = this.random(this.delay.max, this.delay.min) + 0.05;
      const plate = new Plate({
        w,
        h,
        x,
        y,
        delay,
        positionRandom: this.positionRandom.bind(this),
        windowSize: {
          w: this.w,
          h: this.h,
        },
        index: i,
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
    const x = this.range(this.xRange * (this.w / 2));
    const y = this.range(this.yRange * (this.h / 2));
    console.log(x, y);

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
    this.windowSize = option.windowSize;
    this.index = option.index;
    this.scale = {
      target: 1,
      now: 0,
      ease: 0.05,
    };
    this.position = {
      x: this.x,
      y: this.y,
      ease: 0.05,
      range: 0,
      speed: 0.02,
    };
    this.complete = false;
    this.minus = false;
    this.start = false;

    this.clock = new THREE.Clock();
    this.time = 0;
    this.texture = new THREE.TextureLoader().load(
      "./picture-min.jpg",
      (tex) => {
        // console.log(tex);
        return tex;
      }
    );
  }
  create() {
    this.uniforms = {
      u_texture: {
        type: "t",
        value: this.texture,
      },
      u_resolution: {
        type: "v2",
        value: new THREE.Vector2(this.windowSize.w, this.windowSize.h),
      },
      u_imageResolution: {
        type: "v2",
        value: new THREE.Vector2(2143, 1604),
      },
      u_uvPosition: {
        type: "v2",
        value: new THREE.Vector2(
          this.x / this.windowSize.w + 0.5,
          this.y / this.windowSize.h + 0.5
        ),
      },
      u_uvSize: {
        type: "v2",
        value: new THREE.Vector2(
          this.windowSize.w / this.w,
          this.windowSize.h / this.h
        ),
      },
    };
    // console.log(this.uniforms.u_uvPosition.value);
    const geo = new THREE.PlaneGeometry(this.w, this.h, 32, 32);
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      // emissive: 0x072534,
      // flatShading: true,
      // transparent: true,
      // opacity: 0.4,
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
    // console.log(mat.color);
    // mat.color.r = Math.random();
    // mat.color.g = Math.random();
    // mat.color.b = Math.random();
    this.mesh = new THREE.Mesh(geo, mat);
    // console.log(this.mesh.position);
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = 0;
    // this.mesh.scale.x = 1;
    // this.mesh.scale.y = 1;

    // this.mesh.rotation.x = 100;
    // this.mesh.rotation.y = (Math.PI / 180) * 100;
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

    // scale animation
    //------------------
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
    //------------------

    // console.log(this.scale.now);
    // this.position.range += (1 - this.position.range) * this.position.speed;

    // this.position.x +=
    //   (this.x * this.position.range - this.position.x) * this.position.ease;
    // this.position.y +=
    //   (this.y * this.position.range - this.position.y) * this.position.ease;
    // console.log(this.position.range);

    // if (this.position.range > 0.999) {
    //   this.changePosition();
    // }

    // this.position.x += (this.x - this.position.x) * this.scale.now;
    // this.position.y += (this.y - this.position.y) * this.scale.now;
    // if (this.x - this.position.x < 0.001) {
    //   this.changePosition();
    // }

    // console.log(this.scale.now);
    this.mesh.scale.x = this.scale.now;
    this.mesh.scale.y = this.scale.now;
    // this.mesh.rotation.y = (Math.PI / 180) * 90 * this.scale.now;
    // this.mesh.rotation.x += 0.1;
    // this.mesh.rotation.y += 0.1;
    // this.mesh.rotation.z += 0.1;
    // this.mesh.position.x = this.position.x;
    // this.mesh.position.y = this.position.y;
    // (this.uniforms.u_uvPosition.value.x =
    //   this.position.x / this.windowSize.w + 0.5),
    //   (this.uniforms.u_uvPosition.value.y =
    //     this.position.y / this.windowSize.h + 0.5);
    // if (this.index === 0) {
    //   console.log(this.position.x, this.position.y);
    // }
  }

  changePosition() {
    const { x, y } = this.positionRandom();
    // if (this.index === 0) {
    //   console.log(x, y);
    // }

    // this.position.x = this.x;
    // this.position.y = this.y;
    // this.position.range = 0;
    this.x = x;
    this.y = y;
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    (this.uniforms.u_uvPosition.value.x = x / this.windowSize.w + 0.5),
      (this.uniforms.u_uvPosition.value.y = y / this.windowSize.h + 0.5);
  }
}
