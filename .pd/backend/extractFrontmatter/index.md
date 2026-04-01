# Extract Frontmatter from Markdown Files

Grab the frontmatter from markdown files to use as metadata for our pipes. This will allow us to display a blurb for each pipe in the pipe list view, and also potentially use other metadata in the future.

## Get File

Read the file from disk using Deno standard helpers and pass it on

```ts
input.file = await Deno.readTextFile(input.path)
// .catch(() => null); <- LLM keeps trying to catch this but I want the error to propagate and get caught by the pipeline
```

## Extract from Frontmatter
Regex match annoyingly returns `null` when there is no match, so we have to be defensive and default to an empty array to avoid errors when trying to access the capture groups.

```ts
import { parse } from "jsr:@std/yaml";

const frontmatterMatch = input.file.match(/---\s*([\s\S]*?)\s*---/) || [];
input.frontmatter = parse($p.get(frontmatterMatch, '/1'))
```
