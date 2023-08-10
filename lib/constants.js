export default new Proxy({}, {
  get: function(o, key) {
    var c, i, len, sum;
    sum = 0;
    for (i = 0, len = key.length; i < len; i++) {
      c = key[i];
      sum = sum + c.charCodeAt(0);
    }
    return sum;
  }
});
