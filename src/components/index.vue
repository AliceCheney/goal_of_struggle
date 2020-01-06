<template>
<div>
    <div id="big_heard">
        <p v-if="getMyGoalFlag ==='成功' || getMyGoalFlag ==='' " style="padding: 4% 10%;color: white;font-size: 60px;font-weight: bold;">实现你的Goal !</p>
        <p v-if="getMyGoalFlag !=='成功' && getMyGoalFlag !=='' " style="padding: 4% 10%;color: white;font-size: 60px;font-weight: bold;">你没网了 !</p>
        <p style="padding-left: 10%;width: 80%;color: gainsboro;font-size: 14px;">雨露均撒，泽陂苍生</p>
    </div>
    <div id="index_schedule">
        <p style="padding: 1% 2%;font-weight: bold; border-bottom: 1px solid #ebebeb;font-size: 22px">近期目标</p>
<!-- 近期目标和进度条-->
        <div v-if="getMyGoal.length === 0" >
            <p v-if="isLogin" style="font-size: 40px;text-align: center;position: absolute;z-index: 100;width: 80%" >呀，还没有<span style="cursor: pointer;color: cornflowerblue" @click="loginDialog">登录</span>呢</p>
            <p v-if="getMyGoalFlag === '成功'" style="font-size: 40px;text-align: center;position: absolute;z-index: 100;width: 80%" >去写个目标吧</p>
            <div style="padding: 2% 2%" class="frosted-glass">
                <el-row :gutter="30">
                    <el-col :span="12" v-for="(o) in 2" :key="o">
                        <!--卡片-->
                            <el-card>
                                <div slot="header" class="clearfix">
                                    <span style="font-size: 20px"> 目标：<span style="color: #63498B;font-size: 19px;font-weight: bold">瘦到90斤</span></span>
                                </div>
                                <div>
                                    <el-timeline>
                                        <el-timeline-item
                                                v-for="(item,index) in getUpdateGetGoalDetailData"
                                                :key="index"
                                                :timestamp="item.createDate">
                                            {{item.content}}
                                        </el-timeline-item>
                                    </el-timeline>
                                </div>
                                <!--                         进度条样式-->
                                <div style="padding-top: 2%;">
                                    <el-progress :percentage="90"> </el-progress>
                                </div>
                            </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div v-if="getMyGoal.length !== 0">
            <div style="padding: 2% 2%">
                <el-row :gutter="30">
                    <el-col :span="12" v-for="(item,index) in getMyGoal" :key="index">
                        <!--卡片-->
                        <router-link :to="{path: '/goal', query: {id:item.id}}" >
                        <el-card style="margin: 2% 0">
                            <div slot="header" class="clearfix">
                                <span style="font-size: 20px"> 目标：<span style="color: #63498B;font-size: 19px;font-weight: bold">{{item.title}}</span></span>
                                <span style="float: right;cursor: pointer">👍<span style="padding-top: 20px">{{item.awesome}}</span></span>
                            </div>
                            <div>
                                <el-timeline>
                                    <el-timeline-item
                                            v-for="(it,ins) in item.goalDetailList.slice(0,3)"
                                            :key="ins"
                                            :timestamp="it.createDate">
                                        {{it.content}}
                                    </el-timeline-item>
                                </el-timeline>
                            </div>
                            <!--进度条样式-->
                            <div style="padding-top: 2%;">
                                <el-progress :percentage="item.percentage" :color="customColors"> </el-progress>
                            </div>
                        </el-card>
                        </router-link>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div style="border-bottom: 1px  solid #ebebeb;"></div>
        <p style="padding: 1% 2%;font-weight: bold; border-bottom: 1px  solid #ebebeb;font-size: 22px">看看别的</p>
        <div style="padding: 2% 2%">
            <el-row :gutter="20">
                <el-col :span="8" v-for="(item,index) in otherGoal" :key="index">
                    <el-card style="margin-top:3%">
                        <div slot="header" class="clearfix">
                            <el-avatar :src="item.avatar"> </el-avatar>
                            <span  style="position: relative;top: -13px;font-size: 13px"> @<span style="color: cornflowerblue;font-size: 16px">{{item.nickName}}</span></span>
                            <span v-if="!item.alreadyAwesome" @click="awesomeClick(false,item.id,index)" style="float: right;cursor: pointer;z-index: 100">👍<span style="padding-top: 20px">{{item.awesome}}</span></span>
                            <span v-if="item.alreadyAwesome" @click="awesomeClick(true,item.id,index)" style="float: right;cursor: pointer;z-index: 100">👍<span style="padding-top: 20px;color: cornflowerblue" >{{item.awesome}}</span></span>
                        </div>
                        <div @click="jumpOther(item.id)" style="cursor: pointer">
                            <div style="margin: 0;padding-bottom: 10px;font-size: 19px;font-weight: bold">{{item.title}}</div>
                            <div class="text item">{{item.content}}</div>
                            <!--进度条-->
                            <div>
                                <el-progress :text-inside="true" :percentage="item.percentage" :color="customColors"> </el-progress>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "index",
    created() {
        if (localStorage.getItem('token')){
            this.isLogin = false;
            this.$store.dispatch('getMyGoal');
        }
        this.$store.dispatch('getOtherGoal');
    },
    data () {
      return {
          otherGoal:[],
          customColor: '#409eff',
          customColors: [
              {color: '#f56c6c', percentage: 20},
              {color: '#e6a23c', percentage: 40},
              {color: '#5cb87a', percentage: 60},
              {color: '#1989fa', percentage: 80},
              {color: '#6f7ad3', percentage: 100}
          ],
          circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
          squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
          sizeList: ["large", "medium", "small"],
          isLogin:true,
          value: 4,
          activities: [{
              content: '活动按期开始',
              timestamp: '2018-04-15'
          }, {
              content: '通过审核',
              timestamp: '2018-04-13'
          }, {
              content: '创建成功',
              timestamp: '2018-04-11'
          }]
      }
    },
    computed: {
        getUpdateGetGoalDetailData(){
            return this.$store.state.getGoalDetailData
        },
        getLoginFlag(){
            return this.$store.state.loginFlag
        },
        getMyGoal(){
            return this.$store.state.myGoal
        },
        getMyGoalFlag(){
            return this.$store.state.myGoalFlag
        },
        getOtherGoal(){
            return this.$store.state.otherUserGoal
        }
    },
    watch: {
        getOtherGoal: {
            deep: true,
            handler(newVal) {
               this.otherGoal = newVal
            }
        },
        count:{
            handler(newVal){
                // eslint-disable-next-line no-console
                console.log(newVal.week)
                this.week = newVal.week
            }
        },
        getLoginFlag:{
            handler(newVal){
                if (newVal ==='成功'){
                    this.isLogin = false;
                    location.reload()
                }
            }
        },
    },
    methods: {
        awesomeClick(alreadyAwesome,id,index){
            if (alreadyAwesome){
                this.otherGoal[index].alreadyAwesome = false;
                this.otherGoal[index].awesome -= 1;
                this.$store.dispatch('unlikeGoal',id);
            } else {
                this.otherGoal[index].alreadyAwesome = true;
                this.otherGoal[index].awesome += 1;
                this.$store.dispatch('likeGoal',id);
            }
            // console.log(id)
        },

        loginDialog(){
            this.$store.commit('updateLoginDialog',true)
        },
        jumpOther(id) {
            this.$router.push({path:'/goal',query:{id:id,isOther:1}});
        }
    }
}
</script>

<style scoped>
    a {
        text-decoration: none;
    }
    .frosted-glass{
        background: inherit;
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -ms-filter: blur(5px);
        -o-filter: blur(5px);
        filter: blur(5px);
        filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    p{
        margin: 0;
    }

    /*日程*/
    #index_schedule{
        border: 1px solid #ebebeb;
        width: 100%;
        background: #f9f9f9;
        border-radius: 5px;
        margin: 1% 0;
    }
    /*index头部样式*/
   #big_heard{
       background: #63498B;
       height: 300px;
       width: 100%;
       border-radius: 10px;
   }

</style>