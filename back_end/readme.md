# node-reusables
This is a NodeJs project having node reusable modules for your node project. currently providing modules

  - signUp
  - signIn
  - mailServices (sendGrid)




### Tech

This Project uses a number of open source projects to work properly:

* [node.js] - Evented I/O for the backend
* [Express] - Fast node.js network app framework [@tjholowaychuk]
* [winston] - A logger for just about everything.
* [morgan] - HTTP request logger middleware for node.js
* [swagger-ui-express] - Allows to serve auto-generated swagger-ui generated API docs from express
* [swagger-jsdoc] - Document your code and keep a live and reusable OpenAPI (Swagger) specification.
* [mustache] - Mustache is a web template system
* [mongoose] - A MongoDB object modeling tool designed to work in an asynchronous environment.
* [jsonwebtoken] - An implementation of JSON Web Tokens.
* [jest] - Delightful JavaScript Testing
* [supertest] - A high-level abstraction for testing HTTP
* [query-string] - Parse and stringify URL query strings
* [dotenv] - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
* [bcrypt] - A library to help you hash passwords.
* [axios] - Promise based HTTP client for the browser and node.js
* [@sendgrid/mail] - This is a dedicated service for interaction with the mail endpoint of the SendGrid v3 API.
* [cross-env]- Run scripts that set and use environment variables across platforms
* [Eslint] - A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

### Setting .env
Sample .env file
```sh
# Node Environment
NODE_ENV="development" 
# server configuration
PORT="3000"
HOST="localhost"
BASE_URL="http://localhost:3000"
# Logger Level
LOG_LEVEL="dev"
# Database
DB_HOST="localhost"
DB_USERNAME=""
DB_PASSWORD=""
DB_DATABASE_NAME="db_name"
DB_PORT="27017"
DB_SSL=false
JWT_SECRET=""
# Add Sendgrid API Key if using sendgrid to send emails
SENDGRID_API_KEY="api.key.from.sendgrid.accout"
# Google OAuth Client Credentials
GOOGLE_OAUTH_CLIENT_ID=""
GOOGLE_OAUTH_CLIENT_SECRET=""
```

### Installation

node-reusables requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd node-reusables
$ npm install -d
$ npm start
```
If you want to run the application in dev mode:

```sh
$ npm run start:dev
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

### Test
We use Jest and Supertest to run the test. Run the following command to start the Test.

```sh
$ npm test
```

### Lint
ESLint is a pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.

.eslintrc.json file (alternatively configurations can we written in Javascript or YAML as well) is used describe the configurations required for ESLint. Below is the .eslintrc.json file which we are using.

```sh
{
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
        "plugin:jest/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
    }
}
```
We are using [Airbnb's Javascript Style](https://github.com/airbnb/javascript) Guide which is used by many JavaScript developers worldwide.


We can run the lint by running the following:

```sh
$ npm run lint
```

### API Documentation 
In this project swagger is used for API Documentation. Swagger is a set of open-source tools built around the OpenAPI Specification that can help us to design, build, document and consume REST APIs. The ability of APIs to describe their own structure is the root of all awesomeness in Swagger.

The major Swagger tools include:

Swagger Editor — browser-based editor where one can write OpenAPI specification

Swagger UI — renders OpenAPI specs as interactive API documentation

Swagger Codegen — generates server stubs and client libraries from an OpenAPI specification

First Run the node-reusable application, then visit the https://BASE_URL/api-docs/ to view the API endpoint details via browser, powered by swagger. (You can see the BASE_URL in the console log on starting the Application).



License
----

MIT



   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [winston]: <https://www.npmjs.com/package/winston>
   [morgan]:<https://www.npmjs.com/package/morgan>
   [swagger-ui-express]:<https://www.npmjs.com/package/swagger-ui-express>
   [swagger-jsdoc]:<https://www.npmjs.com/package/swagger-jsdoc>
   [mustache]:<https://www.npmjs.com/package/mustache>
   [mongoose]:<https://mongoosejs.com/>
   [jsonwebtoken]:<https://www.npmjs.com/package/jsonwebtoken>
   [jest]:<https://jestjs.io/>
   [supertest]:<https://www.npmjs.com/package/supertest>
   [query-string]:<https://www.npmjs.com/package/query-string>
   [dotenv]:<https://www.npmjs.com/package/dotenv>
   [bcrypt]:<https://www.npmjs.com/package/bcrypt>
   [axios]:<https://www.npmjs.com/package/axios>
   [@sendgrid/mail]:<https://www.npmjs.com/package/@sendgrid/mail>
   [cross-env]:<https://www.npmjs.com/package/cross-env>
   [Eslint]:<https://eslint.org/>
   [Airbnb's Javascript Style]:<https://github.com/airbnb/javascript>

