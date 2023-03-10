import { useEffect } from 'react'
import useModel from '../hooks/useModel'

function Home() {
  const global = useModel('global')
  useEffect(() => {
    console.log('123123123 :', global)
  }, [])
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}

Home.getInitialProps = () => {
  return Promise.resolve({})
}

export default Home
