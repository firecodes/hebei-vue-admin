<template>
  <!-- 未完成的：把地址转成经纬度 -->
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <!-- 报表类型 -->
        <el-select v-model="listQuery.type" class="mr-1" @change="handleFilter">
          <el-option
            v-for="item in reportTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="listQuery.date"
          :type="dateType"
          placeholder="选择年"
          :picker-options="pickerOptions"
          style="width:120px"
          @change="handleFilter"
        />
      </div>
    </div>
    <!-- 左边日历 -->
    <div class="container">
      <div class="calendar-container">
        <el-calendar v-model="listQuery.date">
          <template slot="dateCell" slot-scope="{data}">
            <span
              :class="{ 'is-selected' :data.isSelected, 'is-error':isError(data)}"
            >{{ data.day.split('-').slice(2).join('-') }}</span>
          </template>
        </el-calendar>
      </div>
      <div class="content-container">
        <div v-if="Object.keys(recordDetail).length === 0">
          <el-button @click="dialogVisible=true">上传文件</el-button>
          <div>当前日期还未上传数据，请上传</div>
        </div>
        <div v-else>
          <el-button @click="dialogVisible=true">重新上传文件</el-button>
          <el-form label-position="left" inline class="demo-table-expand" label-width="100px">
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

    <!-- 上传文件 -->
    <el-dialog title="上传文件" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" label-position="right" label-width="80px" />
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadRecords, uploadDetail } from '@/api/report/import'
import waves from '@/directive/waves' // waves directive
import { parseTime, deleteNullParam } from '@/utils'

export default {
  name: 'Import',
  directives: { waves },
  data() {
    return {
      tableData: null, // 表格数据
      totalCount: 0, // 总条数
      listLoading: true, // 加载动画
      listQuery: {
        // 查询条件
        type: 11,
        date: new Date()
      },
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
      dialogFormVisible: false,
      chartData: [
        { id: 10, createTime: '2020-03-23 21:09:04', updateTime: '2020-03-23 21:09:04', year: 2020, month: 1, day: 8, storageId: 38, createUserId: 1, type: 11, lastUpdateUserId: 1 },
        { id: 11, createTime: '2020-03-23 21:11:24', updateTime: '2020-03-23 21:11:24', year: 2020, month: 1, day: 9, storageId: 39, createUserId: 1, type: 11, lastUpdateUserId: 1 },
        { id: 12, createTime: '2020-03-23 21:12:30', updateTime: '2020-03-23 21:12:30', year: 2020, month: 1, day: 10, storageId: 40, createUserId: 1, type: 11, lastUpdateUserId: 1 },
        { id: 63, createTime: '2020-03-30 08:16:47', updateTime: '2020-07-20 19:56:41', year: 2020, month: 3, day: 30, storageId: 586, createUserId: 1, type: 11, lastUpdateUserId: 1 },
        { id: 65, createTime: '2020-03-31 12:05:34', updateTime: '2020-03-31 14:04:20', year: 2020, month: 3, day: 31, storageId: 126, createUserId: 1, type: 11, lastUpdateUserId: 1 },
        { id: 66, createTime: '2020-04-01 07:02:21', updateTime: '2020-05-28 11:24:49', year: 2020, month: 4, day: 1, storageId: 275, createUserId: 1, type: 11, lastUpdateUserId: 1 },
        { id: 67, createTime: '2020-04-06 16:58:00', updateTime: '2020-05-28 11:26:03', year: 2020, month: 4, day: 6, storageId: 280, createUserId: 1, type: 11, lastUpdateUserId: 1 }
      ],
      calendarData: [],
      recordsObj: {},
      recordDetail: {},
      dateType: 'month' // 'month' 'year'
    }
  },
  watch: {
    'listQuery.date': function (newVal) {
      this.getUploadDetail()
    }
  },
  created() {
    Promise.resolve(this.getUploadRecords()).then(() => {
      this.getUploadDetail()
    })
  },
  methods: {
    // 查询上传记录
    async getUploadRecords() {
      this.selectedDate = ''
      // 得到查询条件
      const params = {
        type: this.listQuery.type,
        year: this.listQuery.date.getFullYear()
      }
      if (this.dateType === 'month') params['month'] = this.listQuery.date.getMonth() + 1

      // 发送查询请求
      const res = await uploadRecords(params)
      if (res.status !== 0) return this.$message.error('获取数据失败')
      // this.$message.success('获取数据成功')

      this.recordsObj = {}
      res.data.forEach(record => {
        let date = ''
        if (this.dateType === 'year') {
          date = parseTime(new Date(record.year, record.month - 1, 1), '{y}-{m}-{d}')
        } else {
          date = parseTime(new Date(record.year, record.month - 1, record.day), '{y}-{m}-{d}')
        }
        // console.log(record)
        this.recordsObj[date] = record
      })

      console.log(this.recordsObj)
    },

    async getUploadDetail() {
      console.log('getUploadDetail', parseTime(new Date(this.listQuery.date), '{y}-{m}-{d}'))
      const record = this.recordsObj[parseTime(new Date(this.listQuery.date), '{y}-{m}-{d}')]
      console.log('record', record)
      if (!record) return (this.recordDetail = [])
      const res = await uploadDetail(record.id)
      if (res.status !== 0) return this.$message.error('获取数据失败')
      this.recordDetail = res.data
    },

    // 编辑
    saveData() {
      console.log('saveData')
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.username = tempData.mobile
          if (!this.isEdit) delete tempData.id
          const res = await saveUser(tempData)
          if (res.status === 0) {
            this.dialogFormVisible = false
            this.$message.success('编辑成功')
            // 重新获取数据
            if (this.isEdit) {
              this.getList()
            } else {
              this.handleFilter()
            }
          } else {
            this.$message.error('编辑失败')
          }
        }
      })
    },

    // 搜索
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },

    // 点击“添加”按钮
    handleCreate() {
      this.resetTemp()
      this.isEdit = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 点击“编辑"按钮
    handleUpdate(row) {
      this.temp.id = row.id
      this.temp.username = row.username
      this.temp.realName = row.realName
      this.temp.mobile = row.mobile
      this.temp.status = row.status

      this.isEdit = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    isError(data) {
      // console.log(data.day)
      return !this.recordsObj[data.day] && data.type === 'current-month' && new Date(data.day) < new Date()
    }
  }
}
</script>
<style>
.el-calendar__header {
  display: none;
}
</style>
<style scoped>
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
.el-form-item {
  display: block;
}
</style>
