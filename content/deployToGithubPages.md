# Github Pages Deployment

## Libraries
We are using the [Dax library](https://jsr.io/@david/dax#shell) to handle all interactions with the command line.
```ts
import $ from 'jsr:@david/dax';
```

## read gitignore so we can exclude later
```ts
const gitIgnorePath = std.join(Deno.cwd(), ".gitignore");
try {
    const gitIgnore = Deno.readTextFileSync(gitIgnorePath);
    input.toBeIgnored = gitIgnore.split("\n").map((glob) => std.globToRegExp(glob));
} catch (_e) {
    // probably no .gitignore file
    input.toBeIgnored = [];
}
```

## Checkout pages branch
```ts
await $`git checkout pages || git checkout -b pages`
```

## merge main into pages
```ts
await $`git merge main`
```

## Build the site
```ts
await $`bun generate`
```

## copy build to tmp folder
```ts
await $`mkdir -p /tmp/pagescontent`
await $`cp -r .output/public /tmp/pagescontent`
```

## remove all files in the pages branch
Originally we would `rm -rf ./*` everything but this also removes the `.git` directory so we can't do that.
So we'll be more selective, respect .gitignore and avoid hidden files.
```ts
const files = await $.path.readDirFilePaths(Deno.cwd());
for (const file of files) {
    if (toBeIgnored.some((ignore) => ignore.test(file))) continue;
    await $.path.remove(file);
}
```

## copy files from tmp folder to pages branch
The difference between recursively copying (`cp`) with and without a trailing slash is important to understand:

1. Without trailing slash: `cp -r /tmp/pagescontent .`
   - This copies the `pagescontent` directory itself and its contents into the current directory.
   - Result: You'll have a new directory named `pagescontent` in the current directory.

2. With trailing slash: `cp -r /tmp/pagescontent/ .`
   - This copies only the contents of the `pagescontent` directory into the current directory.
   - Result: The contents of `pagescontent` will be directly in the current directory, without creating a new `pagescontent` directory.

> This all sounds good and well 👆 but it's not working. In practice it either copies the top level folder, or nothing at all.

```ts
const files = await $.path.readDirFilePaths('/tmp/pagescontent');
for (const file of files) {
    await $.path.copyToDir(file, Deno.cwd());
}
```

## commit and push
```ts skip
await $`git add .`
await $`git commit -m "deploy to github pages"`
await $`git push origin pages -f`
```

## checkout main branch
```ts skip
await $`git checkout main`
```
