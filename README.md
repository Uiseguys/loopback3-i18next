# loopback3-i18next

The project is generated by [LoopBack](http://loopback.io).

loopback3-i18next provides the following features:

* Auth
* i18next

## How to start

**Note** that this seed project requires node v4.x.x or higher and npm 2.14.7 but in order to be able to take advantage of the complete functionality we **strongly recommend node >=v6.5.0 and npm >=3.10.3.**

In order to start the seed use:

    $ git clone https://github.com/Uiseguys/loopback3-i18next.git
    $ cd loopback3-i18next
    # install the project's dependencies
    $ npm install
    # install strongloopback
    $ npm install -g strongloop
    # create basic tables
    $ npm run db autoupdate
    # insert seed data
    $ npm run db db-seed
    # start project
    $ npm start  

## Configuration

### database and mail configuration

copy **server/datasources.example.json** to **server/datasources.json**

    {
      "db": {
        "name": "db",
        "connector": "memory"
      },
      "mydb": {
        "name": "mydb",
        "connector": "postgresql",
        "host": "localhost",
        "port": 5432,
        "database": "i18next",
        "user": "postgres",
        "debug": true,
        "password": "root"
      },
      "myEmail": {
        "name": "myEmail",
        "connector": "mail",
        "transports": [
          {
            "type": "smtp",
            "host": "email.active24.com",
            "secure": false,
            "tls": {
              "rejectUnauthorized": false
            },
            "port": 587,
            "auth": {
              "user": "cesko@gastro-booking.com",
              "pass": "n6EEUd5xCJ"
            }
          }
        ]
      }
    }

### server ip and port

Edit **server/config.json**

    {
      "restApiRoot": "/api",
      "host": "127.0.0.1",
      "port": 3000,
      "remoting": {
        "context": false,
        "rest": {
          "handleErrors": false,
          "normalizeHttpPath": false,
          "xml": false
        },
        "json": {
          "strict": false,
          "limit": "100kb"
        },
        "urlencoded": {
          "extended": true,
          "limit": "100kb"
        },
        "cors": false
      }
    }

## How to update?

Edit models and run `$ npm run db autoupdate`

## How to use?

We suggest you to read [this article](https://www.i18next.com/) if you are not familiar with i18next.
We divide features like following:

1.  Create

    You should create a project to start.
    ![enter image description here](https://github.com/Uiseguys/loopback3-i18next/blob/master/screenshots/2018-05-14_0454.png?raw=true)

2.  Edit

    Projects are composed of language and namespaces.
    Project has many languages.
    Each language has many namespaces.
    You can add or remove keys in only default language.
    ![enter image description here](https://github.com/Uiseguys/loopback3-i18next/blob/master/screenshots/2018-05-14_0509_001.png?raw=true)

3.  Publish

    Once project is completed, you should publish project to make it online.
    The published url will be https://loopback3-i18next.herokuapp.com/api/Published/{projectId}/{{lng}}/{{ns}}
    You can find projectId from the url.
    ![enter image description here](https://github.com/Uiseguys/loopback3-i18next/blob/master/screenshots/2018-05-14_0515.png?raw=true)

4.  Import namespaces

    This project provides with feature of importing JSON file into namespace
    ![enter image description here](https://github.com/Uiseguys/loopback3-i18next/blob/master/screenshots/2018-05-14_0509.png?raw=true)
    The JSON file should look like following:

        {
          "application_title": "Einhorn",
          "intro": "Diese Applikation ist ein Einhorn",
          "parametrized_string": "I am parametrized sting with a value: {{value}} and a string: '{{str}}'",
          "email": "email",
          "_languages": {
            "de": "Deutsch",
            "en": "English"
          },
          "_buttons": {
            "send": "send"
          },
          "Compact View": "Compact View"
        }

    You can extract extract keys automatically using [i18next scanner](https://github.com/i18next/i18next-scanner)
    Here is how to use i18next scanner on Angular project

    * Make directive for i18next. Please reference [this](https://github.com/Uiseguys/ng-bs-redux-boilerplate/blob/develop/src/app/shared/i18n/i18next.directive.ts).
    * Use that directive in templates like following:

          <Trans i18nKey="[namespace]:[key]">[default value]</Trans>

      Example:


    	    <Trans i18nKey="common:Compact View">Compact View</Trans>
    	 Here common is namespace, and 'Compact View' is key.
    - run i18next scanner


    	    i18next-scanner --config i18next-scanner.config.js 'src/**/*.{html,ts}'
