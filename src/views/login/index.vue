<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" />
        <!-- prop使得校验规则可以找到当前目录进行匹配校验，值 就是当前项目的名称 -->
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left;" prop="xieyi">
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
    // 声明局部函数实现校验
    let xieyiTest = function (rule, value, callback) {
      // rule校验规则一般没有,value被校验的值,callback回调函数
      // if (value) {
      //   callback()
      // } else {
      //   callback(new Error('请无条件遵守规矩'))
      // }
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      loginForm: {
        mobile: '13011112222', // 手机号
        code: '246810', // 验证码
        xieyi: true // 协议
      },
      // 给form表单域制作校验规则
      loginFormRules: {
        // 项目名称:[{规则},{规则}] required为true项目必填,message错误提示
        // min信息最小限制,max信息最大限制 pattern正则
        mobile: [
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [{ required: true, message: '验证码必填' }],
        xieyi: [{ validator: xieyiTest }] // 自定义校验,协议validator
      }
    }
  },
  methods: {
    login () {
      // 表单验证登录
      // el-form表单对象.validate
      // console.log(this) this.$refs.ref值为该表单组件对象
      this.$refs.loginFormRef.validate(valid => {
        // console.log(valid)校验通过true,不通过为false
        if (!valid) {
          return false
        }
        // 发送请求验证服务器端账号真实校验
        let pro = this.$http({
          url: '/mp/v1_0/authorizations',
          method: 'POST',
          data: this.loginForm
        })
        pro
          .then(res => {
            // console.log(res)
            // 进入后台系统之前保存token,判断是否处于登录状态
            window.sessionStorage.setItem('userinfo', JSON.stringify(res.data.data))
            // name属性实现编程式导航
            this.$router.push({ name: 'home' })
          })
          .catch(err => {
            this.$message.error('手机号码或验证码错误:' + err)
            // console.log(err)
          })
      })
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
