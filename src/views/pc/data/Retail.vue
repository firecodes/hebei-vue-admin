<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <el-date-picker
          v-model="listQuery.daterange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :clearable="false"
          class="mr-1"
          @change="handleFilter"
        />
        <el-select v-model="listQuery.customer" @change="handleFilter">
          <el-option
            v-for="item in customerOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="line-height: 32px;">单位：万方</div>
    </div>
    <!-- 表格数据-->
    <el-table :data="tableData" :span-method="objectSpanMethod" height="660px">
      <el-table-column prop="date" label="日期" align="center" width="85px" fixed />
      <el-table-column prop="source" label="气源" align="center" width="95px" fixed />
      <el-table-column label="计划量" align="center">
        <el-table-column prop="num" label="年度计划" align="center" width="95px" />
        <el-table-column prop="num" label="月度计划" align="center" width="95px" />
      </el-table-column>
      <el-table-column label="购气量" align="center">
        <el-table-column prop="num" label="日累" align="center" width="95px" />
        <el-table-column prop="num" label="月累" align="center" width="95px" />
        <el-table-column prop="num" label="年累" align="center" width="95px" />
      </el-table-column>
      <el-table-column label="总销气量" align="center">
        <el-table-column prop="num" label="居民" align="center" width="95px" />
        <el-table-column prop="num" label="工业" align="center" width="95px" />
        <el-table-column prop="num" label="公服" align="center" width="95px" />
        <el-table-column prop="num" label="分销" align="center" width="95px" />
        <el-table-column prop="num" label="CNG车用" align="center" width="95px" />
        <el-table-column prop="num" label="CNG非车用" align="center" width="95px" />
        <el-table-column prop="num" label="管输" align="center" width="95px" />
        <el-table-column prop="num" label="LNG" align="center" width="95px" />
        <el-table-column prop="num" label="日累" align="center" width="95px" />
        <el-table-column prop="num" label="月累" align="center" width="95px" />
        <el-table-column prop="num" label="月完成率%" align="center" width="95px" />
        <el-table-column prop="num" label="年累" align="center" width="95px" />
        <el-table-column prop="num" label="年完成率%" align="center" width="95px" />
      </el-table-column>
      <el-table-column label="自用气" align="center">
        <el-table-column prop="num" label="生产" align="center" width="95px" />
        <el-table-column prop="num" label="生活" align="center" width="95px" />
        <el-table-column prop="num" label="日累" align="center" width="95px" />
        <el-table-column prop="num" label="月累" align="center" width="95px" />
        <el-table-column prop="num" label="年累" align="center" width="95px" />
      </el-table-column>
      <el-table-column label="年购销差" align="center">
        <el-table-column prop="num" label="差量" align="center" width="95px" />
        <el-table-column prop="num" label="差率%" align="center" width="95px" />
      </el-table-column>
      <el-table-column prop="num" label="期初库存" align="center" width="95px" />
      <el-table-column prop="num" label="当日库存" align="center" width="95px" />
    </el-table>

    <!-- 分页 -->
    <pagination
      :total="totalCount"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { pickerOptions, areaOption } from '@/utils/options'
import { daterange1month, array2Object, parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList as getPipelineCustomers } from '@/api/customer/pipeline'
import { fetchList } from '@/api/customer/retail'

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
      listQuery: {
        pageNum: 1,
        limit: 10,
        daterange: daterange1month(),
        customer: ''
      },
      totalCount: 0, // 总条数
      tableData: [
        { date: '2020-05-03', source: '管道气', num: '112152.7069' },
        {
          date: '2020-05-04',
          source: 'LNG（内购）',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: 'LNG（外购）',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'LNG小计',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '管输气',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'CNG',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '小计',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '管道气',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'LNG（内购）',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: 'LNG（外购）',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'LNG小计',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '管输气',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'CNG',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '小计',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '管道气',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'LNG（内购）',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: 'LNG（外购）',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'LNG小计',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '管输气',
          num: '12152.7069'
        },
        {
          date: '2020-05-04',
          source: 'CNG',
          num: '12152.7069'
        },
        {
          date: '2020-05-03',
          source: '小计',
          num: '12152.7069'
        }
      ]
    }
  },
  created() {
    this.getCustomers()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      const { pageNum, limit: pageSize, customer } = this.listQuery
      const param = {
        pageNum,
        pageSize,
        start: parseTime(this.listQuery.daterange[0], '{y}-{m}-{d}'),
        end: parseTime(this.listQuery.daterange[1], '{y}-{m}-{d}'),
        customer
      }
      console.log(param)
      // fetchList(deleteNullParam(this.listQuery)).then(response => {
      //   this.tableData = response.data
      //   this.totalCount = response.totalCount
      //   this.listLoading = false
      // })
    },

    // 得到l零售客户列表
    async getCustomers() {
      // 发送查询请求
      const res = await fetchList({ pageNum: 1, pageSize: 1000 })
      if (res.status !== 0) return this.$message.error('获取数据失败')
      res.data.forEach(customer => {
        if (!this.listQuery.customer) this.listQuery.customer = customer.id
        this.customerOption.push({ value: customer.id, label: customer.name })
      })

      this.getList()
    },

    handleQuery() {},
    handleCurrentChange() {},
    handleSizeChange() {},
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
