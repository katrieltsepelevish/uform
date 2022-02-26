# Scheduled Tasks

Forms builder with submission and authorization using Node.js, React, MongoDB, Typescript

**Remember:** Run MongoDB servers before lunch

**Warning:** This applcation isn't ready for production

## Installing Application

To install from Github, clone the repository and install dependencies using `npm`:

```sh
$ git clone git://github.com/katrieltsepelevish/uform.git
$ cd uform
```

Install the Server side dependencies, and `run`:

```sh
$ cd server
$ npm install
$ npm run dev
```

Install the `Client` side dependencies, and `run`:

```sh
$ cd ..
$ cd client
$ npm install
$ npm start
```

## Configuring

Configure the `server/.env` file before starting the application, Don't forget to **fill in** all the blank fields:

```
NODE_ENV=development
PORT=8000
ROUTES_PREFIX=/api
JWT_SECRET=fsdf@432cd1dsd
CLIENT_URL=http://localhost:3000
MONGODB_URL=mongodb://localhost:27017/uform
```

Same with the `client/.env` configuration file, Don't forget to **fill in** all the blank fields:

```
REACT_APP_PUBLIC_ENVIRONMENT=development
REACT_APP_PUBLIC_API_URL=http://localhost:8000/api
REACT_APP_BASE_DOMAIN=http://localhost:3000/
```

## API

All Api request should be prefixed with `api`

### `POST /auth/login`

Authorization through JWT strategy

### `POST /auth/register`

Create new user

### `GET /auth/me`

Returns the information of the authorized user

### `GET /form`

Returns all the forms owned by the authorized user

### `GET /form/:id`

Returns a specific form owned by the authorized user depends on provided id

Parameter :

-   `id` : (required) Id of the form

### `POST /form`

Creates new form for authorized user

Parameters :

-   `name` : (required) Name of the form

### `POST /form/:id/field`

Creates a field for specific form owned by the authorized user depends on provided id

Parameter :

-   `id` : (required) Id of the form

### `POST /form/:id/submit`

Submits information to the existing form

Parameter :

-   `id` : (required) Id of the form

## TODO

-   Notifications through Nodemailer
-   Ability to remove and edit forms and fields
-   Ability to add custom css to form
