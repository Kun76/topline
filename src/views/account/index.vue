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
      <div class="rt">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="httpRequest"
        >
          <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" width="300" height="300"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
import bus from '@/utils/bus.js'
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        name: '',
        mobile: '',
        email: '',
        intro: '',
        photo: ''
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
    // 自定义用户图标上传
    httpRequest (res) {
      // 利用res获取被上传文件对象
      let pic = res.file
      let fd = new FormData()
      // 把图片对象放fd里面
      fd.append('photo', pic)
      this.$http({
        url: '/mp/v1_0/user/photo',
        method: 'patch',
        data: fd
      }).then(res => {
        this.$message.success('更新用户头像成功')
        bus.$emit('upAccountPhoto', res.data.data.photo)
        this.getAccount()
      }).catch(err => {
        return this.$message.error('更新用户头像失败' + err)
      })
    },
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
      })
        .then(res => {
          this.$message.success('修改用户信息成功')
          bus.$emit('upAccountName', res.data.data.name)
          // 刷新信息
          this.getAccount()
        })
        .catch(err => {
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
  }
  .rt {
    width: 30%;
  }
}
</style>
