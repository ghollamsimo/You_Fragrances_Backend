# Hexagonal Architecture -->

src

├── core

│   ├── entities

│   ├── interfaces

├── infrastructure

│   ├── database

│   ├── repositories

├── application

│   ├── use-cases

├── interface

│   ├── http

└── main.ts

--------------------------

Core (Domain) :

     -- the core layer represents the heart of the application.

     ── entities :

          Define the core business model and define the properties.

     ── interfaces :

          Define the interface with method and this interface will be implemented by adapter.

Infrastructure :

     -- the infrastructure layer the actual implementations of our Core (domain) interfaces

     ── database :

           ── schemas :

                      Define the structure of Document for mongoose.

     ── repository :

           Define the logic of the application.

Application :

     -- The application layer is responsible for coordinating the domain logic.

     ── usecases or (services) :

           Represent actions our application can perform.

Interface :

     -- The interface layer is responsible for exposing the functionality of our application to the outside world (req, res).

     ── http :

           Defines API endpoints and delegates requests to use cases.

App Module (Dependency Injection) :

     -- In NestJS, we use dependency injection to connect these layers and manage dependencies efficiently.
