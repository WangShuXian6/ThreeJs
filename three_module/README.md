##小猫快跳

## quickstart

> version 1.0.0

> 安装依赖
> npm install

> 执行检查
> grunt

> 使用 mocha 的单元测试。
> 使用 istanbul 代码覆盖率检测
> ESlint javascript 代码风格检查（推荐代码风格使用率 60%）
> 使用强类型 typescript 编译javascript
> travis ci (初步)

> 单元测试：npm run test
> 风格检查：grunt
> typescript编译：使用编辑器编译
> 代码覆盖率图形化信息：浏览器打开 /mochawesome-report/mochawesome.html



## 源码目录介绍
```
./js
├── base                                   // 定义游戏开发基础类
│   ├── animatoin.js                       // 帧动画的简易实现
│   ├── pool.js                            // 对象池的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   ├── three.js                          // 3d库
│   └── weapp-adapter.js                   // 小游戏适配器
├── npc
│   └── enemy.js                           // 敌机类
├── player
│   ├── bullet.js                          // 子弹类
│   └── index.js                           // 玩家类
├── runtime
│   ├── camera.js                      // 摄像机类
│   ├── fog.js                        // 烟雾类
│   ├── light.js                        // 光照系统类 
│   ├── scene.js                        // 世界场景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏状态
└── main.js                                // 游戏入口主函数

```