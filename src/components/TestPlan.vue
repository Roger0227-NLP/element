<template>
    <el-container>
    <el-aside width="400px"> <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
  <el-form-item
    prop="robotip"
    label="机器人IP"
    :rules="[
      { required: true, message: '请输入机器人IP', trigger: 'blur' },
      {required:true,pattern:/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
      message:'请输入正确的IP:PORT格式的地址',trigger: 'blur' }
    ]"
  >
    <el-input v-model="dynamicValidateForm.robotip" placeholder="IP:PORT"></el-input>
    <el-input v-model="dynamicValidateForm.usr" placeholder="user"></el-input>
    <el-input v-model="dynamicValidateForm.pwd" placeholder="password" ></el-input>
  </el-form-item>
  <el-form-item
    v-for="(target, index) in dynamicValidateForm.targets"
    :label="'目标'+' ' + index"
    :key="target.key"
    :prop="'targets.' + index + '.value'"
    :rules="[
    {required: true, message: '目标不能为空', trigger: 'blur'},
    {required:true,pattern:/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
      message:'请输入正确的IP:PORT格式的地址',trigger: 'blur' }
    ]"
  >
    <el-input v-model="target.value" placeholder="IP:PORT"></el-input>
    <el-input v-model="target.usr" placeholder="user" ></el-input>
    <el-input v-model="target.pwd" placeholder="password" ></el-input>
    <el-input v-model="target.processes" placeholder="process1;process2;..."></el-input>
    <el-button @click.prevent="removeDomain(target)">删除</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm()">提交</el-button>
    <el-button @click="addDomain">新增目标</el-button>
    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
  </el-form-item>
  
</el-form></el-aside>
    <el-main>  
      <el-table
    :data="tableData"
    height="800"
    border
    style="width: 100%">
    <el-table-column
      prop="sid"
      label="ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="robotip"
      label="RobotIP"
      width="180">
    </el-table-column>
    <el-table-column
      prop="ips"
      label="目标机器">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作">
      <template slot-scope="scope">
         <el-button
          size="mini"
          type="primary"
          @click="handleActive(scope.$index, scope.row)">激活</el-button>
      </template>
    </el-table-column>
  </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
      data() {
      return {
         dynamicValidateForm: {
          targets: [{
            value: '',
            pwd:'',
            usr:'',
            processes:''
          }],
          robotip: '',
          pwd:'',
          usr:''
        },
        tableData:[]
      };
    },
    mounted(){
        this.oncreated()
    },
    methods:{
        oncreated(){
            this.getTestPlanData()
        },
        submitForm() {
            var postdata = {
              robot_server:this.dynamicValidateForm.robotip.split(":")[0],
              password:this.dynamicValidateForm.pwd,
              user:this.dynamicValidateForm.usr,
              port:parseInt(this.dynamicValidateForm.robotip.split(":")[1]),
              targets:[]
            }
            for (let i = 0; i < this.dynamicValidateForm.targets.length; i++) {
              var target = {
                target_server:this.dynamicValidateForm.targets[i].value.split(":")[0],
                user:this.dynamicValidateForm.targets[i].usr,
                password:this.dynamicValidateForm.targets[i].pwd,
                port:parseInt(this.dynamicValidateForm.targets[i].value.split(":")[1]),
                process:[]
              }
              var tmp = this.dynamicValidateForm.targets[i].processes.split(";")
              for (let j = 0; j < tmp.length; j++) {
                target.process.push(tmp[j])
              }
              postdata.targets.push(target)
            }
            console.log(postdata)
            //或者let that = this
            this.$http.post('test_plan_set',postdata).then(response => {
              this.getTestPlanData()
            })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        removeDomain(item) {
          var index = this.dynamicValidateForm.targets.indexOf(item)
          if (index !== -1) {
            this.dynamicValidateForm.targets.splice(index, 1)
          }
        },
        addDomain() {
          this.dynamicValidateForm.targets.push({
            value: '',
            key: Date.now()
          });
        },
        handleActive(index,row){
            this.$http.get('start',{params:{
              sid:row['sid']
              }}).then(res=>{
                  this.$router.go(0)
              })
        },
        getTestPlanData() {
            this.$http.get("gettestplaninfo").then(res=>{
                var datas = res.data['infos']
                for (let i = 0; i < datas.length; i++) {
                    datas[i]['ips'] = ''
                    for(let j = 0; j < datas[i]['targets'].length;j++){
                        datas[i]['ips'] += datas[i]['targets'][j] + ' '
                    }
                }
                this.tableData = datas
            })
        }
    }
}
</script>