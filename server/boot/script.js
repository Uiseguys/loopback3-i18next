'use strict';
module.exports = app => {
  if (app.models.Role) {
    app.models.Role.observe('before delete', async (ctx, next) => {
      if (ctx.where.id === 1) {
        next(new Error("You can't delete admin role"));
      } else {
        next();
      }
    });
  }
};
