import { Component, h } from 'preact'
import { getStates } from '../data/geo'
import { geoPath } from 'd3-geo'
import { FeatureCollection } from 'geojson'
import { Spinner } from './spinner'

// Function used to generate SVG path data
const pathData = geoPath()

export interface IMapComponentState {
  // Map features data
  map?: FeatureCollection
}

export default class MapComponent extends Component<{}, IMapComponentState> {
  // Set defaults for State
  state: IMapComponentState = {
  }

  render ({}, { map }: IMapComponentState) {
    return map ? (
      <svg
        // Allow resizeable SVG
        viewBox='0 0 960 600'
      >
        {map.features.map(d => (
          <path
            d={pathData(d)!}
          >
            {/* Tooltip on <path> */}
            <title>{d.id}</title>
          </path>
        ))}
        </svg>
    ) : (
      <Spinner
        text='Loading map…'
      />
    )
  }

  async componentWillMount () {
    const map = await getStates()
    this.setState({ map })
    console.log(map)
  }
}
