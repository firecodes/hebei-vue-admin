<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <el-date-picker v-model="listQuery.date" type="date" placeholder="选择日期" :clearable="false" :picker-options="pickerOptions" />
    </div>
    <el-table :data="fileList" stripe border>
      <el-table-column prop="fileName" label="报表名称" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <!-- 编辑按钮 -->
          <el-tooltip effect="dark" content="导出Excel" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-download" @click="handleDownload(row.fileName)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { exportDayReport, exportSales, exportWholeSales, exportSelfTerminal, exportWeekReport, exportLngReport, exportYearReport, exportMonthReport } from '@/api/report/export'
import { parseDate } from '@/utils'
export default {
  name: 'Export',
  data() {
    return {
      listQuery: {
        date: new Date()
      },
      fileList: [{ fileName: '日简报' }, { fileName: '河北分公司销售报表' }, { fileName: '昆仑批发' }, { fileName: '周对比及分日' }, { fileName: '冀东LNG' }, { fileName: '实时年' }, { fileName: '月对比及分日' }],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
        firstDayOfWeek: 6
      }
    }
  },
  methods: {
    handleDownload(fileName) {
      let url = this.apiUrl
      console.log('fileName=', typeof fileName)
      switch (fileName) {
        case '日简报':
          url += '/api/export/day'
          break
        case '河北分公司销售报表':
          url += '/api/export/sales'
          break
        case '昆仑批发':
          url += '/api/export/wholeSales'
          break
        // case '自有终端':
        //   url += '/api/export/selfTerminal'
        //   break
        case '周对比及分日':
          url += '/api/export/week'
          break
        case '冀东LNG':
          url += '/api/export/lng'
          break
        case '实时年':
          url += '/api/export/year'
          break
        case '月对比及分日':
          url += '/api/export/month'
          break
      }
      window.open(`${url}?date=${parseDate(this.listQuery.date)}`)
    }
  }
}
</script>
