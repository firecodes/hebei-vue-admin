// 动态加载百度地图api函数
export default function loadBMap() {
  return new Promise(function (resolve, reject) {
    if (typeof window.BMap !== 'undefined') {
      resolve(window.BMap)
      return true
    }
    window.onBMapCallback = function () {
      resolve(window.BMap)
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=zjdDIQYQXGUBZa7TxqAnDfHAOF8T5TlG&callback=onBMapCallback'
    script.onerror = reject
    document.head.appendChild(script)
  })
}

