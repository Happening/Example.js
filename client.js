var Db = require('db');
var Dom = require('dom');
var Modal = require('modal');
var Obs = require('obs');
var Plugin = require('plugin');
var Page = require('page');
var Server = require('server');
var Ui = require('ui');

exports.render = function() {
  Dom.section(function() {
    Dom.style({
      Box: 'middle'
    });
    Ui.avatar(Plugin.userAvatar(), {
      onTap: function() {
        Plugin.userInfo();
      }
    });
    Dom.div(function() {
      Dom.style({
        Flex: true
      });
      Dom.h2("Hello, developer");
      Dom.text("This is an example Group App demonstrating some Happening API's.");
    });
  });
  Dom.section(function() {
    var clientCounter;
    Dom.h2("Reactive dom");
    Dom.userText("Group Apps are built using Javascript or CoffeeScript. User interfaces are drawn using an abstraction upon the web DOM you know and love. It works **reactively**: changes in the data model are automatically mapped to changes in the interface.");
    clientCounter = Obs.create(0);
    Dom.div(function() {
      Ui.button("Increment me: " + clientCounter.get(), function() {
        clientCounter.modify(function(v) {
          return v + 1;
        });
      });
    });
  });
  Dom.section(function() {
    Dom.h2("Server side code");
    Dom.text("Group Apps contain both code that is run on clients (phones, tablets, web browsers) and on Happening's servers. Server side code is invoked using RPC calls from a client, using timers or subscribing to user events (eg: a user leaves a group).");
    Dom.div(function() {
      Ui.button("Get server time", function() {
        return Server.call('getTime', function(time) {
          return Modal.show("The time on the server is: " + time);
        });
      });
    });
  });
  Dom.section(function() {
    Dom.h2("Synchronized data store");
    Dom.text("A hierarchical data store is available that is automatically synchronized across all the devices of group members. You write to it from server side code.");
    Dom.div(function() {
      Ui.button("Synchronized counter: " + Db.shared.get('counter'), function() {
        Server.call('incr');
      });
    });
  });
  Dom.section(function() {
    Dom.h2("Use the source");
    Dom.text("We're working on writing more documentation. For now, experiment by looking at the sources of Group Apps we've made available on GitHub.");
    Dom.div(function() {
      Ui.button("Visit github.com", function() {
        Plugin.openUrl('https://github.com/happening');
      });
    });
  });
  return Dom.section(function() {
    Dom.h2("Some examples");
    Ui.button("Event API", function() {
      Page.nav(function() {
        Page.setTitle("Event API");
        Dom.section(function() {
          Dom.text("API to send push events (to users that are following your plugin).");
          Ui.button("Push group event", function() {
            Server.send('event');
          });
        });
      });
    });
    Ui.button("Http API", function() {
      Page.nav(function() {
        Page.setTitle("Http API");
        Dom.section(function() {
          Dom.h2("Outgoing");
          Dom.text("API to make HTTP requests from the Happening backend.");
          Ui.button("Fetch HackerNews headlines", function() {
            Server.send('fetchHn');
          });
          Db.shared.iterate('hn', function(article) {
            Ui.item(function() {
              Dom.text(article.get('title'));
              Dom.onTap(function() {
                Plugin.openUrl(article.get('url'));
              });
            });
          });
        });
        Dom.section(function() {
          Dom.h2("Incoming Http");
          Dom.text("API to receive HTTP requests in the Happening backend.");
          Dom.div(function() {
            Dom.style({
              padding: '10px',
              margin: '3px 0',
              background: '#ddd',
              _userSelect: 'text'
            });
            return Dom.code("curl --data-binary 'your text' " + Plugin.inboundUrl());
          });
          Dom.div(function() {
            Dom.style({
              padding: '10px',
              background: Plugin.colors().bar,
              color: Plugin.colors().barText
            });
            Dom.text(Db.shared.get('http') || "<awaiting request>");
          });
        });
      });
    });
    Ui.button("Photo API", function() {
      var Photo;
      Photo = require('photo');
      Page.nav(function() {
        Page.setTitle("Photo API");
        Dom.section(function() {
          var photoKey;
          Dom.text("API to show, upload or manipulate photos.");
          Ui.bigButton("Pick photo", function() {
            Photo.pick();
          });
          if (photoKey = Db.shared.get('photo')) {
            (require('photoview')).render({
              key: photoKey
            });
          }
        });
      });
    });
    Ui.button("Plugin API", function() {
      Page.nav(function() {
        Page.setTitle("Plugin API");
        Dom.section(function() {
          Dom.text("API to get user or group context.");
        });
        Ui.list(function() {
          var items, name, text, value;
          items = {
            "Plugin.agent": Plugin.agent(),
            "Plugin.colors": Plugin.colors(),
            "Plugin.groupAvatar": Plugin.groupAvatar(),
            "Plugin.groupCode": Plugin.groupCode(),
            "Plugin.groupId": Plugin.groupId(),
            "Plugin.groupName": Plugin.groupName(),
            "Plugin.userAvatar": Plugin.userAvatar(),
            "Plugin.userId": Plugin.userId(),
            "Plugin.userIsAdmin": Plugin.userIsAdmin(),
            "Plugin.userName": Plugin.userName(),
            "Plugin.users": Plugin.users.get(),
            "Page.state": Page.state.get(),
            "Dom.viewport": Dom.viewport.get()
          };
          for (name in items) {
            value = items[name];
            text = ("" + name + " = ") + JSON.stringify(value);
            Ui.item(text.replace(/,/g, ', '));
          }
        });
      });
    });
    Ui.button("Social API", function() {
      Page.nav(function() {
        Page.setTitle("Social API");
        Dom.section(function() {
          Dom.text("API to show comments or like boxes.");
        });
        require('social').renderComments();
      });
    });
  });
};

