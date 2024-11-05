-- Enable cql inside the container
docker exec -it cassandra cqlsh

-- Create a keyspace
CREATE KEYSPACE IF NOT EXISTS testkeyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

-- Use the keyspace
USE testkeyspace;

-- Create a table
CREATE TABLE IF NOT EXISTS testingitems (
    userid int PRIMARY KEY,
    name text
);
