import * as THREE from "three";
import TemplateCanvas from "../../TemplateCanvas";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";

export default class Canvas extends TemplateCanvas {
  init() {
    this.createPlanes();
  }

  createPlanes() {
    this.makeRenderTarget();
    this.makeRenderTarget_01();
    this.makeRenderTarget_02();
    this.makeRenderTarget_03();
    this.makeBox(this.rtScene, this.rt01.texture);
    this.makeBox(this.rt01Scene, this.rt02.texture);
    this.makeBox(this.rt02Scene, this.rt03.texture);
    this.makeBox(this.rt03Scene, this.rt01.texture);

    const geo = new THREE.PlaneGeometry(this.w, this.h, 32, 32);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: this.renderTarget.texture,
      side: THREE.DoubleSide,
    });
    // const mat = new THREE.ShaderMaterial({
    //   vertexShader,
    //   fragmentShader,
    //   treansparent: true,
    //   depthTest: true,
    //   side: THREE.DoubleSide,
    //   uniforms: {
    //     tDiffuse: {
    //       value: this.renderTarget.texture,
    //     },
    //     time: { value: 0 },
    //   },
    // });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0, 0, 0);

    this.scene.add(this.mesh);

    this.makeRenderTarget();
  }
  makeRenderTarget() {
    this.renderTarget = new THREE.WebGLRenderTarget(this.w, this.h, {
      // magFilter: THREE.NearestFilter,
      // minFilter: THREE.NearestFilter,
      // wrapS: THREE.ClampToEdgeWrapping,
      // wrapT: THREE.ClampToEdgeWrapping,
      color: 0x00ff00,
    });
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = this.h / 2 / Math.tan(fovRad);
    this.rtCamera = new THREE.PerspectiveCamera(
      fov,
      this.w / this.h,
      1,
      dist * 2
    );
    this.rtCamera.position.z = dist;
    this.rtScene = new THREE.Scene();
    this.rtLight = new THREE.DirectionalLight(0xffffff);
    this.rtLight.position.set(400, 400, 400);
    this.rtScene.add(this.rtLight);
    // this.renderer.render(this.rtScene, this.rtCamera);
  }

  makeRenderTarget_01() {
    this.rt01 = new THREE.WebGLRenderTarget(this.w, this.h, {
      color: 0x00ff00,
    });
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = this.h / 2 / Math.tan(fovRad);
    this.rt01Camera = new THREE.PerspectiveCamera(
      fov,
      this.w / this.h,
      1,
      dist * 2
    );
    this.rt01Camera.position.z = dist;
    this.rt01Scene = new THREE.Scene();
    this.rt01Light = new THREE.DirectionalLight(0xffffff);
    this.rt01Light.position.set(400, 400, 400);
    this.rt01Scene.add(this.rt01Light);
    // this.renderer.render(this.rtScene, this.rtCamera);
  }

  makeRenderTarget_02() {
    this.rt02 = new THREE.WebGLRenderTarget(this.w, this.h, {
      color: 0x00ff00,
    });
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = this.h / 2 / Math.tan(fovRad);
    this.rt02Camera = new THREE.PerspectiveCamera(
      fov,
      this.w / this.h,
      1,
      dist * 2
    );
    this.rt02Camera.position.z = dist;
    this.rt02Scene = new THREE.Scene();
    this.rt02Light = new THREE.DirectionalLight(0xffffff);
    this.rt02Light.position.set(400, 400, 400);
    this.rt02Scene.add(this.rt02Light);
  }

  makeRenderTarget_03() {
    this.rt03 = new THREE.WebGLRenderTarget(this.w, this.h, {
      color: 0x00ff00,
    });
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = this.h / 2 / Math.tan(fovRad);
    this.rt03Camera = new THREE.PerspectiveCamera(
      fov,
      this.w / this.h,
      1,
      dist * 2
    );
    this.rt03Camera.position.z = dist;
    this.rt03Scene = new THREE.Scene();
    this.rt03Light = new THREE.DirectionalLight(0xffffff);
    this.rt03Light.position.set(400, 400, 400);
    this.rt03Scene.add(this.rt03Light);
  }

  makeBox(sceneTarget, mapTexture) {
    const geo = new THREE.BoxGeometry(this.w / 2, this.w / 2, this.w / 2);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      map: mapTexture,
    });
    const mesh = new THREE.Mesh(geo, mat);
    sceneTarget.add(mesh);
  }

  render() {
    // this.renderer.setClearColor(0x115558, 1.0);
    if (this.renderTarget && this.rtScene && this.rtCamera) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.render(this.rtScene, this.rtCamera);
      // this.renderer.setRenderTarget(null);
    }

    // this.mesh.material.uniforms.time.value += 1;

    // this.rtMesh.rotation.y += 0.01;
    // this.rtMesh.rotation.x += 0.01;

    if (this.rt01 && this.rt01Scene && this.rt01Camera) {
      this.renderer.setClearColor(0xff0000, 1.0);
      this.renderer.setRenderTarget(this.rt01);
      this.renderer.render(this.rt01Scene, this.rt01Camera);
      // this.renderer.setRenderTarget(null);
    }
    if (this.rt02 && this.rt02Scene && this.rt02Camera) {
      this.renderer.setClearColor(0x00ff00, 1.0);
      this.renderer.setRenderTarget(this.rt02);
      this.renderer.render(this.rt02Scene, this.rt02Camera);
      // this.renderer.setRenderTarget(null);
    }
    if (this.rt03 && this.rt03Scene && this.rt03Camera) {
      this.renderer.setClearColor(0x0000ff, 1.0);
      this.renderer.setRenderTarget(this.rt03);
      this.renderer.render(this.rt03Scene, this.rt03Camera);
    }
    this.renderer.setRenderTarget(null);
  }

  positionRandom() {
    const x = this.range(this.xRange * (this.w / 2));
    const y = this.range(this.yRange * (this.h / 2));

    return { x, y };
  }
}
