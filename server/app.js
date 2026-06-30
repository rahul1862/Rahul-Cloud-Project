import "dotenv/config";
import crypto from "node:crypto";
import cors from "cors";
import express from "express";
import db from "./db.js";
import { generateUserPdf } from "./lib/pdfExport.js";

const app = express();
app.use(cors());
app.use(express.json());

const toApi = (row) => ({
  _id: row.id,
  name: row.name,
  email: row.email,
  address: row.address,
  phone: row.phone || "",
  createdAt: row.createdAt,
});

const validate = ({ name, email, address }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Must be at least 2 characters";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
  if (!address || address.trim().length < 5) errors.address = "Must be at least 5 characters";
  return errors;
};

const router = express.Router();

router.get("/users", (req, res) => {
  const rows = db.prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
  res.json(rows.map(toApi));
});

router.get("/search", (req, res) => {
  const q = `%${String(req.query.q || "").toLowerCase()}%`;
  const rows = db
    .prepare(
      "SELECT * FROM users WHERE lower(name) LIKE ? OR lower(email) LIKE ? OR lower(address) LIKE ? ORDER BY createdAt DESC"
    )
    .all(q, q, q);
  res.json(rows.map(toApi));
});

router.get("/stats", (req, res) => {
  const rows = db.prepare("SELECT * FROM users").all();
  const total = rows.length;
  const now = Date.now();
  const WEEK = 7 * 86400000;

  const recentUsers = rows.filter((r) => now - new Date(r.createdAt).getTime() < WEEK).length;
  const prevWeekUsers = rows.filter((r) => {
    const age = now - new Date(r.createdAt).getTime();
    return age >= WEEK && age < 2 * WEEK;
  }).length;
  const growthRate =
    prevWeekUsers === 0
      ? (recentUsers > 0 ? 100 : 0)
      : Math.round(((recentUsers - prevWeekUsers) / prevWeekUsers) * 100);

  const domainBreakdown = {};
  for (const r of rows) {
    const domain = r.email.split("@")[1]?.toLowerCase();
    if (domain) domainBreakdown[domain] = (domainBreakdown[domain] || 0) + 1;
  }
  const mostCommonDomain =
    Object.entries(domainBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  res.json({ total, recentUsers, growthRate, mostCommonDomain, domainBreakdown });
});

router.get("/user/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ message: "User not found" });
  res.json(toApi(row));
});

router.get("/user/:id/pdf", async (req, res, next) => {
  try {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
    if (!row) return res.status(404).json({ message: "User not found" });

    const pdfBuffer = await generateUserPdf(toApi(row));
    const filename = `${row.name.replace(/\s+/g, "_")}-profile.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

router.post("/user", (req, res) => {
  const { name, email, address, phone } = req.body || {};
  const errors = validate({ name, email, address });
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: Object.values(errors)[0], errors });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  db.prepare(
    "INSERT INTO users (id, name, email, address, phone, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, name.trim(), email.trim(), address.trim(), phone?.trim() || null, createdAt);

  res.status(201).json(toApi({ id, name, email, address, phone, createdAt }));
});

router.put("/update/user/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ message: "User not found" });

  const { name, email, address, phone } = req.body || {};
  const errors = validate({ name, email, address });
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: Object.values(errors)[0], errors });
  }

  const dupe = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, req.params.id);
  if (dupe) return res.status(409).json({ message: "Email already in use" });

  db.prepare("UPDATE users SET name = ?, email = ?, address = ?, phone = ? WHERE id = ?").run(
    name.trim(),
    email.trim(),
    address.trim(),
    phone?.trim() || null,
    req.params.id
  );

  res.json(toApi({ ...row, name, email, address, phone }));
});

router.delete("/delete/user/:id", (req, res) => {
  const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Deleted" });
});

app.use("/api", router);

app.get("/", (req, res) => res.json({ status: "ok", service: "userhub-server" }));

export { validate, toApi };
export default app;
