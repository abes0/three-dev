import * as THREE from "three";
import gsap from "gsap";

export default class CRolloverMesh {
  constructor({ el, group, id, scrollY, width, height }) {
    this.rect = el.getBoundingClientRect();
    this.group = group;
    this.id = id;
    this.w = width;
    this.h = height;
    this.center = {};
    this.mesh = {};

    this.targetX = 0;
    this.nowX = 0;
    this.ease = 0.05;
    this.offsetY = 0;

    this.removeTargetX = 0;
    this.removeFlag = false;

    this.isOver = false;
    this.isPlaying = false;

    this.init(scrollY);
  }
  init(scrollY) {
    const depth = this.rect.height / 4;
    const geo = new THREE.BoxGeometry(this.rect.width, this.rect.height, depth);

    // const mat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const mat = new THREE.MeshLambertMaterial({
      color: 0xaabbcc * Math.random(),
      emissive: 0x072534,
      // flatShading: true,
      transparent: true,
      opacity: 0.6,
    });

    this.mesh = new THREE.Mesh(geo, mat);

    const center = new THREE.Vector2(
      this.rect.x + this.rect.width / 2,
      this.rect.y + this.rect.height / 2
    );
    const diff = new THREE.Vector2(
      center.x - this.w / 2,
      center.y - this.h / 2
    );
    this.targetX = diff.x;
    this.nowX = -center.x * 2;
    this.removeTargetX = -center.x * 2 - depth * 2;
    this.mesh.position.set(this.removeTargetX, -(diff.y + scrollY), -depth / 2);
    this.mesh.name = this.id;
    this.offsetY = this.mesh.position.y;

    this.group.add(this.mesh);

    this._eRollOver();
  }
  animation(scrollY) {
    if (this.mesh) {
      this.mesh.position.y = this.offsetY + scrollY;
    }
  }

  _eRollOver() {
    this.isOver = true;
    if (!this.isPlaying) {
      this._startRollOver();
    }
  }
  _eRollOut() {
    this.isOver = false;
    if (!this.isPlaying) {
      this._startRollOut();
    }
  }
  _startRollOver() {
    this.isPlaying = true;
    gsap.to(this.mesh.position, {
      x: this.targetX,
      duration: 0.5,
      ease: "power4.out",
      onComplete: this._eCompleteRollOver.bind(this),
    });
  }
  _startRollOut() {
    this.isPlaying = true;
    gsap.to(this.mesh.position, {
      x: this.removeTargetX,
      duration: 0.5,
      ease: "power4.out",
      onComplete: this._eCompleteRollOut.bind(this),
    });
  }
  _eCompleteRollOver() {
    this.isPlaying = false;
    if (!this.isOver) {
      this._startRollOut();
    }
  }
  _eCompleteRollOut() {
    this.isPlaying = false;
    if (this.isOver) {
      this._startRollOver();
    }
  }
}
