PD.components.PipeList = {
  oncreate: function(vnode) {
    PD.actions.loadPipes();
    PD.utils.highlightCodeBlocks(vnode.dom);
  },
  onupdate: function(vnode) {
    PD.utils.highlightCodeBlocks(vnode.dom);
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

    return [
      m("section.hero.panel", [
        m("div.hero-copy", [
          m("span.hero-kicker", "Published Pipes"),
          m("h1.hero-title", "Why blog, when you can pipe?"),
          m("p.hero-body", [
            "Checkout ",
            m("a.hero-link", { href: "https://pipedown.dev", target: "_blank", rel: "noopener noreferrer" }, "Pipedown"),
            " for more information."
          ])
        ]),
        m("div.hero-stat", [
          m("span.hero-stat-label", "Available now"),
          m("strong.hero-stat-value", PD.state.loading ? "..." : String(PD.state.pipes.length)),
          m("span.hero-stat-note", "content pipes")
        ])
      ]),  
      m("section.list-panel.panel", [
        m("div.section-heading", [
          m("p.section-eyebrow", "Directory"),
          m("h2.section-title", "Browse published content")
        ]),
        m("div.pipe-grid",
          PD.state.pipes.map(function(pipe) {
            return m(m.route.Link, {
              class: "pipe-card",
              href: PD.utils.pipeHref(pipe),
              key: pipe.path || pipe.name
            }, [
              m("div.pipe-card-header", [
                m("h3.pipe-name", pipe.name),
              ]),
              m("pre.pipe-blurb", m('code', pipe.blurb || "No description available.")),
              m("div.pipe-meta", [
                m("span.badge", pipe.path || pipe.name),
                m("span.pipe-route", PD.utils.pipeHref(pipe))
              ])
            ]);
          })
        )
      ]
    ),
    m("section.cta.panel", [
      m("div.section-heading", [
        m("p.section-eyebrow", "Get Started"),
        m("h2.section-title", "Ready to create your own pipes?")
      ]),
      m("p.cta-body", [
        "Check out the",
        m("a.hero-link", { href: "https://core.pipedown.dev/examples", target: "_blank", rel: "noopener noreferrer" }, "Pipedown Docs"),
        " for more information."
      ])
    ])
   ];
  }
};