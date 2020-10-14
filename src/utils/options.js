// 区域编码
export const areaOption = [
  { value: 1, label: '石家庄地区', lng: 114.48, lat: 38.03 },
  { value: 2, label: '邯郸地区', lng: 114.47, lat: 36.62 },
  { value: 3, label: '邢台地区', lng: 114.48, lat: 37.05 },
  { value: 4, label: '雄安地区', lng: 116.113523, lat: 38.99955 },
  { value: 5, label: '衡水地区', lng: 115.72, lat: 37.72 },
  { value: 6, label: '保定地区', lng: 115.48, lat: 38.85 },
  { value: 7, label: '廊坊地区', lng: 116.7, lat: 39.53 },
  { value: 8, label: '沧州地区', lng: 116.83, lat: 38.33 },
  { value: 9, label: '张家口地区', lng: 114.87, lat: 40.82 },
  { value: 10, label: '秦皇岛地区', lng: 119.57, lat: 39.95 },
  { value: 11, label: '唐山地区', lng: 118.02, lat: 39.63 }
]

// 直供工业用户编码
export const isDirectSupplyOption = [
  { value: 1, label: '是', type: 'success' },
  { value: 2, label: '否', type: 'danger' }
]
// 昆仑系编码
export const isKunlunOption = [
  { value: 1, label: '是', type: 'success' },
  { value: 2, label: '否', type: 'danger' }
]

// 用户状态
export const userStatusOption = [
  { value: 0, label: '启用', type: 'success' },
  { value: 1, label: '禁用', type: 'danger' }
]

export const locationOption = [
  {
    label: '河北',
    value: '河北',
    children: [
      { value: '河北-保定', label: '保定' },
      { value: '河北-沧州', label: '沧州' },
      { value: '河北-承德', label: '承德' },
      { value: '河北-邯郸', label: '邯郸' },
      { value: '河北-衡水', label: '衡水' },
      { value: '河北-廊坊', label: '廊坊' },
      { value: '河北-秦皇岛', label: '秦皇岛' },
      { value: '河北-石家庄', label: '石家庄' },
      { value: '河北-唐山', label: '唐山' },
      { value: '河北-邢台', label: '邢台' },
      { value: '河北-张家口', label: '张家口' }
    ]
  },
  { value: '北京', label: '北京' },
  { value: '天津', label: '天津' }
]
export const locationOptionSmall = [
  {
    label: '河北',
    value: '河北',
    children: [
      { value: '河北-保定', label: '保定' },
      { value: '河北-沧州', label: '沧州' },
      { value: '河北-邯郸', label: '邯郸' },
      { value: '河北-廊坊', label: '廊坊' },
      { value: '河北-石家庄', label: '石家庄' },
      { value: '河北-唐山', label: '唐山' }
    ]
  },
  { value: '北京', label: '北京' },
  { value: '天津', label: '天津' }
]

// 日期区间选择快捷键
export const pickerOptions = {
  disabledDate: time => {
    return time.getTime() > Date.now()
  },
  shortcuts: [{
    text: '最近一周',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}
