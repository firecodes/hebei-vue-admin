<template>
  <div>
    <!-- 操作区域 -->
    <el-row>
      <!-- 搜索区域 -->
      <el-col :span="16">
        <el-form :inline="true" :model="listQuery">
          <el-date-picker v-model="listQuery.daterange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" @change="handleFilter" />
        </el-form>
      </el-col>
      <el-col :span="8" class="text-right" style="line-height: 32px"> <el-button type="primary" icon="el-icon-download" class="mr-1">下载</el-button>单位：元/立方米 </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column prop="num1" label="北京" align="center" title="单位：元/立方米" />
      <el-table-column prop="num2" label="天津" align="center" />
      <el-table-column prop="num3" label="河北" align="center" />
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { daterange1month, parseDate } from '@/utils'
import { pickerOptions } from '@/utils/options'
import { getGatePrice } from '@/api/screen/price'

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
      totalCount: 0, // 总条数
      tableData: [],
      tableDataWhole: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      this.listQuery.start = parseDate(this.daterange[0])
      this.listQuery.end = parseDate(this.daterange[1])

      const res = await getGatePrice(this.listQuery)
      if (res.status === 0) {
        // this.tableData =
        console.log(res.data)
      }
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
    handleCurrentChange(page) {
      this.listQuery.pageNum = page
      this.turnPage()
    },
    handleSizeChange(size) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = size
      this.turnPage()
    }
  }
}
</script>
