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

camera.position.set(100, 100, 100);

// scene
var scene = new THREE.Scene();
/*******************拉伸*****************************/

const length = 12,
  width = 8;

const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, width);
shape.lineTo(length, width);
shape.lineTo(length, 0);
shape.lineTo(0, 0);

const extrudeSettings = {
  steps: 2,
  depth: 16,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 1,
};

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshBasicMaterial({
  color: 0x004444,
  transparent: true,
  opacity: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);

// 长方体作为EdgesGeometry参数创建一个新的几何体
const edges = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({
  color: 0x00ffff,
});
const line = new THREE.LineSegments(edges, edgesMaterial);
mesh.add(line);
scene.add(mesh);

// // Shape内孔轮廓
// const path1 = new THREE.Path();// 圆孔1
// path1.absarc(20, 20, 10);
// const path2 = new THREE.Path();// 圆孔2
// path2.absarc(80, 20, 10);
// const path3 = new THREE.Path();// 方形孔
// path3.moveTo(50, 50);
// path3.lineTo(80, 50);
// path3.lineTo(80, 80);
// path3.lineTo(50, 80);

// // 下面代码绘制了一个矩形+扇形的轮廓，圆心在(100, 0),半径50。
// const shape = new THREE.Shape();

// //三个内孔轮廓分别插入到holes属性中
// shape.holes.push(path1, path2,path3);

// shape.lineTo(100, 0); //.currentPoint变为(100,0)
// // 圆弧.arc参数的圆心0,0坐标是相对当前.currentPoint而言，而不是坐标原点
// shape.arc(0,0,50,0,Math.PI/2); //.currentPoint变为圆弧线结束点坐标
// console.log('currentPoint',shape.currentPoint);
// // 绘制直线，直线起点：圆弧绘制结束的点  直线结束点：(0, 0)
// shape.lineTo(0, 50);

// // shape:填充轮廓
// const geometry = new THREE.ShapeGeometry(shape, {
// 	steps: 2,
// 	// depth: 16,
// 	// bevelEnabled: true,
// 	// bevelThickness: 1,
// 	// bevelSize: 1,
// 	// bevelOffset: 0,
// 	// bevelSegments: 1
// });
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const mesh = new THREE.Mesh( geometry, material ) ;
// scene.add( mesh );

/*********************************************************/

/***********************几何体定点颜色*****************************/
const geometry1 = new THREE.BufferGeometry(); //创建一个几何体对象
const vertices1 = new Float32Array([
  0,
  0,
  50, //顶点1坐标
  50,
  0,
  50, //顶点2坐标
  0,
  25,
  50, //顶点3坐标
]);
// 顶点位置
geometry1.attributes.position = new THREE.BufferAttribute(vertices1, 3);

const colors1 = new Float32Array([
  1,
  0,
  0, //顶点1颜色
  0,
  0,
  1, //顶点2颜色
  0,
  1,
  0, //顶点3颜色
]);
// 设置几何体attributes属性的颜色color属性
//3个为一组,表示一个顶点的颜色数据RGB
geometry1.attributes.color = new THREE.BufferAttribute(colors1, 3);

// 点渲染模式
const material1 = new THREE.PointsMaterial({
  // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
  vertexColors: true, //默认false，设置为true表示使用顶点颜色渲染
  size: 5.0, //点对象像素尺寸
});

const points1 = new THREE.Points(geometry1, material1); //点模型对象

const materialline = new THREE.LineBasicMaterial({
  vertexColors: true, //使用顶点颜色渲染
});
const line1 = new THREE.Line(geometry1, materialline);

const materialmesh = new THREE.MeshBasicMaterial({
  // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
  vertexColors: true, //默认false，设置为true表示使用顶点颜色渲染
  side: THREE.DoubleSide,
});
const mesh1 = new THREE.Mesh(geometry1, materialmesh);
scene.add(points1);
scene.add(line1);
scene.add(mesh1);
/****************************************************************/

/****************************曲线渐变效果**************************/
const geometry2 = new THREE.BufferGeometry(); //创建一个几何体对象
// 三维样条曲线
const curve2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-50, 20, 90),
  new THREE.Vector3(-10, 40, 40),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(60, -60, 0),
  new THREE.Vector3(70, 0, 80),
]);
const pointsArr2 = curve2.getSpacedPoints(100); //曲线取点
geometry2.setFromPoints(pointsArr2); //pointsArr赋值给顶点位置属性

const pos = geometry2.attributes.position;
const count = pos.count; //顶点数量
// 计算每个顶点的颜色值
const colorsArr = [];

// 根据顶点距离起点远近进行颜色插值计算
const c1 = new THREE.Color(0x00ffff); //曲线起点颜色 青色
const c2 = new THREE.Color(0xffff00); //曲线结束点颜色 黄色

for (let i = 0; i < count; i++) {
  // const percent = i / count; //点索引值相对所有点数量的百分比
  // //根据顶点位置顺序大小设置颜色渐变
  // // 红色分量从0到1变化，蓝色分量从1到0变化
  // colorsArr.push(percent, 0, 1 - percent); //蓝色到红色渐变色

  const percent = i / count; //点索引值相对所有点数量的百分比
  //根据顶点位置顺序大小设置颜色渐变
  const c = c1.clone().lerp(c2, percent); //颜色插值计算
  colorsArr.push(c.r, c.g, c.b);
}
//类型数组创建顶点颜色color数据
const colors2 = new Float32Array(colorsArr);
// 设置几何体attributes属性的颜色color属性
geometry2.attributes.color = new THREE.BufferAttribute(colors2, 3);
const material2 = new THREE.LineBasicMaterial({
  vertexColors: true, //使用顶点颜色渲染
});
const line2 = new THREE.Line(geometry2, material2);

scene.add(line2);

// color颜色渐变插值

// const c1 = new THREE.Color(0xff0000); //红色
// const c2 = new THREE.Color(0x0000ff); //蓝色
// const c = new THREE.Color();
// c.lerpColors(c1,c2, 0);
// console.log('颜色插值结果',c);
// c.lerpColors(c1,c2, 0.5);
// console.log('颜色插值结果',c);
// c.lerpColors(c1,c2, 1);
// console.log('颜色插值结果',c);

// c.lerpColors(c1,c2, 1);
// console.log('颜色插值结果',c);

// geometry.attributes.position = new THREE.BufferAttribute();
// geometry.attributes.normal = new THREE.BufferAttribute(); 
// geometry.attributes.color = new THREE.BufferAttribute(); 
// geometry.attributes.uv = new THREE.BufferAttribute(); 
// geometry.index = new THREE.BufferAttribute(); 

/****************************************************************/

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
};

onMounted(() => {
  containerRef.value.appendChild(renderer.domElement);
  render();
  //控制器 遥感镜头
  controls = new OrbitControls(camera, renderer.domElement);
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style lang="stylus" scoped></style>
