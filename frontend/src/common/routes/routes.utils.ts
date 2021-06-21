export const resources = (routeName, { members = [], collections = [] } = {}) => {
  const result = [];
  const actions_with_path = [
    ...collections.map((action) => ({ action, path: `/${action}` })),
    { action: 'new', path: '/new' },
    ...members.map((action) => ({ action, path: `/:id/${action}` })),
    { action: 'edit', path: '/:id/edit' },
    { action: 'show', path: '/:id' },
    { action: 'index', path: '' },
  ];
  actions_with_path.forEach(({ action, path }) => {
    try {
      result.push({
        path: `/${routeName}${path}`,
        component: require(`@pages/${routeName}/${action}`).default,
      });
    } catch (e) {} // index, new, show, edit 중 파일 없으면 없는대로 추가안함
  });
  return result;
};

export const bulkRegister = (registerComponent, components = []) => {
  components.forEach((path) => {
    try {
      registerComponent(path, require(`@components/${path}`).default);
    } catch (e) {}
  });
};
