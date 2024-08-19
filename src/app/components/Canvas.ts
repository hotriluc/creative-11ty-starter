import {
  Renderer,
  Camera,
  Transform,
  OGLRenderingContext,
  Program,
  Mesh,
  Texture,
  Text,
  Geometry,
  Plane,
  Color,
  Vec2,
} from "ogl";

import sketchVertexShader from "@app/shaders/sketch/vertex.glsl";
import sketchFragmentShader from "@app/shaders/sketch/fragment.glsl";

import textVertexShader from "@app/shaders/text/vertex.glsl";
import textFragmentShader from "@app/shaders/text/fragment.glsl";

const vertex100 =
  /* glsl */ `
` + textVertexShader;

const fragment100 =
  /* glsl */ `#extension GL_OES_standard_derivatives : enable
precision highp float;
` + textFragmentShader;

const vertex300 =
  /* glsl */ `#version 300 es
#define attribute in
#define varying out
` + textVertexShader;

const fragment300 =
  /* glsl */ `#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;
` + textFragmentShader;

export default class Canvas {
  canvas: HTMLCanvasElement;

  renderer!: Renderer;
  gl!: OGLRenderingContext;
  camera!: Camera;
  scene!: Transform;

  time = 0.0;
  mesh!: Mesh;
  program: Program | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.createRenderer();
    this.createCamera();
    this.createScene();

    // Add objects to the scene
    // this.addPlane();
    this.addText();

    // Events
    this.onResize();
    this.update();
    this.bindEvents();
  }

  // Setup Renderer and GL Context
  createRenderer() {
    this.renderer = new Renderer({
      canvas: this.canvas,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    this.gl = this.renderer.gl;
  }

  // Setup the camera
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 600;
    this.camera.perspective({ far: 1000, near: 10 });
  }

  // Setup the scene
  createScene() {
    this.scene = new Transform();
  }

  addPlane() {
    const geometry = new Plane(this.gl, { height: 500, width: 500 });
    this.program = new Program(this.gl, {
      vertex: sketchVertexShader,
      fragment: sketchFragmentShader,
      uniforms: {
        uColor: { value: new Color("#c0cfb2") },
      },
    });
    this.mesh = new Mesh(this.gl, { geometry, program: this.program });
    this.mesh.setParent(this.scene);
  }

  async addText() {
    const texture = new Texture(this.gl, {
      generateMipmaps: false,
    });
    const img = new Image();
    img.onload = () => (texture.image = img);
    img.src = "/assets/fonts/inter.png";

    const program = new Program(this.gl, {
      // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
      vertex: this.renderer.isWebgl2 ? vertex300 : vertex100,
      fragment: this.renderer.isWebgl2 ? fragment300 : fragment100,
      uniforms: {
        tMap: { value: texture },
        uResolution: {
          value: new Vec2(window.innerWidth, window.innerHeight),
        },
      },
      transparent: true,
      cullFace: false,
      depthWrite: false,
    });

    (await fetch("/assets/fonts/inter.json")).json().then((font) => {
      const text = new Text({
        font,
        text: "nopanic",
        width: 200,
        align: "center",
        letterSpacing: -0.05,
        size: 200,
        lineHeight: 1,
      });

      // Pass the generated buffers into a geometry
      const geometry = new Geometry(this.gl, {
        position: { size: 3, data: text.buffers.position },
        uv: { size: 2, data: text.buffers.uv },
        // id provides a per-character index, for effects that may require it
        id: { size: 1, data: text.buffers.id },
        index: { data: text.buffers.index },
      });
      const mesh = new Mesh(this.gl, { geometry, program });
      mesh.position.y = text.height * 0.5;

      mesh.setParent(this.scene);
    });
  }

  // Main tick from where we invoke other components to update
  update() {
    // t?: number
    this.time += 0.015;

    // this.mesh.rotation.y += 0.03 / 20;

    this.renderer.render({ scene: this.scene, camera: this.camera });
    window.requestAnimationFrame(this.update.bind(this));
  }

  // Event Handlers
  onResize() {
    const { screen } = window.APP.ScreenManager;

    // Recalculate viewport sizes
    this.renderer.setSize(screen.width, screen.height);

    // make 1px = 1 webgl unit
    this.camera.fov =
      2 *
      (Math.atan((screen.height * 0.5) / this.camera.position.z) *
        (180 / Math.PI));
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });
  }

  // Events binding
  bindEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
