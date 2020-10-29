<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <el-date-picker v-model="daterange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false" class="mr-1" @change="handleFilter" />
        <el-cascader v-model="cascaderValue" :options="cascaderOptions" filterable style="width: 300px" @change="handleChange">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
      </div>
      <div style="line-height: 32px">
        <span>累计值({{ listQuery.start }}~{{ listQuery.end }})：1222万方</span>
        <!-- <el-button type="primary" icon="el-icon-download" class="mr-1">导出 Excel</el-button> -->
        <!-- 单位：万方 -->
      </div>
    </div>
    <!-- 表格数据-->

    <el-table v-show="listQuery.customerType == 'pipeline'" :data="tableData" v-loading="listLoading" stripe>
      <el-table-column prop="dataTime" label="日期" align="center" width="90px" fixed />
      <el-table-column label="合同量" align="center">
        <el-table-column prop="contractMean" label="日均合同" align="center" />
        <el-table-column prop="contractDiff" label="日均合同超欠" align="center" width="95px" />
        <el-table-column prop="contractCompleteRate" label="月合同完成率" align="center" width="95px" />
      </el-table-column>
      <el-table-column label="计划量" align="center">
        <el-table-column prop="planMean" label="计划日均" align="center" />
        <el-table-column prop="planDiff" label="日均计划超欠" align="center" width="95px" />
        <el-table-column prop="planCompleteRate" label="计划完成率" align="center" width="85px" />
      </el-table-column>
      <el-table-column label="日销量" align="center">
        <el-table-column prop="dayValue" label="今日量" align="center" />
        <el-table-column prop="dayHuanbi" label="环比" align="center" />
        <el-table-column prop="dayTongbi" label="同比" align="center" />
      </el-table-column>
      <el-table-column label="月销量" align="center">
        <el-table-column prop="monthAccumulate" label="月累计" align="center" />
        <el-table-column prop="lastYearMonthAccumulate" label="去年同期累计" align="center" width="95px" />
        <el-table-column prop="monthTongbi" label="同比" align="center" />
        <el-table-column prop="monthIncreaseRate" label="月增幅" align="center" />
      </el-table-column>
      <el-table-column label="年销量" align="center">
        <el-table-column prop="yearAccumulate" label="年累计" align="center" />
        <el-table-column prop="lastYearAccumulate" label="去年同期累计" align="center" width="95px" />
        <el-table-column prop="yearTongbi" label="同比" align="center" />
        <el-table-column prop="yearIncreaseRate" label="年增幅" align="center" />
        <el-table-column prop="lastYearTotal" label="去年销量" align="center" width="95px" />
      </el-table-column>
    </el-table>

    <el-table v-show="listQuery.customerType == 'lng'" :data="tableData" v-loading="listLoading" stripe>
      <el-table-column prop="dataTime" label="日期" align="center" width="90px" fixed />
      <el-table-column label="日销量" align="center">
        <el-table-column prop="dayValue" label="今日量" align="center" />
        <el-table-column prop="dayHuanbi" label="环比" align="center" />
        <el-table-column prop="lastDayValue" label="去年同日量" align="center" />
        <el-table-column prop="dayTongbi" label="同比" align="center" />
      </el-table-column>
      <el-table-column label="月销量" align="center">
        <el-table-column prop="monthAccumulate" label="月累计" align="center" />
        <el-table-column prop="lastYearMonthAccumulate" label="去年同期累计" align="center" width="100px" />
        <el-table-column prop="monthTongbi" label="同比" align="center" />
        <el-table-column prop="monthIncreaseRate" label="月增幅" align="center" />
      </el-table-column>
      <el-table-column label="年销量" align="center">
        <el-table-column prop="yearAccumulate" label="年累计" align="center" />
        <el-table-column prop="dayMean" label="日均" align="center" />
        <el-table-column prop="lastYearDayValue" label="去年同期累计" align="center" width="100px" />
        <el-table-column prop="lastYearDayMean" label="去年同期日均" align="center" width="100px" />
        <el-table-column prop="yearTongbi" label="同比" align="center" />
        <el-table-column prop="dayMeanTongbi" label="日均同比" align="center" />
        <el-table-column prop="yearIncreaseRate" label="同比增幅" align="center" />
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!-- <table>
      <tr>
        <td>标题</td>
        <td>标题</td>
        <td>标题</td>
        <td>标题</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
    </table> -->
  </div>
