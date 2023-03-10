import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { getStore } from './store'
import App from './App'
const store = getStore()
ReactDom.hydrateRoot(
  document.getElementById('root')!,
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)
