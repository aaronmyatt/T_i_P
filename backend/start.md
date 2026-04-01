# TIP

A simple Deno Deploy application to serve markdown Pipedown files that showcase
what I have learned, or generally want to publish and share.

```ts
//console.log({input})
```

## Get Pipe

The get pipes route serves up the markdown files in the `content` folder as JSON.
- route: /api/pipe/:slug
- ```ts
    const slug = $p.get(input, '/route/pathname/groups/slug')
    console.log({slug})
    //$p.get(input, '/route/pathname/groups/companyId')
    input.response = await serveFile(input.request, `./content/${slug}.md`);
    ```

## List Pipes
The list pipes route serves up a JSON array of the markdown files in the `content` folder.
- route: /api/pipes
- ```ts
    import extractFrontmatter from "extractFrontmatter";

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
