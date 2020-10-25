<template>
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <!-- 请输入客户名称 -->
        <el-input v-model="listQuery.name" placeholder="请输入客户名称" clearable @blur="handleFilter" @clear="handleFilter" />
      </div>
      <div>
        <el-button type="primary" @click="handleCreate">添加</el-button>
        <el-button v-waves :loading="downloadLoading" type="primary" @click="handleDownload">导出</el-button>
      </div>
    </div>
    <!-- 表格区域 -->
    <el-table v-loading="listLoading" :data="tableData" border>
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="name" label="客户名称" align="center" />
      <el-table-column prop="address" label="地址" align="center" />
      <el-table-column prop="creator" label="创建人" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" width="140">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="totalCount" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 编辑组织 -->
    <el-dialog :title="isEdit ? '编辑' : '新增'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model.trim="temp.name" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model.trim="temp.address" />
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
import { fetchList, saveCustomer, deleteCustomer } from '@/api/customer/lng'
import waves from '@/directive/waves' // waves directive
import { parseTime, deleteNullParam, getPointByAddr } from '@/utils'
import loadBMap from '@/utils/loadBMap.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Retail',
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
        name: '' // 搜索关键字
      },
      dialogFormVisible: false, // dialog 的显示与隐藏
      isEdit: false, // create 还是 update。新建还是编辑
      temp: {
        // 表单字段
        id: '',
        name: '',
        address: ''
      },
      rules: {
        // 表单规则
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
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
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (!this.isEdit) delete tempData.id
          getPointByAddr(tempData.address, async (flag, point) => {
            if (flag) {
              tempData.lat = point.lat
              tempData.lon = point.lng
              const res = await saveCustomer(tempData)
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
        }
      })
    },
    // 删除组织
    handleDelete(row) {
      this.$confirm(`你确定要删除【${row.name}】吗?`, '提示', {
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteCustomer(row.id)
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
      this.temp.name = row.name
      this.temp.address = row.address

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
        const tHeader = ['客户名称', '地址']
        const filterVal = ['name', 'address']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `冀东LNG客户(${parseTime(new Date(), '{y}-{m}-{d} {h}h{i}m{s}s')})`
        })
        this.downloadLoading = false
      })
    },
    // excel 个数数据
    formatJson(filterVal) {
      return this.tableData.map(obj =>
        filterVal.map(key => {
          const value = obj[key]
          return value
        })
      )
    },

    // 重置数据
    resetTemp() {
      this.temp.id = ''
      this.temp.name = ''

      this.temp.address = ''
    }
  }
}
</script>
