export interface IChartSeries {
  label: string
  values: number[]
}

export interface IChartData {
  labels: string[]
  series: IChartSeries[]
}

export interface IChartProps {
  data: IChartData
  colors: string[] | ReadonlyArray<string>
  width: number
  height: number
}

export interface IChartItem {
  label: string
  value: number
}

export function convertChartData (data: IChartData) {
  return data.series.map(series => series.values
    .map((value, i) => ({
      value,
      label: data.labels[i] || '',
    } as IChartItem)))
}
