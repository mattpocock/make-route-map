import { makeRouteMap, makeNavigate } from '../src';

describe('makeRouteMap', () => {
  it('Should create simple routes as expected', () => {
    const routeMap = makeRouteMap({
      index: {
        path: '/',
      },
      admin: {
        path: '/admin',
      },
    });

    expect(routeMap.index()).toEqual('/');
    expect(routeMap.admin()).toEqual('/admin');
  });
  it('Should handle path params', () => {
    const routeMap = makeRouteMap({
      editUser: {
        path: '/users/:id/edit',
        params: {
          id: true,
        },
      },
    });
    expect(
      routeMap.editUser({
        params: {
          id: '240',
        },
      })
    ).toEqual('/users/240/edit');
  });
  it('Should handle path params with a custom matcher', () => {
    const routeMap = makeRouteMap(
      {
        editUser: {
          path: '/users/$id/edit',
          params: {
            id: true,
          },
        },
      },
      {
        paramMatcher: param => new RegExp(`\\$${param}`),
      }
    );
    expect(
      routeMap.editUser({
        params: {
          id: '240',
        },
      })
    ).toEqual('/users/240/edit');
  });
  it('Should handle search parameters', () => {
    const routeMap = makeRouteMap({
      auth: {
        path: '/',
        search: {
          redirectPath: true,
        },
      },
    });

    expect(
      routeMap.auth({
        search: {
          redirectPath: '/somewhere-else',
        },
      })
    ).toEqual(`/?redirectPath=%2Fsomewhere-else`);
  });
});

describe('makeNavigate', () => {
  it('Should call the navigate function with the routeMap you provide', () => {
    const pushToHistory = jest.fn();
    const routeMap = makeRouteMap({
      editUser: {
        path: '/users/:id/edit',
        params: {
          id: true,
        },
      },
    });

    const navigate = makeNavigate(routeMap, pushToHistory);

    navigate.editUser({
      params: {
        id: '240',
      },
    });

    expect(pushToHistory).toHaveBeenCalledWith(`/users/240/edit`);
  });
});
