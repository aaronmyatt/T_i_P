// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import $ from 'jsr:@david/dax';

export async function Libraries (input, opts) {
    

}
export async function Sheettodownload (input, opts) {
    input.sheet = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=0#gid=0'

}
export async function Somevariables (input, opts) {
    input.format = input.format || 'csv'
input.fileName = `${input.exportName || 'sheet'}.${input.format}`

}
export async function Downloadgsheetdata (input, opts) {
    input.exportUrl = new URL('https://docs.google.com/spreadsheets')
input.pattern = new URLPattern('https://docs.google.com/spreadsheets/d/:id/edit?gid=:gid#gid=:gid')

}
export async function Checkiffilealreadyexists (input, opts) {
    input.gogoDownload = true
input.tmpDirFiles = await $`ls /tmp/`.lines()
if(input.tmpDirFiles.find(file => file === input.fileName)) {
  input.gogoDownload = false // skip download
  $.log(`File already exists: ${input.fileName}`)
} else {
  $.log(`File missing, let's download it: ${input.fileName}`)
}

}
export async function BuildthedownloadURL (input, opts) {
    const url = input.pattern.exec(input.sheet)
const [id, gid, hash] = [$p.get(url, '/pathname/groups/id'), $p.get(url, '/search/groups/gid'), $p.get(url, '/hash/input')]
input.exportUrl.searchParams.set('format', input.format)
input.exportUrl.searchParams.set('id', id)
input.exportUrl.searchParams.set('gid', gid)
input.exportUrl.hash = hash
input.exportUrl.pathname = input.exportUrl.pathname+`/u/1/d/${id}/export`
$.log(`Export URL: ${input.exportUrl}\n`)

}
export async function Downloadthefile (input, opts) {
    input.curlResult = await $`curl -L -o /tmp/${input.fileName} ${input.exportUrl}`
$.log(`File downloaded: ${input.fileName}`)

}

const funcSequence = [
Libraries, Sheettodownload, Somevariables, Downloadgsheetdata, Checkiffilealreadyexists, BuildthedownloadURL, Downloadthefile
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
