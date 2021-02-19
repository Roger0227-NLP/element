<template>
<div>
<el-row>
   <el-col :span="16"><div id="myChart" :style="{width: '1500px', height: '600px'}"></div></el-col>
</el-row>
<!-- <el-row>
   <el-col :span="24">
    <el-slider
      ref="slider"
      v-model="value1"
      range
      show-stops
      show-input @change="onSliderChanged">
    </el-slider>
    </el-col>
<br>
<br> -->
<el-row> <div><el-button @click="onbuttonclicked()">查询</el-button> 
      <el-select v-model="value" placeholder="请选择" @change="onselectchanged">
      <el-option 
        v-for="item in selections"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
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
var selectValue = -1
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
  legendHoverLink: true,
  title: { text: 'cpu占用率' },
  tooltip: {
        trigger: 'axis'
  },
  legend: {
        data: []
  },
  clip:true,
  dataZoom : [{
    realtime:false,
    id:"xdatazoom",
    show : true,
    realtime : true,
    start : 0,
    end : 100,
    xAxisIndex:[0]
  },
  {
    renderLabelForZeroData:true,
    realtime:false,
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
    type : 'value',
    scale : true,
    max : 180,
    min : 0,
    splitNumber : 5,
    boundaryGap: ['0%', '20%'],
    axisLabel: {
        formatter: '{value}%'
    }
  }
}; 

