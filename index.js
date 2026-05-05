const express = require("express");
const app = express();

const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  const time = new Date().toLocaleString();
  console.log(`Request received at: ${time}`);
  console.log(`${req.method} ${req.url}`);
  next();
});

let users = [];
let idCounter = 1;

const sendResponse = (res, message, data = null) => {
  res.json({
    message,
    time: new Date().toLocaleString(),
    data,
  });
};


app.get("/", (req, res) => {
  sendResponse(res, "Server Running");
});



app.get("/users", (req, res) => {
  sendResponse(res, "All users fetched", users);
});


app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return sendResponse(res, "User not found");
  }

  sendResponse(res, "User fetched", user);
});


app.post("/users", (req, res) => {
  const { name, email } = req.body;


  if (!name || !email) {
    return sendResponse(res, "Name and Email are required");
  }


  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return sendResponse(res, "Email already exists");
  }

  const newUser = {
    id: idCounter++,
    name,
    email,
  };

  users.push(newUser);

  sendResponse(res, "User added successfully", newUser);
});

app.delete("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1) {
    return sendResponse(res, "User not found");
  }

  users.splice(index, 1);

  sendResponse(res, "User deleted successfully");
});



app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return sendResponse(res, "All fields required");
  }

  if (email === "admin@gmail.com" && password === "1234") {
    return sendResponse(res, "Login Success");
  }

  sendResponse(res, "Invalid Credentials");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`click-> http://localhost:3000/`)
});
