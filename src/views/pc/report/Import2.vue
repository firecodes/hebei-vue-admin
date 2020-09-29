<template>
  <!-- 卡片视图区域 -->
  <el-card>
    <!-- 操作区域 -->
    <el-row>
      <!-- 搜索区域 -->
      <el-col :span="12">
        <el-form :inline="true" :model="queryInfo">
          <el-form-item label="数据类型">
            <el-select v-model="queryInfo.reportType" class="large" @change="changeReportType">
              <el-option
                v-for="item in reportTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryInfo.date"
              :type="dateType"
              placeholder="选择年"
              :clearable="false"
              :picker-options="pickerOptions"
              style="width:120px"
              @change="getUploadRecords"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="calendar-container">
      <div class="calendar">
        <div>
          <el-calendar>
            <template slot="dateCell" slot-scope="{data}">
              <span>{{ data.day.split('-').slice(2).join('-') }}</span>
            </template>
          </el-calendar>
          <!-- <div
            v-for="item in dateLength"
            :key="item"
            class="calendar-cell"
            :class="{ isUploaded: recordsObj[year + '-' + month +'-' + item] }"
            @click="handleSelect(year + '-' + month + '-' + item)"
          >{{ item }} {{ (year + '-' + month +'-' + item) === selectedDate? '✔️' : '' }}</div>-->
        </div>
        <!-- <div v-else>
          <div
            v-for="item in dateLength"
            :key="item"
            class="calendar-cell"
            :class="{ isUploaded: recordsObj[year + '-' + item] }"
            @click="handleSelect(year + '-' + item)"
          >{{ item +'月' }} {{ (year + '-' + item) === selectedDate? '✔️' : '' }}</div>
        </div>-->
      </div>
      <div class="detail">
        <div v-if="!selectedDate">请从左边选择查看的日期</div>
        <div v-else-if="Object.keys(recordDetail).length === 0">
          <el-button @click="dialogVisible=true">上传文件</el-button>
          <div>当前日期还未上传数据，请上传</div>
        </div>
        <div v-else>
          <el-button @click="dialogVisible=true">重新上传文件</el-button>
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="时间">
              <span
                v-if="dateType==='month'"
              >{{ recordDetail.year + '-' + recordDetail.month + '-' + recordDetail.day }}</span>
              <span v-if="dateType==='year'">{{ recordDetail.year + '-' + recordDetail.month }}</span>
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
      </div>
    </div>
    <el-dialog
      :title="Object.keys(recordDetail).length === 0 ? '上传文件': '重新上传文件'"
      :visible.sync="dialogVisible"
      width="500px"
      @close="dialogClosed"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        action="/sales-api/api/upload"
        :data="uploadData"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
      >
        <el-button type="primary" style="margin-right:10px">点击上传</el-button>
        <span slot="tip" class="el-upload__tip">只能上传 excel 文件，且不超过1000kb</span>
      </el-upload>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  name: 'Import',
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      reportTypeOption: [
        { value: 11, label: '零售业务销售数据' },
        { value: 1, label: '批发业务销售数据' },
        { value: 2, label: '批发业务合同数据' },
        { value: 3, label: '批发业务计划数据' }
      ],
      queryInfo: {
        reportType: 11,
        date: new Date()
      },
      recordsObj: {},
      dateType: 'month', // 'month' 'year'
      selectedDate: '',
      recordDetail: {},
      dialogVisible: false
    }
  },
  computed: {
    year() {
      return this.queryInfo.date.getFullYear()
    },
    month() {
      return this.queryInfo.date.getMonth() + 1
    },
    day() {
      return this.queryInfo.date.getDate()
    },
    dateLength() {
      if (this.dateType === 'year') return 12
      return new Date(this.year, this.month, 0).getDate()
    },
    uploadData() {
      const [year, month, day] = this.selectedDate.split('-')
      const data = {
        type: this.queryInfo.reportType,
        year,
        month
      }
      if (this.dateType === 'month') data['day'] = day
      return data
    }
  },
  created() {
    this.getUploadRecords()
  },
  methods: {
    // 查询上传记录
    async getUploadRecords() {
      this.selectedDate = ''
      // 得到查询条件
      const params = {
        type: this.queryInfo.reportType,
        year: this.year
      }
      if (this.dateType === 'month') params['month'] = this.month
      // 发送查询请求
      const res = await this.$http.get('/api/uploadRecords', { params: params })
      if (res.status !== 0) return this.$message.error('获取数据失败')
      this.$message.success('获取数据成功')

      this.recordsObj = {}
      res.data.forEach(record => {
        let date = ''
        if (this.dateType === 'year') {
          date = record.year + '-' + record.month
        } else {
          date = record.year + '-' + record.month + '-' + record.day
        }
        this.recordsObj[date] = record
      })
    },
    async submitUpload() {
      this.$refs.upload.submit()
    },
    // 更改时间类型， 查询上传记录
    changeReportType() {
      console.log('changeReportType')
      if ([1, 11].includes(this.queryInfo.reportType)) {
        this.dateType = 'month'
      } else {
        this.dateType = 'year'
      }
      this.queryInfo.date = new Date()
      this.getUploadRecords()
    },
    // 选择日期
    async handleSelect(date) {
      this.selectedDate = date
      const record = this.recordsObj[date]
      if (!record) {
        this.recordDetail = {}
        return
      }
      // 发送查询请求
      const res = await this.$http.get(`/api/upload/${record.id}`)
      if (res.status !== 0) return this.$message.error('获取数据失败')
      this.recordDetail = res.data
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
    },
    isError(data) {
      return !this.calendarData[data.day] && data.type === 'current-month' && new Date(data.day) < new Date()
    }
  }
}
</script>
