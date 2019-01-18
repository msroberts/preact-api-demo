import { Component, h } from 'preact'
import { getStates } from '../data/geo'
import { geoPath } from 'd3-geo'
import { FeatureCollection } from 'geojson'
import { Spinner } from './spinner'
import { getCensusData } from '../data/census'

// Function used to generate SVG path data
const pathData = geoPath()

export interface IMapComponentState {
  // Map features data
  map?: FeatureCollection
  // Data from Census
  mapData: any[],
}

export default class MapComponent extends Component<{}, IMapComponentState> {
  // Set defaults for State
  state: IMapComponentState = {
    mapData: [],
  }

  render ({}, { map, mapData }: IMapComponentState) {
    return map ? (
      <svg
        // Allow resizeable SVG
        viewBox='0 0 960 600'
      >
        {map.features.map(d => {
          const data: any = mapData.find(x => x.state === d.id) || {}
          return (
            <path
              d={pathData(d)!}
            >
              {/* Tooltip on <path> */}
              {data && (
                <title>{data.GEONAME}</title>
              )}
            </path>
          )
        })}
        </svg>
    ) : (
      <Spinner
        text='Loading map…'
      />
    )
  }

  async componentWillMount () {
    const [map, mapData] = await Promise.all([
      getStates(),
      // Median age by state
      getCensusData('state:*', '', { AGEGROUP: '31' }),
    ])
    this.setState({ map, mapData })
  }
}
