import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const canvas = document.getElementById('app');

let canvasHeight = canvas.parentElement.clientHeight;
let canvasWidth = canvas.parentElement.clientWidth;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas
});
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(0x000000, 1.0);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvasWidth / canvasHeight
  );
camera.layers.enableAll();
camera.position.z = 15;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//bloom renderer
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1,
  0,
  0
);
bloomPass.strength = 10;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderPass);
bloomComposer.addPass(bloomPass);

//object
const geometry = new THREE.SphereBufferGeometry(0.1, 8, 10);
const material = new THREE.MeshBasicMaterial({
  color: '#FF0000'
});
const mesh = new THREE.Mesh(geometry, material);
mesh.layers.set();
scene.add(mesh);

renderer.setAnimationLoop(time => {
  controls.update();
  renderer.render(scene, camera)
  bloomComposer.render();
  mesh.position.x = (3 * Math.sin(0.010 * time)) - (Math.sin(0.030 * time))
  mesh.position.y = 3.25 * Math.cos(0.010 * time) - 1.25 * Math.cos(0.020 * time) - 0.50 * Math.cos(0.040 * time)
});

//generate all positions first
  
window.addEventListener('resize', event => {
  canvasHeight = canvas.parentElement.clientHeight;
  canvasWidth = canvas.parentElement.clientWidth;
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(
    canvasWidth,
    canvasHeight
  );
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
});