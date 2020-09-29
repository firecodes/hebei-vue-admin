
const Mock = require('mockjs')

// 拓展mockjs
Mock.Random.extend({
  phone: function () {
    var phonePrefixs = ['132', '135', '136', '189', '158'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) // Number()
  }
})

let state = 1
let data_1 = {
  // 基本信息：
  id: '@integer(60, 100)',					// 默认为0，可不填
  state,			// 标志表的状态（暂存，审核中，退回，审核通过）
  date: '', // 日报日期
  editUser: '@cname',		// 填报人
  editUserTel: '@phone',				// 联系方式
  editTime: '@now',		// 填报时间
  reportUser: '@cname', 	// 上报人
  reportUserTel: '@phone',				// 联系方式
  reportTime: '@now',		// 上报时间

  // 计划数据：
  planMonth: 2697.00, // 月计划
  replyMonth: 2129.70, // 月批复
  planDay_1: 73.00, // 当日计划
  replyDay: 73.00,		// 当日批复
  planDay_2: 73.00,		// 次日计划
  replyTomorrow: 73.00, // 次日批复

  // 购气数据：
  png: 66.8702,			// 管道气
  cng: 0,			// 购气数据-CNG
  lng: 0,			// 购气数据-LNG
  lpg: 0,			//  购气数据-LPG

  // 销气数据：
  resident: 6.2250,		// 居民
  enterprise: 6.2250,		// 企业
  publicService: 6.2250,	// 公服
  transfer: 6.2250,		// 销气数据-转供
  cng_1: 6.2250, // 销气数据-CNG
  lng_1: 6.2250,			// 销气数据-LNG
  daishu: 6.2250, // 代输

  // 自用数据：
  product: 6.2250,		// 生产用气
  live: 6.2250,			// 生活用气

  // 新增用户统计：
  resident_1: 22,		// 新增用户统计-居民
  commerce: 22,		// 商业
  industry: 22,		// 工业
  transfer_1: 22,		// 新增用户统计-转供
  other: 22,			// 其他
  remark: 22, // 备注

  // 其他数据：
  pipStock: 3.7489,		// 管库存
  loss: 3.7489,			// 耗损
  lossRate: 3.7489,		// 耗损率
  pressureIn: 3.7489,		// 进站压力
  pressureOut: 3.7489,	// 出站压力
  tempIn: 3.7489, // 进站温度
  tempOut: 3.7489,		// 出站温度
  productState: 'string'	// 生产运行状态
}
const data_2 = {
  // 基本信息：
  id: '@integer(60, 100)',					// 默认为0，可不填
  state,			// 标志表的状态（暂存，审核中，退回，审核通过）
  date: '', // 日报日期
  editUser: '@cname',		// 填报人
  editUserTel: '@phone',				// 联系方式
  editTime: '@now',		// 填报时间
  reportUser: '@cname', 	// 上报人
  reportUserTel: '@phone',				// 联系方式
  reportTime: '@now',		// 上报时间

  // 购气数据：
  pipGas: 1.9963, // 购气数据-管道气
  artificialGas: 0,	// 购气数据-人工煤气
  lngIn: 0,			// 购气数据-LNG内购
  lngOut: 0, // 购气数据-LNG外购
  pipTranGas: 0, // 购气数据-管输气
  cng: 0,			// 购气数据-CNG

  // 销气数据：
  pipGas_1: 1.9963,		// 销气数据-管道气
  artificialGas_1: 0,	// 销气数据-人工煤气
  lngIn_1: 0,		// 销气数据-LNG内购
  lngOut_1: 0,		// 销气数据-LNG外购
  pipTranGas_1: 0,	// 销气数据-管输气
  cng_1: 0		// 销气数据-CNG
}

