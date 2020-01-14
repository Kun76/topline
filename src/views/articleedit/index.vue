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
          <ul>
            <li class="uploadbox" v-for="item in covernm" :key="item.id" @click="showDialog(item)">
              <span>点击图标选择图片</span>
              <img v-if="editForm.cover.images[item-1]" :src="editForm.cover.images[item-1]" alt="">
                <div v-else class="el-icon-picture-outline"></div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="频道 : " prop="channel_id">
          <ChannelCom @slt="selectHandler" :cid='editForm.channel_id'></ChannelCom>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editarticle(false)">修改</el-button>
          <el-button @click="editarticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="素材图片" :visible.sync="dialogVisible" width="60%" @close="clearImg">
        <!-- 标签切换效果 -->
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="素材库" name="first">
            <ul>
              <li class="image-box" v-for="item in imageList" :key="item.id">
                <img :src="item.url" alt="无图" @click="clkImage" />
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="second">
            <ul>
              <li class="uploadbox" v-for="item in 1" :key="item" @click="showDialog()" style>
                <span>点击图标选择图片</span>
                <div class="el-icon-picture-outline"></div>
              </li>
            </ul>
            <el-upload
              action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
              style="float: right; padding: 3px 0"
              :show-file-list="false"
              name="image"
            >
              <el-button size="small" type="primary">上传图片</el-button>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="tot"
          style="textAlign:center"
          :current-page="querycdt.page"
          :page-size="querycdt.per_page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="imageOK">确 定</el-button>
        </span>
      </el-dialog>
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
    },
    covernm () {
      if (this.editForm.cover.type > 0) {
        return this.editForm.cover.type
      }
      return 0
    }
  },
  data () {
    return {
      editForm: {
        title: '', // 标题
        content: '', // 内容
        cover: {
          type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道
      },
      dialogVisible: false,
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
      },
      // 获取图片列表
      imageList: [],
      querycdt: {
        collect: false,
        page: 1,
        per_page: 12
      },
      tot: 0,
      activeName: 'first', // 默认显示第一个页头
      xu: 0,
      materialUrl: '' // 选中的素材图片的路径名地址信息
    }
  },
  methods: {
    // 展示对话框逻辑
    showDialog (n) {
      this.xu = n - 1
      this.dialogVisible = true // 打开dialog对话框
    },
    // 清除之前的痕迹
    clearImg () {
      let lis = document.querySelectorAll('.image-box')
      for (let i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      this.materialUrl = ''
    },
    // 设置按钮高亮
    clkImage (e) {
      this.clearImg()
      e.target.parentNode.style.border = '5px solid greenyellow'
      // 获取当前图片
      this.materialUrl = e.target.src
    },
    // 获取图片素材列表
    getImageList () {
      this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
        .then(res => {
          this.imageList = res.data.data.results
          this.tot = res.data.data.total_count
        })
        .catch(err => {
          return this.$message.error('获得图片列表失败：' + err)
        })
    },
    // 选取好素材图片
    imageOK () {
      if (this.materialUrl) {
        this.editForm.cover.images[this.xu] = this.materialUrl
        // 关闭对话框
        this.dialogVisible = false
      } else {
        this.$message.error('未选择文件')
      }
    },
    handleSizeChange (val) {
      this.querycdt.per_page = val
      this.getImageList()
    },
    handleCurrentChange (val) {
      this.querycdt.page = val
      this.getImageList()
    },
    // 发布文章方法
    editarticle (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.editForm.cover.type === -1) {
          this.editForm.cover.images.splice(0, 3)
        } else {
          this.editForm.cover.images.splice(this.editForm.cover.type, 3)
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
    this.getImageList()
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}

// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
</style>
