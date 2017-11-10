import { hashCode } from './utils';

class NewRelicHostApps {
  constructor(apps) {
    this.MAX_MOST_SATISFING = 25;
    const appsWithId = this.constructor.getHashedApps(apps);
    this.apps = this.constructor.sortAppsByApdex(appsWithId);
    this.hostsList = this.constructor.sortHostsByApp(this.apps);
  }

  _getMaxTopItems(apps, limit) {
    const maxLimit = limit || Math.min(apps.length, this.MAX_MOST_SATISFING);

    return apps.slice(0, maxLimit);
  }

  static getHashedApps(apps) {
    if (!apps) return null;

    return apps.map(item => Object.assign({}, item, {
      $$id: hashCode(JSON.stringify(item)),
    }));
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

    return apps.sort((item, prevItem) => prevItem.apdex - item.apdex);
  }

  static sortHostsByApp(sortedApps) {
    if (!sortedApps || !sortedApps.length) return [];

    return sortedApps.reduce((hostsList, current) => {
      const hosts = current.host.slice();
      const filteredHosts = hosts.filter(host => !hostsList.includes(host));

      return hostsList.concat(filteredHosts);
    }, []);
  }

  _filterByOccurrence(occurrence, value) {
    return this.apps.filter(app => app[occurrence].includes(value));
  }

  getTopAppsByHost(host, limit) {
    const appsByHost = this._filterByOccurrence('host', host);

    return this._getMaxTopItems(appsByHost, limit);
  }

  _sortedPush(newApp) {
    const { apps } = this;

    if (!apps.length) {
      this.apps.push(this.constructor.getHashedApp(newApp));

      this.sortHostsByApp(this.apps);
      return this.apps;
    }

    if (apps[0].apdex <= newApp.apdex) {
      this.apps.unshift(this.constructor.getHashedApp(newApp));

      this.sortHostsByApp(this.apps);
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

    this.sortHostsByApp(this.apps);

    return this.apps;
  }

  addAppToHosts(newApp) {
    const updatedApplications = this._sortedPush(newApp);

    return this._getMaxTopItems(updatedApplications);
  }

  _removeFromApps(id) {
    const { apps } = this;

    if (!apps.length) {
      return this.apps;
    }

    const lastIndex = apps.length - 1;
    if ((apps[0].$$id === id) || (apps[lastIndex].$$id === id)) {
      const index = apps[0].$$id === id ? 0 : lastIndex;
      this.apps.splice(index, 1);

      this.sortHostsByApp(this.apps);
      return this.apps;
    }

    for (let i = 0; i < apps.length; i += 1) {
      if (apps[i].$$id === id) {
        this.apps.splice(i, 1);
        break;
      }
    }

    this.sortHostsByApp(this.apps);
    return this.apps;
  }

  removeAppFromHosts(id) {
    const updatedApplications = this._removeFromApps(id);

    return this._getMaxTopItems(updatedApplications);
  }
}

export default NewRelicHostApps;
