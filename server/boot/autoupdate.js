const path = require('path');

module.exports = app => {
  const datasources = app.datasources;
  const sqlDS = app.datasources.mydb;
  const models = require(path.resolve(__dirname, '../model-config.json'));

  // from http://stackoverflow.com/questions/23168958/auto-create-mysql-table-with-strongloop
  function autoUpdateAll() {
    Object.keys(models).forEach(key => {
      if (typeof models[key].dataSource !== 'undefined') {
        if (typeof datasources[models[key].dataSource] !== 'undefined') {
          app.dataSources[models[key].dataSource].autoupdate(key, err => {
            if (err) {
              console.log(`Problem with model ${key}`);
              console.log(
                'Data may get lost if you use the manual migration script.'
              );
              throw err;
            }
            console.log(`Model ${key} updated`);
          });
        }
      }
    });
  }

  // only do update if command line options say so
  if (process.argv.indexOf('autoupdate') !== -1) {
    // check if data source is actual
    sqlDS.isActual((err, actual) => {
      if (actual) console.log('MySQL database is consistent with models');
      else {
        console.log('autoupdating MySQL database...');
        autoUpdateAll();
      }
    });
  } else {
    console.log('Autoupdating was not run');
  }
};
