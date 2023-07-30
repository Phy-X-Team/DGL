var get;

get = function(path) {
  return new Promise((done) => {
    return fetch(path).then((t) => {
      return t.text();
    }).then((s) => {
      return done(s);
    });
  });
};

export {
  get
};
