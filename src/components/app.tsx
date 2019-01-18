// Need to import "h" into every file that uses JSX
import { Component, h } from 'preact'
import MapComponent from './map'

export default class App extends Component<{}, {}> {
  render () {
    return (
      <main>
        <article>
          <h1>Median Age, 2017</h1>
          <MapComponent/>
        </article>
      </main>
    )
  }
}
