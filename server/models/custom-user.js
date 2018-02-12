'use strict';
const loopback = require('loopback');
const path = require('path');

module.exports = CustomUser => {
  CustomUser.afterRemote('create', async (ctx, userInstance, next) => {
    const {models} = CustomUser.app;

    await models.RoleMapping.create({
      principalType: models.RoleMapping.USER,
      principalId: userInstance.id,
      roleId: ctx.req.body.role,
    });

    const renderer = loopback.template(
      path.resolve(__dirname, '../views/registration.ejs')
    );

    const emailObj = {
      email: ctx.req.body.email,
      password: ctx.req.body.password,
    };
    const htmlBody = renderer(emailObj);
    await models.Email.send(
      {
        from: 'admin@gudeline.com',
        to: ctx.req.body.email,
        subject: 'Guidelines App - Account Created',
        html: htmlBody,
      },
      () => {}
    );
    next();
  });

  CustomUser.afterRemote(
    'prototype.patchAttributes',
    async (ctx, userInstance, next) => {
      const {models} = CustomUser.app;
      const roleMappings = await models.RoleMapping.find({
        where: {principalId: userInstance.id},
      });

      if (roleMappings.length) {
        const mapping = roleMappings[0].toJSON();

        await models.RoleMapping.upsert({
          ...mapping,
          roleId: ctx.req.body.role,
        });
      }
      next();
    }
  );

  CustomUser.observe('before delete', async (ctx, next) => {
    if (ctx.where.id.inq.indexOf(1) !== -1) {
      next(new Error("You can't delete administrator"));
    } else {
      next();
    }
  });

  CustomUser.observe('after delete', async (ctx, next) => {
    await CustomUser.dataSource.models.RoleMapping.destroyAll({
      principalId: ctx.where.id.inq[0],
    });

    next();
  });
};
