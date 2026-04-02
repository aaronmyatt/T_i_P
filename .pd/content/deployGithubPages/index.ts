// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.2";
import $p from "jsr:@pd/pointers@0.1.1";

import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import $ from 'jsr:@david/dax';

export async function Libraries (input, opts) {
    

}
export async function readgitignoresowecanexcludelater (input, opts) {
    const gitIgnorePath = $.path(Deno.cwd()).join(".gitignore");
try {
    const gitIgnore = Deno.readTextFileSync(gitIgnorePath);
    input.toBeIgnored = gitIgnore.split("\n").map((glob) => std.globToRegExp(glob));
} catch (_e) {
    // probably no .gitignore file
    input.toBeIgnored = [];
}

}
export async function Checkoutpagesbranch (input, opts) {
    await $`git checkout pages || git checkout -b pages`

}
export async function mergemainintopages (input, opts) {
    await $`git merge main`

}
export async function Buildthesite (input, opts) {
    await $`bun gen`

}
export async function copybuildtotmpfolder (input, opts) {
    await $`mkdir -p /tmp/pagescontent`
await $`cp -r .output/public /tmp/pagescontent`

}
export async function removeallfilesinthepagesbranch (input, opts) {
    const files = await Array.fromAsync($.path(Deno.cwd()).readDirFilePaths());
for (const file of files) {
    if (input.toBeIgnored.some((ignore) => ignore.test(file))) continue;
    if (file.basename().startsWith(".")) continue;
    await $.path(file).remove();
}

}
export async function copyfilesfromtmpfoldertopagesbranch (input, opts) {
    const files = await Array.fromAsync($.path('/tmp/pagescontent').readDirFilePaths());
for (const file of files) {
    await $.path(file).copyToDir(Deno.cwd());
}

}
export async function removealloutputfiles (input, opts) {
    const outputFiles = await Array.fromAsync($.path('/tmp/pagescontent').readDirFilePaths());
const files = await Array.fromAsync($.path(Deno.cwd()).readDirFilePaths());
for (const file of files) {
    if(outputFiles.find(outputFile => outputFile.basename() === file.basename()))
        await $.path(file).remove();
}

}

const funcSequence = [
Libraries, readgitignoresowecanexcludelater, Checkoutpagesbranch, mergemainintopages, Buildthesite, copybuildtotmpfolder, removeallfilesinthepagesbranch, copyfilesfromtmpfoldertopagesbranch, removealloutputfiles
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
