<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <el-date-picker
        v-model="queryInfo.date"
        type="date"
        placeholder="选择日期"
        :clearable="false"
        :picker-options="pickerOptions"
      />
    </div>
    <el-table :data="fileList" stripe border>
      <el-table-column prop="fileName" label="报表名称" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <!-- 编辑按钮 -->
          <el-tooltip effect="dark" content="导出Excel" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-download" @click="handleDownload(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'Export',
  data() {
    return {
      queryInfo: {
        date: new Date()
      },
      fileList: [{ fileName: '日简报' }, { fileName: '河北分公司销售报表' }, { fileName: '昆仑批发' }, { fileName: '自有终端' }, { fileName: '周对比及分日' }, { fileName: '冀东LNG' }, { fileName: '实时年' }, { fileName: '月对比及分日' }],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    handleDownload() {}
  }
}
</script>
