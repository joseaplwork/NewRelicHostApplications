import { hashCode } from './utils';

class NewRelicHostApps {
  constructor(apps) {
    this.MAX_MOST_SATISFING = 25;
    const appsWithId = this.constructor.getHashedApps(apps);
    this.apps = this.constructor.sortAppsByApdex(appsWithId);
  }

  _getMostSatisfyingApps(apps) {
    const limit = apps.length >= this.MAX_MOST_SATISFING ? this.MAX_MOST_SATISFING : apps.length;

    return apps.slice(0, limit);
  }

  static getHashedApps(apps) {
    if (!apps) return null;

    const appsNew = apps;

    for (let i = 0; i < apps.length; i += 1) {
      appsNew[i].$$id = hashCode(JSON.stringify(appsNew[i]));
    }

    return appsNew;
  }

  static getHashedApp(app) {
    return Object.assign({}, {
      $$id: hashCode(JSON.stringify(app)),
    }, app);
  }

  static sortAppsByApdex(apps) {
    if (!apps || !apps.length) {
      return [];
    }

    return apps.sort((item, prevItem) => {
      if (item.apdex === prevItem.apdex) return 0;

      return item.apdex < prevItem.apdex ? 1 : -1;
    });
  }

  _filterByOccurrence(occurrence, value) {
    return this.apps.filter(app => app[occurrence].includes(value));
  }

  getTopAppsByHost(host) {
    const appsByHost = this._filterByOccurrence('host', host);

    return this._getMostSatisfyingApps(appsByHost);
  }

  _sortedPush(newApp) {
    const { apps } = this;

    if (apps[0].apdex <= newApp.apdex) {
      this.apps.unshift(this.constructor.getHashedApp(newApp));

      return this.apps;
    }

    if (apps[apps.length - 1].apdex >= newApp.apdex) {
      this.apps.push(this.constructor.getHashedApp(newApp));

      return this.apps;
    }

    for (let i = 0; i < apps.length; i += 1) {
      if (apps[i].apdex <= newApp.apdex) {
        this.apps.splice(i, 0, this.constructor.getHashedApp(newApp));
        break;
      }
    }

    return this.apps;
  }

  addAppToHosts(newApp) {
    const updatedApplications = this._sortedPush(newApp);

    return this._getMostSatisfyingApps(updatedApplications);
  }

  _removeFromApps(id) {
    const { apps } = this;

    const lastIndex = apps.length - 1;
    if ((apps[0].$$id === id) || (apps[lastIndex].$$id === id)) {
      const index = apps[0].$$id === id ? 0 : lastIndex;
      this.apps.splice(index, 1);

      return this.apps;
    }

    for (let i = 0; i < apps.length; i += 1) {
      if (apps[i].$$id === id) {
        this.apps.splice(i, 1);
        break;
      }
    }

    return this.apps;
  }

  removeAppFromHosts(id) {
    const updatedApplications = this._removeFromApps(id);

    return this._getMostSatisfyingApps(updatedApplications);
  }
}

export default NewRelicHostApps;
