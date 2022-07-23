# 字节前端监控系统

### 技术栈

```txt
client：
开发框架：React
脚手架：vite
组件库：Ant Design、antv
请求库：umi-request
语法扩展：TypeScript、emotion
打包工具：vite
代码规范：Prettier

server：
开发框架：koa
脚手架：vite
语法扩展：TypeScript
打包工具：webpack
代码规范：Prettier
数据库：mysql
数据库工具：sequelize
```

### 用法

```txt
根目录下运行 npm start 进入主页面
server 目录下运行 npm start 启动服务器
```

### 注意事项

```txt
由于使用emotion，每个页面顶部需要加 /* @jsxImportSource @emotion/react */，才能使用css-in-js语法
```

### git 提交规范

![提交记录angular](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0099c122df340aaa1aaabe63fd4647a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

| 类型         | 功能 | 描述                               |
| ------------ | ---- | ---------------------------------- |
| **feat**     | 功能 | 新增功能，迭代项目需求             |
| **fix**      | 修复 | 修复缺陷，修复上一版本存在问题     |
| **docs**     | 文档 | 更新文档，仅修改文档不修改代码     |
| **style**    | 样式 | 变动格式，不影响代码逻辑           |
| **refactor** | 重构 | 重构代码，非新增功能也非修复缺陷   |
| **perf**     | 性能 | 优化性能，提高代码执行性能         |
| **test**     | 测试 | 新增测试，追加测试用例验证代码     |
| **build**    | 构建 | 更新构建，改动构建工具或外部依赖   |
| **ci**       | 脚本 | 更新脚本，改动 CI 或执行脚本配置   |
| **chore**    | 事务 | 变动事务，改动其他不影响代码的事务 |
| **revert**   | 回滚 | 回滚版本，撤销某次代码提交         |
| **merge**    | 合并 | 合并分支，合并分支代码到其他分支   |
| **sync**     | 同步 | 同步分支，同步分支代码到其他分支   |
| **impr**     | 改进 | 改进功能，升级当前功能模块         |
