import { Component, h } from 'preact'
import { getStates } from '../data/geo'
import { min, max } from 'd3-array'
import { geoPath } from 'd3-geo'
import { scaleSequential, ScaleSequential } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
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
  // Color scale (set when loading data)
  scale: ScaleSequential<string>
  // State and county codes
  fipsState: string
  fipsCounty: string
  // Whether to allow selecting state
  allowClick: boolean
}

export default class MapComponent extends Component<{}, IMapComponentState> {
  // Set defaults for State
  state: IMapComponentState = {
    mapData: [],
    scale: scaleSequential(interpolateBlues),
    // Default to not selected
    fipsState: '',
    fipsCounty: '',
    allowClick: true,
  }

  render ({}, { map, mapData, scale }: IMapComponentState) {
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
              fill={data && scale(parseFloat(data.POP))}
            >
              {/* Tooltip on <path> */}
              {data && (
                <title>{data.GEONAME}: {data.POP}</title>
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
    await this.setMapData()
  }

  async setMapData () {
    // Prevent selecting a different state
    this.setState({ allowClick: false })
    const { fipsState } = this.state
    const mapRequest = fipsState ? getStates() : getStates()
    const dataRequest = getCensusData(
      `${fipsState ? 'county' : 'state'}:*`,
      fipsState ? `state:${fipsState}` : '',
      { AGEGROUP: '31' },
    )

    // Allow promises to be handled separately
    // tslint:disable-next-line:no-floating-promises
    mapRequest
      .then(map => this.setState({ map }))

    // tslint:disable-next-line:no-floating-promises
    dataRequest
      .then(mapData => {
        const values = mapData.map(d => parseFloat(d.POP))
        const scale = this.state.scale
          // Set domain of color scale
          .domain([min(values)!, max(values)!])

        this.setState({ mapData, scale })
      })

    await Promise.all([mapRequest, dataRequest])
      .catch(console.error)

    // Allow selecting map once both datasets have loaded
    this.setState({ allowClick: true })
  }
}
