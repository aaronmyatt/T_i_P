m.mount(document.getElementById("app"), {
  view: function() {
    return m(PD.components.Layout);
  }
});

console.log("App initialized:", PD);