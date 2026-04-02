// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import { download } from "https://deno.land/x/download/mod.ts";
import _$ from "https://deno.land/x/dax/mod.ts";

export async function CalltheWikiMediaAPI (input, opts) {
    let today = new Date();
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, "0");
let day = String(today.getDate()).padStart(2, "0");
let url =
  `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

let response = await fetch(url, {
  headers: {
    Authorization:
      "Bearer " + $p.get(opts, '/config/wikiKey'),
    "Api-User-Agent": `Pipedown (${$p.get(opts, '/config/myEmail')})`,
  },
});
input.wikiJson = await response.json();
input.imageUrl = input.wikiJson["image"]["image"]["source"];

}
export async function DownloadtheImage (input, opts) {
    

try {
  input.imageFile = await download(input.imageUrl);
} catch (err) {
  input.error = err;
}

}
export async function SetWallpaper (input, opts) {
    
input.osaout =
  await _$`osascript -e 'tell application "System Events" to tell every desktop to set picture to "${input.imageFile.fullPath}"'`
    .captureCombined();

}

const funcSequence = [
CalltheWikiMediaAPI, DownloadtheImage, SetWallpaper
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
