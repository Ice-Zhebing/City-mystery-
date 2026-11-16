# City Mystery

只使用 HTML、CSS、原生 JavaScript 和 SQL，无 React、Vue、Express 或其他框架。
.cjs 是 Node.js 使用的 CommonJS JavaScript 文件扩展名，仍然是 JavaScript，不是另一种语言。

## 启动网站

在此文件夹的终端运行：

    node preview.cjs

然后打开 http://127.0.0.1:4173/login.html 。需要 Node.js 24 或更新版本。
不要使用 VS Code Live Server，也不要双击 HTML：它们不能运行登录和数据库服务。
如果出现 EADDRINUSE，说明 4173 端口已有服务运行，直接打开上面的地址即可。

## 文件夹说明

    city-mystery/
      preview.cjs             唯一的本地启动入口
      README.md               本说明
      public/                 网站前端
        index.html            首页
        my-trip.html          行程
        passport.html         旅行护照
        login.html            注册登录
        css/                  全部样式
        js/                   全部浏览器交互、地点数据和地图配置
        assets/               实景照片、署名、56 张详细景点邮戳
      server/                 原生 JavaScript 服务与账户接口
        dev.cjs               本地服务
        api.js                注册登录、保存行程、收集邮戳
        local-db.cjs          本地 SQLite 适配器
        index.js              线上服务入口
      database/
        city-mystery.sqlite   本地账号、行程和邮戳，请勿删除
        migrations/           版本化 SQL 建表文件，请勿修改已执行的迁移
      scripts/                检查和发布脚本，日常使用不需要打开

构建时会暂时生成 dist、drizzle 和 outputs；这些是发布产物，不是另一套源码。
.preview 只保存最近一次页面检查图，可以删除。

## 使用规则

注册用户名和密码均不能为空，只支持英文字母和数字。用户名不可重复且不区分大小写。
每次登录首页重置抽卡；My Trip 保留该账户最后一次 Build my trip 的行程。
Complete trip 保存本次两个或三个景点邮戳。美食不盖章，景点邮戳保留首次获得日期且不重复。
护照按城市分组翻页，仅展示景点章，没有单独的城市章。
所有账户读写由服务器按 user_id 隔离。数据库只保存带盐密码哈希；为满足弹窗显示要求，明文密码仅在本次登录标签页 sessionStorage 暂存，退出后清除。
本地与线上数据库独立；本地账号不能直接用在线上。

## 修改内容

城市、景点和美食：public/js/data.js。
照片映射：public/js/city-media.js、food-media.js；图片版权在 public/assets 的 credits 文件。
Geoapify 地图需要项目专用的浏览器 Key。先将根目录的 `maps-config.example.js` 复制到 `public/js/maps-config.js`，再为 `apiKey` 填入自己的 Key。地图会显示景点标记和步行路线。`public/js/maps-config.js` 和本地 SQLite 数据库都由 Git 忽略。
地图脚本、组件和底图均有超时处理；连接失败会显示重试，不会无限转圈。
轮播和卡片完整显示原图，允许少量留边；美食标明为菜品示意。
邮戳：public/assets/stamps/*.webp，为此次使用内置图像生成工具制作的建筑版画插图，非景点官方印章。

## 检查与构建

    node scripts/check-trips.cjs
    node scripts/check-accounts.cjs
    node scripts/check-map.cjs
    node scripts/build.cjs
    node scripts/check-worker.cjs

## Geoapify 地图加载排查

地图使用 MapLibre GL JS 和 Geoapify 的 OSM Bright 底图。地图组件或底图加载失败时，页面会显示重试提示。
