import express from "express";
import moment from "moment";
import pg from "pg";

const app = express();
const PORT = 3038;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Todo-List",
  password: "Pgtalaku24#",
  port: 5432,
});

db.connect()
  .then(() => console.log("Postgres connected"))
  .catch((err) => console.error("Connection error", err.stack));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (_, res) => {
  try {
    const result = await db.query("SELECT * FROM events  ORDER BY id ASC");
    const events = result.rows.map((event) => ({
      ...event,
      date: moment(event.date).format("YYYY-MM-DD"),
    }));
      res.render("index.ejs", {
        events: events,
        moment: moment,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error: ${err.message}`);
    }
});
  
// Add event here
  
app.post("/add", async (req, res) => {
  const newEvent = {
    title: req.body.title,
    date: moment(req.body.date).format("YYYY-MM-DD"),
  };
  try {
    const result = await db.query(
      "INSERT INTO events (title, date) VALUES($1, $2) RETURNING *",
      [newEvent.title, newEvent.date]
    );
    res.redirect("/");
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

// Edit event here

app.post("/edit", async (req, res) => {
  const id = req.body.updateId
  const title = req.body.updateTitle
  try {
    await db.query("UPDATE events SET title= $1  WHERE id = $2", [title, id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${
      err.message
    }`);
  }
})

// Delete event here

app.post("/delete", async (req, res) => {
  const id = req.body.deleteId;
  try {
    await db.query("DELETE FROM events WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err.message}`);
  }
}
);


app.listen(PORT, () => {
  console.log(`Pg-db is running at http://localhost:${PORT}`);
});
