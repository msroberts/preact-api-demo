import { feature } from 'topojson-client'
import { getJson } from './json'
import { Topology, GeometryCollection } from 'topojson-specification'

const MAP_URL = 'https://unpkg.com/us-atlas@1.0.2/us/10m.json'
let usMap: Topology

async function getMapData () {
  if (!usMap) {
    usMap = await getJson(MAP_URL)
  }

  return usMap
}

export async function getStates () {
  const us = await getMapData()
  return feature(us, us.objects.states as GeometryCollection)
}

export async function getCounties (st: string) {
  const us = await getMapData()
  const counties = feature(us, (us.objects.counties as GeometryCollection))
  counties.features = counties.features
    .filter(c => (c.id as string).startsWith(st))
  return counties
}
