import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const adapter = new JSONFile("db.json");
const db = new Low(adapter);
await db.read();
db.data ||= {
  users: [{ username: "admin", password: "123456" }],
  products: [],
  inbound: [],
  outbound: []
};
await db.write();

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = db.data.users.find(u => u.username === username && u.password === password);
  if (user) res.json({ success: true });
  else res.json({ success: false, message: "Invalid login" });
});

app.get("/products", async (req, res) => {
  await db.read();
  res.json(db.data.products);
});

app.post("/products", async (req, res) => {
  await db.read();
  db.data.products.push(req.body);
  await db.write();
  res.json({ success: true });
});

app.post("/inbound", async (req, res) => {
  await db.read();
  db.data.inbound.push(req.body);
  await db.write();
  res.json({ success: true });
});

app.post("/outbound", async (req, res) => {
  await db.read();
  db.data.outbound.push(req.body);
  await db.write();
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));