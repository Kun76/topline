<template>
  <!-- 创建频道列表独立 -->
  <el-select v-model="chid" placeholder="请选择" clearable>
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ChannelCom',
  props: {
    // 接收父给子传递的频道信息
    cid: {
      default: 0 // 设置默认值
    }
  },
  watch: {
    // 对cid做监听，使得cid的信息被赋予给chid使用
    cid (newV) {
      this.chid = newV
    },
    // 对chid做监听
    chid (newV) {
      // 调用自己的slt方法
      this.$emit('slt', newV)
    }
  },
  data () {
    return {
      chid: '', // 记录当前选中的频道信息
      channelList: [] // 频道列表
    }
  },
  created () {
    // 获得频道列表
    this.getchannelList()
  },
  methods: {
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
