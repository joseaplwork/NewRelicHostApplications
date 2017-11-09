'use strict';

function hashCode(str) {
  var hash = 0;
  if (str.length === 0) return hash;

  for (var i = 0; i < str.length; i += 1) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NewRelicHostApps = function () {
  function NewRelicHostApps(apps) {
    _classCallCheck(this, NewRelicHostApps);

    this.MAX_MOST_SATISFING = 25;
    var appsWithId = this.constructor.getHashedApps(apps);
    this.apps = this.constructor.sortAppsByApdex(appsWithId);
  }

  _createClass(NewRelicHostApps, [{
    key: '_getMostSatisfyingApps',
    value: function _getMostSatisfyingApps(apps) {
      var limit = apps.length >= this.MAX_MOST_SATISFING ? this.MAX_MOST_SATISFING : apps.length;

      return apps.slice(0, limit);
    }
  }, {
    key: '_filterByOccurrence',
    value: function _filterByOccurrence(occurrence, value) {
      return this.apps.filter(function (app) {
        return app[occurrence].includes(value);
      });
    }
  }, {
    key: 'getTopAppsByHost',
    value: function getTopAppsByHost(host) {
      var appsByHost = this._filterByOccurrence('host', host);

      return this._getMostSatisfyingApps(appsByHost);
    }
  }, {
    key: '_sortedPush',
    value: function _sortedPush(newApp) {
      var apps = this.apps;


      if (!apps.length) {
        this.apps.push(this.constructor.getHashedApp(newApp));

        return this.apps;
      }

      if (apps[0].apdex <= newApp.apdex) {
        this.apps.unshift(this.constructor.getHashedApp(newApp));

        return this.apps;
      }

      if (apps[apps.length - 1].apdex >= newApp.apdex) {
        this.apps.push(this.constructor.getHashedApp(newApp));

        return this.apps;
      }

      for (var i = 0; i < apps.length; i += 1) {
        if (apps[i].apdex <= newApp.apdex) {
          this.apps.splice(i, 0, this.constructor.getHashedApp(newApp));
          break;
        }
      }

      return this.apps;
    }
  }, {
    key: 'addAppToHosts',
    value: function addAppToHosts(newApp) {
      var updatedApplications = this._sortedPush(newApp);

      return this._getMostSatisfyingApps(updatedApplications);
    }
  }, {
    key: '_removeFromApps',
    value: function _removeFromApps(id) {
      var apps = this.apps;


      if (!apps.length) {
        return this.apps;
      }

      var lastIndex = apps.length - 1;
      if (apps[0].$$id === id || apps[lastIndex].$$id === id) {
        var index = apps[0].$$id === id ? 0 : lastIndex;
        this.apps.splice(index, 1);

        return this.apps;
      }

      for (var i = 0; i < apps.length; i += 1) {
        if (apps[i].$$id === id) {
          this.apps.splice(i, 1);
          break;
        }
      }

      return this.apps;
    }
  }, {
    key: 'removeAppFromHosts',
    value: function removeAppFromHosts(id) {
      var updatedApplications = this._removeFromApps(id);

      return this._getMostSatisfyingApps(updatedApplications);
    }
  }], [{
    key: 'getHashedApps',
    value: function getHashedApps(apps) {
      if (!apps) return null;

      var appsNew = apps;

      for (var i = 0; i < apps.length; i += 1) {
        appsNew[i].$$id = hashCode(JSON.stringify(appsNew[i]));
      }

      return appsNew;
    }
  }, {
    key: 'getHashedApp',
    value: function getHashedApp(app) {
      return Object.assign({}, {
        $$id: hashCode(JSON.stringify(app))
      }, app);
    }
  }, {
    key: 'sortAppsByApdex',
    value: function sortAppsByApdex(apps) {
      if (!apps || !apps.length) {
        return [];
      }

      return apps.sort(function (item, prevItem) {
        if (item.apdex === prevItem.apdex) return 0;

        return item.apdex < prevItem.apdex ? 1 : -1;
      });
    }
  }]);

  return NewRelicHostApps;
}();

module.exports = NewRelicHostApps;
