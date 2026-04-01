// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import { parse } from "jsr:@std/yaml";

export async function GetFile (input, opts) {
    input.file = await Deno.readTextFile(input.path)
// .catch(() => null); <- LLM keeps trying to catch this but I want the error to propagate and get caught by the pipeline

}
export async function ExtractfromFrontmatter (input, opts) {
    

const frontmatterMatch = input.file.match(/---\s*([\s\S]*?)\s*---/) || [];
const frontmatter = parse($p.get(frontmatterMatch, '/1'))
if(frontmatter && frontmatter.description)
    $p.set(input, '/blurb', frontmatter.description.trim())

}
export async function ExtractfromContent (input, opts) {
    const contentWithoutTitle = input.file.replace(/^#.*\n/, "").trim();
input.blurb = contentWithoutTitle.slice(0, 200) + (contentWithoutTitle.length > 200 ? "..." : "");

}
export async function Returnemptyblurbifnocontent (input, opts) {
    input.blurb = "";

}

const funcSequence = [
GetFile, ExtractfromFrontmatter, ExtractfromContent, Returnemptyblurbifnocontent
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
