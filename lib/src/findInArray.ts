/*
* for returning an object from an array by key value
* i.e. town.buildings keys
*/

export function findInArray<T, K extends keyof T> (array: T[], key: K, value: T[K]) {
  return array.find(element => {
    if (element[key] === value) {
      console.log(`Found matching key value of ${key}: ${value}!`)
      console.log(element)
      return element
    }
  })
}
