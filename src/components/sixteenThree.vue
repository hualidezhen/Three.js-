<script setup>
import * as THREE from "three";
// vue + three.js initate animate
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// 后处理器
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// 引入OutlinePass通道 可以给指定的某个模型对象添加一个高亮发光描边效果
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
// 引入UnrealBloomPass通道 Bloom发光通道
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// 引入GlitchPass通道 会产生闪屏效果
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
// 伽马校正后处理Shader 修复颜色差异
import {GammaCorrectionShader} from 'three/addons/shaders/GammaCorrectionShader.js';
// ShaderPass功能：使用后处理Shader创建后处理通道
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
// FXAA抗锯齿Shader
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
// SMAA抗锯齿通道
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';


// vue 不要DOM
const containerRef = ref(null);
let controls = null;
// 透视相机
var camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  50, // 最近距离
  3000 // 最远距离
);
const colorObj = {
    color:0x00ffff,
};

camera.position.set(200, 200, 250);

//创建一个长方体几何对象Geometry
var geometry = new THREE.BoxGeometry(50, 50, 50);
// const geometry = new THREE.BoxGeometry(25, 100, 50);


// 创建一个高光反射网格材质
var phongMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff,//0xff0000设置材质颜色为红色
});

var mesh = new THREE.Mesh(geometry, phongMaterial); //高光网格模型对象Mesh
mesh.position.set(0,0,0)

 camera.lookAt(0, 0, 0);
// scene
var scene = new THREE.Scene();

// AxesHelper：辅助观察的坐标系
// var axesHelper = new THREE.AxesHelper(1500);
// scene.add(axesHelper);


//环境光:没有特定方向，整体改变场景的光照明暗
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

scene.add(mesh);





// 实例化一个gui对象
const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '10px';
gui.domElement.style.top = '50px';
gui.domElement.style.width = '300px';

// 创建材质子菜单
const matFolder = gui.addFolder('材质');
matFolder.close();//默认闭合
// 材质颜色color
matFolder.addColor(colorObj, 'color').onChange(function(value){
  phongMaterial.color.set(value);
});

matFolder.add(mesh.position, 'x', 0, 180).name('x轴坐标');
matFolder.add(mesh.position, 'y', 0, 180).name('y轴坐标');
matFolder.add(mesh.position, 'z', 0, 180).name('z轴坐标');

// gui.add(obj, 'z', 0, 60);
const lightFolder = gui.addFolder('光照')
lightFolder.close()

// 光照强度属性.intensity
console.log('ambient.intensity',ambient.intensity);
// 通过GUI改变mesh.position对象的xyz属性
// .step() 步长设置交互界面每次改变属性值间隔是多少
lightFolder.add(ambient, 'intensity', 0, 2.0).name('环境光强度').step(0.1);


const obj = {
    scale: 0,
};
// 参数3数据类型：数组(下拉菜单)
gui.add(obj, 'scale', [-100, 0, 100]).name('y坐标').onChange(function (value) {
    mesh.position.y = value;
});

// 参数3数据类型：对象(下拉菜单)
gui.add(obj, 'scale', {
    left: -100,
    center: 0,
    right: 100
    // 左: -100,//可以用中文
    // 中: 0,
    // 右: 100
}).name('位置选择').onChange(function (value) {
    mesh.position.x = value;
});

const obj2 = {
    bool: false,
};
// 改变的obj属性数据类型是布尔值，交互界面是单选框
gui.add(obj2, 'bool').name('是否旋转');








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

// 设置设备像素比，避免canvas画布输出模糊
renderer.setPixelRatio(window.devicePixelRatio);


// 创建后处理对象EffectComposer，WebGL渲染器作为参数
const composer = new EffectComposer(renderer);

// 创建一个渲染器通道，场景和相机作为参数
const renderPass = new RenderPass(scene, camera);

// 设置renderPass通道
composer.addPass(renderPass);



/************************************************************/ 
// canvas画布宽高度要和画布canvas保持一致
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
//bloom发光强度
bloomPass.strength = 2.0;
/************************************************************/ 


/************************************************************/
// OutlinePass第一个参数v2的尺寸和canvas画布保持一致
const v2 = new THREE.Vector2(window.innerWidth, window.innerHeight);
// const v2 = new THREE.Vector2(800, 600);
const outlinePass = new OutlinePass(v2, scene, camera);
//模型描边颜色，默认白色         
outlinePass.visibleEdgeColor.set(0xffff00); 
//高亮发光描边厚度
outlinePass.edgeThickness = 4; 
//高亮描边发光强度
outlinePass.edgeStrength = 6; 
 //模型闪烁频率控制，默认0不闪烁
outlinePass.pulsePeriod = 2;
/************************************************************/ 


/************************************************************/ 
// 闪烁
const glitchPass = new GlitchPass();
/************************************************************/ 

/************************************************************/
// 创建伽马校正通道
const gammaPass= new ShaderPass(GammaCorrectionShader);
/************************************************************/ 

/***********************FXAA抗锯齿通道************************************/ 
const FXAAPass = new ShaderPass( FXAAShader );
// `.getPixelRatio()`获取`renderer.setPixelRatio()`设置的值
const pixelRatioFXAA = renderer.getPixelRatio();//获取设备像素比 
// width、height是canva画布的宽高度
FXAAPass.uniforms.resolution.value.x = 1 /(window.width*pixelRatioFXAA);
FXAAPass.uniforms.resolution.value.y = 1 /(window.height*pixelRatioFXAA);
/************************************************************/ 


/***************************SMAA抗锯齿通道********************************/ 
//获取.setPixelRatio()设置的设备像素比
const pixelRatioSMAA = renderer.getPixelRatio();
// width、height是canva画布的宽高度
const smaaPass = new SMAAPass(window.width * pixelRatioSMAA, window.height * pixelRatioSMAA);
/************************************************************/ 



// 一个模型对象
outlinePass.selectedObjects = [mesh];

bloomPass.selectedObjects = [mesh];

// // 多个模型对象
// outlinePass.selectedObjects = [mesh1,mesh2,group];

// 设置OutlinePass通道
composer.addPass(outlinePass);
// 设置bloomPass通道
composer.addPass(bloomPass);
// 设置glitchPass通道
composer.addPass(glitchPass);
// 设置伽马校正后处理通道
composer.addPass(gammaPass);
// 设置FAXX抗锯齿通道
// composer.addPass(FXAAPass);
// 设置SMAAPass抗锯齿通道
composer.addPass(smaaPass);



const render = () => {
   // 当gui界面设置obj.bool为true,mesh执行旋转动画
   if (obj2 .bool) mesh.rotateY(0.01);
    // renderer.render(scene, camera);
    composer.render();
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
