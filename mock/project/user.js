const Mock = require('mockjs')

// 拓展mockjs
Mock.Random.extend({
  phone: function () {
    var phonePrefixs = ['132', '135', '136', '189', '158'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) // Number()
  }
})

const List = []
const count = 100

const tokens = {
  admin: { // 系统管理员
    token: 'admin-token'
  },
  15811111111: {
    token: 'admin-level2-token'
  },
  15811111112: {
    token: 'user-level2-token'
  },
  15811111113: {
    token: 'admin-level3-token'
  },
  15811111114: {
    token: 'user-level3-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    roleName: '系统管理员',
    orgName: '',
    name: 'admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  'admin-level2-token': {
    roles: ['admin-level2'],
    roleName: '二级单位管理员',
    orgName: '湖北分公司',
    name: '张三',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  'user-level2-token': {
    roles: ['user-level2'],
    roleName: '二级单位用户',
    orgName: '湖北分公司',
    name: '李四',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  'admin-level3-token': {
    roles: ['admin-level3'],
    roleName: '三级单位管理员',
    orgName: '黄石公司',
    name: '王五',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  'user-level3-token': {
    roles: ['user-level3'],
    roleName: '三级单位用户',
    orgName: '黄石公司',
    name: '赵六',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  }

}
for (let i = 0; i < count; i++) {
  const item = Mock.mock({
    id: '@increment',
    username: '@phone',
    realName: '@cname',
    'status|1': [0, 1],
    'orgId|1': [1, 2, 3, 4],
    'orgName|1': ['黄石公司', '咸宁公司', '荆门公司', '武汉中油', '武汉压缩', '武汉昆仑', '恩施公司', '仙桃公司', '十堰公司', '武汉东湖', '孝感公司', '昆利湖北', '宜昌公司', '湖北新捷公司'],
    'roleId|1': [1, 2, 3, 4],
    'roleName|1': ['二级单位管理员', '二级单位用户', '三级单位管理员', '三级单位用户'],
    createUserId: 1,
    createUser: '@cname',
    lastModifyUser: '@cname',
    updateUserId: 1,
    createTime: '@now',
    updateTime: '@now'
  })
  item.username = item.username + ''
  List.push(item)
}

module.exports = [
  {
    url: '/api/user',
    type: 'get',
    response: config => {
      const { pageNum = 1, pageSize = 10, status, roleId, orgId, keyword } = config.query
      console.log(pageNum, pageSize, status, roleId, orgId, keyword)

      const mockList = List.filter(item => {
        // console.log(item)
        if (status && item.status != status) return false
        if (roleId && item.roleId != roleId) return false
        if (orgId && item.orgId != orgId) return false
        if (keyword) {
          console.log(item.username, item.username.indexOf(keyword), item.realName.indexOf(keyword))
          if (item.username.indexOf(keyword) !== -1 || item.realName.indexOf(keyword) !== -1) return true
          return false
        }
        return true
      })

      const pageList = mockList.filter((item, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))

      return {
        pageSize,
        pageNum,
        totalCount: mockList.length,
        status: 0,
        msg: 'success',
        data: pageList
      }
    }
  },

  {
    url: '/api/user',
    type: 'post',
    response: _ => {
      // console.log(_)
      console.log(11111111111)
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  },

  {
    url: '/api/user',
    type: 'put',
    response: _ => {
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  },
  {
    url: '/api/user',
    type: 'delete',
    response: _ => {
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  },
  // user login
  {
    url: '/api/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]
      console.log(config.body)
      // debugger
      // mock error
      if (!token) {
        return {
          status: 60204,
          message: '用户名或密码错误'
        }
      }

      return {
        status: 0,
        msg: 'success',
        data: token
      }
    }
  },
  {
    url: '/api/user/password/reset',
    type: 'put',
    response: _ => {
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  },
  {
    url: '/api/user/password/update',
    type: 'put',
    response: _ => {
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  },

  // get user info
  {
    url: '/api/user/info\.*',
    type: 'get',
    response: config => {
      // console.log(config)
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          status: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        status: 0,
        msg: 'success',
        data: info
      }
    }
  },

  // user logout
  {
    url: '/api/user/logout',
    type: 'post',
    response: _ => {
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  }
]
