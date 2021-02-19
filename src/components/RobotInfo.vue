<template>
<div>
<el-row>
   <el-col :span="16"><div id="myChart" :style="{width: '1200px', height: '400px'}"></div></el-col>
</el-row>
<el-row>
   <el-col :span="16"><div id="myChart2" :style="{width: '1200px', height: '400px'}"></div></el-col>
</el-row>
<br>
<div><el-button @click="onbuttonclicked()">刷新表格</el-button></div>
</div>
</template>

<style>
</style>

<script>
var values
var smax
var smin
var JSONProcessInfo
var interval
const intervalTime = 2
function formatDate(date) {
  var date = new Date(date * 1000);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}
var option = { //定义表格
  title: { text: '内存消耗' },
   tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
 dataZoom : [{
    id:"xdatazoom",
    show : true,
    realtime : true,
    start : 0,
    end : 80,
    xAxisIndex:[0]
  },
  {
    id:"ydatazoom",
    show : true,
    realtime : true,
    start : 0,
    end : 100,
    yAxisIndex:[0]
  }
  ],
  xAxis: {
    data: []
  },
  yAxis: {
    splitLine: {
      show: false
  },
    scale:true,
  },
  series:[]
}
var option2 = { //定义表格
  title: { text: '内存消耗' },
   tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: []
    },
 dataZoom : [{
    id:"xdatazoom",
    show : true,
    realtime : true,
    start : 0,
    end : 80,
    xAxisIndex:[0]
  },
  {
    id:"ydatazoom",
    show : true,
    realtime : true,
    start : 0,
    end : 100,
    yAxisIndex:[0]
  }
  ],
  xAxis: {
    data: []
  },
  yAxis: {
    splitLine: {
      show: false
  },
    scale:true,
  },
  series:[]
}
export default {
name: 'hello',
data () {
return {
    value1: ''
    };
},
mounted(){
    this.oncreated(); 
  },
methods: {
    onbuttonclicked(){
        //清空option
        option['xAxis']['data'] = []
        option2['xAxis']['data'] = []
        for (let i = 0; i < option['series'].length; i++) {
            option['series'][i]['data'] = []
        }
         for (let i = 0; i < option2['series'].length; i++) {
            option2['series'][i]['data'] = []
        }
        let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'),'westeros')
        //设置x坐标
        for (let i = smin; i < smax; i += intervalTime) {
            option['xAxis']['data'].push(formatDate(i))
        }
        for (let i = smin; i < smax; i += intervalTime) {
            option2['xAxis']['data'].push(formatDate(i))
        }
        for (let i = 0; i < option['series'].length; i++) {
            option['series'][i]['data']=[]
        }
        for (let i = 0; i < option2['series'].length; i++) {
            option2['series'][i]['data']=[]
        }
        this.$http.get("robot",{params:{
            gettime:false,
            begintick:smin,
            sid:values['id'],
            endtick:smax
        }}).then(res=>{
            console.log(res.data)
            var jstr = res.data
            var totalindex = 0
            var onlineindex = 0
            var recvindex = 0
            var sendindex = 0
            for (let i = 0; i < jstr['ticks'].length; i++) {
                for(let k = 0; k < option['series'].length; k++){
                    if(option['series'][k]['name'] == '全部人数'){
                        option['series'][k]['data'].push(jstr['totalnums'][totalindex])
                        totalindex++
                    }
                    if(option['series'][k]['name'] == '在线人数'){
                        option['series'][k]['data'].push(jstr['onlinenums'][onlineindex])
                        onlineindex++
                    }
                }
                for(let k = 0; k < option2['series'].length; k++){
                    if(option2['series'][k]['name'] == '收包数量'){
                        option2['series'][k]['data'].push(jstr['recvpkgs'][recvindex])
                        recvindex++
                    }
                    if(option2['series'][k]['name'] == '发包数量'){
                        option2['series'][k]['data'].push(jstr['sendpkgs'][sendindex])
                        sendindex++
                    }
                }
            }
            console.log(option)
            console.log(option2)
            myChart.setOption(option)
            myChart2.setOption(option2)
        });
    },
    oncreated(){
        values = this.$route.params
        smax = values['endtick']
        smin = values['begintick']
        option['legend']['data'] = []
        option['series'] = []
        option2['legend']['data'] = []
        option2['series'] = []
        let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'),'westeros')
        myChart.clear()
        myChart2.clear()
        var s = {
            type:'line',
            name:'全部人数',
            data:[]
        };
        option['legend']['data'].push('全部人数')
        option['series'].push(s)
        option['legend']['data'].push('在线人数')
        s = {
            type:'line',
            name:'在线人数',
            data:[]
        }
        option['series'].push(s)
        option['title']['text'] = '机器人数量'
        s = {
            type:'line',
            name:'收包数量',
            data:[]
        };
        option2['legend']['data'].push('收包数量')
        option2['series'].push(s)
        option2['legend']['data'].push('发包数量')
        s = {
            type:'line',
            name:'发包数量',
            data:[]
        };
        option2['series'].push(s)
        option2['title']['text'] = '收发包'
        myChart.setOption(option)
        myChart2.setOption(option2)
        this.onbuttonclicked()
    }
  }
}
</script>
