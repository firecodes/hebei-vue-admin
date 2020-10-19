<template>
  <div>
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <el-date-picker v-model="daterange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" class="mr-1" @change="handleFilter" />
      </div>
      <div style="line-height: 32px">
        <el-button type="primary" icon="el-icon-download" class="mr-1" @click="handleDownload">导出 Excel</el-button>
        元/立方米
      </div>
    </div>

    <!-- 表格数据 -->
    <el-table :data="tableData" v-loading="listLoading" border stripe>
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column prop="beijing" label="北京" align="center" />
      <el-table-column prop="tianjin" label="天津" align="center" />
      <el-table-column prop="hebei" label="河北" align="center" />
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { daterange1month, parseDate, getDefaultValue } from '@/utils'
import { getGatePrice } from '@/api/data'
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/options'
export default {
  components: { Pagination },
  data() {
    return {
      pickerOptions,
      daterange: daterange1month(),
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        start: '',
        end: ''
      },
      resData: {},
      // tableData: [],
      totalCount: 0, // 总条数
      listLoading: true // 加载动画
    }
  },
  created() {
    this.getList()
  },
  computed: {
    tableData() {
      let days = Object.keys(this.resData)
      days = days.sort((a, b) => new Date(b) - new Date(a))
      const res = []
      days.forEach(day => {
        const arr = this.resData[day]
        res.push({ date: day, beijing: arr[0].priceSingle, tianjin: arr[1].priceSingle, hebei: arr[2].priceSingle })
      })

      return res
    }
  },
  methods: {
    // 获取列表
    async getList() {
      this.listLoading = true
      this.listQuery.start = parseDate(this.daterange[0])
      this.listQuery.end = parseDate(this.daterange[1])
      const res = await getGatePrice(this.listQuery)
      if (res.status === 0) {
        this.resData = res.data
        this.totalCount = res.totalCount
        this.listLoading = false
      }
    },

    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    // 导出
    handleDownload() {
      const start = parseDate(this.daterange[0])
      const end = parseDate(this.daterange[1])
      const url = `${process.env.VUE_APP_BASE_API}/api/datacenter/price/forecast/export/gatePrice?start=${start}&end=${end}`
      window.open(url)
    }
  }
}
</script>
