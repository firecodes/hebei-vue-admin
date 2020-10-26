<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <el-date-picker v-model="daterange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" class="mr-1" @change="handleFilter" />
        <el-select v-model="listQuery.customerId" @change="handleFilter" filterable>
          <el-option v-for="item in customerOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div style="line-height: 32px">
        <!-- <el-button type="primary" icon="el-icon-download" class="mr-1">导出 Excel</el-button> -->
        单位：万方
      </div>
    </div>
    <!-- 表格数据-->
    <el-table :data="tableData" v-loading="listLoading" :span-method="objectSpanMethod">
      <el-table-column prop="dataTime" label="日期" align="center" width="85px" fixed />
      <el-table-column prop="source" label="气源" align="center" width="95px" fixed />
      <el-table-column label="计划量" align="center">
        <el-table-column prop="yearPlan" label="年度计划" align="center" />
        <el-table-column prop="monthPlan" label="月度计划" align="center" />
      </el-table-column>
      <el-table-column label="购气量" align="center">
        <el-table-column prop="dayAccumulationForPurchase" label="日累" align="center" />
        <el-table-column prop="monthAccumulationForPurchase" label="月累" align="center" />
        <el-table-column prop="yearAccumulationForPurchase" label="年累" align="center" />
      </el-table-column>
      <el-table-column label="总销气量" align="center">
        <el-table-column prop="residentValue" label="居民" align="center" />
        <el-table-column prop="industryValue" label="工业" align="center" />
        <el-table-column prop="publicServiceValue" label="公服" align="center" />
        <el-table-column prop="distributionValue" label="分销" align="center" />
        <el-table-column prop="cngForCarValue" label="CNG车用" align="center" />
        <el-table-column prop="cngForOtherValue" label="CNG非车用" align="center" width="95px" />
        <el-table-column prop="pogValue" label="管输" align="center" />
        <el-table-column prop="lngValue" label="LNG" align="center" />
        <el-table-column prop="dayAccumulation" label="日累" align="center" />
        <el-table-column prop="monthAccumulation" label="月累" align="center" />
        <el-table-column prop="monthCompletePercent" label="月完成率%" align="center" />
        <el-table-column prop="yearAccumulation" label="年累" align="center" />
        <el-table-column prop="yearCompletePercent" label="年完成率%" align="center" />
      </el-table-column>
      <el-table-column label="自用气" align="center">
        <el-table-column prop="produceForSelf" label="生产" align="center" />
        <el-table-column prop="liveForSelf" label="生活" align="center" />
        <el-table-column prop="dayAccumulationForSelf" label="日累" align="center" />
        <el-table-column prop="monthAccumulationForSelf" label="月累" align="center" />
        <el-table-column prop="yearAccumulationForSelf" label="年累" align="center" />
      </el-table-column>
      <el-table-column label="年购销差" align="center">
        <el-table-column prop="diffForPurchase" label="差量" align="center" />
        <el-table-column prop="diffRateForPurchase" label="差率%" align="center" />
      </el-table-column>
      <el-table-column prop="initStorage" label="期初库存" align="center" />
      <el-table-column prop="currentStorage" label="当日库存" align="center" />
    </el-table>

    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { pickerOptions, areaOption } from '@/utils/options'
import { daterange1month, array2Object, parseDate } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList as getPipelineCustomers } from '@/api/customer/pipeline'
import { fetchList } from '@/api/customer/retail'
import { getResaleDataByCustomer } from '@/api/data/index'

export default {
  name: 'WholeSale',
  components: { Pagination },
  data() {
    return {
      areaOption,
      cascaderOptions: [],
      cascaderValue: [],
      pickerOptions,
      customerOption: [],
      daterange: daterange1month(),
      listQuery: {
        pageNum: 1,
        pageSize: 3,
        start: '',
        end: '',
        customerId: ''
      },
      totalCount: 0, // 总条数
      tableData: [],
      listLoading: true // 加载动画
    }
  },
  created() {
    this.getCustomers()
  },
  methods: {
    // 获取列表
    async getList() {
      this.listLoading = true

      this.listQuery.start = parseDate(this.daterange[0])
      this.listQuery.end = parseDate(this.daterange[1])
      const res = await getResaleDataByCustomer(this.listQuery)
      if (res.status === 0) {
        const days = Object.keys(res.data).sort((a, b) => a - b)
        this.tableData = []
        days.forEach(day => {
          res.data[day].forEach(item => {
            for (const key in item) {
              if (!isNaN(item[key])) {
                console.log(item[key])
                item[key] = parseInt(item[key] * 10000) / 10000
              }
            }
            this.tableData.push(item)
          })
        })

        this.totalCount = res.totalCount
        this.listLoading = false
      }
    },

    // 得到l零售客户列表
    async getCustomers() {
      // 发送查询请求
      const res = await fetchList({ pageNum: 1, pageSize: 1000 })
      if (res.status !== 0) return this.$message.error('获取数据失败')
      res.data.forEach(customer => {
        if (!this.listQuery.customerId) this.listQuery.customerId = customer.id
        this.customerOption.push({ value: customer.id, label: customer.name })
      })

      this.getList()
    },

    handleQuery() {},
    handleCurrentChange(page) {
      this.listQuery.pageNum = page
    },
    handleSizeChange(size) {
      this.listQuery.pageSize = size
    },
    // 搜索
    handleFilter() {
      console.log('handleFilter', arguments)
      this.listQuery.pageNum = 1
      this.getList()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 7 === 0) {
          return {
            rowspan: 7,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>
