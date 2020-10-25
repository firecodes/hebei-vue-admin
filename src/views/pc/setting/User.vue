<template>
  <!-- 未完成的：把地址转成经纬度 -->
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <!-- 请输入客户名称 -->
        <el-select v-model="listQuery.status" clearable placeholder="状态" style="width: 140px" class="mr-1" @change="handleFilter">
          <el-option v-for="item in userStatusOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model.trim="listQuery.keyword" placeholder="请输入登录账号/姓名" clearable style="width: 220px" @clear="handleFilter" @change="handleFilter" />
      </div>
      <div>
        <el-button type="primary" @click="handleCreate">添加</el-button>
        <el-button v-waves :loading="downloadLoading" type="primary" @click="handleDownload">导出</el-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <el-table v-loading="listLoading" :data="tableData" border>
      <el-table-column type="index" label="#" width="80" />
      <el-table-column prop="mobile" label="登录账号" align="center" />
      <el-table-column prop="realName" label="姓名" align="center" />
      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <span v-for="item in userStatusOption" :key="'status' + item.value">
            <el-tag v-if="item.value == row.status" :type="item.type" disable-transitions>{{ item.label }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="mobile" label="联系方式" align="center" /> -->
      <el-table-column prop="creator" label="创建人" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          <!-- 重置密码 -->
          <el-tooltip effect="dark" content="重置密码" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-unlock" @click="handleResetPassd(row)" />
          </el-tooltip>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑组织 -->
    <el-dialog :title="isEdit ? '编辑' : '新增'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
        <!-- <el-form-item label="用户名" prop="username">
          <el-input
            ref="usernameRef"
            v-model.trim="temp.username"
            autocomplete="off"
            :disabled="isEdit"
          />
        </el-form-item>-->
        <el-form-item label="登录账号" prop="mobile">
          <el-input v-model.trim="temp.mobile" autocomplete="off" :disabled="isEdit" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model.trim="temp.realName" autocomplete="off" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch v-model="temp.status" :active-value="0" :inactive-value="1" active-color="#13ce66" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, saveUser, resetPassword, deleteUser } from '@/api/system/user'
import waves from '@/directive/waves' // waves directive
import { parseTime, deleteNullParam } from '@/utils'
import { userStatusOption } from '@/utils/options'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableData: null, // 表格数据
      totalCount: 0, // 总条数
      listLoading: true, // 加载动画
      listQuery: {
        // 查询条件
        pageNum: 1,
        pageSize: 10,
        status: '', // 0启用， 1禁用
        keyword: ''
      },
      userStatusOption,
      dialogFormVisible: false, // dialog 的显示与隐藏
      isEdit: false, // create 还是 update。新建还是编辑
      temp: {
        // 表单字段
        id: '',
        username: '',
        realName: '',
        mobile: '',
        status: 0
      },
      rules: {
        // 表单规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名的长度大于 3 个字符', trigger: 'blur' }
        ],
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/i, message: '请输入正确的电话号码', trigger: 'blur' }
        ]
      },
      downloadLoading: false // 下载动画
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(deleteNullParam(this.listQuery)).then(response => {
        this.tableData = response.data
        this.totalCount = response.totalCount
        this.listLoading = false
      })
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
    // 删除组织
    handleDelete(row) {
      this.$confirm(`你确定要删除【${row.mobile}】吗?`, '提示', {
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteUser(row.id)
          if (res.status === 0) {
            this.$message.success('删除成功')
            // 重新获取数据
            this.handleFilter()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    // 重置密码
    handleResetPassd(row) {
      this.$confirm(`你确定要重置【${row.mobile}】的密码吗?`, '提示', {
        type: 'warning'
      })
        .then(async () => {
          const res = await resetPassword(row.id)
          if (res.status === 0) {
            this.$message.success('该用户的密码已经被重置为 123456 ')
            // 重新获取数据
            this.handleFilter()
          } else {
            this.$message.error('重置密码失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消操作')
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
    // 点击“下载”按钮
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['登录账号', '姓名', '状态']
        const filterVal = ['mobile', 'realName', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `用户管理(${parseTime(new Date(), '{y}-{m}-{d} {h}h{i}m{s}s')})`
        })
        this.downloadLoading = false
      })
    },
    // excel 个数数据
    formatJson(filterVal) {
      return this.tableData.map(obj =>
        filterVal.map(key => {
          const value = obj[key]

          switch (key) {
            case 'status':
              return this.getStatusLabel(value)
            default:
              return value
          }
        })
      )
    },
    // 根据status的值，得到对应的label
    getStatusLabel(code) {
      const item = this.userStatusOption.find(item => item.value === code)
      return (item && item.label) || ''
    },

    // 重置数据
    resetTemp() {
      this.temp.id = ''
      this.temp.username = ''
      this.temp.realName = ''
      this.temp.mobile = ''
      this.temp.status = 0
    }
  }
}
</script>
