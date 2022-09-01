# demo_crud_users

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

1.使用element组件配合弹框实现表单功能
2. Vue控制台警告：  "Added non-passive event listener to a scroll-blocking 'touchmove' event" ----  Chrome 的事件捕获机制－Passive Event Listeners；告诉前页面内的事件监听器内部是否会调用preventDefault函数来阻止事件的默认行为，以便浏览器根据这个信息更好地做出决策来优化页面性能。当属性passive的值为true的时候，代表该监听器内部不会调用preventDefault函数来阻止默认滑动行为，需要下载包解决
ps :Chrome浏览器称这类型的监听器为被动（passive）监听器。目前Chrome主要利用该特性来优化页面的滑动性能，所以Passive Event Listeners特性当前仅支持mousewheel/touch相关事件。
解决方法 : 1、npm i default-passive-events -S
2、main.js中加入：import 'default-passive-events'
