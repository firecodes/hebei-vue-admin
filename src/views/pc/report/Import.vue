<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="mb-1">
      <el-select v-model="listQuery.reportType" class="mr-1">
        <el-option
          v-for="item in reportTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        type="month"
        :picker-options="pickerOptions"
        @change="getUploadRecords"
      />
    </div>
    <!-- 内容区域 -->
    <div class="container">
      <div v-show="dateType=='day'" class="calendar-container">
        <el-calendar v-model="listQuery.date">
          <template slot="dateCell" slot-scope="{data}">
            <span
              :class="{ 'is-selected' :data.isSelected, 'is-submited':isSubmited(data)}"
            >{{ data.day.split('-').slice(2).join('-') }}</span>
          </template>
        </el-calendar>
      </div>
      <div class="content-container">
        <div v-if="recordDetail">
          <el-button @click="dialogVisible=true">重新上传文件</el-button>
          <el-form label-position="left" inline class="demo-table-expand" label-width="100px">
            <el-form-item label="时间">
              <span>{{ time }}</span>
            </el-form-item>
            <el-form-item label="文件名">
              <span>{{ recordDetail.filename }}</span>
            </el-form-item>
            <el-form-item label="创建人">
              <span>{{ recordDetail.creator }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ recordDetail.createTime }}</span>
            </el-form-item>
            <el-form-item label="最后修改人人">
              <span>{{ recordDetail.lastUpdateUser }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ recordDetail.updateTime }}</span>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-button @click="dialogVisible=true">上传文件</el-button>
          <div>当前日期还未上传数据，请上传</div>
        </div>
      </div>
    </div>

    <!-- 上传文件 -->
    <el-dialog
      :title="recordDetail ? '重新上传文件': '上传文件'"
      :visible.sync="dialogVisible"
      @close="dialogClosed"
    >
      <el-upload
        ref="upload"
        action="/sales-api/api/upload"
        :data="uploadData"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
      >
        <el-button type="primary" style="margin-right:10px">点击上传</el-button>
        <span slot="tip" class="el-upload__tip">请上传 excel 文件，文件扩展名为 .xls 或 .xlsx!</span>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { uploadRecords, uploadDetail } from '@/api/report/import'
import { parseTime } from '@/utils'
export default {
  name: 'Import',
  components: {},

  data() {
    return {
      listQuery: {
        // 查询条件
        reportType: 11,
        date: new Date()
      },
      dateType: 'day',
      uploadRecords: [],
      recordDetail: null,
      dialogVisible: false,
      reportTypeOption: [
        { value: 11, label: '零售业务销售数据', type: 'day' },
        { value: 1, label: '批发业务销售数据', type: 'day' },
        { value: 2, label: '批发业务合同数据', type: 'month' },
        { value: 3, label: '批发业务计划数据', type: 'month' }
      ],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    time() {
      if (this.dateType === 'day') {
        return parseTime(new Date(this.recordDetail.year, this.recordDetail.month - 1, this.recordDetail.day), '{y}-{m}-{d}')
      }
      return parseTime(new Date(this.recordDetail.year, this.recordDetail.month - 1), '{y}-{m}')
    },
    uploadData() {
      const data = {
        type: this.listQuery.reportType,
        year: this.listQuery.date.getFullYear(),
        month: this.listQuery.date.getMonth() + 1
      }
      if (this.dateType === 'day') data['day'] = this.listQuery.date.getDate()
      return data
    }
  },
  watch: {
    'listQuery.date': function (newVal) {
      console.log('listQuery.date')
      this.getUploadDetail()
    },
    'listQuery.reportType': function (newVal) {
      console.log('listQuery.reportType')

      for (let i = 0, len = this.reportTypeOption.length; i < len; i++) {
        const item = this.reportTypeOption[i]
        if (item.value === newVal) {
          this.dateType = item.type
          break
        }
      }

      this.getUploadRecords()
    }
  },
  created() {},
  mounted() {
    this.getUploadRecords()
  },
  methods: {
    // 查询上传记录
    async getUploadRecords() {
      console.log('getUploadRecords----')
      // 得到查询条件
      const params = {
        type: this.listQuery.reportType,
        year: this.listQuery.date.getFullYear(),
        month: this.listQuery.date.getMonth() + 1
      }
      // if (this.dateType === 'day') {
      //   params.month = this.listQuery.date.getMonth() + 1
      // }

      // 发送查询请求
      const res = await uploadRecords(params)
      if (res.status !== 0) return this.$message.error('获取数据失败')

      this.uploadRecords = res.data

      this.getUploadDetail()
    },
    isSubmited(data) {
      return this.findRecord(new Date(data.day))
    },
    // 查询上传详情
    async getUploadDetail() {
      console.log('getUploadDetail')

      const record = this.findRecord(this.listQuery.date)

      if (record) {
        const res = await uploadDetail(record.id)
        if (res.status !== 0) return this.$message.error('获取数据失败')
        this.recordDetail = res.data
      } else {
        this.recordDetail = null
      }

      console.log('this.recordDetail', this.recordDetail)
    },
    findRecord(date) {
      let day = date.getDate()
      if (this.dateType === 'month') {
        day = 0
      }
      for (let i = 0, len = this.uploadRecords.length; i < len; i++) {
        const item = this.uploadRecords[i]
        if (item.year === date.getFullYear() && item.month === date.getMonth() + 1 && item.day === day) {
          return item
        }
      }
      return null
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      this.$message.success('文件上传成功')
      this.dialogVisible = false
      const selectedDate = this.selectedDate
      Promise.resolve(this.getUploadRecords()).then(() => {
        this.selectedDate = selectedDate
        this.handleSelect(selectedDate)
      })
    },
    handleError(err, file, fileList) {
      this.$message.error('文件上传失败, 请检查文件格式是否正确!')
    },
    handleBeforeUpload(file) {
      if (!/\.xls$|\.xlsx/.test(file.name)) {
        this.$message.error('文件扩展名必须为 .xls 或 .xlsx!')
        return false
      }
      return true
    },
    dialogClosed() {
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style >
.el-calendar__header {
  display: none;
}
</style>
<style scoped lang="scss">
.container {
  display: flex;
}
.calendar-container {
  background-color: #fff;
  min-width: 550px;
  width: 550px;
  margin-right: 50px;
}
.content-container {
  flex-grow: 1;
  /* margin-top: 30px; */
}
</style>
