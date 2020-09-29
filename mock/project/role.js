// const Mock = require('mockjs')

module.exports = [
  {
    url: '/api/role',
    type: 'get',
    response: config => {
      const { pageNum = 1, pageSize = 10 } = config.query
      const pageList = [
        { id: 1, role: 'admin-level2', roleName: '二级单位管理员' },
        { id: 2, role: 'user-level2', roleName: '二级单位用户' },
        { id: 3, role: 'admin-level3', roleName: '三级单位管理员' },
        { id: 4, role: 'user-level3', roleName: '三级单位用户' }
      ]

      return {
        pageSize,
        pageNum,
        totalCount: pageList.length,
        status: 0,
        msg: 'success',
        data: pageList

      }
    }
  }

]
