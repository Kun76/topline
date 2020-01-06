<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules='loginFormRules'>
        <img src="./logo_index.png"/>
        <!-- prop使得校验规则可以找到当前目录进行匹配校验，值 就是当前项目的名称 -->
        <el-form-item prop='moblie'>
          <el-input v-model="loginForm.moblie" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop='code'>
          <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left;">
           <!-- 复选框，单个复选框直接设置v-model即可，接收true/false的信息，表示是否选中 -->
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button style="width:100%;" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        moblie: '', // 手机号
        code: '', // 验证码
        xieyi: false // 协议
      },
      // 给form表单域制作校验规则
      loginFormRules: {
        moblie: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          { required: true, message: '验证码必填' }
        ]
      }
    }
  },
  methods: {
    login () {
      // name属性实现编程式导航
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg");
  background-size: cover;
  .login-box {
    width: 410px;
    height: 340px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .el-form {
      width: 75%;
      img {
        width: 55%;
        margin: 20px auto;
      }
    }
  }
}
</style>
