import * as THREE from "three";
import "core-js/stable";
import "regenerator-runtime/runtime";
import TemplateCanvas from "../../TemplateCanvas";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Canvas extends TemplateCanvas {
  init() {
    this.createPlate();
    this.mouseEase = 0.05;
  }

  createPlate() {
    console.log('createPlate');
    const curve = new THREE.EllipseCurve(
      0,  0,            // ax, aY
      100, 30,           // xRadius, yRadius
      0,  2 * Math.PI,  // aStartAngle, aEndAngle
      false,            // aClockwise
      0                 // aRotation
    );
    const points = curve.getPoints( 50 );
    this.geo = new THREE.BufferGeometry().setFromPoints( points );
    // new THREE.PlaneGeometry(100, 30, 32, 32);
    //this.geo = new THREE.BoxGeometry(320, 320, 320);
    this.mat = new THREE.MeshBasicMaterial()
    //  new THREE.LineBasicMaterial( { color: 0xff0000 } );
    // this.mat = new THREE.ShaderMaterial({
    //   uniforms:this.uniforms,
    //   vertexShader,
    //   fragmentShader,
    // });
    // this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh = new THREE.Line( this.geo, this.mat );
    this.scene.add(this.mesh);
    this.mesh.position.set(0, 0, 0);
  }

  render() {
    if (this.mesh) {
      // const choice = this.randomInt(0, 3);
      // const distance = 5;
      // this.mouse.x += this.random(-distance, distance) / this.w;
      // this.mouse.y += this.random(-distance, distance) / this.h;
    }
  }

  positionRandom() {
    const x = this.range(this.xRange * (this.w / 2));
    const y = this.range(this.yRange * (this.h / 2));

    return { x, y };
  }
}
