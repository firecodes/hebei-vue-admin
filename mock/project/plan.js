const Mock = require('mockjs')
let id = 1
let db = []
module.exports = [
  {
    url: '/api/plan/branch',
    type: 'get',
    response: config => {
      // type = 'month' | 'year
      const { year, month, type } = config.query
      console.log(year, month, type)

      let data
      if (type == 'month') {
        data = db.filter(item => item.year == year && item.month == month && item.type == type)
      } else {
        data = db.filter(item => item.year == year && item.type == type)
      }
      // if (Math.round(Math.random())) {
      //   data = [{ id: '@integer(1, 100)', orgId: 2, orgName: '黄石公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 3, orgName: '咸宁公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 4, orgName: '荆门公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 5, orgName: '武汉中油', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 6, orgName: '武汉压缩', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 7, orgName: '武汉昆仑', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 8, orgName: '恩施公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 9, orgName: '仙桃公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 10, orgName: '十堰公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 11, orgName: '武汉东湖', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 12, orgName: '孝感公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 13, orgName: '昆利湖北', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 14, orgName: '宜昌公司', quantity: '@integer(100, 1000)', year, month, type },
      //   { id: '@integer(1, 100)', orgId: 15, orgName: '湖北新捷公司', quantity: '@integer(100, 1000)', year, month, type }]
      //   db = [...db, ...data]
      // }

      return {
        status: 0,
        msg: 'success',
        data
      }
    }
  },
  {
    url: '/api/plan/branch',
    type: 'post',
    response: config => {
      // List.unshift(config.body)
      // console.log(config.body)

      if (config.body[0].type == 'month') {
        db = db.filter(item => !(item.year == config.body[0].year && item.month == config.body[0].month && item.type == config.body[0].type))
      } else {
        db = db.filter(item => !(item.year == config.body[0].year && item.type == config.body[0].type))
      }
      config.body.forEach(item => {
        item.id = id++
        db.push(item)
      })
      // db.push(config.body)
      console.log(db)
      return {
        status: 0,
        msg: 'success',
        data: null
      }
    }
  }
]
