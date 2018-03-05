'use strict';
module.exports = {
  db: {
    name: 'db',
    connector: 'memory',
  },
  mydb: {
    name: 'mydb',
    connector: 'postgresql',
    url: process.env.DATABASE_URL,
    ssl: true,
  },
  myEmail: {
    name: 'myEmail',
    connector: 'mail',
    transports: [
      {
        type: 'smtp',
        host: 'email.active24.com',
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
        port: 587,
        auth: {
          user: 'cesko@gastro-booking.com',
          pass: 'n6EEUd5xCJ',
        },
      },
    ],
  },
};
