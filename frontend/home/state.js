const PD = globalThis.PD = {
  state: {
    pipes: [],
    loading: true,
    error: null,
    currentPipeSlug: null,
    currentPipe: null
  },
  actions: {},
  utils: {},
  components: {}
};

PD.utils.pipeHref = function(pipe) {
  return "/pipe/" + encodeURIComponent(pipe.slug);
};

PD.utils.stripFrontmatter = function(markdown) {
  if (!markdown) {
    return "";
  }

  return markdown.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(\r?\n)?/, "");
};

PD.utils.renderMarkdown = function(markdown) {
  if (!markdown) {
    return "";
  }

  const source = PD.utils.stripFrontmatter(markdown);
  let html = source;

  if (globalThis.marked && typeof globalThis.marked.parse === "function") {
    html = globalThis.marked.parse(source, {
      gfm: true,
      breaks: true
    });
  }

  if (globalThis.DOMPurify && typeof globalThis.DOMPurify.sanitize === "function") {
    return globalThis.DOMPurify.sanitize(html);
  }

  return html;
};

PD.utils.highlightCodeBlocks = function(rootElement) {
  if (!rootElement || !globalThis.hljs || typeof globalThis.hljs.highlightElement !== "function") {
    return;
  }

  rootElement.querySelectorAll("pre code").forEach(function(codeBlock) {
    globalThis.hljs.highlightElement(codeBlock);
  });
};

PD.utils.highlightMarkdown = function(markdown) {
  // syntax highlight markdown code for blurb
  return globalThis.hljs.highlight(markdown, { language: "markdown" }).value;
}

PD.utils.sortedPipes = function(pipes) {
  return pipes.slice().sort(function(left, right) {
    return left.name.localeCompare(right.name);
  });
};

PD.actions.loadPipes = function() {
  PD.state.loading = true;
  PD.state.error = null;

  return m.request({
    method: "GET",
    url: "/api/pipes"
  }).then(function(data) {
    PD.state.pipes = data || [];
    PD.state.loading = false;
  }).catch(function(error) {
    PD.state.pipes = [];
    PD.state.loading = false;
    PD.state.error = error?.message
      ? error.message
      : "Failed to load pipes.";
  });
};

PD.actions.loadPipe = function({ slug }) {
  PD.state.loading = true;
  PD.state.error = null;

  return m.request({
    method: "GET",
    url: "/api/pipe/:slug",
    params: { slug },
    responseType: "text"
  }).then(function(data) {
    PD.state.currentPipe = data || null;
    PD.state.loading = false;
  }).catch(function(error) {
    PD.state.currentPipe = null;
    PD.state.loading = false;
    PD.state.error = error?.message
      ? error.message
      : "Failed to load pipe.";
  });
};
