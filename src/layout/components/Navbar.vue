<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="realName">您好，{{ name }}</div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/img/pc/user.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="goScreen">
            <span>
              <b class="el-icon-monitor mr-1" />大屏展示
            </span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="dialogFormVisible=true">
            <span>
              <svg-icon icon-class="password" class="mr-1" />更改密码
            </span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span>
              <i class="el-icon-top-right mr-1" />退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 更改密码 -->
    <el-dialog title="更改密码" :visible.sync="dialogFormVisible" :width="'500px'" @close="clear">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="temp.oldPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="temp.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkNewPassword">
          <el-input v-model="temp.checkNewPassword" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePasswordUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

import { passwordUpdate } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'name'])
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 获取用户信息
    getInfo() {
      this.$store
        .dispatch('user/getInfo')
        .then(res => {
          console.log(res)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 大屏展示
    goScreen() {
      this.$router.push('/screen')
    },
    // 更改密码
    handlePasswordUpdate() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          passwordUpdate({
            oldPassword: this.temp.oldPassword,
            newPassword: this.temp.newPassword
          }).then(res => {
            if (res.status === 0) {
              this.$message.success('修改密码成功')
              this.dialogFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    clear() {
      this.$refs['dataForm'].resetFields()
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      console.log('value11=', value)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.temp.checkNewPassword !== '') {
          this.$refs['dataForm'].validateField('checkNewPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      console.log('value22=', value)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      temp: {
        oldPassword: '',
        newPassword: '',
        checkNewPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        checkNewPassword: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    // line-height: 50px;

    &:focus {
      outline: none;
    }
    .realName {
      display: inline-block;
      padding-right: 10px;
      position: relative;
      top: -10px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
