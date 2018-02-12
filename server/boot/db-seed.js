'use strict';
module.exports = async app => {
  var User = app.models.CustomUser;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  try {
    const oldUsers = await User.find({where: {username: 'admin'}});
    if (oldUsers.length) return;

    const users = await User.create([
      {username: 'admin', email: 'admin@admin.com', password: 'admin123'},
    ]);
    console.log('Created users:', users);

    const role = await Role.create({
      name: 'super_admin',
      description: 'Super Admin',
    });

    const principal = await role.principals.create({
      principalType: RoleMapping.USER,
      principalId: users[0].id,
    });

    await Role.create({
      name: 'admin',
      description: 'Admin',
    });

    await Role.create({
      name: 'editor',
      description: 'Editor',
    });

    // create project
    await app.models.Project.create([
      {name: 'test', languages: 'en, dt', primaryLanguage: 'en'},
    ]);

    // create language
    await app.models.Translation.create([
      {
        language: 'en',
        namespace: 'default',
        description: '{}',
        projectId: 1,
      },
    ]);
  } catch (e) {
    console.log(e);
  }
};
