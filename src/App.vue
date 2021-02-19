<template>
  <div id="app">
<el-container>
 <el-header height="100px">
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
  <el-menu-item index="plan">压测计划</el-menu-item>
  <el-menu-item index="info">压测信息</el-menu-item>
  </el-menu>
  </el-header>
  <el-main>
    <router-view/>
  </el-main>
  </el-container>
  </div>
</template>

<script>


export default {
  name: 'App',
  data () {
    return {
        activeIndex: '1'
    };
  },
    mounted(){
      this.created();
    },
    methods: {
      created(){
      },
      handleSelect(key, keyPath) {
        this.$router.push({name:key})
      }
    }
}
</script>

<style>

</style>
