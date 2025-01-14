<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 引入相机控件`MapControls`
import { MapControls } from 'three/addons/controls/OrbitControls.js';

// vue 不要DOM
const containerRef = ref(null);
let controls = null;
// 透视相机
var camera = new THREE.PerspectiveCamera(
  40,
  // 90,
  window.innerWidth / window.innerHeight,
  0.1, // 最近距离
  4000 // 最远距离
);
camera.position.set(300, 300, 350);



// // 正投影相机
// const width = window.innerWidth; //canvas画布宽度
// const height = window.innerHeight; //canvas画布高度
// const k = width / height; //canvas画布宽高比
// const s = 200; //控制left, right, top, bottom范围大小
// const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

//创建一个长方体几何对象Geometry
var geometry = new THREE.BoxGeometry(50, 50, 50);

//创建一个材质对象Material 基础材质不受光源印象
var basicMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

// 创建一个漫反射网络材质
var lambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000, //0xff0000设置材质颜色为红色
});

// 两个参数分别为几何体geometry、材质material
// const mesh = new THREE.Mesh(geometry, basicMaterial); //基础网格模型对象Mesh
// var mesh = new THREE.Mesh(geometry, lambertMaterial); //漫反射网格模型对象Mesh
var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh

// 网格模型位置xyz坐标：0,10,0
mesh.position.set(-100, 0, 0);


// camera.up.set(100,0 , 0);

/**********************************管道漫游****************************/ 

// 三维样条曲线
const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-50, 20, 90),
    new THREE.Vector3(-10, 40, 40),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(60, -60, 0),
    new THREE.Vector3(90, -40, 60),
    new THREE.Vector3(120, 30, 30),
]);
// 样条曲线path作为TubeGeometry参数生成管道
const tubeGeometry = new THREE.TubeGeometry(path, 200, 5, 30);
const texLoader = new THREE.TextureLoader(); 
//纹理贴图
const texture = texLoader.load('../../public/chartLet/textureMin.jpg');
//UV坐标U方向阵列模式
texture.wrapS = THREE.RepeatWrapping;
//纹理沿着管道方向阵列(UV坐标U方向)
texture.repeat.x = 10;
const TubeMaterial = new THREE.MeshLambertMaterial({
    map:texture,
    side: THREE.DoubleSide, //双面显示看到管道内壁
});
const tubeMesh = new THREE.Mesh(tubeGeometry, TubeMaterial);


// 设置几何体attributes属性的位置属性
// tubeGeometry.attributes.position = path;
// const tubePoints = new THREE.Points(tubeGeometry, TubeMaterial);
// tubeMesh.position.set(100,100,100)



/**********************************管道漫游****************************/ 



// scene
var scene = new THREE.Scene();

scene.add(mesh);

scene.add(tubeMesh);
// scene.add(tubePoints);



/***********************box3包围盒*****************************/ 
// const box3 = new THREE.Box3()
// console.log('box3',box3);
// box3.min = new THREE.Vector3(-10, -10,0);
// box3.max = new THREE.Vector3(100, 20,50);

const box3 = new THREE.Box3();
box3.expandByObject(mesh); // 计算模型包围盒
console.log('查看包围盒',box3);

const scale = new THREE.Vector3()
// getSize()计算包围盒尺寸
// 获得包围盒长宽高尺寸，结果保存在参数三维向量对象scale中
box3.getSize(scale)
console.log('模型包围盒尺寸', scale);

// 计算包围盒中心坐标
const center = new THREE.Vector3()
box3.getCenter(center)
console.log('模型中心坐标', center);




/**************************************************************/ 

// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

//环境光:没有特定方向，整体改变场景的光照明暗
// const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// scene.add(ambient);

// 聚光源
// 0xffffff:光源颜色
// 1.0：光照强度intensity
// const spotLight = new THREE.SpotLight(0xffffff,1.0);
// spotLight.position.set(300,300,300)
// // 设置聚光光源发散角度
// spotLight.angle = Math.PI / 24;//光锥角度的二分之一
// scene.add(spotLight);//光源添加到场景中
// // 聚光源辅助对象，可视化聚光源
// const spotLightHelper = new THREE.SpotLightHelper(spotLight,0xffff33)
// scene.add(spotLightHelper);


// 平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// 平行光设置产生阴影的光源对象,开启光源阴影的计算功能
directionalLight.castShadow = true;
directionalLight.position.set(100, 0, 0);

// 参数2表示平行光.position附近方框的尺寸
const dirHelper = new THREE.DirectionalLightHelper( directionalLight, 5);
scene.add( dirHelper );


//网格地面 比例大小的参照物
var gridHelper = new THREE.GridHelper(100, 100);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
// scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.8);

// 设置渲染器，允许光源阴影渲染
renderer.shadowMap.enabled = true; 
renderer.shadowMap.receiveShadow = true; 



directionalLight.shadow.camera.left = -5*10;
directionalLight.shadow.camera.right = 5*10;
directionalLight.shadow.camera.top = 5*10;
directionalLight.shadow.camera.bottom = -5*10;

// directionalLight.shadow.mapSize.set(128,128)
// 如果阴影边缘锯齿感的时候，可以适当提升像素
directionalLight.shadow.mapSize.set(1024,1024);
directionalLight.shadow.radius = 3;




// 可视化平行光阴影对应的正投影相机对象
const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);

scene.add(directionalLight);

const mapControls = new MapControls(camera, renderer.domElement);

mapControls.addEventListener('change', function () {
    // 鼠标右键旋转时候，查看.position变化
    // 鼠标左键拖动的时候，查看.position、.target的位置会变化
    console.log('camera.position',camera.position);
    console.log('controls.target',mapControls.target);
});

// const render = () => {

//   requestAnimationFrame(render);
//   renderer.render(scene, camera);
// };


// // 从曲线上等间距获取一定数量点坐标
// const pointsArr = path.getSpacedPoints(500);
// // 渲染循环
// let i = 0; //在渲染循环中累加变化
// function render() {
//     if (i < pointsArr.length - 1) {
//       if(i%1 === 0){
//         // 相机位置设置在当前点位置
//         camera.position.copy(pointsArr[i]);
//         // 曲线上当前点pointsArr[i]和下一个点pointsArr[i+1]近似模拟当前点曲线切线
//         // 设置相机观察点为当前点的下一个点，相机视线和当前点曲线切线重合
//         camera.lookAt(pointsArr[i + 1]);
//       }

//         i += 0.5; //调节速度
//     } else {
//         i = 0
//     }
//     renderer.render(scene, camera);
//     requestAnimationFrame(render);
// }
// render();


var clock = new THREE.Clock();
const render = () => {
  const spt = clock.getDelta() * 1000; //毫秒
  //   console.log("两帧渲染时间间隔(毫秒)", spt);
  //   console.log("帧率FPS", 1000 / spt);
  renderer.render(scene, camera); //执行渲染操作
  // 重置渲染器输出画布canvas尺寸
  renderer.setSize(window.innerWidth * 0.95, window.innerHeight * 0.9);
  // 2.1.更新相机参数
  const k = window.innerWidth / window.innerHeight; //canvas画布宽高比
  const s = 200; //控制left, right, top, bottom范围大小

  camera.left = -s * k;
  camera.right = s * k;
  // 2.2.相机的left, right, top, bottom属性变化了，通知threejs系统
  camera.updateProjectionMatrix();
  mesh.rotateY(0.01); //每次绕y轴旋转0.01弧度
  requestAnimationFrame(render);
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
