# 开发

```bash
# clone the project
git clone https://github.com/leilei0227/hubei-vue-admin.git

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


