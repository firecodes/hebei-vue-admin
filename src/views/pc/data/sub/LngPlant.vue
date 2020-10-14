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
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleFilter" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" class="text-right" style="line-height: 32px"> <el-button type="primary" icon="el-icon-download" class="mr-1">下载</el-button>单位：元/立方米 </el-col>
    </el-row>
    <!-- <v-chart :options="lineOption"/> -->
    <!-- 表格数据 -->
    <el-table :data="tableData" border stripe>
      <el-table-column prop="date" label="日期" align="center" />
      <el-table-column prop="num1" label="河北华气" align="center" title="单位：元/立方米" />
      <el-table-column prop="num2" label="张家口国储" align="center" />
      <el-table-column prop="num3" label="迁安赤翼" align="center" />
      <el-table-column prop="num4" label="唐钢气体" align="center" />
      <el-table-column prop="num5" label="任丘华港" align="center" />
      <el-table-column prop="num6" label="唐山新奥" align="center" />
      <el-table-column prop="num7" label="中翔" align="center" />
      <el-table-column prop="num8" label="怡蕙达" align="center" />
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import fetchJsonp from 'fetch-jsonp'
import { daterange1month, parseDate, getDefaultValue } from '@/utils'
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/options'

export default {
  components: { Pagination },
  data() {
    return {
      pickerOptions,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        daterange: daterange1month()
      },
      totalCount: 0, // 总条数
      // dataset: {
      //   source: []
      // },
      tableData: [],
      tableDataWhole: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const start = this.listQuery.daterange[0]
      const end = this.listQuery.daterange[1]

      fetchJsonp(`http://152.136.232.230:8081/api/screen/price/LngPlantByDate?start=${parseDate(start)}&end=${parseDate(end)}`)
        .then(response => {
          return response.json()
        })
        .then(json => {
          if (json.status !== 0) return this.$message.error('获取数据失败')
          this.$message.success('获取数据成功')
          // 得到表格数据
          const data = []
          //  河北唐钢: '唐钢气体',
          // 迁安怡蕙达: '怡蕙达',
          // 沧州中翔: '中翔',
          // 新奥永顺: '唐山新奥',
          // 华油霸州: '河北华气

          for (let index = end.getTime(); index >= start.getTime(); ) {
            const date = parseDate(new Date(index))
            data.push({
              date: date,
              num1: (json.data['华气霸州'] && json.data['华气霸州'][date] && json.data['华气霸州'][date].priceSingle) || '-',
              num2: (json.data['张家口国储'] && json.data['张家口国储'][date] && json.data['张家口国储'][date].priceSingle) || '-',
              num3: (json.data['迁安翅冀'] && json.data['迁安翅冀'][date] && json.data['迁安翅冀'][date].priceSingle) || '-',
              num4: (json.data['河北唐钢'] && json.data['河北唐钢'][date] && json.data['河北唐钢'][date].priceSingle) || '-',
              num5: (json.data['任丘华港'] && json.data['任丘华港'][date] && json.data['任丘华港'][date].priceSingle) || '-',
              num6: (json.data['新奥永顺'] && json.data['新奥永顺'][date] && json.data['新奥永顺'][date].priceSingle) || '-',
              num7: (json.data['沧州中翔'] && json.data['沧州中翔'][date] && json.data['沧州中翔'][date].priceSingle) || '-',
              num8: (json.data['迁安怡蕙达'] && json.data['迁安怡蕙达'][date] && json.data['迁安怡蕙达'][date].priceSingle) || '-'
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
