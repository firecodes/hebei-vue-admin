<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <el-date-picker v-model="daterange" type="monthrange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" class="mr-1" @change="handleFilter" />
        <el-select v-model="listQuery.customerId" @change="handleFilter" filterable style="width: 250px">
          <el-option label="昆仑能源有限公司河北分公司" value="0"></el-option>
          <el-option v-for="item in customerOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div style="line-height: 32px">
        <el-button type="primary" icon="el-icon-download" class="mr-1" @click="handleDownload">导出 Excel</el-button>
        单位：万方
      </div>
    </div>
    <!-- 表格数据-->
    <el-table :data="tableData" v-loading="listLoading" :span-method="objectSpanMethod">
      <el-table-column prop="yearMonth" label="日期" align="center" width="85px" fixed />
      <el-table-column prop="source" label="气源" align="center" width="95px" fixed />
      <el-table-column prop="num" label="期初库存" align="center" width="95px">
        <template slot-scope="{row}">
          {{row.initStorage | roFixed4}}
        </template>
      </el-table-column>
      <el-table-column label="购气量" align="center">
        <el-table-column label="月累" align="center" width="95px" >
         <template slot-scope="{row}">
          {{row.monthAccumulationForPurchase | roFixed4}}
        </template>
        </el-table-column>
        <el-table-column prop="num" label="去年同期" align="center" width="95px" > 
          <template slot-scope="{row}">
          {{row.lastYearForPurchase | roFixed4}}
        </template>
        </el-table-column>
        <el-table-column prop="num" label="同比" align="center" width="95px" > 
          <template slot-scope="{row}">
          {{row.tongbiForPurchase | roFixed4}}
        </template>
        </el-table-column>
        <el-table-column prop="num" label="同比变化" align="center" width="95px" >
           <template slot-scope="{row}">
          {{row.tongbiIncreaseForConsume | roFixed4}}
        </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="总销气量" align="center">        
        <el-table-column prop="num" label="居民" align="center" width="95px" > 
          <template slot-scope="{row}">
          {{row.residentValue | roFixed4}}
        </template>
        </el-table-column>
        <el-table-column prop="num" label="工业" align="center" width="95px" > 
          <template slot-scope="{row}">
          {{row.industryValue | roFixed4}}
        </template>
        </el-table-column>
        <el-table-column prop="num" label="公服" align="center" width="95px" > 
          <template slot-scope="{row}">
          {{row.publicServiceValue | roFixed4}}
        </template>
        </el-table-column>
        <el-table-column prop="num" label="分销" align="center" width="95px" > 
          <template slot-scope="{row}">
          {{row.distributionValue | roFixed4}}
        </template></el-table-column>
        <el-table-column prop="num" label="CNG车用" align="center" width="95px" > 
          <template slot-scope="{row}">
           {{row.cngForCarValue | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="CNG非车用" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.cngForOtherValue | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="管输" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.pogValue | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="LNG" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.lngValue | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="月累" align="center" width="95px">
           <template slot-scope="{row}">
           {{row.monthAccumulationForConsume | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="去年同期" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.lastYearForConsume | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="同比" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.tongbiForConsume | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="同比变化" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.tongbiIncreaseForPurchase | roFixed4}}
         </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="自用气" align="center">
           <el-table-column prop="num" label="生产" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.produceForSelf | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="生活" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.liveForSelf | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="月累" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.monthAccumulationForSelf | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="去年同期" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.lastYearForSelf | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="同比" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.tongbiForSelf | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="同比变化" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.tongbiIncreaseForSelf | roFixed4}}
         </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="月购销差" align="center">
        <el-table-column prop="num" label="差量" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.diffForPurchase | roFixed4}}
         </template>
        </el-table-column>
        <el-table-column prop="num" label="差率%" align="center" width="95px" >
           <template slot-scope="{row}">
           {{row.diffRateForPurchase | roFixed4}}
         </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="num" label="期末库存" align="center" width="95px" >
         <template slot-scope="{row}">
           {{row.currentStorage | roFixed4}}
         </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { pickerOptions } from '@/utils/options'
import { array2Object, parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList } from '@/api/customer/retail'
import { getResaleMonthStyle } from '@/api/data/index'

export default {
  name: 'WholeSale',
  components: { Pagination },
  data() {
    return {
      pickerOptions,
      customerOption: [],
      daterange: [],
      listQuery: {
        pageNum: 1,
        pageSize: 2,
        start: '',
        end: '',
        customerId: '0'
      },
      totalCount: 0, // 总条数
      tableData: [],
      listLoading: false // 加载动画
    }
  },
  filters:{
    roFixed4(value) {
      if(value === null) return '-'
      const index = (value +'').indexOf('.')
      if(index !== -1 && typeof value === 'number') {
          return value.toFixed(2)
      } else {
        return value
      }
    }
  },
  created() {
    this.getDaterange()
    this.getCustomers()
    this.getList()
  },
  methods: {
    getDaterange() {
      const date = new Date()
      this.daterange = [new Date(date.setMonth(date.getMonth() - 1)), new Date()]
    },
    // 获取列表
    async getList() {
      this.listLoading = true
  
      this.listQuery.start = parseTime(this.daterange[0], '{y}-{m}')
      this.listQuery.end = parseTime(this.daterange[1], '{y}-{m}')
      const res = await getResaleMonthStyle(this.listQuery)
      if (res.status === 0) {
        const days = Object.keys(res.data).sort((a, b) => a - b)
        this.tableData = []
        days.forEach(day => {
          res.data[day].forEach(item => {
            for (const key in item) {
              if (!isNaN(item[key])) {
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
        this.customerOption.push({ value: customer.id, label: customer.name })
      })
    },

    // 搜索
    handleFilter() {
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
    },
     // 导出
    handleDownload() {
      const start = parseTime(this.daterange[0], '{y}-{m}')
      const end = parseTime(this.daterange[1], '{y}-{m}')
      const customerId = this.listQuery.customerId
      const url = `${process.env.VUE_APP_BASE_API}/api/datacenter/resale/month/export?start=${start}&end=${end}&customerId=${customerId}`
      window.open(url)
    }
  }
}
</script>
