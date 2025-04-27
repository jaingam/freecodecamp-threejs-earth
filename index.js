import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
// import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const loader = new THREE.TextureLoader;

const earthGroup = new THREE.Group()
earthGroup.rotation.z = -23.4 * Math.PI / 180
const geometry = new THREE.IcosahedronGeometry(5, 3);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/earthmap1k.jpg",),
  lightMap: loader.load("./textures/earthlights1k.jpg"),
  bumpMap: loader.load("./textures/earthbump1k.jpg"),
  bumpScale: 0.1,
  specularMap: loader.load("./textures/earthspec1k.jpg"),
  specular: 0xFFFFFF
});
const earthMesh = new THREE.Mesh(geometry, material);


const lightsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earthlights1k.jpg"),
  blending: THREE.AdditiveBlending
});
const lightMesh = new THREE.Mesh(geometry, lightsMat);
const cloudsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earthcloudmap.jpg"),
  alphaMap: loader.load("./textures/earthcloudmap.jpg"),
  blendColor: 0x000000,
  transparent: true,
  opacity: 0.3,
  color: 0xFFFFFF,
  blending: THREE.AdditiveBlending
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.01);
const earthLight = new THREE.PointLight(0xff0000, 1);
earthMesh.add(earthLight)
earthGroup.add(earthMesh);
earthGroup.add(lightMesh);
earthGroup.add(cloudsMesh);

scene.add(earthGroup);

const sunMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/sunmap.jpg",),
  emissiveMap: loader.load("./textures/sunmap.jpg"),
  emissive: 0xFFFFFF,
  emissiveIntensity: 1
});

const sunGeometry = new THREE.IcosahedronGeometry(20, 5);
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

const sunLight = new THREE.PointLight(0xffffff, 50, 0, 1);
sunMesh.add(sunLight)
sunMesh.position.set(0, 0, 0)
earthGroup.position.set(50, 0, 0)


scene.add(sunMesh);

camera.position.z = 100;

const earthPath = new THREE.EllipseCurve(

  0, 0,            // ax, aY
  50, 50,           // xRadius, yRadius
  0, 2 * Math.PI,  // aStartAngle, aEndAngle
  false,            // aClockwise
  Math.PI / 2                 // aRotation
);

let fraction = 0;
function animate() {
  earthGroup.rotation.y += Math.PI*2/100;
  cloudsMesh.rotation.y += 0.002;
  fraction += Math.PI/18000;

  if (fraction > 1) {
    fraction = 0;
  }
  let earthPos = earthPath.getPointAt(fraction)
  earthGroup.position.set(earthPos.x, 0, earthPos.y);
  renderer.render(scene, camera);

  controls.update();
}
renderer.setAnimationLoop(animate);
