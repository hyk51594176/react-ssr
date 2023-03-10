/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: wqhui
 * @Date: 2022-05-31 19:09:40
 * @Description:  服务端入口文件
 */
import React from 'react'
import ReactDomServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Provider } from 'react-redux'
import { routes } from './router/RoutesContent'
import { matchRoutes, RouteMatch } from 'react-router-dom'

import App from './App'
import { getStore } from './store'
import { Response } from 'express'

type Props = {
  url: string
  res: Response
  startHtml: string
  endHtml: string
}

async function initData(
  routeMatch: RouteMatch<string>[] | null,
  store: ReturnType<typeof getStore>
) {
  const list = [store.dispatch('global/init')]
  if (routeMatch) {
    const { route } = routeMatch[routeMatch.length - 1]
    const { element } = route
    const getInitialProps = (element as any)?.type?.getInitialProps
    if (getInitialProps) {
      list.push(getInitialProps(store))
    }
  }
  await Promise.all(list)
}

export async function render({ url, startHtml, endHtml, res }: Props) {
  const routeMatch = matchRoutes(routes, url)
  const store = getStore(true)
  await initData(routeMatch, store)
  startHtml = startHtml.replace(
    '//--PRE_LOADED_STATE--//',
    `window.PRE_LOADED_STATE=${JSON.stringify(store.getState())}`
  )
  const stream = ReactDomServer.renderToPipeableStream(
    <StaticRouter location={url}>
      <Provider store={store}>
        <App />
      </Provider>
    </StaticRouter>,
    {
      onShellReady() {
        res.setHeader('Content-Type', 'text/html')
        res.write(startHtml)
        stream.pipe(res).on('finish', res.end)
      },
      onAllReady() {
        res.write(endHtml)
      },
      onShellError(error: any) {
        res.setHeader('Content-Type', 'text/json')
        res.end(JSON.stringify({ error }))
      },
    }
  )
}
