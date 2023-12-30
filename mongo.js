const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://nolifeplayerofcsgo:${password}@cluster0.sqeh0x9.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("Usage:");
  console.log("To display all entries: node mongo.js <password>");
  console.log('To add an entry: node mongo.js <password> "<name>" <number>');
  mongoose.connection.close();
}
