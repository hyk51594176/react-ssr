/*
 * @Author: wqhui
 * @Date: 2022-05-31 15:20:18
 * @Description:  app服务启动和服务端渲染处理逻辑
 */
import fs from 'fs'
import path from 'path'

import express from 'express'
import { ViteDevServer } from 'vite'

//区分集成生产环境
const IS_PROP = process.env.NODE_ENV === 'production'

const resolve = (p: string) => path.resolve(__dirname, '../', p)

export async function createServer() {
  const app = express()

  let vite: ViteDevServer
  //启动服务
  if (!IS_PROP) {
    //开发模式使用 vite 服务器
    vite = await (
      await import('vite')
    ).createServer({
      server: { middlewareMode: 'ssr' },
      appType: 'custom',
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    //生产模式使用 静态 服务器
    //压缩代码
    app.use((await import('compression')).default())
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      })
    )
  }

  //处理返回到客户端的html页面
  app.use(async (req, res) => {
    try {
      let template: string, render
      const url = req.originalUrl
      if (!IS_PROP) {
        //开发模式
        // 1. 读取 index.html
        //    开发模式总是读取最新的html
        template = fs.readFileSync(resolve('index.html'), 'utf-8')

        // 2. 应用 Vite HTML 转换。
        //    这将会注入 Vite HMR 客户端，
        //    同时也会从 Vite 插件应用 HTML 转换。
        //    例如：@vitejs/plugin-react 中的 global preambles
        template = await vite.transformIndexHtml(url || '', template)

        // 3. 加载服务端入口。
        //    vite.ssrLoadModule 将自动转换
        //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
        //    并提供类似 HMR 的根据情况随时失效。
        render = (await vite.ssrLoadModule(resolve('src/entry-server.tsx')))
          .render
      } else {
        //生产模式

        //读取打包的模板
        template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')

        //读取打包的服务端入口
        render = (await import(resolve('dist/server/entry-server.js'))).render
      }

      // 4. 渲染应用的 HTML。这假设 entry-server.js 导出的 `render`
      //    函数调用了适当的 SSR 框架 API。
      //    例如 ReactDOMServer.renderToString()
      // 5. 注入渲染后的应用程序 HTML 到模板中。
      const [startHtml, endHtml] = template.split('<!--ssr-outlet-->')
      await render({
        url,
        startHtml,
        endHtml,
        res,
      })
    } catch (e: any) {
      !IS_PROP && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })
  return { app }
}
const PORT = 3000

createServer().then(({ app }) =>
  app.listen(PORT, async () => {
    const url = `http://localhost:${PORT}`
    console.log(`[React SSR]启动成功, 地址为:${url}`)
    if (!IS_PROP) {
      ;(await import('child_process')).exec(`open ${url}`)
    }
  })
)
