<template>
<div>
<el-row>

    <el-col :span="20"><el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      sortable
      label="ID"
      width="70%">
    </el-table-column>
    <el-table-column
      prop="stat"
      sortable
      label="状态"
      width="80%">
    </el-table-column>
    <el-table-column
      prop="begintime"
      sortable
      label="开始时间"
      width="160%">
    </el-table-column>
    <el-table-column
      prop="endtime"
      sortable
      label="结束时间"
      width="160%">
    </el-table-column>
     <el-table-column
      prop="testmode"
      sortable
      label="测试项目"
      width="150%">
    </el-table-column>
     <el-table-column
      prop="result"
      sortable
      label="测试结果"
      width="120%">
    </el-table-column>
     <el-table-column
      sortable
      label="测试结果"
      width="150%">
      <template slot-scope="scope">
          <el-button
          size="mini"
          type = "primary"
          @click="handleResult(scope.$index, scope.row)">查看报告</el-button>
          </template>
    </el-table-column>
    <el-table-column
      prop="robotIP"
      sortable
      label="机器人IP"
      width="180%">
    </el-table-column>
    <el-table-column prop="targetIP"  label="目标机器IP" width="180%">
    </el-table-column>
     <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="info"
          @click="handleRead(scope.$index, scope.row)">查看详细信息</el-button>
         <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
</el-table></el-col>
</el-row>


<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>存在多个IP请选择需要展示的内容</span>
  <el-select v-model="value" placeholder="请选择" @change="onselectchanged">
      <el-option 
        v-for="item in selections"
        :key="item.value"
        :label="item.value"
        :value="item.value">
      </el-option>
    </el-select>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogButtonClicked">确 定</el-button>
  </span>
</el-dialog>

<!-- <el-dialog
  title="提示"
  :visible.sync="dialogVisible2"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="onDialogDeleteClicked">确 定</el-button>
  </span>
</el-dialog> -->

  </div>
</template>

<script>
var selectionIP
var rowtmp
var isReport
function formatDate(now) { 
    var d=new Date(now * 1000);
    var year=d.getFullYear();  //取得4位数的年份
    var month=d.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
    var date=d.getDate();      //返回日期月份中的天数（1到31）
    var hour=d.getHours();     //返回日期中的小时数（0到23）
    var minute=d.getMinutes(); //返回日期中的分钟数（0到59）
    var second=d.getSeconds(); //返回日期中的秒数（0到59）
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
}
export default {
    data() {
      return {
        tableData:[],
        value:'',
        value1:'',
        selections:[],
        dialogVisible:false
      }
    },
    mounted(){
        this.oncreated()
       
    },
    methods:{
        oncreated(){
            console.log("in testinfo")
            this.$http.get("gettestinfo").then(
            res=>{
            console.log('150',res.data['datas'])
            for (let i = 0; i < res.data['datas'].length; i++) {
              if(res.data['datas'][i]['status'] == 1){
                  res.data['datas'][i]['stat'] = "正在测试"
              }
              if(res.data['datas'][i]['status'] == 2){
                  res.data['datas'][i]['stat'] = "测试结束"
              }
              if(res.data['datas'][i]['status'] == 3){
                  res.data['datas'][i]['stat'] = "可激活  "
              }
              if(res.data['datas'][i]['status'] == 0){
                  res.data['datas'][i]['stat'] = "错误"
              }
              res.data['datas'][i]['targetIP'] = ""
              res.data['datas'][i]['begintime'] = formatDate(res.data['datas'][i]['begintick'])
              res.data['datas'][i]['endtime'] = formatDate(res.data['datas'][i]['endtick'])
              for (let j = 0; j < res.data['datas'][i]['targets'].length; j++) {
                res.data['datas'][i]['targetIP'] += res.data['datas'][i]['targets'][j] + ' '
              }
            }
            
            console.log(res.data['datas'])
            
            for(let i = 0; i < res.data['datas'].length; i++) {
              res.data['datas'][i]['result'] = '通过'
                this.$http.get('cpureport',{params:{
                begintick:res.data['datas'][i]['begintick'],
                endtick:res.data['datas'][i]['endtick'],
                targetip:res.data['datas'][i]['targets'][0]
              }}).then(res2=>{
                //console.log(res2['data'])
                for (let j = 0; j < res2['data']['datas'].length; j++){
                    if(res2['data']['datas'][j]['level'] != 0){
                        res.data['datas'][i]['result'] = '未通过'
                        break
                    }
                }
              })
              this.$http.get('memoryreport',{params:{
                begintick:res.data['datas'][i]['begintick'],
                endtick:res.data['datas'][i]['endtick'],
                targetip:res.data['datas'][i]['targets'][0]
              }}).then(res2=>{
                //console.log(res2['data'])
                for (let j = 0; j < res2['data']['datas'].length; j++){
                    if(res2['data']['datas'][j]['level'] != 0){
                        res.data['datas'][i]['result'] = '未通过'
                        break
                    }
                }
              })
              this.$http.get('trans',{params:{
                sid:res.data['datas'][i]['id']
              }}).then(res3=>{
                console.log(res3.data)
                for (let j = 0; j < res3['data']['infos'].length; j++){
                    if(res3['data']['infos'][j]['successrate'] <= 98){
                        res.data['datas'][i]['result'] = '未通过'
                        break
                    }
                }
              })
            }
            this.$nextTick(()=>{
              this.tableData = res.data['datas']
            })
          });
        },
        onselectchanged(param){
            selectionIP = param
        },
        dialogButtonClicked(){
            if(selectionIP == ""){
                this.$alert("请选择IP")
            }
            else {
                rowtmp['targets'][0] = selectionIP
                if (isReport == 1){
                  this.$router.push({name: "report",params:rowtmp})
                }
                else {
                  this.$router.push({name: "menu",params:rowtmp})
                }
                this.dialogVisible = false
            }
        },
        handleDelete(index, row){
            this.$http.get('delete_form',{params:{
            assid:row['id']
            }}).then(res=>{
                this.$router.go(0)
            })
        },
       handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleRead(index, row){
        if(row['targets'].length >= 2){
          this.selections = []
          for (let i = 0; i < row['targets'].length; i++) {
              var selection = {
              value:row['targets'][i],
              label:row['targets'][i]
            }
            this.selections.push(selection)
          }
          selectionIP = ""
          rowtmp = row
          isReport = 0
          this.dialogVisible = true;
        }
        else {
          //this.$router.push({path: "/"})
          this.$router.push({name: "menu",params:row})
          //console.log(row)
          this.dialogVisible = false
        }
      },
      handleResult(index, row){
        if(row['targets'].length >= 2){
          this.selections = []
          for (let i = 0; i < row['targets'].length; i++) {
              var selection = {
              value:row['targets'][i],
              label:row['targets'][i]
            }
            this.selections.push(selection)
          }
          selectionIP = ""
          rowtmp = row
          isReport = 1
          this.dialogVisible = true;
        }
        else {
          this.$router.push({name: "report",params:row})
          this.dialogVisible = false
        }
      }
    }
}
</script>