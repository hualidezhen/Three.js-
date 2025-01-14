<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// vue 不要DOM
const containerRef = ref(null);
let controls = null;
// 透视相机
var camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1, // 最近距离
  1000 // 最远距离
);

//创建一个空的几何体对象
const geometry = new THREE.BufferGeometry();

//类型化数组创建顶点数据
const vertices1 = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  50,
  0,
  0, //顶点2坐标
  0,
  100,
  0, //顶点3坐标
  0,
  0,
  10, //顶点4坐标
  0,
  0,
  100, //顶点5坐标
  50,
  0,
  10, //顶点6坐标
]);

const vertices2 = new Float32Array([
  0,
  0,
  0, //顶点1坐标
  80,
  0,
  0, //顶点2坐标
  80,
  80,
  0, //顶点3坐标

  0,
  0,
  0, //顶点4坐标   和顶点1位置相同
  80,
  80,
  0, //顶点5坐标  和顶点3位置相同
  0,
  80,
  0, //顶点6坐标
]);

const vertices3 = new Float32Array([
  0,
  0,
  0, //顶点1坐标 0 索引
  80,
  0,
  0, //顶点2坐标 1
  80,
  80,
  0, //顶点3坐标 2
  0,
  80,
  0, //顶点4坐标 3
]);

// Uint16Array类型数组创建顶点索引数据
const indexes = new Uint16Array([
  // 下面索引值对应顶点位置数据中的顶点坐标
  0, 1, 2, 0, 2, 3,
]);

// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
// const attribue = new THREE.BufferAttribute(vertices1, 3);
const attribue = new THREE.BufferAttribute(vertices3, 3);
// 索引数据赋值给几何体的index属性
geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组

// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

// 点渲染模式
const pointMaterial = new THREE.PointsMaterial({
  color: 0xffff00,
  size: 10.0, //点对象像素尺寸
});

// 线材质对象
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff0000, //线条颜色
});

const points = new THREE.Points(geometry, pointMaterial); //点模型对象
// const line = new THREE.Line(geometry, lineMaterial);//线模型
// // 闭合线条
const line = new THREE.LineLoop(geometry, lineMaterial);
// //非连续的线条
// const line = new THREE.LineSegments(geometry, lineMaterial);

camera.position.set(200, 200, 200);

// scene
var scene = new THREE.Scene();

// scene.add(points);
// scene.add(line);

// // 矩形平面，无索引，两个三角形，6个顶点
// // 每个顶点的法线数据和顶点位置数据一一对应
// const normals = new Float32Array([
//     0, 0, 1, //顶点1法线( 法向量 )
//     0, 0, 1, //顶点2法线
//     0, 0, 1, //顶点3法线
//     0, 0, 1, //顶点4法线
//     0, 0, 1, //顶点5法线
//     0, 0, 1, //顶点6法线
// ]);
// // 设置几何体的顶点法线属性.attributes.normal
// geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

// const material = new THREE.MeshLambertMaterial({
//     color: 0x0000ff,
//     side: THREE.DoubleSide, //两面可见
//     wireframe:true,//线条模式渲染mesh对应的三角形数据
// });

// var mesh = new THREE.Mesh(geometry, material); //高光网格模型对象Mesh
// scene.add(mesh);

// const geometry1 = new THREE.PlaneGeometry(100,50,2,1); //矩形平面几何体
const geometry1 = new THREE.SphereGeometry(50, 64, 32); //球体

const material = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide, //两面可见
  wireframe: true, //线条模式渲染mesh对应的三角形数据
});

// 几何体xyz三个方向都放大2倍
geometry1.scale(1.5, 1.5, 1.5);
// 几何体沿着x轴平移50
geometry1.translate(50, 0, 0);
// 几何体绕着x轴旋转45度
geometry1.rotateX(Math.PI / 4);
// 几何体旋转、缩放或平移之后，查看几何体顶点位置坐标的变化
// BufferGeometry的旋转、缩放、平移等方法本质上就是改变顶点的位置坐标
console.log('顶点位置数据', geometry.attributes.position);


var mesh = new THREE.Mesh(geometry1, material); //高光网格模型对象Mesh
scene.add(mesh);

console.log("几何体", geometry1);
console.log("顶点位置数据", geometry1.attributes.position);
console.log("顶点索引数据", geometry1.index);

// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

//网格地面 比例大小的参照物
// var gridHelper = new THREE.GridHelper(100, 100);
// gridHelper.material.opacity = 0.2;
// gridHelper.material.transparent = true;
// scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.8);

const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  containerRef.value.appendChild(renderer.domElement);
};

onMounted(() => {
  render();
  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style lang="stylus" scoped></style>
