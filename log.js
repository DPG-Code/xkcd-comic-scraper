export const log = (...args) => console.log('-->', ...args)
export const time = string => {
  console.time(string)
  return () => console.timeEnd(string)
}