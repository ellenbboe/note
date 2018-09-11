一个最基本的 Electron 应用一般来说会有如下的目录结构：

your-app/
  ├── package.json
  ├── main.js
  └── index.html


Electron apps 使用JavaScript开发，其工作原理和方法与Node.js 开发相同。 electron模块包含了Electron提供的所有API和功能，引入方法和普通Node.js模块一样：

const electron = require('electron')

### BrowserWindow
```
// 在主进程中.
  const {BrowserWindow} = require('electron')

  // 或者从渲染进程中使用 `remote`.
  // const {BrowserWindow} = require('electron').remote

  let win = new BrowserWindow({width: 800, height: 600})
  win.on('closed', () => {
    win = null
  })

  // 加载远程URL
  win.loadURL('https://github.com')

  // 或加载本地HTML文件
  win.loadURL(`file://${__dirname}/app/index.html`)
``
