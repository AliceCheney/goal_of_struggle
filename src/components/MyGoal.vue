<template>
    <div>
        <div id="big_heard">
            <p v-if="getMyGoalFlag ==='成功'" style="padding: 4% 10%;color: white;font-size: 60px;font-weight: bold;">实现你的Goal !</p>
            <p v-if="getMyGoalFlag !=='成功' && getMyGoalFlag !==''" style="padding: 4% 10%;color: white;font-size: 60px;font-weight: bold;">你没网了 !</p>
            <p v-if=" getMyGoalFlag ===''" style="padding: 4% 10%;color: white;font-size: 60px;font-weight: bold;">你还没登陆</p>
            <p style="padding-left: 10%;width: 80%;color: gainsboro;font-size: 14px;">雨露均撒，泽陂苍生</p>
        </div>
        <div id="index_schedule">
            <el-button @click="searchGoal" icon="el-icon-search" plain style="float: right;margin: 1% 2% 0 0"> </el-button>
            <div style="float: right;padding-top: 1%;">
                <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="title">
                </el-input>
            </div>
            <p style="padding: 1% 2%;font-weight: bold; font-size: 22px">我的目标</p>
            <!-- 近期目标和进度条-->
            <div v-if="getMyGoal.length === 0">
                <p v-if="getMyGoalFlag === '成功' && getMyGoalByTitleFlag ===''" style="font-size: 40px;margin-left: 2%" >还没有目标，去写一个目标吧</p>
                <p v-if="getMyGoalByTitleFlag === '成功'" style="font-size: 40px;margin-left: 2%" >我没找到这个你再想想</p>
                <p v-if="getMyGoalByTitleFlag !== '成功' && getMyGoalByTitleFlag !=='' " style="font-size: 40px;margin-left: 2%" >查找出错了</p>
                <div style="padding: 2% 2%" class="frosted-glass">
                    <el-row :gutter="30">
                        <el-col :span="12" v-for="(item,index) in getMyGoal" :key="index">
                            <!--卡片-->
                            <router-link :to="{path: '/goal', query: {id:item.id}}" >
                                <el-card style="margin: 2% 0">
                                    <div slot="header" class="clearfix">
                                        <span style="font-size: 20px"> 目标：<span style="color: #63498B;font-size: 19px;font-weight: bold">{{item.title}}</span></span>
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
            <div v-if="getMyGoal.length !== 0">

                <div style="padding: 2% 2%">
                    <el-row :gutter="30">
                        <el-col :span="12" v-for="(item,index) in getMyGoal" :key="index">
                            <!--卡片-->
                            <router-link :to="{path: '/goal', query: {id:item.id}}" >
                                <el-card style="margin: 2% 0">
                                    <div slot="header" class="clearfix">
                                        <span style="font-size: 20px"> 目标：<span style="color: #63498B;font-size: 19px;font-weight: bold">{{item.title}}</span></span>
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
        </div>
    </div>
</template>

<script>
    export default {
        name: "MyGoal",
        data(){
          return {
              title:'',
              isLogin:true,
              customColor: '#409eff',
              customColors: [
                  {color: '#f56c6c', percentage: 20},
                  {color: '#e6a23c', percentage: 40},
                  {color: '#5cb87a', percentage: 60},
                  {color: '#1989fa', percentage: 80},
                  {color: '#6f7ad3', percentage: 100}
              ],
          }
        },
        created() {
            if (localStorage.getItem('token')){
                this.isLogin = false;
                this.$store.dispatch('getMyGoal');
            }
        },
        computed:{
            getMyGoalByTitleFlag(){
                return this.$store.state.getMyGoalByTitleFlag
            },
            getMyGoalFlag(){
                return this.$store.state.myGoalFlag
            },
            getMyGoal(){
                return this.$store.state.myGoal
            },
        },
        watch:{

        },
        methods:{
            searchGoal(){
                let title = this.title;
                if (title === ''){
                    this.$store.dispatch('getMyGoal');
                }else {
                    this.$store.dispatch('getMyGoalByTitle',title);
                }
            }
        }
    }
</script>

<style scoped>
    a {
        text-decoration: none;
    }
    #index_schedule{
        border: 1px solid #ebebeb;
        width: 100%;
        background: #f9f9f9;
        border-radius: 5px;
        margin: 1% 0;
    }
    div{
        margin: 0;
    }
    p{
        margin: 0;
    }
    #big_heard{
        background: #63498B;
        height: 300px;
        width: 100%;
        border-radius: 10px;
    }
</style>