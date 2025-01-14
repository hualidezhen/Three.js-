<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

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
const geometryL = new THREE.BoxGeometry(500, 500, 500);
// // SphereGeometry：球体
// const geometry = new THREE.SphereGeometry(50);
// // CylinderGeometry：圆柱
// const geometry = new THREE.CylinderGeometry(50,50,100);
// // PlaneGeometry：矩形平面
const geometry = new THREE.PlaneGeometry(1024, 1024); //完整贴图

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



// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

//纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();
// .load()方法加载图像，返回一个纹理对象Texture
const texture = texLoader.load("../../public/chartLet/textureMin.jpg");
texture.encoding  = THREE.SRGBColorSpace;//设置为SRGB颜色空间 最新版本
// console.log(texture.encoding);
// const texture = texLoader.load('../../public/chartLet/normalMin.jpg');
// const texture = texLoader.load('../../public/chartLet/mine.png');

const textureC = texLoader.load("../../public/chartLet/瓷砖.jpg");
textureC.encoding  = THREE.SRGBColorSpace;//设置为SRGB颜色空间 最新版本
// console.log(textureC.encoding);

// 设置阵列模式
textureC.wrapS = THREE.RepeatWrapping;
textureC.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
textureC.repeat.set(12, 12); //注意选择合适的阵列数量

const textureCube = new THREE.CubeTextureLoader()
    .setPath('../../public/chartLet/')
    .load(['瓷砖.jpg', '地球.jpg', '透明指南针.jpg', '指南针.jpg', 'normalMin.jpg', 'textureMin.jpg']);

    //如果renderer.outputEncoding=THREE.sRGBEncoding;环境贴图需要保持一致
textureCube.encoding = THREE.sRGBEncoding;   

// 地面
var lambertMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide, //两面可见
  metalness: 0, //金属度 表示材质像金属的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0
  roughness: 1, //粗糙度 0.0表示平滑的镜面反射,1.0表示完全漫反射
  // envMap: texture, //设置pbr材质环境贴图
  map: texture, //map表示材质的颜色贴图属性

});

//瓷砖
var lambertMaterialC = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide, //两面可见
  metalness: 0, //金属度
  roughness: 1, //粗糙度
  // envMap: textureC, //设置pbr材质环境贴图
  map: textureC, //map表示材质的颜色贴图属性
});

console.log(textureCube);

// 立方体
// MeshPhysicalMaterial是MeshStandardMaterial的子类，具有更多的PBR材质属性和功能
var lambertMaterialL = new THREE.MeshPhysicalMaterial({
  metalness: 0.5, //金属度
  roughness: 0, //粗糙度
  envMap: textureCube, //设置pbr材质环境贴图
  envMapIntensity:1,  
  // map: texture, //map表示材质的颜色贴图属性

});




// 两个参数分别为几何体geometry、材质material

var mesh = new THREE.Mesh(geometry, lambertMaterial); //物理模型对象Mesh
var meshC = new THREE.Mesh(geometryC, lambertMaterialC); //物理网格模型对象Mesh
var meshL = new THREE.Mesh(geometryL, lambertMaterialL); //物理网格模型对象Mesh

// 实例化一个gui对象
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '10px';
gui.domElement.style.top = '50px';
gui.domElement.style.width = '300px';
// 创建材质子菜单
const matFolder = gui.addFolder('立方体');
matFolder.close();//默认闭合
// 范围可以参考文档
matFolder.add(meshL.material,'metalness',0,1).name('金属度');
matFolder.add(meshL.material,'roughness',0,1).name('粗糙度');
matFolder.add(meshL.material,'clearcoat',0,1).name('清漆层');
matFolder.add(meshL.material,'clearcoatRoughness',0,1).name('清漆层粗糙度');
matFolder.add(meshL.material,'envMapIntensity',0,10).name('环境贴图影响度');
matFolder.add(meshL.material,'transmission',0,1).name('透光率');
matFolder.add(meshL.material,'reflectivity',0,1).name('反射率');
matFolder.add(meshL.material,'sheen',0,1).name('光泽');
matFolder.add(meshL.material,'ior',1,2.333).name('折射率');



mesh.rotateX(Math.PI / 2);
meshC.rotateX(Math.PI / 2);

// 网格模型位置xyz坐标：0,10,0
mesh.position.set(0, 0, 0);
meshC.position.set(512, 0, 768);
meshL.position.set(768, 300, 256);


camera.position.set(1500, 500, 1500);

// scene
var scene = new THREE.Scene();

scene.add(mesh);
scene.add(meshC);
scene.add(meshL);


// 矩形平面网格模型设置背景透明的png贴图
const geometryZ = new THREE.PlaneGeometry(100, 100); //默认在XOY平面上
const textureLoader = new THREE.TextureLoader();
const textureZ = textureLoader.load("../../public/chartLet/透明指南针.jpg");
textureZ.offset.x += 0.5; //纹理U方向偏移
// 设置.wrapS也就是U方向，纹理映射模式(包裹模式)
textureZ.wrapS = THREE.RepeatWrapping; //对应offste.x偏移

textureZ.offset.y += 0.5; //纹理V方向偏移
// 设置.wrapT也就是V方向，纹理映射模式
textureZ.wrapT = THREE.RepeatWrapping; //对应offste.y偏移

const material = new THREE.MeshBasicMaterial({
  map: textureZ,
  transparent: true, //使用背景透明的png贴图，注意开启透明计算
});
const meshZ = new THREE.Mesh(geometryZ, material);
meshZ.rotateX(-Math.PI / 2);
meshZ.position.y = 1; //适当偏移，不与地面重合

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
// const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
// gridHelper.material.opacity = 0.2;
// gridHelper.material.transparent = true;
// scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
// console.log(renderer.outputEncoding);
renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.outputEncoding = THREE.LinearEncoding;

renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.8);

const render = () => {
  textureZ.offset.x += 0.001; //设置纹理动画：偏移量根据纹理和动画需要，设置合适的值
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
