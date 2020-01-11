<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormrules">
        <el-form-item label="标题 : " prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容 : " prop="content">
          <quillEditor v-model="addForm.content"></quillEditor>
        </el-form-item>
        <el-form-item label="封面 : ">
          <el-radio-group v-model="addForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="true"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="频道 : " prop="channel_id">
          <ChannelCom @slt="selectHandler"></ChannelCom>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addarticle(false)">发布</el-button>
          <el-button @click="addarticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 通过es6按需导入方式 导入需要的组件模块
import { quillEditor } from 'vue-quill-editor'
// 引入频道独立组件
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'Articleadd',
  data () {
    return {
      addForm: {
        tilte: '', // 标题
        content: '', // 内容
        cover: {
          type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道
      },
      imageUrl: '',
      // 表单验证
      addFormrules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符' }
        ],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        channel_id: [
          { required: true, message: '频道不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 发布文章方法
    addarticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        this.$http({
          url: 'mp/v1_0/articles',
          method: 'POST',
          data: this.addForm,
          params: { draft: flag }
        })
          .then(res => {
            this.$message.success('发布成功' + res)
            this.$router.push({ name: 'article' })
          })
          .catch(err => {
            this.$message.error('发布失败' + err)
          })
      })
    },
    // 获取频道数据
    getchannelList () {
      this.$http({
        url: 'mp/v1_0/channels',
        method: 'GET'
      })
        .then(res => {
          if (res.data.message === 'OK') {
            this.channelList = res.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获取频道失败' + err)
        })
    },
    selectHandler (val) {
      this.addForm.channel_id = val
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    }
  },
  created () {
    this.getchannelList()
  },
  components: {
    quillEditor,
    ChannelCom
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-icon-plus avatar-uploader-icon{
 border: 1px dashed #d9d9d9;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
