const AppError = require('../utils/app-error');

const getPermissionSlug = (module, method, params) => {
  method = method.toLowerCase();

  if (method === 'get' && !params) {
    return `app.${module}.getall`;
  } else if (method === 'get' && params) {
    return `app.${module}.getone`;
  } else if (method === 'post') {
    return `app.${module}.create`;
  } else if (method === 'patch') {
    return `app.${module}.update`;
  } else if (method === 'delete') {
    return `app.${module}.delete`;
  } else {
    return false;
  }
};

const checkPermission = (req, res, next) => {
  const module = req.baseUrl.split('/')[2];
  const method = req.method;
  const params = req.params?.id;

  const slug = getPermissionSlug(module, method, params);

  if (!req.user.role.permissions.some((permission) => permission.slug === slug)) {
    return next(new AppError('You do not have permission to access this resource.', 403));
  }

  next();
};

module.exports = { checkPermission };
