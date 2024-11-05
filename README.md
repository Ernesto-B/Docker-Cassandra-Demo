# Cassandra REST API with Docker

This project demonstrates a simple REST API built using Node.js and Express, backed by a Cassandra database. Both locally run inside a Docker container. The API provides basic CRUD operations and a metrics endpoint for data analysis.

## Table of Contents
- [Cassandra REST API with Docker](#cassandra-rest-api-with-docker)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
  - [Endpoints](#endpoints)
    - [1. POST /item](#1-post-item)
    - [2. GET /items](#2-get-items)
    - [3. PUT /item/:id](#3-put-itemid)
    - [4. DELETE /item](#4-delete-item)
    - [5. GET /metrics](#5-get-metrics)
  - [Notes](#notes)

---

## Prerequisites
To run this project, you'll need to have Docker and Docker Compose installed on your system. The project uses a Cassandra container as the database and an Express server for handling API requests.

- **Docker**: Ensure Docker is installed and running on your system.
- **Node.js**: You should have Node.js installed on your machine for local development and testing.


## Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ernesto-B/Docker-Cassandra-Demo.git
   cd https://github.com/Ernesto-B/Docker-Cassandra-Demo.git
   ```
2. **Start the Docker containers**:
   ```bash
    docker-compose up --build
    ```
    - This will autumatically start the Cassandra container (port `9042`) and the Node.js server (port `3000`).
3. **Create the Cassandra Keyspace and Table**:
   - Run the commands found in the `setup.cql` one at a time:
    ```bash
    docker exec -it cassandra cqlsh

    CREATE KEYSPACE IF NOT EXISTS testkeyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

    USE testkeyspace;

    CREATE TABLE IF NOT EXISTS testingitems (
    userid int PRIMARY KEY,
    name text
    );
    ```
## Endpoints
### 1. POST /item
- **Description**: Create a new item in the database.
- **Request**:
  - **Method**: `POST`
  - **URL**: `http://localhost:3000/item`
  - **Body**:
    ```json
    {
        "id": 1,
        "name": "John Doe"
    }
    ```
### 2. GET /items
- **Description**: Fetch all items from the database.
- **Request**:
  - **Method**: `GET`
  - **URL**: `http://localhost:3000/items`

### 3. PUT /item/:id
- **Description**: Update an existing item's name in the database.
- **Request**:
  - **Method**: `PUT`
  - **URL**: `http://localhost:3000/item/1`
  - **Body**:
    ```json
    {
        "name": "Jane Doe"
    }
    ```
### 4. DELETE /item
- **Description**: Delete an item from the database.
- **Request**:
  - **Method**: `DELETE`
  - **URL**: `http://localhost:3000/item/1`
  - **Body**:
    ```json
    {
        "id": 1
    }
    ```
### 5. GET /metrics
- **Description**: Fetch metrics for the database.
- **Request**:
  - **Method**: `GET`
  - **URL**: `http://localhost:3000/metrics`

## Notes
- Although a volume is mounted onto the Cassandra container, if updates are made to index.js, the container must be rebuilt to apply the changes. This can be done by running `docker-compose reset` or `docker-compose down` followed by `docker-compose up --build`.