'use strict';

module.exports = Translation => {
  // --- add ---
  Translation.addEntry = async (translationId, data, cb) => {
    try {
      const translation = await Translation.findById(translationId);

      // check if translation exists
      if (!translation) {
        cb('No translation found');
      }

      // check if key already exists
      const {key, value} = data;
      if (translation.description.indexOf(`"${key}":`) !== -1) {
        cb('Key already exists');
      } else {
        const json = JSON.parse(translation.description);
        json[key] = value;

        await translation.updateAttributes({
          description: JSON.stringify(json),
        });

        // apply changes to other all languages
        const otherLanguages = await Translation.find({
          where: {
            projectId: translation.projectId,
            namespace: translation.namespace,
            language: {nlike: translation.language},
          },
        });

        for (let i = 0; i < otherLanguages.length; i += 1) {
          const temp = JSON.parse(otherLanguages[i].description);
          temp[key] = '';
          await otherLanguages[i].updateAttributes({
            description: JSON.stringify(temp),
          });
        }

        cb(null, {success: true});
      }
    } catch (e) {
      cb(e);
    }
  };

  Translation.remoteMethod('addEntry', {
    http: {path: '/:translationId/entry', verb: 'post'},
    accepts: [
      {arg: 'translationId', type: 'number'},
      {arg: 'data', type: 'object', http: {source: 'body'}},
    ],
    description: 'add entry',
    returns: {type: 'object', root: true},
  });

  // --- update ---
  Translation.updateEntry = async (translationId, data, cb) => {
    try {
      const translation = await Translation.findById(translationId);

      // check if translation exists
      if (!translation) {
        cb('No translation found');
      }

      // check if key exists
      const {key, value} = data;
      if (translation.description.indexOf(`"${key}":`) === -1) {
        cb('Key does not exist');
      } else {
        const json = JSON.parse(translation.description);
        json[key] = value;

        await translation.updateAttributes({
          description: JSON.stringify(json),
        });

        cb(null, {success: true});
      }
    } catch (e) {
      cb(e);
    }
  };

  Translation.remoteMethod('updateEntry', {
    http: {path: '/:translationId/entry', verb: 'patch'},
    accepts: [
      {arg: 'translationId', type: 'number'},
      {arg: 'data', type: 'object', http: {source: 'body'}},
    ],
    description: 'update entry',
    returns: {type: 'object', root: true},
  });

  // --- delete ---
  Translation.deleteEntry = async (translationId, key, cb) => {
    try {
      const translation = await Translation.findById(translationId);

      // check if translation exists
      if (!translation) {
        cb('No translation found');
      }

      // check if key already exists
      if (translation.description.indexOf(`"${key}":`) !== -1) {
        const json = JSON.parse(translation.description);
        json[key] = undefined;

        await translation.updateAttributes({
          description: JSON.stringify(json),
        });

        // apply changes to other all languages
        const otherLanguages = await Translation.find({
          where: {
            projectId: translation.projectId,
            namespace: translation.namespace,
            language: {nlike: translation.language},
          },
        });

        for (let i = 0; i < otherLanguages.length; i += 1) {
          const temp = JSON.parse(otherLanguages[i].description);
          temp[key] = undefined;
          await otherLanguages[i].updateAttributes({
            description: JSON.stringify(temp),
          });
        }
      }
      cb(null, {success: true});
    } catch (e) {
      cb(e);
    }
  };

  Translation.remoteMethod('deleteEntry', {
    http: {path: '/:translationId/entry/:key', verb: 'delete'},
    accepts: [
      {arg: 'translationId', type: 'number'},
      {arg: 'key', type: 'string'},
    ],
    description: 'delete entry',
    returns: {type: 'object', root: true},
  });

  // --- update key ---
  Translation.updateKey = async (translationId, data, cb) => {
    // check if no need to update
    const {key, oldKey} = data;
    if (key === oldKey) {
      cb(null, {success: true});
      return;
    }

    try {
      const translation = await Translation.findById(translationId);

      // check if translation exists
      if (!translation) {
        cb('No translation found');
      }

      if (translation.description.indexOf(`"${key}":`) !== -1) {
        cb('Key already exists');
      } else {
        const json = JSON.parse(translation.description);

        json[key] = json[oldKey];
        json[oldKey] = undefined;

        await translation.updateAttributes({
          description: JSON.stringify(json),
        });

        // apply changes to other all languages
        const otherLanguages = await Translation.find({
          where: {
            projectId: translation.projectId,
            namespace: translation.namespace,
            language: {nlike: translation.language},
          },
        });

        for (let i = 0; i < otherLanguages.length; i += 1) {
          const temp = JSON.parse(otherLanguages[i].description);
          temp[key] = temp[oldKey];
          temp[oldKey] = undefined;

          await otherLanguages[i].updateAttributes({
            description: JSON.stringify(temp),
          });
        }
      }
      cb(null, {success: true});
    } catch (e) {
      cb(e);
    }
  };

  Translation.remoteMethod('updateKey', {
    http: {path: '/:translationId/key', verb: 'patch'},
    accepts: [
      {arg: 'translationId', type: 'number'},
      {arg: 'data', type: 'object', http: {source: 'body'}},
    ],
    description: 'update key',
    returns: {type: 'object', root: true},
  });
};
