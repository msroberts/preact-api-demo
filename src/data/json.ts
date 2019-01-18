export async function getJson<T= any> (url: string): Promise<T> {
  return fetch(url).then(res => res.json()) // Convert response to JSON
}
