import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import CPUInfo from '../components/CPUinfo'
import Memory from '../components/MemoryInfo'
import Net from '../components/NetInfo'
import Robot from '../components/RobotInfo'
import Trans from '../components/TransInfo'
import TestInfo from '../components/TestInfo'
import TestPlan from '../components/TestPlan'
import Report from '../components/Report'
//import { ElLoadingComponent } from 'element-ui/types/loading'
Vue.use(Router)

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/info',
      name:'info',
      component:TestInfo,
    },
    {
      path: '/plan',
      name:'plan',
      component:TestPlan,
    },
    {
      path: '/report',
      name:'report',
      component:Report,
    },
    {
      path: '/menu',
      name:'menu',
      component: Index,
      children:[
        {
          path: '/cpu',
          name:'cpu',
          component: CPUInfo
        },
        {
          path: '/memory',
          name:'memory',
          component: Memory
        },
        {
          path: '/net',
          name:'net',
          component: Net
        },
        {
          path: '/robot',
          name:'robot',
          component: Robot
        },
        {
          path:'/trans',
          name:'trans',
          component:Trans
        }
      ]
    }
  ]
})
