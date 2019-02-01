// Need to import "h" into every file that uses JSX
import { Component, h } from 'preact'
import { schemeBlues } from 'd3-scale-chromatic'
import MapComponent from './map'
import { Pie } from './charts/pie'
import { IChartData, IChartItem } from './charts/chart-data'
import { Spinner } from './spinner'
import { AGEGROUPS, getCensusDataForFips } from '../data/census'

export interface IAppState {
  fipsId: string
  pieData?: IChartData
}

function formatter (d: IChartItem) {
  let label = ''
  let dividedBy = 1
  if (d.value > 1e6) {
    label = 'M'
    dividedBy = 1e6
  } else if (d.value > 1e3) {
    label = 'K'
    dividedBy = 1e3
  }

  const digits = dividedBy > 1 ? 2 : 0

  return `${d.label} (${(d.value / dividedBy).toLocaleString([], {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}${label})`
}

const selectedAgeGroups = [
  '19',
  '23',
  '24',
  '25',
  '26',
]

export default class App extends Component<{}, IAppState> {
  state: IAppState = {
    fipsId: '',
  }

  mapClick = (fipsId: string) => {
    this.setState({ fipsId })

    // tslint:disable-next-line:no-floating-promises
    this.updateChartData()
  }

  updateChartData = async () => {
    const data = (await getCensusDataForFips(this.state.fipsId, { DATE: '10' }, ['AGEGROUP', 'DATE_DESC']))
      .filter(d => selectedAgeGroups.indexOf(d.AGEGROUP) >= 0)

    const pieData: IChartData = {
      series: [
        {
          label: data[0].DATE_DESC,
          values: data.map(d => parseFloat(d.POP)),
        },
      ],
      labels: data.map(d => AGEGROUPS[parseFloat(d.AGEGROUP)]),
    }
    this.setState({ pieData })
  }

  render ({}, { fipsId, pieData }: IAppState) {
    return (
      <main>
        <article>
          <h1>Median Age, 2017</h1>
          <MapComponent
            onMapClick={this.mapClick}
          />
        </article>

        <article
          class='half'
        >
          {pieData && (
            <h2>
              {pieData.series[0].label}
            </h2>
          )}

          {pieData ? (
            <Pie
              data={pieData}
              colors={schemeBlues[pieData.labels.length]}
              radius={150}
              labelFormatter={formatter}
              width={500}
              height={400}
            />
          ) : (
            <Spinner
              text='Loading pie chart'
            />
          )}
        </article>

        <footer>
          <small>Selected FIPS ID: {fipsId}</small>
        </footer>
      </main>
    )
  }

  async componentWillMount () {
    await this.updateChartData()
  }
}
