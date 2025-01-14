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
  10000 // 最远距离
);

//创建一个长方体几何对象Geometry
//BoxGeometry：长方体
// const geometry = new THREE.BoxGeometry(100, 100, 100);
// // SphereGeometry：球体
// const geometry = new THREE.SphereGeometry(50);
// // CylinderGeometry：圆柱
// const geometry = new THREE.CylinderGeometry(50,50,100);
// // PlaneGeometry：矩形平面
const geometry = new THREE.PlaneGeometry(1024, 1024); //完整贴图
const geometry1 = new THREE.PlaneGeometry(512, 512); //四分之一贴图
const geometryC = new THREE.PlaneGeometry(512, 512); //四分之一贴图




// CircleGeometry：圆形平面
// const geometry = new THREE.CircleGeometry(50,64,32);

console.log("uv", geometry.attributes.uv);

/**纹理坐标0~1之间随意定义*/
const uvs = new Float32Array([
  0,
  0, //图片左下角
  1,
  0, //图片右下角
  1,
  1, //图片右上角
  0,
  1, //图片左上角
]);

// 获取纹理贴图四分之一
const uvs1 = new Float32Array([0, 0, 0.5, 0, 0.5, 0.5, 0, 0.5]);

// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

geometry1.attributes.uv = new THREE.BufferAttribute(uvs1, 2); //2个为一组,表示一个顶点的纹理坐标

//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load("../../public/chartLet/textureMin.jpg");
// texture.encoding  = THREE.SRGBColorSpace;//设置为SRGB颜色空间 最新版本
// console.log(texture.encoding);

// const texture = texLoader.load('../../public/chartLet/normalMin.jpg');
// const texture = texLoader.load('../../public/chartLet/mine.png');

const textureC = texLoader.load("../../public/chartLet/瓷砖.jpg");
// textureC.encoding  = THREE.SRGBColorSpace;//设置为SRGB颜色空间 最新版本
// console.log(textureC.encoding);


// 设置阵列模式
textureC.wrapS = THREE.RepeatWrapping;
textureC.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
textureC.repeat.set(12,12);//注意选择合适的阵列数量


// 创建一个慢反射网格材质
var lambertMaterial = new THREE.MeshLambertMaterial({
  side: THREE.DoubleSide, //两面可见
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  map: texture, //map表示材质的颜色贴图属性
});

//瓷砖 
var lambertMaterialC = new THREE.MeshLambertMaterial({
  side: THREE.DoubleSide, //两面可见
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  map: textureC, //map表示材质的颜色贴图属性
});

// 两个参数分别为几何体geometry、材质material

var mesh = new THREE.Mesh(geometry, lambertMaterial); //慢反射网格模型对象Mesh
var mesh1 = new THREE.Mesh(geometry1, lambertMaterial); //慢反射网格模型对象Mesh
var meshC = new THREE.Mesh(geometryC, lambertMaterialC); //慢反射网格模型对象Mesh


mesh.rotateX(Math.PI / 2);
mesh1.rotateX(Math.PI / 2);
meshC.rotateX(Math.PI / 2);

// 网格模型位置xyz坐标：0,10,0
mesh.position.set(0, 0, 0);
mesh1.position.set(-256, 0, 768);
meshC.position.set(512, 0, 768);




camera.position.set(1500, 500, 1500);

// scene
var scene = new THREE.Scene();

scene.add(mesh);
scene.add(mesh1);
scene.add(meshC);

// 矩形平面网格模型设置背景透明的png贴图
const geometryZ = new THREE.PlaneGeometry(100, 100); //默认在XOY平面上
const textureLoader = new THREE.TextureLoader();
const textureZ = textureLoader.load('../../public/chartLet/透明指南针.jpg')
textureZ.offset.x +=0.5;//纹理U方向偏移
// 设置.wrapS也就是U方向，纹理映射模式(包裹模式)
textureZ.wrapS = THREE.RepeatWrapping;//对应offste.x偏移

textureZ.offset.y +=0.5;//纹理V方向偏移
// 设置.wrapT也就是V方向，纹理映射模式
textureZ.wrapT = THREE.RepeatWrapping;//对应offste.y偏移


const material = new THREE.MeshBasicMaterial({
    map: textureZ,        
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
});
const meshZ = new THREE.Mesh(geometryZ, material);
meshZ.rotateX(-Math.PI / 2);
meshZ.position.y = 1;//适当偏移，不与地面重合

// scene.add(meshZ);


// AxesHelper：辅助观察的坐标系
var axesHelper = new THREE.AxesHelper(1500);
scene.add(axesHelper);

//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);




//网格地面 比例大小的参照物
// var gridHelper = new THREE.GridHelper(100, 100);
// 添加一个辅助网格地面
const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
// console.log(renderer.outputEncoding);
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.outputEncoding = THREE.LinearEncoding;


renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.8);

const render = () => {
  textureZ.offset.x +=0.001;//设置纹理动画：偏移量根据纹理和动画需要，设置合适的值
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
