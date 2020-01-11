<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改文章</span>
      </div>
      <el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormrules">
        <el-form-item label="标题 : " prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容 : " prop="content">
          <quillEditor v-model="editForm.content"></quillEditor>
        </el-form-item>
        <el-form-item label="封面 : ">
          <el-radio-group v-model="editForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道 : " prop="channel_id">
          <ChannelCom @slt="selectHandler" :cid='editForm.channel_id'></ChannelCom>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editarticle(false)">修改</el-button>
          <el-button @click="editarticle(true)">存入草稿</el-button>
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
// 导入频道独立组件
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleEdit',
  components: {
    ChannelCom,
    quillEditor
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  data () {
    return {
      editForm: {
        tilte: '', // 标题
        content: '', // 内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道
      },
      // 表单验证
      editFormrules: {
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
    editarticle (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        this.$http({
          url: `mp/v1_0/articles/${this.aid}`,
          method: 'PUT',
          data: this.editForm,
          params: { draft: flag }
        })
          .then(res => {
            this.$message.success('修改成功' + res)
            this.$router.push({ name: 'article' })
          })
          .catch(err => {
            this.$message.error('修改失败' + err)
          })
      })
    },
    // 通过id获取数据
    getArticleByAid () {
      let pro = this.$http.get(`mp/v1_0/articles/${this.aid}`)
      pro
        .then(res => {
          this.editForm = res.data.data
        })
        .catch(err => {
          return this.$message.error('获取文章失败' + err)
        })
    },
    selectHandler (val) {
      this.editForm.channel_id = val
    }
  },
  created () {
    this.getArticleByAid() // 获得指定文章
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
