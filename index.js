const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());

//middleware
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234245",
  },
  {
    id: 4,
    name: "Mary poppendick",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  res.json(person);

  if (!person) {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "You have to put name and number" });
  }

  const nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return res.status(400).json({ error: "Name already exists" });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.get("/info", (req, res) => {
  const currentDate = new Date();

  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${currentDate}</p>`
  );
});

function generateId() {
  return Math.floor(Math.random() * 1000000);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
