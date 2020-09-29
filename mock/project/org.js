const Mock = require('mockjs')

// const List = []
// const count = 15

// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock({
//     id: '@increment',
//     'orgName|1': ['湖北分公司', '黄石公司', '咸宁公司', '荆门公司', '武汉中油', '武汉压缩', '武汉昆仑', '恩施公司', '仙桃公司', '十堰公司', '武汉东湖', '孝感公司', '昆利湖北', '宜昌公司', '湖北新捷公司'],
//     'orgType|1': [2, 3],
//     'gasSourceType|1': [1, 2, 3, 4],
//     'upperLine|1': ['忠武线', '川气东送', '西二线', '西二线', '无'],
//     'reportType|1': ['1', '1,2', '3', '1,2,3'],
//     address: '@county(true)',
//     lon: '@float(100, 120)',
//     lat: '@float(20, 40)',
//     createUserId: 1,
//     createUser: '@cname',
//     lastModifyUser: '@cname',
//     updateUserId: 1,
//     createTime: '@now',
//     updateTime: '@now'
//   }))
// }

const List = Mock.mock([{ id: 1, orgName: '湖北分公司', orgType: 2, gasSourceType: 0, upperLine: '', reportType: '2', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 2, orgName: '黄石公司', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 3, orgName: '咸宁公司', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 4, orgName: '荆门公司', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 5, orgName: '武汉中油', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 6, orgName: '武汉压缩', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 7, orgName: '武汉昆仑', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 8, orgName: '恩施公司', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 9, orgName: '仙桃公司', orgType: 3, gasSourceType: 1, upperLine: '川气东送', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 10, orgName: '十堰公司', orgType: 3, gasSourceType: 1, upperLine: '西二线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 11, orgName: '武汉东湖', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 12, orgName: '孝感公司', orgType: 3, gasSourceType: 2, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 13, orgName: '昆利湖北', orgType: 3, gasSourceType: 1, upperLine: '西二线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 14, orgName: '宜昌公司', orgType: 3, gasSourceType: 1, upperLine: '忠武线', reportType: '1', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 15, orgName: '湖北新捷公司', orgType: 3, gasSourceType: 3, upperLine: '', reportType: '1,2', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' },
{ id: 16, orgName: '黄冈工厂（LNG）', orgType: 3, gasSourceType: 0, upperLine: '', reportType: '3', address: '@county(true)', lon: '@float(100, 120)', lat: '@float(20, 40)', createUserId: 1, createUser: '@cname', lastModifyUser: '@cname', updateUserId: 1, createTime: '@now', updateTime: '@now' }])

module.exports = [
  {
    url: '/api/org',
    type: 'get',
    response: config => {
      const { pageNum = 1, pageSize = 10, orgType, reportType, orgName } = config.query
      console.log(pageNum, pageSize, orgType, orgName)

      const mockList = List.filter(item => {
        if (orgType && item.orgType != orgType) return false
        if (orgName && item.orgName.indexOf(orgName) === -1) return false
        if (reportType && item.reportType.indexOf(reportType) === -1) return false
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
    url: '/api/org',
    type: 'post',
    response: config => {
      // List.unshift(config.body)
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  },

  {
    url: '/api/org',
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
    url: '/api/org',
    type: 'delete',
    response: _ => {
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  }
]
