import { Store } from '../store'

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  )
}

About.getInitialProps = (store: Store) => {
  return Promise.resolve({})
}

export default About
