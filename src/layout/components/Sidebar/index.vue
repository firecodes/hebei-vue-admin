<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
    <el-menu
      :default-active="this.$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="false"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
      router
    >
      <template v-for="menu in menuList">
        <!-- 一级菜单 -->
        <el-submenu v-if="menu.children" :key="menu.path" :index="menu.path">
          <!-- 一级菜单的模板区域 -->
          <template slot="title">
            <i :class="menu.icon" />
            <span>{{ menu.name }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            v-for="child in menu.children"
            :key="child.path"
            :index="child.path"
          >{{ child.name }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="menu.path" :index="menu.path">
          <i :class="menu.icon" />
          <span slot="title">{{ menu.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
// import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { Logo },
  data() {
    return {
      // isCollapseData: this.isCollapse,
      menuList: [
        {
          name: '首页',
          path: '/pc/home',
          icon: 'el-icon-s-home'
        },
        {
          name: '数据中心',
          path: 'data',
          icon: 'el-icon-data-line',
          children: [
            { name: '批发业务', path: '/pc/data/wholesale' },
            { name: '零售业务', path: '/pc/data/retail' },
            { name: '价格分析', path: '/pc/data/price' }
          ]
        },
        {
          name: '报表管理',
          path: 'report',
          icon: 'el-icon-document',
          children: [
            { name: '数据导入', path: '/pc/report/import' },
            { name: '数据导出', path: '/pc/report/export' }
          ]
        },
        {
          name: '客户管理',
          path: 'customer',
          icon: 'el-icon-s-custom',
          children: [
            { name: '管道气客户', path: '/pc/customer/pipeline' },
            { name: '冀东LNG客户', path: '/pc/customer/lng' },
            { name: '零售客户', path: '/pc/customer/retail' }
          ]
        },
        {
          name: '系统管理',
          path: 'setting',
          icon: 'el-icon-setting',
          children: [{ name: '用户管理', path: '/pc/setting/user' }]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'permission_routes']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
