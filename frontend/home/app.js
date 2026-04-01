m.route(document.getElementById("app"), "/", {
  "/": {
    view: function() {
      return m(PD.components.Layout, m(PD.components.PipeList));
    }
  },
  "/pipe/:slug": {
    view: function(vnode) {
      return m(PD.components.Layout,
        m(PD.components.PipePage, { slug: vnode.attrs.slug })
      );
    }
  }
});

console.log("App initialized:", PD);