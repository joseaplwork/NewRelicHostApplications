import NewRelicHostApps from '../index';
import applicationsData from './host-app-data.json';

describe('NewRelicHostApps', () => {
  const LIMIT_APPS_PER_HOST = 25;
  let applications;

  beforeEach(() => {
    applications = applicationsData.slice();
  });

  it('should be defined', () => {
    expect(NewRelicHostApps).toBeDefined();
  });

  it('should have a method getTopAppsByHost', () => {
    const instance = new NewRelicHostApps();

    expect(instance.getTopAppsByHost).toBeDefined();
  });

  it('should have a method addAppToHosts', () => {
    const instance = new NewRelicHostApps();

    expect(instance.addAppToHosts).toBeDefined();
  });

  it('should have a method removeAppFromHosts', () => {
    const instance = new NewRelicHostApps();

    expect(instance.removeAppFromHosts).toBeDefined();
  });

  it('should call getTopAppsByHost and return the 25 most satisfying applications', () => {
    const instance = new NewRelicHostApps(applications);
    const appsByHost = instance.getTopAppsByHost('7e6272f7-098e.dakota.biz');

    expect(appsByHost.length).toEqual(LIMIT_APPS_PER_HOST);
  });

  it('should call getTopAppsByHost and return the max size of the list if there are less than 25 satisfying applications', () => {
    const fewApplications = applications.splice(0, 30);
    const instance = new NewRelicHostApps(fewApplications);
    const appsByHost = instance.getTopAppsByHost('b0b655c5-928a.nadia.biz');

    expect(appsByHost.length).toBeLessThanOrEqual(LIMIT_APPS_PER_HOST);
  });

  it('should add an app to the appHosts list', () => {
    const applicationToAdd = {
      name: 'test',
      contributors: ['test 1', 'test 2'],
      version: 2,
      apdex: 60,
      host: ['e7bf58af-f0be.dallas.biz', 'b0b655c5-928a.nadia.biz', '95b346a0-17f4.abbigail.name'],
    };

    const instance = new NewRelicHostApps(applications);

    instance.addAppToHosts(applicationToAdd);

    const randomApp = instance.apps.find(app => app.name === applicationToAdd.name);

    expect(randomApp.name).toBe(applicationToAdd.name);
  });

  it('should optimistically add an app to the appHosts list into the first position', () => {
    const applicationToAdd = {
      name: 'test',
      contributors: ['test 1', 'test 2'],
      version: 2,
      apdex: 120,
      host: ['e7bf58af-f0be.dallas.biz', 'b0b655c5-928a.nadia.biz', '95b346a0-17f4.abbigail.name'],
    };

    const instance = new NewRelicHostApps(applications);

    instance.addAppToHosts(applicationToAdd);

    const firstApp = instance.apps[0];

    expect(firstApp.name).toBe(applicationToAdd.name);
  });

  it('should optimistically add an app to the appHosts list into the last position', () => {
    const applicationToAdd = {
      name: 'test',
      contributors: ['test 1', 'test 2'],
      version: 2,
      apdex: 0,
      host: ['e7bf58af-f0be.dallas.biz', 'b0b655c5-928a.nadia.biz', '95b346a0-17f4.abbigail.name'],
    };

    const instance = new NewRelicHostApps(applications);

    instance.addAppToHosts(applicationToAdd);

    const lastApp = instance.apps.slice().pop();

    expect(lastApp.name).toBe(applicationToAdd.name);
  });

  it('should have remove an app from the appHosts list', () => {
    const instance = new NewRelicHostApps(applications);
    const applicationToRemove = instance.apps[100];

    instance.removeAppFromHosts(applicationToRemove.$$id);

    const expected = instance.apps.find(app => app.name === applicationToRemove.name);

    expect(expected).not.toBeDefined();
  });

  it('should optimistically remove an app from the hosts in the first position', () => {
    const instance = new NewRelicHostApps(applications);
    const applicationToRemove = instance.apps[0];

    instance.removeAppFromHosts(applicationToRemove.$$id);

    const expected = instance.apps.find(app => app.name === applicationToRemove.name);

    expect(expected).not.toBeDefined();
  });

  it('should optimistically remove an app from the hosts in the last position', () => {
    const instance = new NewRelicHostApps(applications);
    const applicationToRemove = instance.apps.slice().pop();

    instance.removeAppFromHosts(applicationToRemove.$$id);

    const expected = instance.apps.find(app => app.name === applicationToRemove.name);

    expect(expected).not.toBeDefined();
  });
});
