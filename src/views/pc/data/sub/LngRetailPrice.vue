<template>
  <div>
    <!-- 操作区域 -->
    <el-row>
      <!-- 搜索区域 -->
      <el-col :span="16">
        <el-form :inline="true" :model="queryInfo">
          <el-form-item label="日期">
            <el-date-picker
              v-model="queryInfo.daterange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              :clearable="false"
              @change="handleQuery"
            />
          </el-form-item>
          <el-form-item label="城市">
            <el-cascader
              v-model="queryInfo.location"
              :options="locationOption"
              :props="{ expandTrigger: 'hover' }"
              @change="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery" />
          </el-form-item>
          <el-form-item />
        </el-form>
      </el-col>
      <el-col :span="8" class="text-right" style="line-height: 32px;">
        <el-button type="primary" icon="el-icon-download" class="mr-1">下载</el-button>单位：元/公升
      </el-col>
    </el-row>
    <!-- <v-chart :options="lineOption"/> -->
    <!-- 表格数据 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column prop="num1" label="价格" align="center" />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="text-center mt-1"
      background
      layout="prev, pager, next, sizes, total"
      :total="total"
      :current-page="queryInfo.pageNum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="queryInfo.pageSize"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>
<script>
import fetchJsonp from 'fetch-jsonp'

import { daterange1month, parseDate, getDefaultValue } from '@/utils'
import { pickerOptions, locationOptionSmall } from '@/utils/options'

export default {
  data() {
    return {
      pickerOptions,
      locationOption: locationOptionSmall,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        location: ['河北', '河北-保定'],
        daterange: daterange1month()
      },
      total: 0,
      tableData: [],
      tableDataWhole: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const start = this.queryInfo.daterange[0]
      const end = this.queryInfo.daterange[1]
      const location = this.queryInfo.location[this.queryInfo.location.length - 1]

      fetchJsonp(`http://152.136.232.230:8081/api/screen/price/lngRetail?start=${parseDate(start)}&end=${parseDate(end)}&location=${location}`)
        .then(response => {
          return response.json()
        })
        .then(json => {
          if (json.status !== 0) return this.$message.error('获取数据失败')
          this.$message.success('获取数据成功')
          // 得到表格数据
          const data = []
          const defaultNum1 = getDefaultValue(json.data)

          console.log('defaultNum1=', defaultNum1)

          for (let index = end.getTime(); index >= start.getTime(); ) {
            const date = parseDate(new Date(index), 'yyyy-MM-dd')
            data.push({
              date: date,
              num1: (json.data && json.data[date] && json.data[date].priceSingle) || defaultNum1
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
    handleQuery() {
      this.queryInfo.pageNum = 1
      this.getData()
    },
    turnPage() {
      const startIndex = (this.queryInfo.pageNum - 1) * this.queryInfo.pageSize
      const endIndex = this.queryInfo.pageNum * this.queryInfo.pageSize
      this.tableData = this.tableDataWhole.slice(startIndex, endIndex)
    },
    // 翻页
    handleCurrentChange(page) {
      this.queryInfo.pageNum = page
      this.turnPage()
    },
    // 改变每一页的数据量
    handleSizeChange(size) {
      this.queryInfo.pageNum = 1
      this.queryInfo.pageSize = size
      this.turnPage()
    },
    handleChange() {}
  }
}
</script>
