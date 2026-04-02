// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import $ from 'jsr:@david/dax';
import { download } from "https://deno.land/x/download/mod.ts";

export async function DevSetup (input, opts) {
    

}
export async function helper (input, opts) {
    input.quietUnlessError = async (cmd, successMessage, errorMessage) => {
  const result = await $(cmd)
  if (result.code !== 0) {
    $.logError(result.stderr);
    throw new Error(`${errorMessage}
    Try it manually: ${cmd}` || `Failed: ${cmd}`);
  }
  $.logStep(successMessage || `Success: ${cmd}`);
}

}
export async function Checkifcommandsexist (input, opts) {
    input.commandMissing = {
  brew:       !(await $.commandExists('brew')),
  bun:        !(await $.commandExists('bun')),
  tmux:       !(await $.commandExists('tmux')),
  datasette:  !(await $.commandExists('datasette')),
  pocketbase: !($.path('./_pocketbase').isFileSync()),
}
console.log('Missing: ', input.commandMissing);

}
export async function InstallHomebrew (input, opts) {
    input.errors = [`Brew is not installed.
Please install brew manually with this command:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
and then run this script again`]

}
export async function Installbun (input, opts) {
    await input.quietUnlessError(
  `brew install bun`, 
  "Success: Bun installed", 
  "Failed: Could not install Bun"
);

}
export async function Installtmux (input, opts) {
    await input.quietUnlessError(
  `brew install tmux`, 
  "Success: Tmux installed", 
  "Failed: Could not install tmux"
);

}
export async function Installdatasette (input, opts) {
        const result = await $`brew install pipx; pipx ensurepath; pipx install datasette; pipx inject datasette datasette-import; pipx install sqlite-utils;`
      .stderr("piped");
    if(result.code !== 0) {
      $.log.error(result.stderr);
      throw new Error("Failed to install Datasette");
    }
    $.log("Datasette + dependencies installed ");

}
export async function Installpocketbase (input, opts) {
    
await download("https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_darwin_amd64.zip", {dir: "/tmp", file: 'pocketbase.zip'});
await $`unzip -o /tmp/pocketbase.zip -d /tmp/`;
await $`mv /tmp/pocketbase ./_pocketbase`;
const exists = $.path('./_pocketbase').isFileSync()
$.log(`Pocketbase installed: ${exists}`);

}

const funcSequence = [
DevSetup, helper, Checkifcommandsexist, InstallHomebrew, Installbun, Installtmux, Installdatasette, Installpocketbase
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
