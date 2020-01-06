import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
// Make sure to call Vue.use(Vuex) first if using a module system
export default new Vuex.Store({
    state: {
        loginFlag:'',
        userInfo:{},
        regFlag:'',
        loginDialog: false,
        saveGoalFlag:'',
        myGoal:[],
        myGoalFlag:'',
        otherUserGoal:[],
        updateGoalFlag:'',
        getGoalByIdData:{},
        getGoalDetailData:[],
        getMyGoalByTitleFlag:''
    },
    mutations: {
        updateGetMyGoalByTitleFlag(state,getMyGoalByTitleFlag){
            state.getMyGoalByTitleFlag = getMyGoalByTitleFlag
        },
        updateGetGoalDetailData(state,getGoalDetailData){
            state.getGoalDetailData = getGoalDetailData
        },
        updateGetGoalByIdData(state,getGoalByIdData){
            state.getGoalByIdData = getGoalByIdData
        },
        updateUpdateGoalFlag(state,updateGoalFlag){
            state.updateGoalFlag = updateGoalFlag
        },
        updateOtherUserGoal(state,otherUserGoal){
            state.otherUserGoal = otherUserGoal
        },
        updateMyGoal(state,myGoal){
            state.myGoal = myGoal
        },
        updateLoginFlag(state,loginFlag){
            state.loginFlag = loginFlag
        },
        updateUserInfo(state,userInfo){
            state.userInfo = userInfo
        },
        updateRegFlag(state,regFlag){
            state.regFlag = regFlag
        },
        updateLoginDialog(state,loginDialog){
            this.state.loginDialog = loginDialog
        },
        upSaveGoalFlag(state,saveGoalFlag){
            this.state.saveGoalFlag = saveGoalFlag
        },
        updateMyGoalFlag(state,myGoalFlag){
            this.state.myGoalFlag = myGoalFlag
        }
    },
    actions:{
        /**
         * 点赞
         */
        likeGoal(context,goalId){
            axios({
                method:'put',
                url:'http://cshujie.com:3362/goal/likeGoal?goalId='+goalId
            })
        },
        unlikeGoal(context,goalId){
            axios({
                method:'put',
                url:'http://cshujie.com:3362/goal/unlikeGoal?goalId='+goalId
            })
        },

        /**
         * 通过title获取目标
         */
        getMyGoalByTitle(context,title){
            axios({
                method:'get',
                url:'http://cshujie.com:3362/goal/getMyGoalByTitle?title='+title,
                headers:{
                    token:localStorage.getItem('token')
                }
            }).then( response =>{
                if (response.data.message === '成功'){
                    context.commit('updateMyGoal',response.data.data);
                    context.commit('updateGetMyGoalByTitleFlag',response.data.message);
                }else {
                    context.commit('updateGetMyGoalByTitleFlag',response.data.message);
                }
            }).catch( error =>{
                context.commit('updateGetMyGoalByTitleFlag','网络连接失败');
                console.log(error)
            })
        },
        /**
         *按时间查目标更新
         */
        getGoalDetailByDate(context,{goalId,dateFrom,dateTo}){
            axios({
                method:'get',
                url:'http://cshujie.com:3362/goal/getGoalDetailByDate?goalId='+goalId+'&dateFrom='+dateFrom+'&dateTo='+dateTo
            }).then( response =>{
                if (response.data.message === '成功'){
                    context.commit('updateGetGoalDetailData',response.data.data);
                }else {
                    context.commit('updateGetGoalDetailData',response.data.message);
                }
            }).catch( error =>{
                context.commit('updateGetGoalDetailData','网络连接失败');
                console.log(error)
            })
        },
        /**
         * 获取目标详情
         */
        getGoalById(context,id){
            let formData = new FormData();
            formData.append('id',id);
            axios({
                method:'get',
                url:'http://cshujie.com:3362/goal/getGoalById?id='+id,
                data:formData,
                headers:{
                    token:localStorage.getItem('token')
                }
            }).then( response =>{
                if (response.data.message === '成功'){
                    response.data.data.goalDetailList.push({content:'第一次创建',createDate:response.data.data.createDate});
                    context.commit('updateGetGoalDetailData',response.data.data.goalDetailList);
                    context.commit('updateGetGoalByIdData',response.data.data);
                }else {
                    context.commit('updateGetGoalByIdData',response.data.message);
                }
            }).catch( error =>{
                context.commit('updateGetGoalByIdData','网络连接失败');
                console.log(error)
            })
        },
        /**
         * 更新目标
         */
        updateGoal(context,{goalId,content,percentage,updateDate}){
            let formData = new FormData();
            formData.append('goalId',goalId);
            formData.append('content',content);
            formData.append('percentage',percentage);
            formData.append('updateDate',updateDate);
            axios({
                method:'post',
                url:'http://cshujie.com:3362/goal/updateGoal',
                data:formData,
                headers:{
                    token:localStorage.getItem('token')
                }
            }).then( response =>{
                if (response.data.message === '成功'){
                    context.commit('updateUpdateGoalFlag','');
                    context.commit('updateUpdateGoalFlag',response.data.message);
                }else {
                    context.commit('updateUpdateGoalFlag',response.data.message);
                }

            }).catch( error =>{
                context.commit('updateUpdateGoalFlag','网络连接失败');
                console.log(error)
            })
        },
        /**
         * 获取他人目标
         */
        getOtherGoal(context){
            axios({
                method:'get',
                url:'http://cshujie.com:3362/goal/getOtherUsersGoal?pageNum=1&pageSize=15',
                headers:{
                    token:localStorage.getItem('token')
                }
            }).then( response =>{
                if (response.data.message === '成功'){
                    context.commit('updateOtherUserGoal',response.data.data);
                }else {
                    context.commit('updateOtherUserGoal',response.data.message);
                }
            }).catch( error =>{
                context.commit('updateOtherUserGoal','网络连接失败');
                console.log(error)
            })

        },
        /**
         * 获取我的目标
         */
        getMyGoal(context){
          axios({
              method:'get',
              url:'http://cshujie.com:3362/goal/getMyGoal',
              headers:{
                  token:localStorage.getItem('token')
              }
          }).then( response =>{
              if (response.data.message === '成功'){
                  context.commit('updateMyGoal',response.data.data);
                  context.commit('updateMyGoalFlag',response.data.message);
              }else {
                  context.commit('updateMyGoalFlag',response.data.message);
              }
          }).catch( error =>{
              context.commit('updateMyGoalFlag','网络连接失败');
              console.log(error)
          })
        },
        /**
         * 制定目标
         */
        saveGoal(context,{startDate,endDate,title,content}){
            let formData = new FormData();
            formData.append('startDate',startDate);
            formData.append('endDate',endDate);
            formData.append('title',title);
            formData.append('content',content)
            axios({
                method:'post',
                url:'http://cshujie.com:3362/goal/saveGoal',
                data: formData,
                headers:{
                    token:localStorage.getItem('token')
                }
            }).then(response =>{
                if (response.data.message === '成功'){
                    context.commit('upSaveGoalFlag','');
                    context.commit('upSaveGoalFlag',response.data.message);
                }else {
                    context.commit('upSaveGoalFlag',response.data.message);
                }
            }).catch(error =>{
                context.commit('upSaveGoalFlag','网络连接失败');
                console.log(error)
            })

        },
        /**
         *登录
         */
        login(context,{username,password}){
            let formData = new FormData();
            formData.append('username',username);
            formData.append('password',password);
            axios({
                method: 'post',
                url: 'http://cshujie.com:8776/login',
                data: formData
            }).then(response => {
                if (response.data.message === '成功'){
                    localStorage.setItem('token',response.data.data);
                    context.commit('updateLoginFlag',response.data.message);
                    if (localStorage.getItem("token")){
                        context.dispatch('testToken')
                    }
                }else {
                    context.commit('updateLoginFlag',response.data.message);
                }
            }).catch(error => {
                context.commit('updateLoginFlag','网络连接失败');
                console.log(error)
            });
        },
        /**
         *判断token
         */
        testToken(context){
            let formData = new FormData();
            formData.append('token',localStorage.getItem("token"));
            if (localStorage.getItem("token")){
                axios({
                    method: 'post',
                    url: 'http://cshujie.com:8776/testToken',
                    data: formData
                }).then(response => {
                    if (response.data.message === '成功'){
                        context.commit('updateUserInfo',response.data.data);
                    }else {
                        context.commit('updateUserInfo',response.data.message)
                    }
                }).catch(error =>{
                    context.commit('updateUserInfo','网络连接失败，请稍后重试');
                    console.log(error)
                })
            }
        },
        /**
         * 注册判断
         */
        register(context,{username,email,password}){
            let formData = new FormData();
            formData.append('username',username);
            formData.append('email',email);
            formData.append('password',password);
            axios({
                method: 'post',
                url: 'http://cshujie.com:8776/user/register',
                data: formData
            }).then(response => {
                if (response.data.message === '成功'){
                    localStorage.setItem('token',response.data.data);
                    context.commit('updateRegFlag',response.data.message);
                    location.reload()
                }else {
                    context.commit('updateRegFlag',response.data.message);
                }
            }).catch(error => {
                context.commit('updateRegFlag','网络连接失败');
                console.log(error)
            })
        }
    }
});





