<template>
  <div>
    <div>
      <div class="btnList">
        <template  v-for="(item,index) in routerList">
          <div class="btn">
            <RouterLink :to="item.path">{{index + 1}}.{{item.meta.title}}</RouterLink>
          </div>

        </template>
      </div>
    </div>
    <div>
      <RouterView />
    </div>
  </div>
</template>

<script>
import router from '@/router' // 导入路由
export default {
  name: "homePage",
  data(){
    return {
      routerList:[]
    }
  },
  components: {
  },
  mounted(){
    this.routerList = router.options.routes
    this.routerList.shift()//去掉第一个默认首页路径
    // console.log(router)
  },
  methods: {

  },
};
</script>

<style>
.btnList{
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.btn{
  width: 300px;
  margin: 5px 5px;
  /* flex: 0.5; */
  /* align-items: center; */
  /* flex-wrap: wrap-reverse; */
}
</style>
