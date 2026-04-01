PD.components.Layout = {
  view: function(vnode) {
    return m("div.app-shell", [
      m("header.topbar", [
        m("div.brand-lockup", {
          role: "link",
          tabindex: 0,
          onclick: function() {
            m.route.set("/");
          },
          onkeydown: function(event) {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              m.route.set("/");
            }
          }
        }, [
          m("p.brand-mark", "TIP"),
          m("p.brand-subtitle", "Today I Piped")
        ])
      ]),
      m("main.page-frame", [
        vnode.children
      ])
    ]);
  }
};