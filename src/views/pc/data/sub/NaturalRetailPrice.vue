<template>
  <div>
    <!-- 操作区域 -->
    <el-row>
      <!-- 搜索区域 -->
      <el-col :span="16">
        <el-form :inline="true" :model="listQuery">
          <el-form-item label="日期">
            <el-date-picker v-model="listQuery.daterange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" @change="handleFilter" />
          </el-form-item>
          <el-form-item label="城市">
            <el-cascader v-model="listQuery.location" :options="locationOption" :props="{ expandTrigger: 'hover' }" @change="handleFilter" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleFilter" />
          </el-form-item>
          <el-form-item />
        </el-form>
      </el-col>
      <el-col :span="8" class="text-right" style="line-height: 32px"> <el-button type="primary" icon="el-icon-download" class="mr-1">下载</el-button>单位：元/立方米 </el-col>
    </el-row>
    <!-- <v-chart :options="lineOption"/> -->
    <!-- 表格数据 -->
    <el-table :data="tableData" <el-table :data="tableData" border stripe>
      border stripe>
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column prop="num1" label="民用" align="center" />
      <el-table-column prop="num2" label="工商业" align="center" />
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import fetchJsonp from 'fetch-jsonp'
import { daterange1month, parseDate, getDefaultValue } from '@/utils'
import Pagination from '@/components/Pagination'
import { pickerOptions, locationOption } from '@/utils/options'

export default {
  components: { Pagination },
  data() {
    return {
      pickerOptions,
      locationOption,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        location: ['河北', '河北-保定'],
        daterange: daterange1month()
      },
      totalCount: 0, // 总条数
      tableData: [],
      tableDataWhole: [],
      listLoading: true // 加载动画
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const start = this.listQuery.daterange[0]
      const end = this.listQuery.daterange[1]
      const location = this.listQuery.location[this.listQuery.location.length - 1]

      fetchJsonp(`http://152.136.232.230:8081/api/screen/price/retailprice?start=${parseDate(start)}&end=${parseDate(end)}&location=${location}`)
        .then(response => {
          return response.json()
        })
        .then(json => {
          if (json.status !== 0) return this.$message.error('获取数据失败')
          this.$message.success('获取数据成功')
          // 得到表格数据
          const data = []
          const defaultNum1 = getDefaultValue(json.data['民用'])
          const defaultNum2 = getDefaultValue(json.data['工商业'])

          for (let index = end.getTime(); index >= start.getTime(); ) {
            const date = parseDate(new Date(index), 'yyyy-MM-dd')
            data.push({
              date: date,
              num1: (json.data['民用'] && json.data['民用'][date] && json.data['民用'][date].priceSingle) || defaultNum1,
              num2: (json.data['工商业'] && json.data['工商业'][date] && json.data['工商业'][date].priceSingle) || defaultNum2
            })
            index -= 3600 * 1000 * 24
          }

          this.tableDataWhole = data
          this.total = this.tableDataWhole.length
          this.turnPage()
        })
        .catch(function (ex) {
          console.log('parsing failed', ex)
        })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    turnPage() {
      const startIndex = (this.listQuery.pageNum - 1) * this.listQuery.pageSize
      const endIndex = this.listQuery.pageNum * this.listQuery.pageSize
      this.tableData = this.tableDataWhole.slice(startIndex, endIndex)
    },
    // 翻页
    handleCurrentChange(page) {
      this.listQuery.pageNum = page
      this.turnPage()
    },
    // 改变每一页的数据量
    handleSizeChange(size) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = size
      this.turnPage()
    },
    handleChange() {}
  }
}
</script>
