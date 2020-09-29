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
        <el-cascader
          v-model="cascaderValue"
          :options="cascaderOptions"
          filterable
          style="width:250px"
          @change="handleChange"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
      </div>
      <div style="line-height: 32px;">单位：万方</div>
    </div>
    <!-- 表格数据-->
    <el-table v-show="listQuery.customerType=='pipeline'" :data="tableData" stripe>
      <el-table-column prop="date" label="日期" align="center" width="90px" fixed />
      <el-table-column label="合同量" align="center">
        <el-table-column prop="num" label="日均合同" align="center" />
        <el-table-column prop="num" label="日均合同超欠" align="center" width="95px" />
        <el-table-column prop="num" label="月合同完成率" align="center" width="95px" />
      </el-table-column>
      <el-table-column label="计划量" align="center">
        <el-table-column prop="num" label="计划日均" align="center" />
        <el-table-column prop="num" label="日均计划超欠" align="center" width="95px" />
        <el-table-column prop="num" label="计划完成率" align="center" width="85px" />
      </el-table-column>
      <el-table-column label="日销量" align="center">
        <el-table-column prop="num" label="今日量" align="center" />
        <el-table-column prop="num" label="环比" align="center" />
        <el-table-column prop="num" label="同比" align="center" />
      </el-table-column>
      <el-table-column label="月销量" align="center">
        <el-table-column prop="num" label="月累计" align="center" />
        <el-table-column prop="num" label="去年同期累计" align="center" width="95px" />
        <el-table-column prop="num" label="同比" align="center" />
        <el-table-column prop="num" label="月增幅" align="center" />
      </el-table-column>
      <el-table-column label="年销量" align="center">
        <el-table-column prop="num" label="年累计" align="center" />
        <el-table-column prop="num" label="去年同期累计" align="center" width="95px" />
        <el-table-column prop="num" label="同比" align="center" />
        <el-table-column prop="num" label="年增幅" align="center" />
        <el-table-column prop="num" label="2019年销量" align="center" width="95px" />
      </el-table-column>
    </el-table>
    <el-table v-show="listQuery.customerType=='lng'" :data="tableData" stripe>
      <el-table-column prop="date" label="日期" align="center" width="90px" fixed />

      <el-table-column label="日销量" align="center">
        <el-table-column prop="num" label="今日量" align="center" />
        <el-table-column prop="num" label="环比" align="center" />
        <el-table-column prop="num" label="去年同日量" align="center" />
        <el-table-column prop="num" label="同比" align="center" />
      </el-table-column>
      <el-table-column label="月销量" align="center">
        <el-table-column prop="num" label="月累计" align="center" />
        <el-table-column prop="num" label="去年同期累计" align="center" width="100px" />
        <el-table-column prop="num" label="同比" align="center" />
        <el-table-column prop="num" label="月增幅" align="center" />
      </el-table-column>
      <el-table-column label="年销量" align="center">
        <el-table-column prop="num" label="年累计" align="center" />
        <el-table-column prop="num" label="日均" align="center" />
        <el-table-column prop="num" label="去年同期累计" align="center" width="100px" />
        <el-table-column prop="num" label="日均" align="center" />
        <el-table-column prop="num" label="同比" align="center" />
        <el-table-column prop="num" label="日均同比" align="center" />
        <el-table-column prop="num" label="同比增幅" align="center" />
      </el-table-column>
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
import { fetchList as getLngCustomers } from '@/api/customer/lng'

export default {
  name: 'WholeSale',
  components: { Pagination },
  data() {
    return {
      areaOption,
      cascaderOptions: [],
      cascaderValue: [],
      pickerOptions,
      listQuery: {
        pageNum: 1,
        limit: 10,
        daterange: daterange1month(),
        customerType: 'pipeline',
        customer: ''
      },
      totalCount: 0, // 总条数
      tableData: [
        { date: '2020-05-03', num: '773' },
        { date: '2020-05-04', num: '773' },
        { date: '2020-05-05', num: '773' },
        { date: '2020-05-06', num: '773' },
        { date: '2020-05-07', num: '773' },
        { date: '2020-05-08', num: '773' },
        { date: '2020-05-09', num: '773' },
        { date: '2020-05-10', num: '773' },
        { date: '2020-05-11', num: '773' },
        { date: '2020-05-12', num: '773' }
      ]
    }
  },
  created() {
    this.getPipelineCustomers()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      const { pageNum, limit: pageSize, customer, customerType } = this.listQuery
      const param = {
        pageNum,
        pageSize,
        start: parseTime(this.listQuery.daterange[0], '{y}-{m}-{d}'),
        end: parseTime(this.listQuery.daterange[1], '{y}-{m}-{d}'),
        customer,
        customerType
      }
      console.log(param)
      // fetchList(deleteNullParam(this.listQuery)).then(response => {
      //   this.tableData = response.data
      //   this.totalCount = response.totalCount
      //   this.listLoading = false
      // })
    },

    // 得到管道气客户
    getPipelineCustomers() {
      getPipelineCustomers({
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        if (res.status === 0) {
          this.setCascaderOption(res.data)
        }
      })
    },
    getLngCustomers() {
      getLngCustomers({
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        if (res.status === 0) {
          const obj = {
            value: 'LNG',
            label: '唐山LNG',
            children: []
          }
          res.data.forEach(item => {
            obj.children.push({
              value: item.id,
              label: item.name
            })
          })
          this.cascaderOptions.push(obj)
        }
      })
    },
    setCascaderOption(data) {
      const temp = {}
      data.forEach(item => {
        if (!temp[item.area]) {
          temp[item.area] = []
        }
        temp[item.area].push(item)
      })

      const areaObj = array2Object(areaOption)

      for (const key in temp) {
        const obj = {
          value: key,
          label: areaObj[key],
          children: []
        }
        temp[key].forEach(item => {
          if (!this.cascaderValue.length) {
            this.cascaderValue = [key, item.id]
            this.listQuery.customer = item.id
            this.listQuery.customerType = 'pipeline'
          }
          obj.children.push({
            value: item.id,
            label: item.name
          })
        })
        this.cascaderOptions.push(obj)
      }

      this.getList()
      this.getLngCustomers()
    },
    handleChange(evt) {
      this.listQuery.customer = this.cascaderValue[1]
      if (this.cascaderValue[0] === 'LNG') {
        this.listQuery.customerType = 'lng'
      } else {
        this.listQuery.customerType = 'pipeline'
      }
      this.handleFilter()
    },
    handleQuery() {},
    handleCurrentChange() {},
    handleSizeChange() {},
    // 搜索
    handleFilter() {
      console.log('handleFilter', arguments)
      this.listQuery.pageNum = 1
      this.getList()
    }
  }
}
</script>
