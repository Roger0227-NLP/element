<template>
<div>
<el-col :span="16"><div id="myChart" :style="{width: '1200px', height: '600px'}"></div></el-col>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="name"
      label="事务名"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="sum"
      label="总数"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="success"
      sortable
      label="成功">
    </el-table-column>
    <el-table-column
      prop="failed"
      sortable
      label="失败">
    </el-table-column>
        <el-table-column
      prop="error"
      sortable
      label="错误">
    </el-table-column>
        <el-table-column
      prop="timeout"
      sortable
      label="超时">
    </el-table-column>
    <el-table-column
      prop="successrate"
      sortable
      label="成功率">
    </el-table-column>
    <el-table-column
      prop="tps"
      sortable
      label="TPS">
    </el-table-column>
    <el-table-column
      prop="maxcost"
      sortable
      label="最大时间(ms)">
    </el-table-column>
    <el-table-column
      prop="mincost"
      sortable
      label="最小时间(ms)">
    </el-table-column>
    <el-table-column
      prop="50percent"
      sortable
      label="50%耗时(ms)">
    </el-table-column>
    <el-table-column
      prop="75percent"
      sortable
      label="75%耗时(ms)">
    </el-table-column>
    <el-table-column
      prop="90percent"
      sortable
      label="90%耗时(ms)">
    </el-table-column>
  </el-table>
</div>
</template>

<style>
</style>

<script>
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
var values
  var option = { //定义表格
  title: { text: '事务数量' },
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
  series:[],
  xAxis: {
    data: []
  },
  yAxis: {
    splitLine: {
      show: false
  },
    scale:true,
  }
}; 
    const intervalTime = 1
    var smax
    var smin
    export default {
        data(){
            return {
                tableData:[]
            }
        },
        mounted(){
            this.oncreated();
            this.drawline();
        },
        methods: {
            oncreated(){
                values = this.$route.params
                smax = values['endtick']
                smin = values['begintick']
                this.$http.get("trans",{params:{
                  sid:values['id']
                  }}).then(res=>{
                    this.tableData = res.data['infos']
                });
            },
            drawline(){
                option['xAxis']['data'] = []
                 this.$http.get("transrecord",{params:{
                    getinfo:true,
                    sid:values['id']
                }}).then(res=>{
                    var JSONInfo = res.data
                    console.log(JSONInfo)
                    let myChart = this.$echarts.init(document.getElementById('myChart'),'westeros')
                    for (let i = JSONInfo['starttime'] + intervalTime; i <= JSONInfo['endtime']; i += intervalTime) {
                        option['xAxis']['data'].push(formatDate(i))
                    }
                    option['series'] = []
                    for (let i = 0; i < JSONInfo['names'].length; i++) {
                        var s = {
                            type:'line',
                            name: JSONInfo['names'][i],
                            data:[]
                        };
                        option['legend']['data'].push(JSONInfo['names'][i])
                        option['series'].push(s)
                    }

                    for (let i = 0; i < JSONInfo['names'].length; i++) {
                        this.$http.get("transrecord",{params:{
                            getinfo:false,
                            begintck:JSONInfo['starttime'],
                            endtick:JSONInfo['endtime'],
                            name:JSONInfo['names'][i],
                            sid:values['id']
                        }}).then(ret=>{
                            var jstr = ret.data
                            console.log(ret.data)
                            for(let k = 0; k < option['series'].length; k++){
                                if(option['series'][k]['name'] == JSONInfo['names'][i]){
                                    console.log(option['series'][k]['name'])
                                    var jindex = 0
                                    for (let j = JSONInfo['starttime']; j <= JSONInfo['endtime'] - intervalTime; j += intervalTime){
                                        if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                                            if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                                                j++
                                            }
                                        option['series'][k]['data'].push(parseFloat(jstr['nums'][jindex]))
                                        jindex++
                                        }else if (jindex > 0 && Math.abs(j + 1 - jstr['ticks'][jindex]) < intervalTime){
                                            option['series'][k]['data'].push(parseFloat(jstr['nums'][jindex - 1] + parseFloat(jstr['nums'][jindex] + 1)) / 2)
                                        }else{
                                            option['series'][k]['data'].push(0)
                                        }
                                    }
                                }
                            }
                            //console.log(option)
                            myChart.setOption(option)
                        })
                    }
                });
            
            }
        }
    }

</script>