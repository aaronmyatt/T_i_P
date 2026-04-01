// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import extractFrontmatter from "extractFrontmatter";
import { serveDir, serveFile } from "jsr:@std/http/file-server";

export async function TIP (input, opts) {
    //console.log({input})

}
export async function GetPipe (input, opts) {
      const slug = $p.get(input, '/route/pathname/groups/slug')
  console.log({slug})
  //$p.get(input, '/route/pathname/groups/companyId')
  input.response = await serveFile(input.request, `./content/${slug}.md`);

}
export async function ListPipes (input, opts) {
      

  const files = await Deno.readDir("./content");
  const pipes = [];
  for await (const file of files) {
      if (file.isFile && file.name.endsWith(".md")) {
          const { frontmatter } = await extractFrontmatter.process({path: `./content/${file.name}`})
          if(frontmatter.draft) continue; // skip drafts
          pipes.push({
              name: file.name,
              file: file.name,
              slug: file.name.replace(".md", ""),
              blurb: frontmatter.description,
          })
      }
  }

  input.response = new Response(JSON.stringify(pipes), {
      headers: { "Content-Type": "application/json" },
  });

}
export async function StaticFiles (input, opts) {
      

  input.response = await serveDir(input.request, {
      fsRoot: "./frontend",
      showIndex: true,
  });

}

const funcSequence = [
TIP, GetPipe, ListPipes, StaticFiles
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
