window.PD = {
  state: {
    pipes: [],
    loading: true,
    error: null
  },
  actions: {},
  utils: {},
  components: {}
};

PD.utils.pipeHref = function(pipe) {
  return "/pipe/" + encodeURIComponent(pipe.slug);
};

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
    PD.state.error = error && error.message
      ? error.message
      : "Failed to load pipes.";
  }).then(function() {
    m.redraw.sync();
  });
};