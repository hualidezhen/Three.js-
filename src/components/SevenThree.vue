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
camera.position.set(100, 100, 150);

// 批量创建多个长方体表示高层楼
const group1 = new THREE.Group(); //所有高层楼的父对象
group1.name = "高层";
group1.position.set(0, 0, 0);
for (let i = 0; i < 5; i++) {
  const geometry = new THREE.BoxGeometry(20, 60, 10);
  // 平移几何体的顶点坐标,改变几何体自身相对局部坐标原点的位置
geometry.translate(50/2,0,0,);;
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = i * 30; // 网格模型mesh沿着x轴方向阵列
  group1.add(mesh); //添加到组对象group1
  mesh.name = i + 1 + "号楼";
  //可视化mesh的局部坐标系
  const meshAxesHelper = new THREE.AxesHelper(50);
  mesh.add(meshAxesHelper);
  // 声明一个三维向量用来表示某个坐标
  const worldPosition = new THREE.Vector3();
  // 获取mesh的世界坐标，你会发现mesh的世界坐标受到父对象group的.position影响
  mesh.getWorldPosition(worldPosition);
  console.log("世界坐标", worldPosition);
  console.log("本地坐标", mesh.position);
  // console.log('mesh.name',mesh.name);
}
group1.position.y = 30;

const group2 = new THREE.Group();
group2.name = "洋房";
// 批量创建多个长方体表示洋房
for (let i = 0; i < 5; i++) {
  const geometry = new THREE.BoxGeometry(20, 30, 10);
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = i * 30;
  group2.add(mesh); //添加到组对象group2
  mesh.name = i + 6 + "号楼";
}
group2.position.z = 50;
group2.position.y = 15;

const model = new THREE.Group();
model.name = "小区房子";
model.add(group1, group2);
model.position.set(-50, 0, -25);

// 递归遍历model包含所有的模型节点
model.traverse(function (obj) {
  console.log("所有模型节点的名称", obj.name);
  // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
  if (obj.isMesh) {
    //判断条件也可以是obj.type === 'Mesh'
    obj.material.color.set(0xffff00);
  }
});

// scene 场景
const scene = new THREE.Scene();
scene.add(model);

//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// scene.remove(ambient);//移除场景中环境光
// scene.remove(model);//移除场景中模型对象

var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

//网格地面 比例大小的参照物
var gridHelper = new THREE.GridHelper(100, 100);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

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
