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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" class="text-right" style="line-height: 32px;">
        <el-button type="primary" icon="el-icon-download" class="mr-1">下载</el-button>单位：元/立方米
      </el-col>
    </el-row>
    <!-- <v-chart :options="lineOption"/> -->
    <!-- 表格数据 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column prop="num1" label="中石化唐山" align="center" title="单位：元/立方米" />
      <el-table-column prop="num2" label="中海油天津" align="center" />
      <el-table-column prop="num3" label="中石化天津" align="center" />
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
import { pickerOptions } from '@/utils/options'

export default {
  data() {
    return {
      pickerOptions,
      queryInfo: {
        pageNum: 1,
        pageSize: 10,
        daterange: daterange1month()
      },
      total: 0,
      // dataset: {
      //   source: []
      // },
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

      fetchJsonp(`http://152.136.232.230:8081/api/screen/price/lngReceive?start=${parseDate(start)}&end=${parseDate(end)}`)
        .then(response => {
          return response.json()
        })
        .then(json => {
          if (json.status !== 0) return this.$message.error('获取数据失败')
          this.$message.success('获取数据成功')
          // 得到表格数据
          const data = []
          const defaultNum1 = getDefaultValue(json.data['中海油天津浮式'])
          const defaultNum2 = getDefaultValue(json.data['中石化天津'])
          const defaultNum3 = getDefaultValue(json.data['中石油曹妃甸'])

          for (let index = end.getTime(); index >= start.getTime(); ) {
            const date = parseDate(new Date(index), 'yyyy-MM-dd')
            data.push({
              date: date,
              num1: (json.data['中海油天津浮式'] && json.data['中海油天津浮式'][date] && json.data['中海油天津浮式'][date].priceSingle) || defaultNum1,
              num2: (json.data['中石化天津'] && json.data['中石化天津'][date] && json.data['中石化天津'][date].priceSingle) || defaultNum2,
              num3: (json.data['中石油曹妃甸'] && json.data['中石油曹妃甸'][date] && json.data['中石油曹妃甸'][date].priceSingle) || defaultNum3
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
    handleCurrentChange(page) {
      this.queryInfo.pageNum = page
      this.turnPage()
    },
    handleSizeChange(size) {
      this.queryInfo.pageNum = 1
      this.queryInfo.pageSize = size
      this.turnPage()
    }
  }
}
</script>
