<template>

<div>
    <div id="pdfDom">
            <el-row>
            <el-col :span="12">
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="pid"
      sortable
      label="PID"
      width="80%">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="进程名"
      width="160%">
    </el-table-column>
    <el-table-column
      prop="woring"
      sortable
      label="危险等级"
      width="160%">
      <template slot-scope="scope">
        <span v-if="scope.row.woring=='低风险'" style="color: #409EFF">低风险</span>
        <span v-else-if="scope.row.woring=='中风险'" style="color: #E6A23C">中风险</span>
        <span v-else-if="scope.row.woring=='高风险'" style="color: #F56C6C">高风险</span>
    </template>
    </el-table-column>
    <el-table-column  align="center">
        <template slot-scope="scope">
            <div v-if="startDraw == 1">
                {{ drawEcharts(scope.row, scope.$index) }}
                <div :id="`charts` + scope.$index" :style="{width: '350px', height: '200px'}"></div>
            </div>
        </template>
    </el-table-column>    
            </el-table></el-col>
            </el-row>

            <el-row>
            <el-col :span="18">
                <el-table
    :data="tableData1"
    border
    style="width: 100%">
    <el-table-column
      prop="pid"
      sortable
      label="PID"
      width="80%">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="进程名"
      width="160%">
    </el-table-column>
    <el-table-column
      prop="level"
      sortable
      label="危险等级"
      width="160%">
      <template slot-scope="scope">
        <span v-if="scope.row.level=='低风险'" style="color: #409EFF">低风险</span>
        <span v-else-if="scope.row.level=='中风险'" style="color: #E6A23C">中风险</span>
        <span v-else-if="scope.row.level=='高风险'" style="color: #F56C6C">高风险</span>
    </template>
    </el-table-column>
   <el-table-column
      prop="lrb"
      sortable
      label="增长趋势(单位:Kb)"
      width="170%">
    </el-table-column>
    <el-table-column  align="center">
        <template slot-scope="scope">
            <div v-if="startDraw2 == 1">
                <div :id="`memroycharts` + scope.$index" :style="{width: '350px', height: '200px'}"></div>
                {{ drawMemoryEcharts(scope.row, scope.$index) }}
            </div>
        </template>
    </el-table-column>
            </el-table></el-col>
            </el-row>


            <el-row>
            <el-col :span="18">
                <el-table
    :data="tableData2"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      sortable
      label="ID"
      width="80%">
    </el-table-column>
    <el-table-column
      prop="name"
      sortable
      label="事务名"
      width="160%">
    </el-table-column>
    <el-table-column
      prop="successrate"
      sortable
      label="成功率"
      width="160%">
    </el-table-column>
                </el-table></el-col>
            </el-row>
    </div>
    <p>
       <span @click="getPdf()">
       <i class="el-icon-printer"></i> 下载PDF
      </span>
    </p>
</div>
</template>
<style>

</style>

<script>
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
tooltip: {
        trigger: 'axis'
  },
