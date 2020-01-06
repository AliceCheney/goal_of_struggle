<template>
    <div id="app">
      <router-view style="width: 80%;margin-left: 10%"> </router-view>
      <el-menu id="left_menu" default-active="1-4-1" class="el-menu-vertical-demo"  :collapse="isCollapse">
        <router-link to="/index">
          <el-menu-item index="1">
            <i class="el-icon-house"> </i>
            <span slot="title">返回主页</span>
          </el-menu-item>
        </router-link>
        <div>
        <el-menu-item index="2" @click="goalDialog = true"  >
          <i class="el-icon-circle-plus-outline"> </i>
          <span slot="title">制定你的目标</span>
        </el-menu-item>
        </div>
        <router-link to="/myGoal">
            <el-menu-item index="3">
                <i class="el-icon-guide"> </i>
                <span slot="title">我的目标</span>
            </el-menu-item>
        </router-link>
        <el-menu-item index="4" v-if="!getUserInfo.avatar" @click="loginDialogTrue">
          <i class="el-icon-user"> </i>
          <span slot="title">请登录</span>
        </el-menu-item>
        <el-submenu v-if="getUserInfo.avatar" index="4">
          <template slot="title">
            <img :src="getUserInfo.avatar" style="width: 100%;height: 50%;border-radius: 50%">
            <span slot="title">{{getUserInfo.nikeName}}</span>
          </template>
          <el-menu-item-group>
            <span slot="title">{{getUserInfo.nikeName}}</span>
            <el-menu-item index="1-1" @click="logout">退出登录</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
        <!--填写目标弹框-->
        <div>
            <el-dialog :visible.sync="goalDialog" width="500px" center  >
                <p style="text-align: center;font-size: 30px;font-weight: bold;margin: -28px 0 12px 0">目标</p>
                <div>
                    <p style="padding-bottom: 12px">  </p>
                    <el-date-picker format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"
                                    v-model="value1"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <p style="padding: 20px 0 12px 0"> </p>
                <el-input type="textarea" autosize placeholder="标题" v-model="title" style="width: 200px"> </el-input>
                <p style="padding: 20px 0 12px 0"> </p>
                <el-input style="margin-bottom: 5px" type="textarea" placeholder="描述" v-model="content" maxlength="50" show-word-limit> </el-input>
                <div style="text-align: center;padding-top: 20px">
                    <el-button @click="goalDialog = false">取 消</el-button>
                    <el-button type="primary" @click="goalTrue()"  :loading=" saveGoalLoading" >确 定</el-button>
                </div>
            </el-dialog>
        </div>
      <!--登录弹框-->
      <div>
          <el-dialog :visible.sync="getLoginDialog" width="500px" center  >
            <div v-if="loginIsShow" style="text-align: center">
              <p style="text-align: center;font-size: 30px;font-weight: bold;margin: -25px 0 10px 0">登录</p>
            <el-form style="text-align: left"  :model="LoginForm" :rules="logRules" ref="LoginForm" :label-position="labelPosition" label-width="80px" >
              <el-form-item style="margin-bottom: 6px" label="用户名" prop="username">
                <el-input  v-model="LoginForm.username" placeholder="请输入邮箱" >
                </el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 6px" label="密码" prop="password">
                <el-input v-model="LoginForm.password" placeholder="请输入密码" show-password> </el-input>
              </el-form-item>
            </el-form>
            <p @click="loginIsShow = false" style="font-size: 12px;padding-bottom: 16px;text-align: center;color: cornflowerblue;cursor: pointer"  >还没账号？点我注册</p>
            <span slot="footer" class="dialog-footer" >
              <el-button @click="logReset('LoginForm')">取 消</el-button>
              <el-button type="primary" :loading="loginLoading" @click="loginSubmit('LoginForm')">确 定</el-button>
            </span>
            </div>
            <!--注册弹框-->
            <div v-if="!loginIsShow" >
              <p style="text-align: center;font-size: 30px;font-weight: bold;margin: -25px 0 10px 0">注册</p>
              <el-form  :label-position="labelPosition" :model="regForm" status-icon :rules="regRules" ref="regForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item style="margin-bottom: 6px" label="用户名" prop="username">
                    <el-input v-model.number="regForm.username"> </el-input>
                  </el-form-item>
                  <el-form-item style="margin-bottom: 6px" label="邮箱" prop="email">
                  <el-input v-model.number="regForm.email"> </el-input>
                  </el-form-item>
                  <el-form-item style="margin-bottom: 6px" label="密码" prop="password">
                    <el-input type="password" v-model="regForm.password" autocomplete="off" show-password> </el-input>
                  </el-form-item>
                  <el-form-item style="margin-bottom: 6px" label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="regForm.checkPass" autocomplete="off" show-password> </el-input>
                  </el-form-item>
                  <p @click="loginIsShow = true" style="font-size: 12px;padding-bottom: 16px ;text-align: center;color: cornflowerblue;cursor: pointer" >已有账号？点我登录</p>
                  <el-form-item style="text-align: center;padding: 0">
                    <el-button @click="resetForm('regForm')">取消</el-button>
                    <el-button type="primary" :loading="regLoading" @click="regSubmit('regForm')">提交</el-button>
                  </el-form-item>
                </el-form>
            </div>
          </el-dialog>
      <!--弹框结束-->
      </div>
    </div>
