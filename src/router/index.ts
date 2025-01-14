import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
        redirect:'/homePage',
		name: 'homePage',
		component: () => import('../../src/view/homePage.vue'),
		meta: {
			title: 'three三维模型首页',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/BmwCars',
		name: 'BmwCars',
		component: () => import('../../src/components/BmwCars.vue'),
		meta: {
			title: '换肤宝马',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/FirstThree',
		name: 'FirstThree',
		component: () => import('../../src/components/FirstThree.vue'),
		meta: {
			title: '光源和几何体模型',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/SecondThree',
		name: 'SecondThree',
		component: () => import('../../src/components/SecondThree.vue'),
		meta: {
			title: '动画循环渲染',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/ThreeThree',
		name: 'ThreeThree',
		component: () => import('../../src/components/ThreeThree.vue'),
		meta: {
			title: '阵列立方体和相机适配体验',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/FourThree',
		name: 'FourThree',
		component: () => import('../../src/components/FourThree.vue'),
		meta: {
			title: 'gui可视化改变三维模型',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/FiveThree',
		name: 'FiveThree',
		component: () => import('../../src/components/FiveThree.vue'),
		meta: {
			title: '几何体',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/SixThree',
		name: 'SixThree',
		component: () => import('../../src/components/SixThree.vue'),
		meta: {
			title: '模型对象和材质',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/SevenThree',
		name: 'SevenThree',
		component: () => import('../../src/components/SevenThree.vue'),
		meta: {
			title: '层级模型',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/EightThree',
		name: 'EightThree',
		component: () => import('../../src/components/EightThree.vue'),
		meta: {
			title: 'UV坐标、纹理贴图',
			hidden: true,
		},
        children:[]
    },
    {
		path: '/NineThree',
		name: 'NineThree',
		component: () => import('../../src/components/NineThree.vue'),
		meta: {
			title: '外部三维模型',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/TenThree',
		name: 'TenThree',
		component: () => import('../../src/components/TenThree.vue'),
		meta: {
			title: 'PBR材质和纹理贴图',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/ElevenThree',
		name: 'ElevenThree',
		component: () => import('../../src/components/ElevenThree.vue'),
		meta: {
			title: '渲染器和前端UI界面',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/TwelveThree',
		name: 'TwelveThree',
		component: () => import('../../src/components/TwelveThree.vue'),
		meta: {
			title: '生成曲线,几何体1.0',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/ThirteenThree',
		name: 'ThirteenThree',
		component: () => import('../../src/components/ThirteenThree.vue'),
		meta: {
			title: '生成曲线,几何体2.0',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/FourteenThree',
		name: 'FourteenThree',
		component: () => import('../../src/components/FourteenThree.vue'),
		meta: {
			title: '相机基础,光源和阴影',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/fifteenThree',
		name: 'fifteenThree',
		component: () => import('../../src/components/fifteenThree.vue'),
		meta: {
			title: '精灵图',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/sixteenThree',
		name: 'sixteenThree',
		component: () => import('../../src/components/sixteenThree.vue'),
		meta: {
			title: '后处理EffectComposer',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/seventeenThree',
		name: 'seventeenThree',
		component: () => import('../../src/components/seventeenThree.vue'),
		meta: {
			title: '场景标注标签信息',
			hidden: true,
		},
        children:[]
    },
	{
		path: '/eighteenThree',
		name: 'eighteenThree',
		component: () => import('../../src/components/eighteenThree.vue'),
		meta: {
			title: '射线拾取',
			hidden: true,
		},
        children:[]
    },
]

const router = createRouter({
	history: createWebHashHistory(), // 路由模式
	routes: routes, // 路由规则
})

export default router
