# LDR App - Backend

This directory contains the source code for the API server.

To run it in development mode, run `npm run develop`, to build it productionally, run `npm build`.

To migrate to a new database schema, run `npm makemigrations && npm migrations`.

## Configuration

- Please use `.env.*` file to configure the app. You will need to configure several environment variables for the app to work.

- `SECRET`: A secret key used to access certain admin-only API endpoints, such as `POST /api/activities`. Must be used with HTTP header `ldr-admin-key`.
- `DB_TYPE`: Type of database. Only `MySQL` and `Postgres` are supported at the moment, support for `MongoDB` will be added in future.
- `DB_PORT`: Port of the Database.
- `DB_USERNAME`: Username.
- `DB_PASSWORD`: Password.
- `DB_NAME`: Name of the database.
- `DB_SSL`: Boolean, accepts `true` or `false`. This is highly dependent on your database connection being on SSL or not.

## TODO:
- Allow users to define new activities themselves.
- Allow users to invite their partner to sign up and share the same list of activities with them.