title: {
    show:false
},
  xAxis: {
    show:false,
    data: []
  },
  series : [],
  yAxis: {
    type : 'value',
    scale : true,
    max : 100,
    min : 0,
    splitNumber : 3,
  }
}; 
var option2 = { //定义表格
title: {
    show:false
},
  legendHoverLink: true,
  tooltip: {
        trigger: 'axis'
  },
  legend: {
        data: []
  },
  clip:true,
  xAxis: {
      show:false,
    data: []
  },
  series : [],
  yAxis: {
    type : 'value',
    scale : true,
    min:0,
    splitNumber : 3,
  }
}; 
var values
export default {
name: 'hello',
data () {
    return {
        tableData1: [],
        tableData: [],
        tableData2:[],
        startDraw: -1,
        startDraw2: -1,
        htmlTitle: "报告pdf"
        };
    },
    mounted(){
        
    },
    created(){
        values = this.$route.params
        console.log(values)
        this.$http.get('cpureport',{params:{
            begintick:values['begintick'],
            endtick:values['endtick'],
            targetip:values['targets'][0]
            }}).then(res=>{
                console.log(res.data)
                for (let i = 0; i < res['data']['datas'].length; i++) {
                    if(res['data']['datas'][i]['level'] == 1){
                        res['data']['datas'][i]['woring'] = '低风险'
                        this.tableData.push(res['data']['datas'][i])
                    }
                        if(res['data']['datas'][i]['level'] == 2){
                            res['data']['datas'][i]['woring'] = '中风险'
                        this.tableData.push(res['data']['datas'][i])
                    }
                        if(res['data']['datas'][i]['level'] == 3){
                            res['data']['datas'][i]['woring'] = '高风险'
                        this.tableData.push(res['data']['datas'][i])
                    }
                }
                this.startDraw = 1
            });

            this.$http.get('memoryreport',{params:{
            begintick:values['begintick'],
            endtick:values['endtick'],
            targetip:values['targets'][0]
            }}).then(res=>{
                for (let i = 0; i < res['data']['datas'].length; i++) {
                    if(res['data']['datas'][i]['level'] == 1){
                        res['data']['datas'][i]['level'] = "低风险"
                        this.tableData1.push(res['data']['datas'][i])
                    }
                    if(res['data']['datas'][i]['level'] == 2){
                        console.log(res['data']['datas'][i])
                        res['data']['datas'][i]['level'] = '中风险'
                        this.tableData1.push(res['data']['datas'][i])
                    }
                    if(res['data']['datas'][i]['level'] == 3){
                        res['data']['datas'][i]['level'] = '高风险'
                        this.tableData1.push(res['data']['datas'][i])
                    }
                    if(res['data']['datas'][i]['level'] == 4){
                        res['data']['datas'][i]['level'] = '未知'
                        this.tableData1.push(res['data']['datas'][i])
                    }
                }
            this.startDraw2 = 1
            })

            this.$http.get('trans',{params:{
                sid:values['id']
            }}).then(res4=>{
                console.log(res4.data)

                for (let j = 0; j < res4['data']['infos'].length; j++){
                    var s = {}
                    if( res4['data']['infos'][j]['successrate'] < 98){
                        s['name'] = res4['data']['infos'][j]['name']
                        s['successrate'] = res4['data']['infos'][j]['successrate']
                        s['id'] = res4['data']['infos'][j]['id']
                        console.log(s)
                        this.tableData2.push(s)
                    }
                }
            })

        },
    methods: {
        drawEcharts(row,i){
            this.$nextTick(() => {
                // 得到开始结束时间
                var smax = row['tick'] + parseInt((values['endtick'] - values['begintick']) * 0.025)
                var smin = row['tick'] - parseInt((values['endtick'] - values['begintick']) * 0.025)
                
                option['series'] = []
                var s = {
                    smooth: true,
                    type:'line',
                    name:'used',
                    data:[]
                };
                option['series'].push(s)

                //设置x坐标
                option['xAxis']['data'] = []
                for (let i = smin; i <= smax; i += intervalTime) {
                    option['xAxis']['data'].push(formatDate(i))
                }
                let myChart = this.$echarts.init(document.getElementById('charts'+i), 'westeros');
                this.$http.get("getalalcpuinfo",{params:{
                    begintick:smin,
                    endtick:smax,
                    targetip:values['targets'][0],
                    pid:row['pid']
                }}).then(res=>{
                    option['series'][0]['data'] = []
                    var jstr = res.data
                    if(jstr['ticks'].length <= 0)
                        return
                    var jindex = 0
                    for (let j = smin; j <= smax; j += intervalTime) {
                    if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                        if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                            j++
                        }
                        if(jstr['useds'][jindex] > 10000){
                            console.log(jstr['useds'][jindex])
                            console.log(jindex)
                            option['series'][0]['data'].push(parseFloat(jstr['useds'][jindex - 1]).toFixed(2))
                        }
                        option['series'][0]['data'].push(parseFloat(jstr['useds'][jindex]).toFixed(2))
                        jindex++
                    }else{
                            option['series'][0]['data'].push(0)
                        }
                    }
                    //myChart.clear()
                    //console.log(option)
                    myChart.setOption(option)
                })
            });
        },
        drawMemoryEcharts(row,i){
            this.$nextTick(() => {
                console.log(row)
                var smax = values['endtick']
                var smin = values['endtick'] - 120
                
                
                let myChart = this.$echarts.init(document.getElementById('memroycharts'+i), 'westeros');
                this.$http.get("memoryinfo",{params:{
                    begintick:smin,
                    endtick:smax,
                    targetip:values['targets'][0],
                    pid:row['pid']
                }}).then(res=>{
                    console.log(res.data)
                    option2['series'] = []
                    var s = {
                        smooth: true,
                        type:'line',
                        name:'used',
                        data:[]
                    };
                    option2['series'].push(s)

                    //设置x坐标
                    option2['xAxis']['data'] = []
                    for (let i = smin; i <= smax; i += intervalTime) {
                        option2['xAxis']['data'].push(formatDate(i))
                    }
                    var jstr = res.data
                    var jindex = 0
                    for (let j = smin; j <= smax; j += intervalTime) { // 间隔时间为两秒
                        if(Math.abs(j - jstr['ticks'][jindex]) < intervalTime){
                            if(Math.abs(j - jstr['ticks'][jindex]) >= 1){
                                j++
                            }
                            option2['series'][0]['data'].push(parseInt(jstr['useds'][jindex]))
                            jindex++
                        }else if (jindex > 0 && Math.abs(j + 1 - jstr['ticks'][jindex]) < intervalTime){
                        option2['series'][0]['data'].push(parseInt(jstr['useds'][jindex - 1] + parseInt(jstr['useds'][jindex] + 1)) / 2)
                    }else{
                            option2['series'][0]['data'].push(0)
                        }
                    }
                    myChart.setOption(option2)
                })
            })
            
        }
    }
}
</script>


