// import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import TemplateCanvas from "../../TemplateCanvas";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";
import * as THREE from "./three";

export default class Canvas {
  constructor() {
    this.renderer = undefined;
    this.mainScene = undefined;
    this.mainCamera = undefined;
    this.capScene = undefined;
    this.capTag = undefined;
    this.mesh = undefined;
    this.dest = undefined;
    this.init();
  }
  init() {
    const sw = innerWidth;
    const sh = innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#canvas-container"),
      alpha: true,
      antialias: false,
      stencil: false,
      powerPreference: "low-power",
    });
    this.renderer.autoClear = true;

    this.mainScene = new THREE.Scene();

    this.mainCamera = new THREE.PerspectiveCamera(80, 1, 0.1, 50000);

    this.capScene = new THREE.Scene();

    this.capTg = new THREE.WebGLRenderTarget(16, 16);

    //capture用のbox
    this.mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x967a2c,
      })
    );
    this.capScene.add(this.mesh);

    //メインシーンの板ポリ
    this.dest = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      // new THREE.MeshBasicMaterial({
      //   color: 0xff0000,
      // })
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: true,
        side: THREE.DoubleSide,
        uniforms: {
          tDiffuse: {
            value: this.capTg.texture,
          },
          time: { value: 0 },
        },
      })
    );
    this.mainScene.add(this.dest);

    this.update();
  }

  update() {
    requestAnimationFrame(this.update.bind(this));

    const sw = innerWidth;
    const sh = innerHeight;

    this.mainCamera.aspect = sw / sh;
    this.mainCamera.updateProjectionMatrix();
    this.mainCamera.position.z =
      sh / Math.tan((this.mainCamera.fov * Math.PI) / 360) / 2;

    this.renderer.setClearColor(0xf2cdd1, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(sw, sh);

    this.mesh.scale.set(sw * 0.2, sw * 0.2, sw * 0.2);
    this.mesh.rotation.x += 0.005;
    this.mesh.rotation.y -= 0.006;
    this.mesh.rotation.z += 0.011;

    this.capTg.setSize(
      sw * window.devicePixelRatio,
      sh * window.devicePixelRatio
    );

    this.renderer.setRenderTarget(this.capTg, true);
    this.renderer.render(this.capScene, this.mainCamera, this.capTg);

    this.dest.material.uniforms.time.value += 1;
    this.dest.scale.set(sw, sh, 1);
    this.renderer.render(this.mainScene, this.mainCamera);
  }
}
