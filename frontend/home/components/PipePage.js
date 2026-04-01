PD.components.PipePage = {
  oncreate: function(vnode) {
    PD.actions.loadPipe({ slug: vnode.attrs.slug });
    PD.utils.highlightCodeBlocks(vnode.dom);
  },
  onupdate: function(vnode) {
    PD.utils.highlightCodeBlocks(vnode.dom);
  },
  view: function(vnode) {
    const title = vnode.attrs.slug || "Untitled pipe";

    if (PD.state.loading) {
      return m("section.list-panel.panel", [
        m("div.state-card.state-card-loading", "Fetching /api/pipes...")
      ]);
    }

    if (PD.state.error) {
      return m("section.list-panel.panel", [
        m("div.state-card.state-card-error", [
          m("p", PD.state.error),
          m("button.retry-button", { onclick: function() { PD.actions.loadPipe({ slug: vnode.attrs.slug }); } }, "Retry")
        ])
      ]);
    }

    if (PD.state.currentPipe === null) {
      return m("section.list-panel.panel", [
        m("div.state-card", "No pipe was returned by /api/pipe/:slug.")
      ]);
    }

    const renderedPipe = PD.utils.renderMarkdown(PD.state.currentPipe || "");

    return m("section.list-panel.panel", [
      m("div.section-heading", [
        m("p.section-eyebrow", "Pipe"),
        m("h2.section-title", title)
      ]),
      m("div.pipe-content", m.trust(renderedPipe))
    ]);
  }
};