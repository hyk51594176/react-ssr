import { Suspense } from 'react'
import RoutesContent from './router/RoutesContent'
import './style/index.less'
function App() {
  return (
    <Suspense>
      <RoutesContent />
    </Suspense>
  )
}

export default App
