# Extract Content Blurbs from Markdown Files

Let's expect a blurb meta data value in frontmatter, and if it's not there, we'll take the first 200 characters of the file after the h1 title as the blurb. This will be used in the pipe list view to give users a preview of the content of each pipe.

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
const frontmatter = parse($p.get(frontmatterMatch, '/1'))
if(frontmatter && frontmatter.description)
    $p.set(input, '/blurb', frontmatter.description.trim())
```

## Extract from Content

- not: /blurb
  ```ts
  const contentWithoutTitle = input.file.replace(/^#.*\n/, "").trim();
  input.blurb = contentWithoutTitle.slice(0, 200) + (contentWithoutTitle.length > 200 ? "..." : "");
  ```

## Return empty blurb if no content
- not: /blurb
  ```ts
  input.blurb = "";
  ```
