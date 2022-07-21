# qqmap-wx-jssdk

腾讯地图 微信小程序 js SDK v1.2

## 安装

```
npm install @jonny1994/qqmap-wx-jssdk --save
# or
yarn add @jonny1994/qqmap-wx-jssdk -S
```

## 使用

```js
import QQMapWX from "@jonny1994/qqmap-wx-jssdk";

qqmapsdk = new QQMapWX({
  key: "申请的key",
  useGetFuzzyLocation: true // 使用 `wx.getFuzzyLocation` 替换 `wx.getLocation`
});
```

## 其他 API

参考[腾讯地图微信小程序 jsSDK 文档](http://lbs.qq.com/qqmap_wx_jssdk/index.html)
