import { FunctionalComponent, h } from 'preact'
import { scaleOrdinal } from 'd3-scale'
import { pie, arc } from 'd3-shape'
import { IChartProps, IChartItem, convertChartData } from './chart-data'

export interface IPieChartProps extends IChartProps {
  radius: number
  labelFormatter: (data: IChartItem) => string
}

const pieChart = pie<any, IChartItem>()
  .sort(null)
  .value(d => d.value)

// See https://github.com/row1/react-declarative-d3
export const Pie: FunctionalComponent<IPieChartProps> = ({
  data,
  radius,
  colors,
  width,
  height,
  labelFormatter,
}) => {
  const color = scaleOrdinal<string>()
    .range(colors)

  const chartArc = arc()
    .innerRadius(0)
    .outerRadius(radius)

  const chartData = pieChart(convertChartData(data)[0]) // Pie chart uses only first series

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
    >
      <g
        transform={`translate(${width / 2}, ${height / 2})`}
      >
        <g>
          {chartData.map(d => (
            <path
              d={chartArc(d)}
              fill={color(d.data.label)}
            />
          ))}
        </g>
        <g>
          {chartData.map(d => (
            <text
              transform={`translate(${chartArc.centroid(d)})`}
              text-anchor='middle'
            >
              {labelFormatter(d.data)}
            </text>
          ))}
        </g>
      </g>
    </svg>
  )
}
