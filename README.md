# 开发

```bash
# clone the project
git clone https://github.com/leilei0227/hebei-vue-admin.git

# enter the project directory
cd hubei-vue-admin

# install dependency
npm install

# develop
npm run dev
```

浏览器会自动打开 http://localhost:9528

# 发布

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

# 分析

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

# 47 环境与客户环境不不同之处

```javascript
// components/Global/index.vue
//线上接口地址
let apiUrl = 'http://47.104.26.21/sales-api'
if (process.env.NODE_ENV === 'production') {
  apiUrl = location.protocol + '//' + location.host
}

//47
let apiUrl = 'http://47.104.26.21/sales-api'
// if (process.env.NODE_ENV === 'production') {
//   apiUrl = location.protocol + '//' + location.host
// }

// vue.config.js
publicPath: '/',
publicPath: '/hb-ui', // 47

// pc/report/Import.vue
action="/api/upload"
action="/sales-api/api/upload"  // 47
```
