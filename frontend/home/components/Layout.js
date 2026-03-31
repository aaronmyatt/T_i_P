PD.components.Layout = {
  view: function() {
    return m("div.app-shell", [
      m("header.topbar", [
        m("div.brand-lockup", [
          m("p.brand-mark", "TIP"),
          m("p.brand-subtitle", "Today I Piped")
        ])
      ]),
      m("main.page-frame", [
        m("section.hero.panel", [
          m("div.hero-copy", [
            m("span.hero-kicker", "Published Pipes"),
            m("h1.hero-title", "A browsable index of content built as Pipedown pages."),
            m("p.hero-body", "Each entry links directly to its rendered page and mirrors the editorial dashboard styling used in Pipedown.")
          ]),
          m("div.hero-stat", [
            m("span.hero-stat-label", "Available now"),
            m("strong.hero-stat-value", PD.state.loading ? "..." : String(PD.state.pipes.length)),
            m("span.hero-stat-note", "content pipes")
          ])
        ]),
        m(PD.components.PipeList)
      ])
    ]);
  }
};