const data_3 = {
  // 基本信息：
  id: '@integer(60, 100)',		// 默认为0，可不填
  state, // 标志表的状态（暂存，审核中，退回，审核通过）
  date: '', // 日报日期
  editUser: '@cname',		// 填报人
  editUserTel: '@phone',				// 联系方式
  editTime: '@now',		// 填报时间
  reportUser: '@cname', 	// 上报人
  reportUserTel: '@phone',				// 联系方式
  reportTime: '@now',		// 上报时间

  // 购销存数据：
  buyGasDay: 1.9963, // 购气日累
  sellGasDay: 1.9963, // 销气日累
  productGas: 1.9963, // 生产用气
  liveGas: 1.9963,		// 生活用气
  stockDayWf: 1.9963, // 当日库存（万方）
  stockDayDun: 1.9963,	// 当日库存（吨）
  storageCapacity: 1.9963, // 库容比

  // 日运行动态：
  gapCause: 'string',		// 购销气量与上一日对比相差10%以上的数据原因分析
  awork: 'string', // A类动火作业日进展情况
  adevice: 'string',		// A类生产设备维修、保养情况
  aprog: 'string',			// A类项目投产日进展情况
  emergency: 'string', // 突发事件
  weather: 'string', // 影响生产的恶劣天气情况
  exchange: 'string',		// 上、下游单位重大生产变化或事故事件
  adeviceOp: 'string',		// 本单位A类生产设备操作情况变化
  questions: 'string',		// 需要协调解决的问题
  otherThing: 'string' 	// 其他
}
module.exports = [
  {
    // 获取日报
    url: '/api/productReport',
    type: 'get',
    response: config => {
      const { date, type } = config.query
      console.log('获取日报', date, type)
      let resturnData = {}
      if (type == 1) {
        resturnData = data_1
      } else if (type == 2) {
        resturnData = data_2
      } else {
        resturnData = data_3
      }
      resturnData.date = date

      return {
        status: 0,
        msg: '',
        data: resturnData
      }
    }
  },
  {
    // 提交日报 type=1|2|3
    url: '/api/productReport',
    type: 'post',
    response: config => {
      // console.log(config.query)
      data_1 = config.body
      const { opType, type } = config.query
      console.log(opType, type)
      if (opType === 'tempStorage') {
        return {
          status: 0,
          msg: '',
          data: {
            state: 1
          }
        }
      } else if (opType === 'submit') {
        return {
          status: 0,
          msg: '',
          data: {
            state: 2
          }
        }
      }
    }
  },
  {
    // 更改日报的状态 type=1|2|3；opType=report|returnBack
    url: '/api/productReport',
    type: 'put',
    response: config => {
      console.log(config)
      const { opType, type, id } = config.query
      console.log(opType, type, id)

      if (opType === 'report') {
        // 审核通过上报-- 状态：已上报
        state = 3
        return {
          status: 0,
          msg: '',
          data: {
            state: 3
          }
        }
      } else if (opType === 'returnBack') {
        // 审核不通过，退回-- 状态：已退回
        state = 4
        return {
          status: 0,
          msg: '',
          data: {
            state: 4
          }
        }
      }
    }
  },
  {
    // 日报填报中，填写的日报记录
    url: '/api/productRecords',
    type: 'get',
    response: config => {
      console.log(config)
      const { year, month, type } = config.query
      console.log(year, month, type)

      if (type == 1) {
        return {
          status: 0,
          msg: '',
          data: {
            '2020-08-01': true,
            '2020-08-03': true
          }
        }
      } else if (type == 2) {
        return {
          status: 0,
          msg: '',
          data: {
            '2020-08-01': true,
            '2020-08-02': true
          }
        }
      } else {
        return {
          status: 0,
          msg: '',
          data: {
            '2020-08-01': true
          }
        }
      }
    }
  },
  {
    // 日报汇总中，填写的日报记录
    url: '/api/productRecords/list',
    type: 'get',
    response: config => {
      console.log(config)
      const { year, month, type } = config.query
      console.log(year, month, type)

      return {
        status: 0,
        msg: '',
        data: {
          '2020-08-01': true,
          '2020-08-03': true,
          '2020-08-07': true,
          '2020-08-08': true,
          '2020-08-09': true,
          '2020-08-10': true,
          '2020-08-15': true
        }
      }
    }
  },
  {
    // 日报汇总中，某天的填报情况
    url: '/api/productRecords/list/detail',
    type: 'get',
    response: config => {
      console.log(config)
      const { year, month } = config.query
      console.log(year, month)

      return {
        status: 0,
        msg: '',
        data: {
          buySaleStockList: [
            { orgId: 2, orgName: '黄石公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 3, orgName: '咸宁公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 4, orgName: '荆门公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 5, orgName: '武汉中油', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 6, orgName: '武汉压缩', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 7, orgName: '武汉昆仑', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 8, orgName: '恩施公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 9, orgName: '仙桃公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 10, orgName: '十堰公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 11, orgName: '武汉东湖', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 12, orgName: '孝感公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 13, orgName: '昆利湖北', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 14, orgName: '宜昌公司', reportId: '@integer(60, 200)', reportType: 1, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' },
            { orgId: 15, orgName: '湖北新捷公司' }

          ],
          tradeMeterList: [{ orgId: 1, orgName: '湖北分公司', reportId: '@integer(60, 200)', reportType: 2, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' }, { orgId: 15, orgName: '湖北新捷公司' }],
          huanggangFactoryList: [{ orgId: 16, orgName: '黄冈工厂', reportId: '@integer(60, 200)', reportType: 3, reportTime: '@now("yyyy-MM-dd")' + ' ' + '@time' }]
        }
      }
    }
  }
]
