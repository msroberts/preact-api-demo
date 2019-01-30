import { getJson } from './json'

const CENSUS_API = 'https://api.census.gov/data/2017/pep/charagegroups'

export const AGEGROUPS = [
  'Total',
  'Under 5 years',
  '5 to 9 year',
  '10 to 14 years',
  '15 to 19 years',
  '20 to 24 years',
  '25 to 29 years',
  '30 to 34 years',
  '35 to 39 years',
  '40 to 44 years',
  '45 to 49 years',
  '50 to 54 years',
  '55 to 59 years',
  '60 to 64 years',
  '65 to 69 years',
  '70 to 74 years',
  '75 to 79 years',
  '80 to 84 years',
  '85 years and over',
  'Under 18 years',
  '5 to 13 years',
  '14 to 17 years',
  '18 to 64 years',
  '18 to 24 years',
  '25 to 44 years',
  '45 to 64 years',
  '65 years and over',
  '85 years and over',
  '16 years and over',
  '18 years and over',
  '15 to 44 years',
  'Median age (years)',
]

export interface ICensusDataRow {
  id: string
  [key: string]: string
}

export function formatCensusData (data: string[][]) {
  const [headers] = data
  data = data.slice(1)
  return data.map(row => {
    const obj: ICensusDataRow = { id: '' }
    headers.forEach((field, i) => obj[field] = row[i])
    // Set ID to FIPS codes
    obj.id = obj.state
    if (obj.county) {
      obj.id += obj.county
    }
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
    ...fields,
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
