# C4 Diagrams:

Entities:

![car-rental entities](/car-rental%20entities.jpg)

L1:

![car-rental entities](/car-rental%20L1.jpg)

L2:

![car-rental entities](/car-rental%20L2.jpg)

L3:

![car-rental entities](/car-rental%20L3.jpg)

# About the project

Server-Side Rendering CRUD Application that manages the business logic of a car rental system, enabling clients to register users and create vehicle reservations. The application follows `SOLID` principles, with modules separated and implemented using the `'Model-View-Controller'`
 design pattern.


# Technologies used

- **Sqlite**:  SQLite is a Relational Database Management System (RDBMS) database engine.
- **Sequelize**: Object-Relational Mapper (ORM) for PostgreSQL, MySQL, MariaDB, SQLite, and Microsoft SQL Server. Facilitates the communication with the SQLite databases by providing models and establishing entity relations.
- **Bulmajs**: Bulma.js is a modern CSS framework based on Flexbox to build a responsive interface.
- **Nunjucks**: Nunjucks is a powerful templating engine for JavaScript. Allows a dynamic build of HTML pages.
- **Rsdi**: Is a design pattern used to manage dependencies in an Express.js application. It helps organize and modularize your code by separating concerns and promoting reusability.
- **Dotenv**: Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. It simplifies the management of environment-specific configurations in Node.js applications.
- **Express**: It provides a set of features for building web, including routing, middleware, and HTTP utilities.
- **Node.js**: Node.js is a runtime environment that allows you to run JavaScript on the server-side.
- **Nodemon**: Nodemon is a utility that monitors for changes in the application and automatically restarts the server. It enhances the development workflow by speeding up the development cycle and reducing downtime.
- **Eslint**: It helps maintain code quality and consistency across a project.
- **Multer**: Multer is a middleware for handling multipart/form-data, used for uploading files in Node.js applications.
- **Flatpickr**: Flatpickr is a  datetime picker library. It provides a user-friendly interface for selecting dates.


# Project structure

### " * " represents Car, User and Reserve modules

| Path                   | Description                                                                                           |
|------------------------|-------------------------------------------------------------------------------------------------------|
| src                    | Contains the application                                                                              |
| src/config             | Configuration of the application                                                                      |
| src/config/config.js   | Distributes environment variables throughout the application                                          |
| src/config/setup.sql   | Configures Cars table in database                                                                     |
| src/config/insert.js   | Inserts information of cars to Cars table                                                             |
| src/module             | Contains each module of the application                                                               |
| src/module/*/controller| Manages the HTTP requests of the project and renders entities                                         |
| src/module/*/services  | Business logic of the application                                                                     |
| src/module/*/repository| Interacts with the database using a Sequelize Model to return entities                                |
| src/module/*/model     | Sequelize models used for queries, relations and synchronization with Sqlite                          |
| src/module/*/entity    | The entity used in this module                                                                        |
| src/module/*/mapper    | Maps the received data such as form data or database date into an Entity                              |
| src/module/*/module.js | Module's bootstrap                                                                                    |
| src/app.js             | Entry point of the application                                                                        |



