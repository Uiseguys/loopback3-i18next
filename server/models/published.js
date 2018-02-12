'use strict';
const helpers = require('./helpers.js');

module.exports = Published => {
  helpers.disableAllMethods(Published, ['getVersion']);

  // --- publish ---
  Published.remoteMethod('getPublished', {
    http: {path: '/:language/:namespace', verb: 'get'},
    accepts: [
      {arg: 'language', type: 'string'},
      {arg: 'namespace', type: 'string'},
      {arg: 'version', type: 'string', http: {source: 'query'}},
    ],
    description: 'get versions',
    returns: {type: 'object', root: true},
  });

  Published.getPublished = async (language, namespace, version, cb) => {
    try {
      const translations = await Published.find({
        where: {
          projectId: 1,
          language,
          namespace,
          version: version || 'Latest',
        },
      });
      if (!translations || !translations.length) {
        cb('Not found');
      } else {
        cb(null, JSON.parse(translations[0].translation));
      }
    } catch (e) {
      cb(e);
    }
  };
};
