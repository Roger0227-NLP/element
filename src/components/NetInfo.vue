<template>
<div>
<el-row>
   <el-col :span="16"><div id="myChart" :style="{width: '1200px', height: '400px'}"></div></el-col>
</el-row>
<el-row>
   <el-col :span="16"><div id="myChart2" :style="{width: '1200px', height: '400px'}"></div></el-col>
</el-row>
<!-- 
<el-row>
   <el-col :span="24">
    <el-slider
      ref="slider"
      v-model="value1"
      range
      show-stops
      show-input @change="onSliderChanged">
</el-slider>
 </el-col>
</el-row> -->
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
  title: { text: '下载流量' },
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
    type:'value',
    boundaryGap: ['0%', '20%'],
    axisLabel: {
        formatter: '{value}Kbps'
    },
    splitLine: {
      show: false
  },
    scale:true,
  }
};

var option2 = { //定义表格
  title: { text: '上传流量' },
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
    type:'value',
    boundaryGap: ['0%', '20%'],
    axisLabel: {
        formatter: '{value}Kbps'
    },
    splitLine: {
      show: false
  },
    scale:true,
  }
};
export default {
name: 'hello',
data () {
return {
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
        option2['xAxis']['data'] = []
        for (let i = 0; i < option2['series'].length; i++) {
            option2['series'][i]['data'] = []
        }
        let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'),'westeros')
        //设置x坐标
        for (let i = smin; i <= smax; i += intervalTime) {
            option['xAxis']['data'].push(formatDate(i))
        }
        for (let i = smin; i <= smax; i += intervalTime) {
            option2['xAxis']['data'].push(formatDate(i))
        }
        //每个进程都去取
        for (let i = 0; i < JSONProcessInfo.length; i++){ 
            this.$http.get("netinfo",{params:{
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
                        for (let j = smin; j <= smax; j += intervalTime) {
                            if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                            if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                                j++
                            }
                            option['series'][k]['data'].push(parseFloat(jstr['downloadSpeeds'][jindex]).toFixed(2))
                            jindex++
                            }else{
                                option['series'][k]['data'].push(0)
                            }
                        }
                    }
                }
                console.log(option)
                myChart.setOption(option)
                
                for(let k = 0; k < option2['series'].length; k++){
                    var ret = option2['series'][k]['name'].split(":")
                    if(JSONProcessInfo[i]['pid'] == ret[0]){
                        var jindex = 0
                        for (let j = smin; j <= smax; j += intervalTime) {
                            if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                            if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                                j++
                            }
                            option2['series'][k]['data'].push(parseFloat(jstr['updateSpeeds'][jindex]).toFixed(2))
                            jindex++
                            }else{
                                option2['series'][k]['data'].push(0)
                            }
                        }
                    }
                }
                console.log(option2)
                myChart2.setOption(option2)
          });
        }
    },
    oncreated(){
        values = this.$route.params
        smax = values['endtick']
        smin = values['begintick']
        let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'),'westeros') 
        option['legend']['data'] = []
        option2['legend']['data'] = []
        this.$http.get("getprocessinfo",{params:{
          targetip:values['targets'][0],
          begintick:values['begintick'],
          endtick:values['endtick']
        }}).then(res=>{ //得到进程信息
        var starttick = values['begintick']
        var endtick = values['endtick']
        interval = res.data['interval'] //全局刻度信息
        JSONProcessInfo = res.data['datas'] //得到进程信息json对象
        console.log(JSONProcessInfo)
        //console.log(interval)
        //this.$refs.slider.min = starttick
        //this.$refs.slider.max = endtick

        option['series'] = []
        option2['series'] = []
        for (let index = 0; index < JSONProcessInfo.length; index++) {
        var s = {
            type:'line',
            name:JSONProcessInfo[index]['pid'].toString() + ":" + JSONProcessInfo[index]['processname'],
            data:[]
        };

        option['legend']['data'].push(JSONProcessInfo[index]['pid'].toString() + ":" + JSONProcessInfo[index]['processname'])
        option['series'].push(s)

        var s2 = {
            type:'line',
            name:JSONProcessInfo[index]['pid'].toString() + ":" + JSONProcessInfo[index]['processname'],
            data:[]
        };
        option2['legend']['data'].push(JSONProcessInfo[index]['pid'].toString() + ":" + JSONProcessInfo[index]['processname'])
        option2['series'].push(s2)
        }
        //option['title']['text'] = "下载流量"
        myChart.setOption(option);
        //option2['title']['text'] = "上传流量"
        myChart2.setOption(option2);

        this.onbuttonclicked()
        });
    }
  }
}
</script>
