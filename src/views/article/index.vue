<template>
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
        end_pubdate: '' // 文章发布结束时间
      },
      timetotime: [], // 设置用来存储时间数据
      channelList: []
    }
  }, // 监听器设置
  watch: {
    timetotime: function (newv) {
      if (newv) {
        this.searchForm.begin_pubdate = newv[0]
        this.searchForm.end_pubdate = newv[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  methods: {
    // 获取真实列表数据
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
    }
  },
  created () {
    this.getchannelList()
  }
}
</script>

<style lang="less" scoped>
</style>
