const express = require("express");
const cassandra = require("cassandra-driver");

const app = express();
app.use(express.json());

// Connect to Cassandra
const client = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_HOST || "cassandra"],
    localDataCenter: "datacenter1",
    keyspace: "testkeyspace"
});


app.post("/item", async (req, res) => {
    let { id, name } = req.body;
    id = id || Math.floor(Math.random() * 1000)

    try {
        // Ensure id is an int
        id = parseInt(id, 10);
        if (isNaN(id)) {
            return res.status(400).send("Invalid id: must be a valid integer");
        }

        const query = "INSERT INTO testingitems (userid, name) VALUES (?, ?);";
        console.log("Attempting to insert:", { id, name });
        await client.execute(query, [id, name], { prepare: true });
        console.log("Insert successful");
        res.status(200).send("Item added successfully");
    } catch (error) {
        res.status(500).send("Failed to add item");
        console.error(error);
    }
});

app.get("/items", async (req, res) => {

    try {
        const query = "SELECT * FROM testingitems;";
        const result = await client.execute(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send("Failed retrieve item");
        console.error(error);
    }
});

app.put("/item/:id", async (req, res) => {
    const id = req.params.id;
    const { newName } = req.body;
    try {
        const query = "UPDATE testingitems SET name = ? WHERE userid = ?;";
        await client.execute(query, [newName, parseInt(id)], { prepare: true });
        res.status(200).send(`Item with id ${id} edited successfully`);
    } catch (error) {
        res.status(500).send("Failed to edit item");
        console.error(error);
    }
})

app.delete("/item" , async (req, res) => {
    const { id } = req.body;
    try {
        const query = "DELETE FROM testingitems WHERE userid = ?;";
        await client.execute(query, [parseInt(id)], { prepare: true });
        res.status(200).send(`Item with id ${id} deleted successfully`);
    } catch (error) {
        res.status(500).send("Failed to delete item");
        console.error(error);
    }
})

app.get("/metrics", async (req, res) => {
    try {
        // First select all the desired values
        const result = await client.execute("SELECT userid, name FROM testingitems;");

        const itemsCount = result.rowLength;
        const sumIds = result.rows.reduce((sum, row) => sum + row.userid, 0);
        const nameLen = result.rows.reduce((sum, row) => sum + row.name.length, 0);
        const avgNameLen = (nameLen / itemsCount).toFixed(2);
        res.status(200).json({
            itemsCount,
            sumIds,
            avgNameLen
        });
    } catch (error) {
        res.status(500).send("Failed analyze metrics");
        console.error(error);
    }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