</template>
<script>
import { pickerOptions, areaOption } from '@/utils/options'
import { daterange1month, array2Object, parseDate, deleteNullParam } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { fetchList as getPipelineCustomers } from '@/api/customer/pipeline'
import { fetchList as getLngCustomers } from '@/api/customer/lng'
import { getWholeSalesDataByCustomer } from '@/api/data/index'

export default {
  name: 'WholeSale',
  components: { Pagination },
  data() {
    return {
      areaOption,
      // cascaderOptions: [
      //   {
      //     value: '0',
      //     label: '分公司销售量（含LNG）',
      //     children: [
      //       {
      //         value: '0',
      //         label: '管道气（长输+自产）',
      //         children: [
      //           { value: '0', label: '长输管道气' },
      //           {
      //             value: '0',
      //             label: '油田自产气',
      //             children: [
      //               { value: '0', label: '华北油田自产气' },
      //               { value: '0', label: '冀东油田自产气' },
      //               { value: '0', label: '大港油田自产气' }
      //             ]
      //           }
      //         ]
      //       },
      //       {
      //         value: '0',
      //         label: '冀东LNG销量',
      //         children: [
      //           { value: '0', label: 'lng公司' },
      //           { value: '0', label: 'lng公司' },
      //           { value: '0', label: 'lng公司' }
      //         ]
      //       },
      //       {
      //         value: '0',
      //         label: '石家庄地区',
      //         children: [
      //           { value: '0', label: '石家庄地区公司1' },
      //           { value: '0', label: '石家庄地区公司2' },
      //           { value: '0', label: '石家庄地区公司3' }
      //         ]
      //       },
      //       { value: '0', label: '石家庄地区' },
      //       { value: '0', label: '石家庄地区' }
      //     ]
      //   }
      // ],
      cascaderOptions: [
        {
          value: '0',
          label: '分公司销售量（含LNG）'
        },
        {
          value: '1',
          label: '管道气（长输+自产）',
          children: [
            { value: '2', label: '长输管道气' },
            {
              value: '3',
              label: '油田自产气',
              children: [
                { value: '4', label: '华北油田自产气' },
                { value: '5', label: '冀东油田自产气' },
                { value: '6', label: '大港油田自产气' }
              ]
            }
          ]
        },
        {
          value: '7',
          label: '管道气（分地区）',
          children: []
        },
        {
          value: 'LNG',
          label: '冀东LNG销量',
          children: []
        }
      ],
      cascaderValue: ['0'],
      pickerOptions,
      daterange: daterange1month(),
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        start: '',
        end: '',
        customerType: 'pipeline',
        customerId: ''
      },
      totalCount: 0, // 总条数
      tableData: [],
      listLoading: true, // 加载动画
      pipelineCustomers: [],
      lngCustomers: []
    }
  },
  watch: {
    pipelineCustomers(val) {
      areaOption.forEach(item => {
        this.cascaderOptions[2].children.push({
          value: item.value,
          label: item.label,
          children: []
        })
      })

      val.forEach(item => {
        this.cascaderOptions[2].children[item.area - 1].children.push({
          value: item.id,
          label: item.name
        })
      })
    },
    lngCustomers(val) {
      val.forEach(item => {
        this.cascaderOptions[3].children.push({
          value: item.id,
          label: item.name
        })
      })
    }
  },
  created() {
    this.getPipelineCustomers()
    this.getLngCustomers()
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      this.listLoading = true

      this.listQuery.start = parseDate(this.daterange[0])
      this.listQuery.end = parseDate(this.daterange[1])
      const res = await getWholeSalesDataByCustomer(this.listQuery)
      if (res.status === 0) {
        this.tableData = res.data
        this.totalCount = res.totalCount
        this.listLoading = false
      }
    },

    // 得到管道气客户
    getPipelineCustomers() {
      getPipelineCustomers({
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        if (res.status === 0) {
          this.pipelineCustomers = res.data
        }
      })
    },
    getLngCustomers() {
      getLngCustomers({
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        if (res.status === 0) {
          this.lngCustomers = res.data
        }
      })
    },
    handleChange(evt) {
      this.listQuery.customerId = this.cascaderValue[this.cascaderValue.length - 1]
      if (this.cascaderValue[0] === 'LNG') {
        this.listQuery.customerType = 'lng'
      } else {
        this.listQuery.customerType = 'pipeline'
      }
      this.handleFilter()
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    }
  }
}
</script>
