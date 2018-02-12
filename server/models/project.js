'use strict';

const helpers = require('./helpers.js');

module.exports = Project => {
  
  helpers.disableAllMethods(Project, []);

  // --- add ---
  Project.remoteMethod('addLanguage', {
    http: {path: '/:projectId/language', verb: 'post'},
    accepts: [
      {arg: 'projectId', type: 'number'},
      {arg: 'data', type: 'object', http: {source: 'body'}},
    ],
    description: 'add language',
    returns: {type: 'object', root: true},
  });

  Project.addLanguage = async (projectId, data, cb) => {
    try {
      const {Translation} = Project.dataSource.models;
      const {language} = data;

      // check if exists
      const isExist = await Translation.count({
        projectId,
        language,
      });

      if (isExist) {
        return cb('Already exists');
      }

      // get en namespaces
      const namespaces = await Translation.find({
        where: {
          projectId,
          language: 'en',
        },
      });

      // duplicate only keys
      let promises = [];
      for (let i = 0; i < namespaces.length; i += 1) {
        // get only keys
        const referenceData = JSON.parse(namespaces[i].description);
        const insertData = {};
        for (let key in referenceData) {
          insertData[key] = '';
        }
        // insert data
        promises.push(
          Translation.create({
            projectId,
            language,
            namespace: namespaces[i].namespace,
            description: JSON.stringify(insertData),
          })
        );
      }
      const inserted = await Promise.all(promises);

      cb(null, inserted);
    } catch (e) {
      cb(e);
    }
  };

  // --- add namespace ---
  Project.remoteMethod('addNamespace', {
    http: {path: '/:projectId/namespace', verb: 'post'},
    accepts: [
      {arg: 'projectId', type: 'number'},
      {arg: 'data', type: 'object', http: {source: 'body'}},
    ],
    description: 'add namespace',
    returns: {type: 'object', root: true},
  });

  Project.addNamespace = async (projectId, data, cb) => {
    try {
      const {Translation} = Project.dataSource.models;
      const {namespace} = data;

      // check if exists
      const isExist = await Translation.count({
        projectId,
        namespace,
      });

      if (isExist) {
        return cb('Already exists');
      }

      // get languages
      const languages = await Translation.find({
        fields: {language: true},
        where: {
          projectId,
        },
      });

      let promises = [];
      const createdLanuages = [];
      for (let i = 0; i < languages.length; i += 1) {
        if (createdLanuages.indexOf(languages[i].language) !== -1) continue;

        createdLanuages.push(languages[i].language);
        // insert data
        promises.push(
          Translation.create({
            projectId,
            language: languages[i].language,
            namespace: namespace,
            description: JSON.stringify({}),
          })
        );
      }

      const inserted = await Promise.all(promises);
      cb(null, inserted);
    } catch (e) {
      cb(e);
    }
  };

  // --- publish ---
  Project.remoteMethod('publish', {
    http: {path: '/:projectId/publish', verb: 'post'},
    accepts: [
      {arg: 'projectId', type: 'number'},
      {arg: 'data', type: 'object', http: {source: 'body'}},
    ],
    description: 'publish translation',
    returns: {type: 'object', root: true},
  });

  Project.publish = async (projectId, data, cb) => {
    try {
      const {Translation, Published} = Project.dataSource.models;
      const {version} = data;

      // check version
      if (!version) {
        cb('Version is required');
      }

      const translations = await Translation.find({
        where: {
          projectId,
        }
      });

      // remove old published
      await Published.destroyAll({
        projectId,
        version,
      });

      // insert new translations
      let promises = [];
      for (let i = 0; i < translations.length; i += 1) {
        promises.push(Published.create({
          projectId,
          version,
          language: translations[i].language,
          namespace: translations[i].namespace,
          translation: translations[i].description,
        }));
      }

      await Promise.all(promises);

      cb(null, { version });
    } catch (e) {
      cb(e);
    }
  };

  // --- publish ---
  Project.remoteMethod('versions', {
    http: {path: '/:projectId/versions', verb: 'get'},
    accepts: [
      {arg: 'projectId', type: 'number'},
    ],
    description: 'get versions',
    returns: {type: 'object', root: true},
  });

  Project.versions = (projectId, cb) => {
    const sql = `SELECT DISTINCT version FROM published WHERE projectid='${projectId}';`;
    Project.dataSource.connector.execute(sql, [], (err, result) => {
      if (err) {
        cb(err);
      } else {
        cb(null, result.map(item => item.version));
      }
    });
  };
};
