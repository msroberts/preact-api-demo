// Need to import "h" into every file that uses JSX
import { Component, h } from 'preact'
import MapComponent from './map'

export default class App extends Component<{}, {}> {
  render () {
    return (
      <main>
        <MapComponent/>
      </main>
    )
  }
}
