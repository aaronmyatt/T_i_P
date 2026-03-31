PD.components.PipeList = {
  oncreate: function() {
    PD.actions.loadPipes();
  },
  view: function() {
    if (PD.state.loading) {
      return m("section.list-panel.panel", [
        m("div.section-heading", [
          m("p.section-eyebrow", "Directory"),
          m("h2.section-title", "Loading content")
        ]),
        m("div.state-card.state-card-loading", "Fetching /api/pipes...")
      ]);
    }

    if (PD.state.error) {
      return m("section.list-panel.panel", [
        m("div.section-heading", [
          m("p.section-eyebrow", "Directory"),
          m("h2.section-title", "Unable to load content")
        ]),
        m("div.state-card.state-card-error", [
          m("p", PD.state.error),
          m("button.retry-button", { onclick: PD.actions.loadPipes }, "Retry")
        ])
      ]);
    }

    if (PD.state.pipes.length === 0) {
      return m("section.list-panel.panel", [
        m("div.section-heading", [
          m("p.section-eyebrow", "Directory"),
          m("h2.section-title", "No content yet")
        ]),
        m("div.state-card", "No pipes were returned by /api/pipes.")
      ]);
    }

    return m("section.list-panel.panel", [
      m("div.section-heading", [
        m("p.section-eyebrow", "Directory"),
        m("h2.section-title", "Browse published content")
      ]),
      m("div.pipe-grid",
        PD.state.pipes.map(function(pipe) {
          return m("a.pipe-card", {
            href: PD.utils.pipeHref(pipe),
            key: pipe.path || pipe.name
          }, [
            m("div.pipe-card-header", [
              m("h3.pipe-name", pipe.name),
              m("span.pipe-arrow", "View")
            ]),
            m("p.pipe-blurb", pipe.blurb || "Open this content pipe."),
            m("div.pipe-meta", [
              m("span.badge", pipe.path || pipe.name),
              m("span.pipe-route", PD.utils.pipeHref(pipe))
            ])
          ]);
        })
      )
    ]);
  }
};