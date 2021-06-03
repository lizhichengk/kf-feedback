#### 组件名
kf-feedback
#### 组件描述
客服组件用户反馈
#### 当前版本
1.0.1
#### 如何使用
```
import Feedback from 'kf-feedback';
important 'kf-feedback/dist/css/app.css';
```
#### 注意
1、组件依赖element-ui 使用前确认全局安装了element-ui
#### 参数
参数|说明|类型|是否必选|默认值
---|---|---|---|---
url | 请求地址 | String | 否 | '/heron/feedback/list'
right | 抽屉位置 | String | 否 | 500
noChose | 是否需要选择 | Boolean | 否 | true