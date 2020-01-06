<template >
  <div>
    <div id="big_heard">
      <p v-if="getUpdateGetGoalByIdData.title" style="padding: 6% 10% 1% 10%;color: white;font-size: 60px;font-weight: bold;">{{getUpdateGetGoalByIdData.title}}</p>
      <p v-if="!getUpdateGetGoalByIdData.title" style="padding: 6% 10% 1% 10%;color: white;font-size: 60px;font-weight: bold;">
        你没网了！</p>
      <p style="padding-left: 10%;width: 80%;color: gainsboro;font-size: 20px;">目标时间：<span>
        {{getUpdateGetGoalByIdData.startDate}} 至 {{getUpdateGetGoalByIdData.endDate}}</span></p>
      <el-button type="primary" v-if="!isOther" @click="upDateGoalDialog = true " style="float: right;margin: 20px 40px">更新目标</el-button>
    </div>

<!--    更新目标弹框-->
    <div>
      <el-dialog :visible.sync="upDateGoalDialog" width="500px" center  >
        <p style="text-align: center;font-size: 30px;font-weight: bold;margin: -28px 0 12px 0">目标</p>
        <div>
          <p style="padding-bottom: 12px">  </p>
          <el-date-picker v-model="upDateGoalTime"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"
                          align="right" type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </div>
        <p style="padding: 20px 0 12px 0"> </p>
        <el-input style="margin-bottom: 5px" type="textarea" placeholder="描述" v-model="upDateGoalContent" maxlength="100" show-word-limit> </el-input>
        <div style="padding: 4% 0 2% 0">
          <el-progress :percentage="percentage" :color="customColors"> </el-progress>
          <div style="text-align: center;padding:4% 0 2% 0">
            <el-button-group>
              <el-button icon="el-icon-minus" @click="decrease"> </el-button>
              <el-button icon="el-icon-plus" @click="increase"> </el-button>
            </el-button-group>
          </div>
        </div>
        <div style="text-align: center;">
          <el-button @click="upDateGoalFalse">取 消</el-button>
          <el-button type="primary" @click="upDateGoal" >确 定</el-button>
        </div>
      </el-dialog>
    </div>
<!--    进度-->
    <div class="block" style="background: #fcfcfc;margin: 1% 0 0 0;padding: 0% 2% 0 0;border-radius: 5px;border: 1px solid #ebebeb">
      <div class="block" style="float: right;padding-top: 1%">
        <span style="color: darkgrey">记录查询 : </span>
        <el-date-picker
                :disabled="checkTimeIsShow"
                v-model="checkGoal"
                type="daterange"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions1">
        </el-date-picker>
      </div>
      <p style="padding: 1% 2% 2% 3.5%;font-weight: bold;font-size: 22px">记录</p>
      <p style="font-size: 40px;color: gray;text-align: center;padding: 4% 0" v-if="getUpdateGetGoalDetailData.length === 0">呀，还没有记录呢</p>
      <el-timeline v-if="getUpdateGetGoalDetailData.length !== 0">
        <el-timeline-item v-for="(item,index) in getUpdateGetGoalDetailData" :key="index" :timestamp="item.createDate" placement="top">
          <el-card>
            <p>{{item.content}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {
  name: 'goal',
  created() {
    this.id = this.$route.query.id;
    this.isOther = this.$route.query.isOther;
    let id = this.$route.query.id;
    this.$store.dispatch('getGoalById',id);
  },
  data() {
    return {
      isOther: null,
      checkTimeIsShow:false,
      id:0,
      percentage: 0,
      customColor: '#409eff',
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      checkGoal:'',
      upDateGoalContent:'',
      upDateGoalTime:'',
      upDateGoalDialog:false,
      pickerOptions1: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  computed:{
    getUpdateGetGoalDetailData(){
      return this.$store.state.getGoalDetailData
    },
    getUpdateGetGoalByIdData(){
      return this.$store.state.getGoalByIdData
    },
    getUpdateGoal(){
      return this.$store.state.updateGoalFlag
    },
  },
  watch:{
    getUpdateGetGoalByIdData:{
      deep:true,
      handler(newVal){
        this.percentage = newVal.percentage
      }
    },
    getUpdateGoal:{
      deep:true,
      handler(newVal){
        if (newVal === '成功'){
          this.$message.success('更新成功');
          location.reload()
        }else{
          this.$message.error(newVal);
        }
      }
    },
    checkGoal:{
      deep:true,
      handler(newVal){
        let goalId = this.id;
        let dateFrom = newVal[0];
        let dateTo = newVal[1];
        this.$store.dispatch('getGoalDetailByDate',{goalId,dateFrom,dateTo});
      }
    }
  },
  methods:{
    upDateGoal(){
      let goalId = this.id;
      let content = this.upDateGoalContent;
      let percentage = this.percentage;
      let updateDate = this.upDateGoalTime;
      if (goalId === undefined || percentage === undefined || content === '' ) {
          this.$message({
            message: '要填完整哦',
            type: 'error'
          });
        }else {
          this.$store.dispatch('updateGoal',{goalId,content,percentage,updateDate});
          this.upDateGoalDialog = false
          // console.log(this.upDateGoalTime);
          // console.log(this.upDateGoalContent);
          // console.log(this.percentage)
        }
    },
    upDateGoalFalse(){
      this.upDateGoalDialog = false
    },

    increase() {
      this.percentage += 10;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
    },
    decrease() {
      this.percentage -= 10;
      if (this.percentage < 0) {
        this.percentage = 0;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div{
    margin: 0;
  }
  p{
    margin: 0;
  }
  /*goal头部样式*/
  #big_heard{
    background: #63498B;
    height: 300px;
    width: 100%;
    border-radius: 10px;
  }
</style>
