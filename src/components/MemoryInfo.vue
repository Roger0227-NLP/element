<template>
<div>
<el-row>
   <el-col :span="16"><div id="myChart" :style="{width: '1200px', height: '600px'}"></div>
   <br>
<el-button @click="onbuttonclicked()">刷新表格</el-button>
</el-col>
<!-- </el-row>
<el-row>
   <el-col :span="24">
    <el-slider
      ref="slider"
      v-model="value1"
      range
      show-stops
      show-input @change="onSliderChanged">
</el-slider> -->

</el-row>

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
    end : 100,
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
  yAxis:{
    show:true,
    type:'value',
    scale:true,
    boundaryGap: ['0%', '20%'],
    axisLabel: {
        formatter: '{value}Mb'
    }
  }
}

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
        for (let i = 0; i < option['series'].length; i++) {
            option['series'][i]['data'] = []
        }
        
        let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')

        //设置x坐标
        for (let i = smin; i <= smax; i += intervalTime) {
          option['xAxis']['data'].push(formatDate(i))
        }
        //每个进程都去取
        for (let i = 0; i < JSONProcessInfo.length; i++){ 
            this.$http.get("memoryinfo",{params:{
            begintick:smin,
            endtick:smax,
            targetip:values['targets'][0],
            pid:JSONProcessInfo[i]['pid']
        }}).then(res=>{
                var jstr = res.data
                console.log(res.data)
                for(let k = 0; k < option['series'].length; k++){
                    var ret = option['series'][k]['name'].split(":")
                    if(JSONProcessInfo[i]['pid'] == ret[0]){
                        var jindex = 0
                        for (let j = smin ; j <= smax ; j += intervalTime) { // 间隔时间为两秒
                            if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                                if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                                    j++
                                }
                                option['series'][k]['data'].push(parseFloat(jstr['useds'][jindex] / 1024).toFixed(2))
                                jindex++
                            }else if (jindex > 0 && Math.abs(j + 1 - jstr['ticks'][jindex]) < intervalTime){
                                option['series'][k]['data'].push((parseFloat(jstr['useds'][jindex - 1] + parseFloat(jstr['useds'][jindex] + 1)) / 2 / 1024).toFixed(2))
                            }else{
                                option['series'][k]['data'].push(0)
                            }
                        }
                    }
                }
                console.log(option)
                myChart.setOption(option)
          });
        }
    },
    oncreated(){
        values = this.$route.params
        smax = values['endtick']
        smin = values['begintick']
        console.log("in memoryinfo ",values)
        let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
        this.$http.get("getprocessinfo",{params:{
          targetip:values['targets'][0],
          begintick:values['begintick'],
          endtick:values['endtick']
        }}).then(res=>{ //得到进程信息
        var starttick = values['begintick']
        var endtick = values['endtick']
        interval = res.data['interval'] //全局刻度信息
        JSONProcessInfo = res.data['datas'] //得到进程信息json对象
        console.log(interval)
        //this.$refs.slider.min = starttick
        //this.$refs.slider.max = endtick

        option['series'] = []
        for (let index = 0; index < JSONProcessInfo.length; index++) {
            var s = {
                type:'line',
                name:JSONProcessInfo[index]['pid'].toString() + ":" + JSONProcessInfo[index]['processname'],
                data:[]
            };
            option['legend']['data'].push(JSONProcessInfo[index]['pid'].toString() + ":" + JSONProcessInfo[index]['processname'])
            option['series'].push(s)
        }
            //myChart.setOption(option);
            this.onbuttonclicked()
        });
    }
  }
}

</script>