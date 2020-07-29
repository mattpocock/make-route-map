# make-route-map

Routing in web apps can be a subtle, but persistent source of bugs. You think you've updated every reference to a route you're changing, and *BAM*. You've caused a bug in some unrelated part of your app.

Keep your routes in a single, type-safe source of truth with a routeMap.

## makeRouteMap

### Simple

```js
import { makeRouteMap } from 'make-route-map';

const routeMap = makeRouteMap({
  users: {
    path: '/users',
  },
  admin: {
    path: '/admin',
  },
});

console.log(routeMap.admin());
// '/admin'

console.log(routeMap.users());
// '/users'
```

### Path Params and Search

```js
import { makeRouteMap } from 'make-route-map';

const routeMap = makeRouteMap({
  editUser: {
    path: '/users/:id/edit',
    params: {
      id: true,
    },
  },
  auth: {
    path: '/auth',
    search: {
      desiredUsername: true,
    },
  },
});

console.log(routeMap.editUser({ params: { id: '240' } }));
// '/users/240/edit'

console.log(routeMap.auth({ search: { desiredUsername: 'mattpocock' } }));
// '/auth?desiredUsername=mattpocock'
```

## makeNavigate

`makeNavigate` gives you a type-safe way of navigating around your app.

```js
import { makeRouteMap, makeNavigate } from 'make-route-map';

const routeMap = makeRouteMap({
  editUser: {
    path: '/users/:id/edit',
    params: {
      id: true,
    },
  },
  auth: {
    path: '/auth',
    search: {
      desiredUsername: true,
    },
  },
});

// This could be replaced with any history.push implementation
const goToRoute = route => {
  window.location.href = route;
};

const navigate = makeNavigate(routeMap, goToRoute);

// This would take the user to '/users/240/edit'
navigate.editUser({
  params: {
    id: '240',
  },
});
```

### useNavigate in React

In React, this can be combined with a hook to make a simple `useNavigate` hook. This example uses `react-router-dom`.

```js
import { makeRouteMap, makeNavigate } from 'make-route-map';
import { useHistory } from 'react-router-dom';

const routeMap = makeRouteMap({
  root: {
    path: '/',
  },
});

const useNavigate = () => {
  const history = useHistory();
  const navigate = makeNavigate(routeMap, history.push);
  return navigate;
};

const Button = () => {
  // Use this navigate
  const navigate = useNavigate();
  return <button onClick={navigate.root}>Go Home</button>;
};
```

## Options

`make-route-map` is at an early stage, so I'm keen to hear what you need to make this work for you.

### paramMatcher

Helps for when your path params don't match the default `:id` pattern.

```js
import { makeRouteMap } from 'make-route-map';

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

console.log(
  routeMap.editUser({
    params: {
      id: '240',
    },
  })
);
// '/users/240/edit'
```
