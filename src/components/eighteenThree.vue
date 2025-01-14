<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const containerRef = ref(null);
let controls = null;

var camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  50,
  3000
);

camera.position.set(300, 300, 300);
camera.lookAt(0, 0, 0);

var scene = new THREE.Scene();

var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

var gridHelper = new THREE.GridHelper(100, 100);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);

// // 创建射线对象Ray
// const ray = new THREE.Ray();
// ray.origin.set(1, 0, 1);
// ray.direction.set(1, 0, 0);

// // 创建一个箭头辅助对象来可视化射线
// const arrowHelper = new THREE.ArrowHelper(ray.direction, ray.origin, 10, 0xff0000);
// scene.add(arrowHelper);

// // 三角形三个点坐标
// const p1 = new THREE.Vector3(10, 2, 0);
// const p2 = new THREE.Vector3(10, -2, 2);
// const p3 = new THREE.Vector3(10, -2, -2);
// const point = new THREE.Vector3(); // 用来记录射线和三角形的交叉点
// const result = ray.intersectTriangle(p1, p2, p3, false, point);
// console.log('交叉点坐标', point);
// console.log('查看是否相交', result);

// // 创建三角形的几何体
// const triangleGeometry = new THREE.BufferGeometry();
// const vertices = new Float32Array([
//   p1.x, p1.y, p1.z,
//   p2.x, p2.y, p2.z,
//   p3.x, p3.y, p3.z,
// ]);
// triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// // 创建材质
// const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide });

// // 创建三角形网格
// const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
// scene.add(triangleMesh);

/**********************************射线拾取********************************/ 
// const geometry = new THREE.SphereGeometry(25, 50, 50);
// const material = new THREE.MeshLambertMaterial({
//   color: 0x009999,
// });
// const mesh1 = new THREE.Mesh(geometry, material);
// const mesh2 = mesh1.clone();
// mesh2.position.y = 100;
// const mesh3 = mesh1.clone();
// mesh3.position.x = 100;
// const model = new THREE.Group();
// model.add(mesh1, mesh2, mesh3);
// model.updateMatrixWorld(true);
// scene.add(model);

// const raycaster = new THREE.Raycaster();
// console.log('射线属性', raycaster.ray);

// // 设置射线起点
// raycaster.ray.origin = new THREE.Vector3(-100, 0, 0);
// // 设置射线方向射线方向沿着x轴
// raycaster.ray.direction = new THREE.Vector3(1, 0, 0);

// // 射线发射拾取模型对象
// const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);
// console.log("射线器返回的对象", intersects);
// if (intersects.length > 0) {
//   console.log("交叉点坐标", intersects[0].point);
//   console.log("交叉对象", intersects[0].object);
//   console.log("射线原点和交叉点距离", intersects[0].distance);
//   intersects[0].object.material.color.set(0xff0000);
// }

/*****************************************************************/ 

/*****************Raycaster(鼠标点击选中模型)**********************/

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

onMounted(() => {
  const geometry = new THREE.SphereGeometry(25, 50, 50);
const material = new THREE.MeshLambertMaterial({
  color: 0x009999,
});
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = mesh1.clone();
mesh2.position.y = 100;
const mesh3 = mesh1.clone();
mesh3.position.x = 100;
const model = new THREE.Group ();
model.add(mesh1, mesh2, mesh3);
model.updateMatrixWorld(true);
scene.add(model);

// sprite.change = function(){
//   mesh.material.color.set(0xffffff);
// }
// sprite2.change = function(){
//   mesh.material.color.set(0xffff00);
// }


// const raycaster = new THREE.Raycaster();
// console.log('射线属性', raycaster.ray);

// // 设置射线起点
// raycaster.ray.origin = new THREE.Vector3(-100, 0, 0);
// // 设置射线方向射线方向沿着x轴
// raycaster.ray.direction = new THREE.Vector3(1, 0, 0);

// // 射线发射拾取模型对象
// const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);
// console.log("射线器返回的对象", intersects);
// if (intersects.length > 0) {
//   console.log("交叉点坐标", intersects[0].point);
//   console.log("交叉对象", intersects[0].object);
//   console.log("射线原点和交叉点距离", intersects[0].distance);
//   intersects[0].object.material.color.set(0xff0000);
// }

  containerRef.value.appendChild(renderer.domElement);
  render();
  controls = new OrbitControls(camera, renderer.domElement);
  window.onresize = function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  
  renderer.domElement.addEventListener('click', function (event) {
    console.log(123);
    const px = event.offsetX;
    const py = event.offsetY;
    const x = (px / renderer.domElement.clientWidth) * 2 - 1;
    const y = -(py / renderer.domElement.clientHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);
    console.log("射线器返回的对象", intersects);
    if (intersects.length > 0) {
      intersects[0].object.material.color.set(0xff0000);
    }
  });
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style lang="stylus" scoped></style>
