<template>
  <div>
    <!--搜索卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" :label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" :label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" :label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" :label="3">审核失败</el-radio>
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select v-model="searchForm.channel_id" clearable placeholder="请选择">
              <!-- clearable可以清除内容 -->
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
        <el-table :data="articleList" style="width: 100%">
          <el-table-column label="图标">
            <template slot-scope="stData">
              <img :src="stData.row.cover.images[0]" width="150" height="100" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间"></el-table-column>
          <el-table-column label="操作">
            <el-button type="primary" icon="el-icon-edit" size="mini" round>修改</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" round>删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="searchForm.per_page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tot"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data () {
    return {
      searchForm: {
        status: '', // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败,不传为全部
        channel_id: '', // 频道的id
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        page: 1, // 设置默认页数
        per_page: 10 // 设置显示行数
      },
      timetotime: [], // 设置用来存储时间数据
      channelList: [], // 用来存储频道数据
      articleList: [], // 文章列表
      tot: 0 // 文章总数
    }
  }, // 监听器设置
  watch: {
    // 设置深度监听,如果有数据变化就重新申请列表数据
    searchForm: {
      handler: function (newV, oldV) {
        this.getArticleList()
      },
      deep: true
    },
    timetotime: function (newv) {
      if (newv) {
        this.searchForm.begin_pubdate = newv[0]
        this.searchForm.end_pubdate = newv[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      this.getArticleList()
    }
  },
  methods: {
    // val发送改变后的值,
    handleSizeChange (val) {
      this.searchForm.per_page = val
      // this.getArticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      // this.getArticleList()
    },
    // 获取频道数据
    getchannelList () {
      this.$http({
        url: '/mp/v1_0/channels',
        method: 'GET'
      })
        .then(res => {
          this.channelList = res.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获取频道失败' + err)
        })
    },
    // 获取列表数据
    getArticleList () {
      // 过滤掉为空的参数
      let searchData = {}
      // 遍历这个数据组
      for (const k in this.searchForm) {
        // 如果有值为0或者存在不为空的值,就给searchData
        if (this.searchForm[k] || this.searchForm[k] === 0) {
          searchData[k] = this.searchForm[k]
        }
      }
      this.$http({
        url: '/mp/v1_0/articles',
        method: 'GET',
        params: searchData
      })
        .then(res => {
          this.articleList = res.data.data.results
          this.tot = res.data.data.total_count
        })
        .catch(err => {
          return this.$message.error('获取列表失败' + err)
        })
    }
  },
  created () {
    // 获取频道
    this.getchannelList()
    // 获取列表
    this.getArticleList()
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
