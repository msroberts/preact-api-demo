import { Component, h } from 'preact'
import { getStates, getCounties } from '../data/geo'
import { min, max } from 'd3-array'
import { geoPath } from 'd3-geo'
import { scaleSequential, ScaleSequential } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { FeatureCollection } from 'geojson'
import { Spinner } from './spinner'
import { getCensusData, ICensusDataRow } from '../data/census'

const WIDTH = 960
const HEIGHT = 600

// Function used to generate SVG path data
const pathData = geoPath()

export interface IMapComponentState {
  // Map features data
  map?: FeatureCollection
  // Data from Census
  mapData: ICensusDataRow[],
  // Color scale (set when loading data)
  scale: ScaleSequential<string>
  // State and county codes
  fipsState: string
  fipsCounty: string
  // Whether to allow selecting state
  allowClick: boolean
  // Zoom
  transform: string
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
    transform: '',
  }

  mapClick = async (e: any) => {
    let id = e.target.dataset.id as string
    const { fipsState, fipsCounty } = this.state
    if (id === fipsState + fipsCounty) {
      id = ''
    }
    await this.setMapData(id.substr(0, 2), id.substr(2, 3))
  }

  render ({}, { map, mapData, scale, transform }: IMapComponentState) {
    return map ? (
      <svg
        // Allow resizeable SVG
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        // Default color
        fill='#ccc'
      >
        <g
          transform={transform}
        >
          {map.features.map(d => {
            const data: ICensusDataRow = mapData.find(x => x.id === d.id) || { id: '' }
            return (
              <path
                d={pathData(d)!}
                fill={data.id && scale(parseFloat(data.POP))}
                data-id={d.id}
                onClick={this.mapClick}
              >
                {/* Tooltip on <path> */}
                {data.id && (
                  <title>{data.GEONAME}: {data.POP}</title>
                )}
              </path>
            )
          })}
        </g>
      </svg>
    ) : (
      <Spinner
        text='Loading map…'
      />
    )
  }

  async componentWillMount () {
    await this.setMapData('', '')
  }

  async setMapData (fipsState: string, fipsCounty: string) {
    // Prevent selecting a different state
    this.setState({ allowClick: false, fipsState, fipsCounty })
    const mapRequest = fipsState ? getCounties(fipsState) : getStates()
    const dataRequest = getCensusData(
      `${fipsState ? 'county' : 'state'}:*`,
      fipsState ? `state:${fipsState}` : '',
      { AGEGROUP: '31' },
    )

    // Allow promises to be handled separately
    // tslint:disable-next-line:no-floating-promises
    mapRequest
      .then(map => {
        let transform = ''
        if (fipsState) {
          // Zoom to state: https://bl.ocks.org/mbostock/4699541
          const bounds = pathData.bounds(map)
          const dx = bounds[1][0] - bounds[0][0]
          const dy = bounds[1][1] - bounds[0][1]
          const x = (bounds[0][0] + bounds[1][0]) / 2
          const y = (bounds[0][1] + bounds[1][1]) / 2
          const scale = .9 / Math.max(dx / WIDTH, dy / HEIGHT)
          const translate = [WIDTH / 2 - scale * x, HEIGHT / 2 - scale * y]

          transform = `translate(${translate})scale(${scale})`
        }

        this.setState({ map, transform })
      })

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
