# City Mystery

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

## Cloudflare 邀请制部署

1. 在 Cloudflare 控制台的 D1 SQL Database 中新建 `city-mystery-db`，将 Database ID 填入根目录 `wrangler.jsonc` 的 `database_id`。线上使用独立的空数据库。
2. 在仓库根目录的终端登录 Wrangler、执行数据库迁移并部署：

       npx wrangler login
       npx wrangler d1 migrations apply DB --remote
       node scripts/build.cjs --cloudflare
       npx wrangler deploy
       npx wrangler secret put GEOAPIFY_BROWSER_KEY

   最后一条命令会提示输入 Geoapify 浏览器 Key。Worker 会在运行时提供地图配置，Key 不需要提交到 GitHub。邀请地址确定后，可以在 Geoapify 控制台为 Key 添加站点来源限制。浏览器仍会收到这个地图 Key。

3. 部署配置默认关闭正式 `workers.dev` 地址和预览地址。在 Cloudflare 的 Workers & Pages 中打开 `city-mystery`，设置 **Access → Protect this Worker behind Access → All traffic**。创建 Allow 规则，Include 选择 Emails，填入获准访问的完整邮箱，并启用 One-time PIN 登录。
4. 确认 Access 策略生效后，在 Worker 的 **Settings → Domains & Routes** 启用 `workers.dev` 地址。启用后把 Wrangler 配置的 `workers_dev` 改为 `true`，让以后部署沿用该设置。`preview_urls` 可以继续关闭。
5. 用无痕窗口验证受邀邮箱可以进入、名单外邮箱无法访问，再分享正式网址。首次使用网站时需要注册站内账号来保存个人行程和邮戳。

参考：[Cloudflare Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/) · [D1 配置](https://developers.cloudflare.com/d1/get-started/) · [Geoapify Key 限制](https://myprojects.geoapify.com/help/api-keys/)
