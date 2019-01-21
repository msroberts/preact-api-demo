// Need to import "h" into every file that uses JSX
import { Component, h } from 'preact'
import MapComponent from './map'

export interface IAppState {
  fipsId: string
}

export default class App extends Component<{}, IAppState> {
  state: IAppState = {
    fipsId: '',
  }

  mapClick = (fipsId: string) => {
    this.setState({ fipsId })
  }

  render ({}, { fipsId }: IAppState) {
    return (
      <main>
        <article>
          <h1>Median Age, 2017</h1>
          <MapComponent
            onMapClick={this.mapClick}
          />
        </article>

        <footer>
          <small>Selected FIPS ID: {fipsId}</small>
        </footer>
      </main>
    )
  }
}
