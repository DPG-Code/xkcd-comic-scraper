import fs from 'fs-extra'
import axios from 'axios'
import { getImageSize } from './getImageSize.js'
import { log, time } from './log.js'

const endTime = time("time")

const { writeJSON } = fs

const INITIAL_ID_XKCD_COMICS = 2600
const MAX_ID_XKCD_COMICS = 2670 + 1

const indexFile = []

for (let id = INITIAL_ID_XKCD_COMICS; id < MAX_ID_XKCD_COMICS; id++) {
  const url = `https://xkcd.com/${id}/info.0.json`
  log(`Fetching ${url}...`)
  const { data } = await axios.get(url)
  const { num, news, description, img, ...restOfComic } = data
  log(`Fetched comic #${num} and getting img dimensions.`)
  const { height, width } = await getImageSize({ url: img })
  log(`Got img dimensions ${width}x${height}`)
  const comicToStore = {
    id,
    img,
    height,
    width,
    ...restOfComic
  }
  
  indexFile.push(comicToStore)
  const jsonFile = `./comics/${id}.json`
  await writeJSON(jsonFile, comicToStore)
  log(`Wrote ${jsonFile}!!!\n`)
}

await writeJSON('./comics/index.json', indexFile)
log(`Wrote index File! \n`)

endTime("time")