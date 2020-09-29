<template>
  <div>
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <el-select v-model="listQuery.reportType" class="mr-1" @change="getUploadRecords">
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
    </div>
    <!-- 内容区域 -->
    <div class="container">
      <div class="calendar-container">
        <el-calendar v-model="listQuery.date">
          <template slot="dateCell" slot-scope="{data}">
            <span
              :class="{ 'is-selected' :data.isSelected, 'is-submited':isSubmited(data)}"
            >{{ data.day.split('-').slice(2).join('-') }}</span>
          </template>
        </el-calendar>
      </div>
      <div class="content-container">
        {{ recordDetail }}
        <div v-show="recordDetail === null">
          <el-button @click="dialogVisible=true">上传文件</el-button>
          <div>当前日期还未上传数据，请上传</div>
        </div>
        <!-- <div v-show="recordDetail !== null">
          <el-button @click="dialogVisible=true">重新上传文件</el-button>
          {{ recordDetail }}
          <el-form label-position="left" inline class="demo-table-expand" label-width="100px">
            <el-form-item label="时间">
              <span>{{ recordDetail.year + '-' + recordDetail.month + '-' + recordDetail.day }}</span>
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
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { uploadRecords, uploadDetail } from '@/api/report/import'
import { parseTime } from '@/utils'
export default {
  name: 'DayImport',
  components: {},

  data() {
    return {
      listQuery: {
        // 查询条件
        reportType: 11,
        date: new Date()
      },
      recordsObj: {},
      recordDetail: null,
      reportTypeOption: [
        { value: 11, label: '零售业务销售数据' },
        { value: 1, label: '批发业务销售数据' },
        { value: 2, label: '批发业务合同数据' },
        { value: 3, label: '批发业务计划数据' }
      ],
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {},
  watch: {
    listQuery: {
      handler: function (newVal) {
        console.log('listQuery.date')
        this.getUploadDetail()
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    // this.getUploadRecords()
  },
  methods: {
    // 查询上传记录
    async getUploadRecords() {
      // 得到查询条件
      const params = {
        type: this.listQuery.reportType,
        year: this.listQuery.date.getFullYear(),
        month: this.listQuery.date.getMonth() + 1
      }

      // 发送查询请求
      const res = await uploadRecords(params)
      if (res.status !== 0) return this.$message.error('获取数据失败')

      this.recordsObj = {}
      res.data.forEach(record => {
        const date = parseTime(new Date(record.year, record.month - 1, record.day), '{y}-{m}-{d}')
        this.recordsObj[date] = record
      })
    },
    isSubmited(data) {
      return this.recordsObj[data.day]
    },
    // 查询上传详情
    async getUploadDetail() {
      const record = this.recordsObj[parseTime(new Date(this.listQuery.date), '{y}-{m}-{d}')]
      if (record) {
        const res = await uploadDetail(record.id)
        if (res.status !== 0) return this.$message.error('获取数据失败')
        this.recordDetail = res.data
      } else {
        this.recordDetail = null
      }

      console.log('this.recordDetail', this.recordDetail.filename)
    }
  }
}
</script>

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
