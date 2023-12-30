require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(express.json());

// middleware
morgan.token("postData", (req) => {
  if (req.method === "POST" && req.body) {
    return JSON.stringify(req.body);
  }
  return " ";
});

const customFormat =
  ":method :url :status :res[content-length] - :response-time ms :postData";

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(morgan(customFormat));
app.use(bodyParser.json());

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.json(person);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
// findbyidandDelete didnt work in latest version so i used findOneAndDelete()
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Person.findOneAndDelete({ _id: id })
    .then((deletedPerson) => {
      if (!deletedPerson) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.status(204).end();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "You have to put name and number" });
  }

  Person.create({
    name: body.name,
    number: body.number,
  })
    .then((newPerson) => {
      res.json(newPerson);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/info", (req, res) => {
  Person.countDocuments({}, (err, count) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const currentDate = new Date();
    res.send(
      `<p>Phonebook has info for ${count} people</p> <p>${currentDate}</p>`
    );
  });
});

const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