export default {
  name: 'hello',
  data () {
    return {
        value:'',
        value1:'',
        value2:'',
        selections:[]
      };
  },
  mounted(){
    console.log(option)
    this.oncreated();
  },
  methods: {
    onbuttonclicked(){
        let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
        if(selectValue == -1){
          return
        }
        //设置x坐标
        option['xAxis']['data'] = []
        for (let i = smin; i <= smax; i += intervalTime) {
            option['xAxis']['data'].push(formatDate(i))
        }
        //最高线程占用的cpu
        if(selectValue == 0){
          myChart.clear()
          option['series'] = []
          for (let index = 0; index < JSONProcessInfo.length; index++){
            var s = {
              smooth: true,
              type:'line',
              name:JSONProcessInfo[index]['pid'] + ":" + JSONProcessInfo[index]['processname'],
              data:[]
            };
              option['series'].push(s)
              option['legend']['data'].push(JSONProcessInfo[index]['pid'] + ":" + JSONProcessInfo[index]['processname'])
          }
          
          console.log(option)
          //let myChart = this.$echarts.init(document.getElementById('myChart'))
         //清空option
          for (let i = 0; i < option['series'].length; i++) {
              option['series'][i]['data'] = []
          }
          for (let i = 0; i < JSONProcessInfo.length; i++) {
              this.$http.get("getalalcpuinfo",{params:{
                begintick:smin,
                endtick:smax,
                targetip:values['targets'][0],
                pid:JSONProcessInfo[i]['pid']
              }}).then(res=>{
                var jstr = res.data
                if(jstr['ticks'].length <= 0)
                  return
                for(let k = 0; k < option['series'].length; k++){
                  var ret = option['series'][k]['name'].split(":")
                  if(JSONProcessInfo[i]['pid'] == ret[0]){
                    var jindex = 0
                    for (let j = smin; j <= smax; j += intervalTime) {
                      if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                        if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                            j++
                        }
                        if(jstr['useds'][jindex] > 10000){
                          console.log(jstr['useds'][jindex])
                          console.log(jindex)
                          option['series'][k]['data'].push(parseFloat(jstr['useds'][jindex - 1]).toFixed(2))
                        }
                        option['series'][k]['data'].push(parseFloat(jstr['useds'][jindex]).toFixed(2))
                        jindex++
                      }
                      else{
                        option['series'][k]['data'].push(0)
                      }
                    }
                  }
                }
                //myChart.clear()
                myChart.setOption(option)
              });
            }
        }
        //cpu占用总和
        if(selectValue == 1){
          myChart.clear()
          option['series'] = []
          for (let index = 0; index < JSONProcessInfo.length; index++){
            var s = {
              smooth: true,
              type:'line',
              name:JSONProcessInfo[index]['pid'] + ":" + JSONProcessInfo[index]['processname'],
              data:[]
            };
              option['series'].push(s)
              option['legend']['data'].push(JSONProcessInfo[index]['pid'] + ":" + JSONProcessInfo[index]['processname'])
          }

          for (let i = 0; i < option['series'].length; i++) {
              option['series'][i]['data'] = []
          }
          for (let i = 0; i < JSONProcessInfo.length; i++) {
              this.$http.get("getallcpu",{params:{
                begintick:smin,
                endtick:smax,
                targetip:values['targets'][0],
                pid:JSONProcessInfo[i]['pid']
              }}).then(res=>{
                var jstr = res.data
                if(jstr['ticks'].length <= 0)
                  return
                for(let k = 0; k < option['series'].length; k++){
                  var ret = option['series'][k]['name'].split(":")
                  if(JSONProcessInfo[i]['pid'] == ret[0]){
                    var jindex = 0
                    for (let j = smin; j <= smax; j += intervalTime) {
                      if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                        if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                            j++
                        }
                        if(jstr['useds'][jindex] > 10000){
                          console.log(jstr['useds'][jindex])
                          console.log(jindex)
                          option['series'][k]['data'].push(parseFloat(jstr['useds'][jindex - 1]).toFixed(2))
                        }
                        option['series'][k]['data'].push(parseFloat(jstr['useds'][jindex]).toFixed(2))
                        jindex++
                      }
                      else{
                        option['series'][k]['data'].push(0)
                      }
                    }
                  }
                }
                //myChart.clear()
                myChart.setOption(option)
              });
            }
        }

        if(selectValue > 1){
          /*
          var isCompress = false //是否压缩
          for (let i = 0; i < JSONProcessInfo.length; i++) {
            if(parseInt(JSONProcessInfo[i]['pid']) == selectValue){
              if(JSONProcessInfo[i]['threads'].length > 5){
                isCompress = true
              }
            }
          }*/
          /*
          if(isCompress == true){     
            //压缩x轴 
            var xtmp = option['xAxis']['data']
            option['xAxis']['data'] = []
            for (let index = 0; index < xtmp.length; index += 5) {
                option['xAxis']['data'].push(xtmp[index])
            }
          }*/
          //console.log(option)
          myChart.clear()
          for (let i = 0; i < JSONProcessInfo.length; i++) {
            if(parseInt(JSONProcessInfo[i]['pid']) == selectValue){ //查询选择的进程所有的线程
              console.log(JSONProcessInfo[i]['pid'])
              //清空显示的线条数组
              option['series'] = []
              for(let n = 0; n < JSONProcessInfo[i]['tids'].length; n++){
                var tmp = {
                  //smooth: true,  // 开启平滑处理
                  showAllSymbol: false,
                  smooth: true,
                  sampling: 'max',
                  animation:false,
                  type:'line',
                  name:JSONProcessInfo[i]['tids'][n], //tid
                  data:[]
                };
                option['legend']['data'].push(JSONProcessInfo[i]['tids'][n].toString())
                option['series'].push(tmp)
              }
              console.log(option)
              myChart.clear()
              for(let n = 0; n < JSONProcessInfo[i]['tids'].length; n++){
                this.$http.get("cpuinfo",{params:{
                  begintick:smin,
                  endtick:smax,
                  targetip:values['targets'][0],
                  pid:JSONProcessInfo[i]['pid'],
                  tid:JSONProcessInfo[i]['tids'][n]
                }}).then(res=>{
                  var jstr = res.data
                  if(jstr['ticks'].length <= 0)
                    return
                  for(let k = 0; k < option['series'].length; k++){
                    if(JSONProcessInfo[i]['tids'][n].toString() == option['series'][k]['name'].toString()){
                      var jindex = 0
                      for (let j = smin; j <= smax; j += intervalTime) {
                        if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                          if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                            j++
                          }
                          if(jstr['useds'][jindex] > 10000){
                            console.log(jstr['useds'][jindex])
                            console.log(jindex)
                            option['series'][k]['data'].push(parseFloat(jstr['useds'][jindex - 1]).toFixed(2))
                          }
                          option['series'][k]['data'].push(parseFloat(jstr['useds'][jindex]).toFixed(2))
                          jindex++
                        }
                        else{
                          option['series'][k]['data'].push(0)
                        }
                      }
                    }
                  }
                  /*
                  if(isCompress == true){ //压缩y数值
                    for (let index = 0; index < option['series'].length; index++) {
                      if(option['series'][index]['name'] == JSONProcessInfo[i]['pid']){
                        var ytmp = option['series'][index]['data']
                        option['series'][index]['data'] = []
                        for (let j = 0; j < ytmp.length; j+=5) {
                          myChart.appendData({
                            seriesIndex:index,
                            data:ytmp[j]
                          })
                        }
                      }
                    }
                  }*/
                  myChart.setOption(option)
                  console.log("tid:",JSONProcessInfo[i]['tids'][n],"已绘制")
                  
                });
              }
            }
        }
      }
    },
    oncreated(){
      
       values = this.$route.params
       smax = values['endtick']
       smin = values['begintick']
      let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
      this.$http.get("getprocessinfo",{params:{
        targetip:values['targets'][0],
          begintick:values['begintick'],
          endtick:values['endtick']
      }}).then(res=>{ //得到进程信息
          var starttick = values['begintick']
          var endtick = values['endtick']
          var interval = res.data['interval']
          JSONProcessInfo = res.data['datas'] //得到进程信息json对象

         // this.$refs.slider.min = starttick
         // this.$refs.slider.max = endtick

          var selection = {
              value:0,
              label:'查看最大线程'
          }
          option['series'] = []
          this.selections.push(selection)
          selection = {
            value:1,
            label:'查看总CPU',
          }
          this.selections.push(selection)
          for (let index = 0; index < JSONProcessInfo.length; index++) {
            var selection = {
              value:JSONProcessInfo[index]['pid'],
              label:JSONProcessInfo[index]['pid'] + ":" + JSONProcessInfo[index]['processname']
            }
            this.selections.push(selection)
            var s = {
              type:'line',
              name:JSONProcessInfo[index]['pid'] + ":" + JSONProcessInfo[index]['processname'],
              data:[]
            };
            option['series'].push(s)
          }
          //console.log(JSONProcessInfo)
          //console.log(this.selections)
          myChart.setOption(option);
          selectValue = 1
          this.onbuttonclicked()
        });
    },
    onselectchanged(params){
      selectValue = params
      this.onbuttonclicked()
    }
  }
}
</script>
