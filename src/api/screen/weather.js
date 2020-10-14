import request from '@/utils/request'

// 天气数据
export function getWeather (code) {
  console.log('code------------', code)
  return request({
    url: `/api/screen/weather/city/${code}`,
    method: 'get'
  })
}
