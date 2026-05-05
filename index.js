const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const time = new Date().toLocaleString();
  console.log(`Request received at: ${time}`);
  console.log(`Req : ${req.method} and res: ${req.url}`);
  next();
});

let users = [];
let idCounter = 1;

const sendResponse = (res, message, data = null) => {
  res.status(statusCode).json({
    message,
    time: new Date().toLocaleString(),
    data,
  });
};



app.get("/", (req, res) => {
  sendResponse(res,200,"Hello, every thing is fine and Server Running");
});


app.get("/users", (req, res) => {
  sendResponse(res,200,"All users fetched", users);
});


app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) {
    return sendResponse(res,404,"User not found");
  }

  sendResponse(res,200,"User fetched", user);
});


app.post("/users", (req, res) => {
  const { name, email } = req.body;

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return sendResponse(res,400,"Email already exists");
  }

  const newUser = {
    id: idCounter++,
    name,
    email,
  };

  users.push(newUser);

  sendResponse(res,201,"User added successfully", newUser);
});

app.delete("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1) {
    return sendResponse(res,404,"User not found");
  }

  users.splice(index, 1);

  sendResponse(res,200,"User deleted successfully");
});



app.post("/login", (req, res) => {
  const { email, password } = req.body;


  if (email === "admin@gmail.com" && password === "1234") {
    return sendResponse(res,200,"Login Success");
  }

  sendResponse(res,403,"Invalid Credentials");
});


app.listen(3000, () => {
  console.log(`Server running`);
  console.log(`click-> http://localhost:3000/`)
});
