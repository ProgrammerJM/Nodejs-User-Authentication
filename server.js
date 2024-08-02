const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((users) => users.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
