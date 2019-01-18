import { getJson } from './json'

const CENSUS_API = 'https://api.census.gov/data/2017/pep/charagegroups'

export function formatCensusData (data: string[][]) {
  const [headers] = data
  data = data.slice(1)
  return data.map(row => {
    const obj: any = {}
    headers.forEach((field, i) => obj[field] = row[i])
    return obj
  })
}

export async function getCensusData (
  filterFor: string,
  filterIn?: string,
  additionalFilters: {[key: string]: string} = {},
  fields: string[] = [],
) {
  fields = [
    'POP',
    'GEONAME',
  ]

  let url = `${CENSUS_API}?for=${encodeURIComponent(filterFor)}`
  if (filterIn) {
    url += `&in=${encodeURIComponent(filterIn)}`
  }
  url += `&get=${encodeURIComponent(fields.join())}`
  Object.keys(additionalFilters).forEach(key => {
    url += `&${encodeURIComponent(key)}=${encodeURIComponent(additionalFilters[key])}`
  })

  const data = await getJson(url)
  return formatCensusData(data)
}
