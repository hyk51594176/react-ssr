import React from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

const lazy = (p: string) => React.lazy(() => import(`../pages/${p}.tsx`))

const Layout = React.lazy(() => import('../component/layout'))

const list = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: 'Home' },
      { path: 'about', element: 'About' },
      { path: '*', element: 'NoMatch' },
    ],
  },
]

export const routes = list.map(function deep({
  element,
  children,
  ...obj
}): RouteObject {
  if (typeof element === 'string') {
    const El = lazy(element)
    element = <El />
  }
  return {
    ...obj,
    element: element,
    children: children?.map(deep as any),
  }
})

export default function RoutesContent() {
  return useRoutes(routes)
}
