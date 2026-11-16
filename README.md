# City Mystery · 城市盲盒

City Mystery 是 ICE 制作的中英双语英国一日游网站。它收录了伦敦、爱丁堡、约克等 8 座城市。你可以随机抽取城市、景点和美食，查看步行路线，并把到访景点的邮戳收进旅行护照。

## 本地运行

1. 安装 Node.js 24 或更新版本，在项目根目录打开 PowerShell。
2. 如果要在本地使用地图，把 `maps-config.example.js` 复制为 `public/js/maps-config.js`，然后在副本的 `apiKey` 中填入自己的 Geoapify 浏览器 Key。
3. 运行 `node preview.cjs`，打开[本地登录页](http://127.0.0.1:4173/login.html)。

## 如何使用

1. 注册或登录，选择「尽兴逛」或「慢慢逛」。
2. 抽取一座城市，再抽取景点和美食。想换一个选项时，点卡片上的「换一张」。
3. 点「生成行程」，查看景点顺序、地图和预计步行时间。
4. 点「完成行程并盖章」，然后在旅行护照查看收集到的邮戳。

## 线上网站

[访问 City Mystery](https://city-mystery.zhebingice.workers.dev/login.html)

## 用到的 API

- [Geoapify Maps API](https://www.geoapify.com/get-started-with-maps-api/) 提供底图，网页使用 MapLibre GL JS 渲染地图。
- [Geoapify Routing API](https://apidocs.geoapify.com/docs/routing/) 根据所选景点坐标计算步行路线、距离和预计用时。
