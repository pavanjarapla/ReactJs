

const cron = require("node-cron");
const fs = require("fs"); 
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");

const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "10mb" }));




app.use(express.json());




const authUsers = JSON.parse(fs.readFileSync("authUsers.json"));
app.post("/api/authentication", (req, res) => {
  const { email, password } = req.body;
  const user = authUsers.users.find((user) => user.user_email === email);
  if (user && user.password === password) {
    res.send({
      token: user.token,
    });
  } else {
    res.status(400).send("Authentication failed");
  }
});
app.post("/api/register", (req, res) => {
  const newUser = req.body; // Assuming you send user data like { user_email, password, token }

  // Check if a user with the same user_email already exists
  const existingUser = authUsers.users.find(
    (user) => user.user_email === newUser.user_email
  );

  if (existingUser) {
    res.status(409).send("User already exists"); // HTTP 409 Conflict status for resource conflicts
  } else {
    // User doesn't exist, so add the new user
    newUser["token"]="test123";
    authUsers.users.push(newUser);

    // Save the updated data back to the JSON file (you should use a more robust database solution in a real-world app)
    const fs = require("fs");
    fs.writeFileSync("authUsers.json", JSON.stringify(authUsers));

    res.status(201).send("User registered successfully");
  }
});


let lastUpdatedTimestamp = null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port} over HTTPS`);
});