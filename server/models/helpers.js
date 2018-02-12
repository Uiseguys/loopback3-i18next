// https://github.com/strongloop/loopback/issues/651
'use strict';
module.exports.disableAllMethods = (model, methodsToExpose) => {
  if (model && model.sharedClass) {
    methodsToExpose = methodsToExpose || [];

    const methods = model.sharedClass.methods();
    const relationMethods = [];
    const hiddenMethods = [];

    try {
      Object.keys(model.definition.settings.relations).forEach((relation) => {
        relationMethods.push({ name: `prototype.__findById__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__destroyById__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__updateById__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__exists__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__link__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__get__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__create__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__update__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__destroy__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__unlink__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__count__${relation}`, isStatic: false });
        relationMethods.push({ name: `prototype.__delete__${relation}`, isStatic: false });
        relationMethods.push({ name: 'prototype.patchAttributes' });
      });
    } catch (err) {
      console.log(err);
    }

    methods.concat(relationMethods).forEach((method) => {
      const methodName = method.name;
      if (methodsToExpose.indexOf(methodName) < 0) {
        hiddenMethods.push(methodName);
        model.disableRemoteMethodByName(methodName);
      }
    });
  }
};
