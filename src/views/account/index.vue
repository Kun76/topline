<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <div class="text item cardbody">
      <div class="lt">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          label-width="100px"
          :rules="accountFormRules"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="intro">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">头像区域</div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        name: '',
        mobile: '',
        email: '',
        intro: ''
      },
      // 设置表单校验
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          { min: 1, max: 7, message: '名字长度介于1-7之间' }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不对' }
        ]
      }
    }
  },
  methods: {
    // 获取当前用户数据
    getAccount () {
      this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'GET'
      })
        .then(res => {
          this.accountForm = res.data.data
        })
        .catch(err => {
          return this.$message.error('获取用户信息错误' + err)
        })
    },
    // 更新账号信息
    editAccount () {
      // 表单验证
      this.$refs.accountFormRef.validate(valid => {
        if (!valid) {
          return false
        }
      })
      // 发送数据
      this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'patch',
        data: this.accountForm
      }).then(res => {
        this.$message.success('修改用户信息成功')
        // 刷新信息
        this.getAccount()
      }).catch(err => {
        this.$message.error('修改用户信息失败' + err)
      })
    }
  },
  created () {
    this.getAccount()
  }
}
</script>

<style lang="less" scoped>
// 给表单 和 头像区域做布局样式设计
.cardbody {
  display: flex;
  justify-content: space-between;
  .lt {
    width: 40%;
    background-color: pink;
  }
  .rt {
    width: 30%;
    background-color: lightgreen;
  }
}
</style>
