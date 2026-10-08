import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import TemplateCanvas from "../../TemplateCanvas";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";

export default class Canvas extends TemplateCanvas {
  init() {
    this.createPlate();
    this.mouseEase = 0.05;
  }

  createPlate() {
    this.geo = new THREE.PlaneGeometry(this.w, this.h, 32, 32);
    //this.geo = new THREE.BoxGeometry(320, 320, 320);
    this.mat = new THREE.ShaderMaterial({
      uniforms:this.uniforms,
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.scene.add(this.mesh);
    this.mesh.position.set(0, 0, 0);
  }

  render() {
    if (this.mesh) {
      // this.mesh.rotation.y += 0.01;
      // this.mesh.rotation.x += 0.01;
      // console.log('time', this.time);
      // this.geo.parameters.width = this.w;
      // this.geo.parameters.height = this.h;
      // console.log(this.geo.parameters);
    }
  }

  positionRandom() {
    const x = this.range(this.xRange * (this.w / 2));
    const y = this.range(this.yRange * (this.h / 2));

    return { x, y };
  }
}
