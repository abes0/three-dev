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

    this.scene = new THREE.Scene();

    this.text = {
      content: [..."Love the life you live. Live the life you love."],
      size: 0,
    };
    this.text.size = this.w / this.text.content.length;
    this.curning = {
      text: ["i", "l", " ", "."],
      halfText: ["f", "t", "r"],
      addText: ["m", "w", "W"],
      halfAddText: ["A", "B", "C", "D", "E", "F", "G", "H", "K", "O", "T", "W"],
      twiceAddText: [],
      number: 0,
      margin: 0,
    };
    this.curning.margin =
      this.text.content.filter((letter) => {
        return this.curning.text.includes(letter);
      }).length +
      this.text.content.filter((letter) => {
        return this.curning.halfText.includes(letter);
      }).length /
        2 -
      this.text.content.filter((letter) => {
        return this.curning.addText.includes(letter);
      }).length -
      this.text.content.filter((letter) => {
        return this.curning.halfAddText.includes(letter);
      }).length /
        2 -
      this.text.content.filter((letter) => {
        return this.curning.twiceAddText.includes(letter);
      }).length *
        2;
    console.log("margin: ", this.curning.margin, this.text.content);
    this.size = 100;
    this.number = 1;
    this.params = [];
    this.color = {
      default: 0xbb3333,
      now: 0xbb3333,
    };

    for (let i = 0; i < this.text.content.length; i++) {
      this.init(i);
    }

    this.light = new THREE.DirectionalLight(0xffffff, 1, 100);
    this.light.position.set(300, 300, dist * 2);
    this.scene.add(this.light);

    this.renderer.render(this.scene, this.camera);
    console.log(this.scene);

    this.render();
  }

  init(id) {
    const target = {
      x: 0,
      y: 0,
      rotation: {
        x: (Math.PI / 180) * this.random(180, 360),
        y: (Math.PI / 180) * this.random(180, 360),
        z: (Math.PI / 180) * this.random(180, 360),
      },
    };

    const dir = {
      x: this.random(-0.5, 0.5),
      y: this.random(-0.5, 0.5),
    };

    const now = {
      x: 0,
      y: 0,
      rotation: {
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z,
      },
    };
    const loader = new THREE.FontLoader();
    loader.load("/helvetiker_bold.typeface.json", (font) => {
      const geo = new THREE.TextGeometry(this.text.content[id], {
        font: font,
        size: this.text.size * 1.2,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 5,
        bevelSize: 50 / this.text.content.length,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      const mat = new THREE.MeshToonMaterial({
        color: this.color.default,
        // emissive: 0x072534,
        // flatShading: true,
        // transparent: true,
        // opacity: 0.4,
      });

      const mesh = new THREE.Mesh(geo, mat);
      if (id > 0) {
        if (this.curning.text.includes(this.text.content[id - 1])) {
          this.curning.number++;
        }
        if (this.curning.halfText.includes(this.text.content[id - 1])) {
          this.curning.number += 0.5;
        }
        if (this.curning.addText.includes(this.text.content[id - 1])) {
          this.curning.number--;
        }
        if (this.curning.halfAddText.includes(this.text.content[id - 1])) {
          this.curning.number -= 0.5;
        }
        if (this.curning.twiceAddText.includes(this.text.content[id - 1])) {
          this.curning.number -= 2.0;
        }
      }
      target.x =
        id < this.text.content.length / 2
          ? this.text.size *
              -(
                this.text.content.length / 2 -
                (id - 0.5 * this.curning.number)
              ) +
            (this.text.size * this.curning.margin) / 4
          : this.text.size *
              (id - 0.5 * this.curning.number - this.text.content.length / 2) +
            (this.text.size * this.curning.margin) / 4;

      now.x = dir.x === 0 ? target.x : target.x + this.w * dir.x;
      now.y = dir.y === 0 ? target.y : target.y + this.h * dir.y;

      mesh.position.x = target.x;
      mesh.position.y = target.y;
      mesh.rotation.set(now.rotation.x, now.rotation.y, now.rotation.z);
      this.scene.add(mesh);
    });

    this.params.push({
      target,
      dir,
      now,
    });
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

  toRGB(hexcolor) {
    return {
      r: Math.floor(hexcolor / 65536),
      g: Math.floor(hexcolor % 65536) / 256,
      b: hexcolor % 256,
    };
  }

  mouseMoved(x, y) {}

  animation(mesh, id) {
    const { target, dir, now } = this.params[id];
    const x = target.x + dir.x * this.w * (1 - this.scrollProgress);
    const y = target.y + dir.y * this.h * (1 - this.scrollProgress);
    now.x += (x - now.x) * 0.1;
    now.y += (y - now.y) * 0.1;
    now.rotation.x = target.rotation.x * (1 - this.scrollProgress);
    now.rotation.y = target.rotation.y * (1 - this.scrollProgress);
    now.rotation.z = target.rotation.z * (1 - this.scrollProgress);

    mesh.position.x = now.x;
    mesh.position.y = now.y;
    mesh.rotation.x = now.rotation.x;
    mesh.rotation.y = now.rotation.y;
    mesh.rotation.z = now.rotation.z;
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    this.scrollY = window.pageYOffset;
    this.scrollProgress = this.scrollY / (document.body.clientHeight - this.h);
    console.log(this.scrollY, document.body.clientHeight, this.scrollProgress);

    for (let j = 0; j < this.text.content.length; j++) {
      if (this.scene.children[j + 1]) {
        this.animation(this.scene.children[j + 1], j);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
