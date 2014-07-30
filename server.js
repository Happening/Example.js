var Db = require('db');
exports.onInstall = function() {
  return Db.shared.set('counter', 0);
};
exports.client_incr = function() {
  log('hello world!');
  return Db.shared.modify('counter', function(v) {
    return v + 1;
  });
};
exports.client_getTime = function(cb) {
  return cb.reply(new Date());
};
exports.onHttp = function(request) {
  Db.shared.set('http', request.data);
  return request.respond(200, "Thanks for your input\n");
};
exports.client_fetchHn = function() {
  var Http;
  Http = require('http');
  return Http.get({
    url: 'https://news.ycombinator.com',
    name: 'hnResponse'
  });
};
exports.hnResponse = function(data) {
  var all, id, m, re, title, url;
  re = /<a href="(http[^"]+)">([^<]+)<\/a>/g;
  id = 1;
  while (id < 5 && (m = re.exec(data))) {
    all = m[0], url = m[1], title = m[2];
    log('hn headline', title, url);
    if (url === 'http://www.ycombinator.com') {
      continue;
    }
    Db.shared.set('hn', id, {
      title: title,
      url: url
    });
    id++;
  }
};
exports.onPhoto = function(info) {
  log('onPhoto', JSON.stringify(info));
  Db.shared.set('photo', info.key);
};
return exports.client_event = function() {
  var Event;
  Event = require('event');
  Event.create({
    text: "Test event"
  });
};