</template>
<style scoped>

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  #left_menu{
    position: fixed;
    top: 50%;
    margin-top: -112px;
    z-index: 100;
  }
  p{
    margin: 0;
  }
</style>
<script>
  export default {
    name:'app',
    created(){
      if (localStorage.getItem("token")){
        this.$store.dispatch('testToken')
      }
    },
    data() {
      //注册判断
      let checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        setTimeout(() => {
          let loginUsernameReg = new RegExp(/^[0-9a-zA-Z_\-@]{4,12}$/);
          if (loginUsernameReg.test(value)){
            callback();
          }else {
            callback(new Error('用户名格式不正确 只能输入4-12位字母 数字 -_@'))
          }
        }, 500);
      };
      let checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }
        setTimeout(() => {
          let emailReg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
          if (emailReg.test(value)){
            callback();
          }else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100);
      };
      let validatePass = (rule, value, callback) => {
        let passwordReg = new RegExp(/^[0-9a-zA-Z~!@#$%^&*()_+|}{?><,./';:=[\]\\`-]{6,18}$/);
        if (value === '') {
          callback(new Error('请输入密码'));
        } if (!passwordReg.test(value)){
          callback(new Error('请输入6-18位数字字母英文字符'));
        } else {
          if (this.regForm.checkPass !== '') {
            this.$refs.regForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.regForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
          regLoading:false,
          loginLoading:false,
          title: '',
          content: '',
          value2: '',
          saveGoalLoading:false,
        goalDialog:false,
        text: '',
        textarea: '',
        loginIsShow:'true',
        labelPosition: 'top',
        input: '',
        isCollapse: true,
        loginDialogGoal:false,
        LoginForm: {
          username: '',
          password: '',
        },
        regForm: {
          password: '',
          checkPass: '',
          username: '',
          email:''
        },
        logRules:{
          username:[
            { validator: checkUsername, trigger: 'blur' }
          ],
          password:[
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        regRules: {
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          email: [
            { validator: checkEmail, trigger: 'blur' }
          ],
        },
        value1: '',
      };
    },
    computed:{
      getLoginFlag(){
        return this.$store.state.loginFlag
      },
      getUserInfo(){
        return this.$store.state.userInfo
      },
      getRegFlag(){
        return this.$store.state.regFlag
      },
        getLoginDialog(){
          return this.$store.state.loginDialog
        },
        getSaveGoalFlag(){
            return this.$store.state.saveGoalFlag
        }
    },
    watch:{
        getSaveGoalFlag:{
            deep:true,
            handler(newVal){
                this.regLoading = false;
                if (newVal === '成功'){
                    this.$message({
                        message: '制定成功',
                        type: 'success'
                    });
                    this.saveGoalLoading = false;
                    this.goalDialog = false;
                    location.reload()
                }else {
                    this.saveGoalLoading = false;
                    this.$message.error(newVal);
                }
            }
        },
      getLoginFlag:{
        deep:true,
        handler(newVal){
            this.loginLoading = false;
          if (newVal === '成功'){
            this.$message({
              message: '登录成功',
              type: 'success'
            });
              location.reload();
              this.$store.commit('updateLoginDialog',false)
          }else {
            this.$message.error(newVal);
          }
        }
      },
      getUserInfo:{
        deep:true,
        handler(newVal){
          if (!newVal.userId){
            this.$message.error(newVal);
          }
        }
      },
      getRegFlag:{
        deep:true,
        handler(newVal){
          if (newVal === '成功'){
            this.$message({
              message: '注册成功',
              type: 'success'
            });
              this.$store.commit('updateLoginDialog',false)
          }else {
            this.$message.error(newVal);
              this.$store.commit('updateLoginDialog',false)
          }
        }
      }
    },
    methods: {
        // 目标确定按钮
        goalTrue(){
            if (localStorage.getItem('token')){
                if (this.value1[0] === undefined || this.value1[1] === undefined ||
                    this.title === '' || this.content === ''  ) {
                    this.$message({
                        message: '要填完整哦',
                        type: 'error'
                    });
                    return
                }
                this.saveGoalLoading = true;
                let startDate = this.value1[0];
                let endDate = this.value1[1];
                let title = this.title;
                let content = this.content;
                this.$store.dispatch('saveGoal',{startDate,endDate,title,content});
            }else {
                this.$message({
                    message: '你还没登陆呢',
                    type: 'error'
                });
            }
        },
      //登录确定按钮
      loginSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let username = this.LoginForm.username;
            let password = this.LoginForm.password;
            this.loginLoading = true;
            this.$store.dispatch('login',{username, password})
          } else {
            return false;
          }
        });
      },
      logReset(formName) {
          this.$store.commit('updateLoginDialog',false);
        this.$refs[formName].resetFields();
      },
      //注册确定
      regSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let username = this.regForm.username;
            let email = this.regForm.email;
            let password = this.regForm.password;
            this.regLoading = true;
            this.$store.dispatch('register',{username,email,password});
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
          this.$store.commit('updateLoginDialog',false);
      },
      logout(){
        localStorage.removeItem("token")
        this.$store.commit("updateUserInfo","已退出")
          location.reload();
      },
      loginDialogTrue(){
          this.$store.commit('updateLoginDialog',true)
      }
    }
  }
</script>

