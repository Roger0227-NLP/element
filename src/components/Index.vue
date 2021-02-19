<template>
  <el-container>
  <el-header>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="cpu">CPU信息</el-menu-item>
  <el-menu-item index="memory">内存信息</el-menu-item>
  <el-menu-item index="net">网络流量</el-menu-item>
  <el-menu-item index="robot">机器人信息</el-menu-item>
  <el-menu-item index="trans">事务信息</el-menu-item>
  </el-menu>
  </el-header>
  <el-main>
    <router-view/>
  </el-main>
</el-container>
</template>

<script>
var values

export default {
   data() {
      return {
        activeIndex: '1'
      };
    },
    mounted(){
      this.oncreated();
    },
    methods: {
      oncreated(){
        values = this.$route.params
        if(values['endtick'] == 0){
          values['endtick'] = parseInt((new Date()).getTime()/1000)
        }
        console.log(values)
      },
      handleSelect(key, keyPath) {
        this.$router.push({name:key,params:values})
      }
    }
}
</script>

<style>

</style>
