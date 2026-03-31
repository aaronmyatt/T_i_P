# TIP

A simple Deno Deploy application to serve markdown Pipedown files that showcase
what I have learned, or generally want to publish and share.

```ts
//console.log({input})
```

## Get Pipe

The get pipes route serves up the markdown files in the `content` folder as JSON.
- route: /pipe/:slug
- ```ts
    const slug = $p.get(input, '/route/pathname/groups/slug')
    //$p.get(input, '/route/pathname/groups/companyId')
    input.response = serveFile(input.request, `./content/${slug}.md`);
    ```

## List Pipes
The list pipes route serves up a JSON array of the markdown files in the `content` folder.
- route: /api/pipes
- ```ts
    const files = await Deno.readDir("./content");
    const pipes = [];
    for await (const file of files) {
        if (file.isFile && file.name.endsWith(".md")) {
            pipes.push({
                file: file.name,
                slug: file.name.replace(".md", ""),
                blurb: await Deno.readTextFile(`./content/${file.name}`).then((text) => {
                    // return either the yaml frontmatter description, or the first 200 characters of the file after the h1 title
                    const frontmatterMatch = text.match(/---\s*([\s\S]*?)\s*---/);
                    if (frontmatterMatch) {
                        const frontmatter = frontmatterMatch[1];
                        const descriptionMatch = frontmatter.match(/description:\s*(.*)/);
                        if (descriptionMatch) {
                            return descriptionMatch[1].trim();
                        }
                    }
                    const contentWithoutTitle = text.replace(/^#.*\n/, "").trim();
                    return contentWithoutTitle.slice(0, 200) + (contentWithoutTitle.length > 200 ? "..." : "");
                }),
            });
        }
    }
    input.response = new Response(JSON.stringify(pipes), {
        headers: { "Content-Type": "application/json" },
    });
    ```

## Static Files

The static files route serves up the frontend files in the `frontend` folder.
- not: /response
- ```ts
    import { serveDir, serveFile } from "jsr:@std/http/file-server";

    input.response = await serveDir(input.request, {
        fsRoot: "./frontend",
        showIndex: true,
    });
    ```
