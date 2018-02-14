'use strict';
const helpers = require('./helpers.js');

module.exports = Published => {
  helpers.disableAllMethods(Published, ['getVersion']);

  // --- publish ---
  Published.remoteMethod('getPublished', {
    http: {path: '/:projectId/:language/:namespace', verb: 'get'},
    accepts: [
      {arg: 'projectId', type: 'string'},
      {arg: 'language', type: 'string'},
      {arg: 'namespace', type: 'string'},
      {arg: 'version', type: 'string', http: {source: 'query'}},
    ],
    description: 'get versions',
    returns: {type: 'object', root: true},
  });

  Published.getPublished = async (projectId, language, namespace, version, cb) => {
    try {
      const translations = await Published.find({
        where: {
          projectId,
          language,
          namespace,
          version: version || 'Latest',
        },
      });
      if (!translations || !translations.length) {
        cb(null, {});
      } else {
        cb(null, JSON.parse(translations[0].translation));
      }
    } catch (e) {
      cb(e);
    }
  };
};
