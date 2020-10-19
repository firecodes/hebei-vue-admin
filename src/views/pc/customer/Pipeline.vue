<template>
  <!-- 未完成的：把地址转成经纬度 -->
  <div class="app-container">
    <!-- 顶部搜索区域 -->
    <div class="filter-container mb-1">
      <div>
        <!-- 区域 -->
        <el-select v-model="listQuery.code" placeholder="区域" clearable style="width: 140px" class="mr-1" @change="handleFilter">
          <el-option v-for="item in areaOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <!-- 直供工业用户 -->
        <el-select v-model="listQuery.isDirectSupply" placeholder="直供工业用户" clearable style="width: 140px" class="mr-1" @change="handleFilter">
          <el-option v-for="item in isDirectSupplyOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <!-- 昆仑系 -->
        <el-select v-model="listQuery.isKunlun" placeholder="昆仑系" clearable style="width: 120px" class="mr-1" @change="handleFilter">
          <el-option v-for="item in isKunlunOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <!-- 请输入客户名称 -->
        <el-input v-model="listQuery.customerName" placeholder="请输入客户名称" clearable style="width: 200px" @blur="handleFilter" @clear="handleFilter" />
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
      <el-table-column prop="mergeItems" label="客户合并项" align="center" />
      <el-table-column prop="pipeline" label="管线" align="center" />
      <el-table-column prop="area" label="所属区域" align="center">
        <template slot-scope="{ row }">{{ getCodeLabel(row.area) }}</template>
      </el-table-column>
      <el-table-column prop="directSupplier" label="直供工业用户" align="center">
        <template slot-scope="{ row }">
          <span v-for="item in isDirectSupplyOption" :key="'directSupplier' + item.value">
            <el-tag v-if="item.value == row.directSupplier" :type="item.type" disable-transitions>{{ item.label }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="belongKunlun" label="昆仑系" align="center">
        <template slot-scope="{ row }">
          <span v-for="item in isKunlunOption" :key="'belongKunlun' + item.value">
            <el-tag v-if="item.value == row.belongKunlun" :type="item.type" disable-transitions>{{ item.label }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" align="center" width="250" />
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model.trim="temp.name" autocomplete="off" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="客户合并项" prop="mergeItems">
          <el-input v-model.trim="temp.mergeItems" autocomplete="off" placeholder="多项用、隔开" />
        </el-form-item>
        <el-form-item label="管线" prop="pipeline">
          <el-input v-model.trim="temp.pipeline" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select v-model="temp.area">
            <el-option v-for="item in areaOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="直供工业用户">
          <el-switch v-model="temp.directSupplier" :active-value="1" :inactive-value="2" active-color="#13ce66" />
        </el-form-item>
        <el-form-item label="昆仑系">
          <el-switch v-model="temp.belongKunlun" :active-value="1" :inactive-value="2" active-color="#13ce66" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model.trim="temp.address" autocomplete="off" />
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
import { fetchList, saveCustomer, deleteCustomer } from '@/api/customer/pipeline'
import waves from '@/directive/waves' // waves directive
import { parseTime, deleteNullParam, getPointByAddr } from '@/utils'
import loadBMap from '@/utils/loadBMap.js'
import { areaOption, isDirectSupplyOption, isKunlunOption } from '@/utils/options'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Pipeline',
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
        code: '', // 区域
        isDirectSupply: '', // 直供工业用户
        isKunlun: '', // 昆仑系
        customerName: '' // 搜索关键字
      },
      areaOption, // 区域编码
      isDirectSupplyOption, // 直供工业用户编码
      isKunlunOption, // 昆仑系
      dialogFormVisible: false, // dialog 的显示与隐藏
      isEdit: false, // create 还是 update。新建还是编辑
      temp: {
        // 表单字段
        id: '',
        name: '',
        mergeItems: '',
        pipeline: '',
        area: '',
        directSupplier: 2,
        belongKunlun: 2,
        address: ''
      },
      rules: {
        // 表单规则
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        pipeline: [{ required: true, message: '请输入管线', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        area: [{ required: true, message: '请选择所属区域', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      },
      downloadLoading: false // 下载动画
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    loadBMap()
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
      this.$refs['dataForm'].validate(valid => {
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
      this.temp.mergeItems = row.mergeItems
      this.temp.pipeline = row.pipeline
      this.temp.area = row.area
      this.temp.directSupplier = row.directSupplier
      this.temp.belongKunlun = row.belongKunlun
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
        const tHeader = ['客户名称', '客户合并项', '管线', '所属区域', '直供工业用户', '昆仑系', '地址']
        const filterVal = ['name', 'mergeItems', 'pipeline', 'area', 'directSupplier', 'belongKunlun', 'address']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `管道气客户(${parseTime(new Date(), '{y}-{m}-{d} {h}h{i}m{s}s')})`
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
            case 'area':
              return this.getCodeLabel(value)
            case 'directSupplier':
              return this.getDirectSupplierLabel(value)
            case 'belongKunlun':
              return this.getBelongKunlunLabel(value)
            default:
              return value
          }
        })
      )
    },

    // 重置数据
    resetTemp() {
      this.temp.id = ''
      this.temp.name = ''
      this.temp.mergeItems = ''
      this.temp.pipeline = ''
      this.temp.area = ''
      this.temp.directSupplier = 2
      this.temp.belongKunlun = 2
      this.temp.address = ''
    },
    // 根据status的值，得到对应的label
    getCodeLabel(code) {
      const item = this.areaOption.find(item => item.value === code)
      return (item && item.label) || ''
    },
    // 根据status的值，得到对应的label
    getDirectSupplierLabel(directSupplier) {
      const item = this.isDirectSupplyOption.find(item => item.value === directSupplier)
      return (item && item.label) || ''
    },
    // 根据status的值，得到对应的label
    getBelongKunlunLabel(belongKunlun) {
      const item = this.isKunlunOption.find(item => item.value === belongKunlun)
      return (item && item.label) || ''
    }
  }
}
</script>
