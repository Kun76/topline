<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>粉丝统计</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <div id="main"  ref='mainref' style="width:600px;height:400px"></div>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
export default {
  data () {
    return {
      myChart: null // 接收echarts图表对象
    }
  },
  name: 'Fans',
  methods: {
    paintPic () {
      // var myChart = echarts.init(document.getElementById('main'))
      // this.$refs.mainref可以通过ref方法获取dom对象
      this.myChart = echarts.init(this.$refs.mainref)
      // 绘制图表
      let option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 绘制图表
      this.myChart.setOption(option)
      // 获取数据对图表进行二次填充
      this.getFansStat()
    },
    // 封装方法获取成员名称
    getkeys (obj) {
      var keys1 = []
      for (var p1 in obj) {
        if (obj.hasOwnProperty(p1)) { keys1.push(p1) }
      }
      return keys1
    },
    // 动态获取服务器真实粉丝数据
    getFansStat () {
      let pro = this.$http({
        url: '/mp/v1_0/statistics/followers',
        method: 'get'
      })
      pro.then(res => {
        // console.log(res)
        // 通过getkeys方法获取到名字集合
        let keys = this.getkeys(res.data.data.age)
        // console.log(keys)
        // 创建一个空数组
        let dataobj = []
        // 获取这个对象
        let ages = res.data.data.age
        // 遍历添加到obj中
        for (const k in ages) {
          dataobj.push({ value: ages[k], name: k })
        }
        let opt = {
          legend: {
            data: keys
          },
          series: [
            {
              data: dataobj
            }
          ]
        }
        // echarts图表对象调用改成员
        this.myChart.setOption(opt)
      }).catch(err => {
        return this.$message.error('获得粉丝统计数据失败：' + err)
      })
    }
  },
  // 页面渲染结束后调用paintpic显示图表
  mounted () {
    this.paintPic()
  }
}
</script>

<style lang="less" scoped>
</style>
