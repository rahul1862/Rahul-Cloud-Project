import crypto from "node:crypto";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTest = process.env.NODE_ENV === "test";

const db = new DatabaseSync(isTest ? ":memory:" : path.join(__dirname, "userhub.sqlite"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    phone TEXT,
    createdAt TEXT NOT NULL
  )
`);

const SEED = [
  { name: "Aoife Murphy",      email: "aoife.murphy@marenfoods.ie",          address: "14 Wine St, Sligo",          phone: "+353 87 214 5563", daysAgo: 0 },
  { name: "Cian Doyle",        email: "cian.doyle@marenfoods.ie",            address: "47 Dawson St, Dublin",       phone: "",                 daysAgo: 2 },
  { name: "Niamh Healy",       email: "niamh.healy@marenfoods.ie",           address: "9 Main St, Waterford",       phone: "+353 85 330 9981", daysAgo: 5 },
  { name: "Sean Walsh",        email: "sean.walsh@marenfoods.ie",            address: "6 George's St, Cork",        phone: "",                 daysAgo: 18 },
  { name: "Roisin Kavanagh",   email: "roisin.kavanagh@marenfoods.ie",       address: "2 Castle St, Kilkenny",      phone: "+353 86 770 2214", daysAgo: 41 },

  { name: "Conor Ryan",        email: "conor.ryan@brightsidecapital.com",    address: "31 Quay St, Galway",         phone: "+353 89 442 0087", daysAgo: 1 },
  { name: "Saoirse Gallagher", email: "saoirse.gallagher@brightsidecapital.com", address: "19 William St, Limerick", phone: "",               daysAgo: 7 },
  { name: "Eoin Fallon",       email: "eoin.fallon@brightsidecapital.com",   address: "63 Mary St, Dublin",         phone: "+353 83 118 6645", daysAgo: 12 },
  { name: "Caoimhe McCarthy",  email: "caoimhe.mccarthy@brightsidecapital.com", address: "8 North Main St, Cork",   phone: "",                 daysAgo: 29 },
  { name: "Liam Brennan",      email: "liam.brennan@brightsidecapital.com",  address: "12 Baggot St, Dublin",       phone: "+353 87 905 3321", daysAgo: 63 },

  { name: "Aisling Fitzgerald", email: "aisling.fitzgerald@kilbrideandco.ie", address: "4 Grafton St, Dublin",      phone: "",                 daysAgo: 3 },
  { name: "Darragh Nolan",     email: "darragh.nolan@kilbrideandco.ie",      address: "88 Patrick St, Cork",        phone: "+353 85 661 4470", daysAgo: 9 },
  { name: "Orla Quinn",        email: "orla.quinn@kilbrideandco.ie",         address: "21 O'Connell St, Limerick",  phone: "",                 daysAgo: 22 },
  { name: "Ruairi Whelan",     email: "ruairi.whelan@kilbrideandco.ie",      address: "3 Shop St, Galway",          phone: "+353 86 229 7783", daysAgo: 54 },
  { name: "Maeve Lynch",       email: "maeve.lynch@kilbrideandco.ie",        address: "57 High St, Kilkenny",       phone: "",                 daysAgo: 88 },

  { name: "Tadhg Maher",       email: "tadhg.maher@northgatelogistics.com",  address: "14 Wine St, Sligo",          phone: "+353 87 552 0193", daysAgo: 4 },
  { name: "Sinead Hogan",      email: "sinead.hogan@northgatelogistics.com", address: "9 Main St, Waterford",       phone: "",                 daysAgo: 11 },
  { name: "Cormac O'Brien",    email: "cormac.obrien@northgatelogistics.com", address: "47 Dawson St, Dublin",      phone: "+353 89 304 7762", daysAgo: 25 },
  { name: "Grainne Daly",      email: "grainne.daly@northgatelogistics.com", address: "6 George's St, Cork",        phone: "",                 daysAgo: 47 },
  { name: "Fionn Connolly",    email: "fionn.connolly@northgatelogistics.com", address: "31 Quay St, Galway",       phone: "+353 83 671 0028", daysAgo: 95 },

  { name: "Erin Naughton",     email: "erin.naughton@verityhealth.ie",       address: "2 Castle St, Kilkenny",      phone: "",                 daysAgo: 0 },
  { name: "Diarmuid Power",    email: "diarmuid.power@verityhealth.ie",      address: "19 William St, Limerick",    phone: "+353 85 117 4456", daysAgo: 6 },
  { name: "Clodagh Phelan",    email: "clodagh.phelan@verityhealth.ie",      address: "63 Mary St, Dublin",         phone: "",                 daysAgo: 15 },
  { name: "Padraig Greene",    email: "padraig.greene@verityhealth.ie",      address: "8 North Main St, Cork",      phone: "+353 86 884 2210", daysAgo: 36 },
  { name: "Cathal Brophy",     email: "cathal.brophy@verityhealth.ie",       address: "12 Baggot St, Dublin",       phone: "",                 daysAgo: 71 },

  { name: "Niall Roche",       email: "niall.roche@lakeshorestudio.com",     address: "4 Grafton St, Dublin",       phone: "+353 87 330 6692", daysAgo: 2 },
  { name: "Eabha Cullen",      email: "eabha.cullen@lakeshorestudio.com",    address: "88 Patrick St, Cork",        phone: "",                 daysAgo: 8 },
  { name: "Senan Dunne",       email: "senan.dunne@lakeshorestudio.com",     address: "21 O'Connell St, Limerick",  phone: "+353 85 778 3341", daysAgo: 19 },
  { name: "Aoibhinn Curran",   email: "aoibhinn.curran@lakeshorestudio.com", address: "3 Shop St, Galway",          phone: "",                 daysAgo: 44 },
  { name: "Ronan Sweeney",     email: "ronan.sweeney@lakeshorestudio.com",   address: "57 High St, Kilkenny",       phone: "+353 89 226 1175", daysAgo: 102 },

  { name: "Ciara Buckley",     email: "ciara.buckley@ashfordpartners.ie",    address: "14 Wine St, Sligo",          phone: "",                 daysAgo: 1 },
  { name: "Brian Mullen",      email: "brian.mullen@ashfordpartners.ie",     address: "9 Main St, Waterford",       phone: "+353 86 412 0857", daysAgo: 10 },
  { name: "Aine Shanahan",     email: "aine.shanahan@ashfordpartners.ie",    address: "47 Dawson St, Dublin",       phone: "",                 daysAgo: 26 },
  { name: "Eamon Foley",       email: "eamon.foley@ashfordpartners.ie",      address: "6 George's St, Cork",        phone: "+353 83 905 6612", daysAgo: 58 },
  { name: "Roisin Casey",      email: "roisin.casey@ashfordpartners.ie",     address: "31 Quay St, Galway",         phone: "",                 daysAgo: 84 },

  { name: "Killian Burke",     email: "killian.burke@greenfieldanalytics.com", address: "2 Castle St, Kilkenny",    phone: "+353 87 661 9943", daysAgo: 0 },
  { name: "Sorcha Egan",       email: "sorcha.egan@greenfieldanalytics.com", address: "19 William St, Limerick",    phone: "",                 daysAgo: 5 },
  { name: "Donal Keane",       email: "donal.keane@greenfieldanalytics.com", address: "63 Mary St, Dublin",         phone: "+353 85 220 4487", daysAgo: 13 },
  { name: "Aoife Reidy",       email: "aoife.reidy@greenfieldanalytics.com", address: "8 North Main St, Cork",      phone: "",                 daysAgo: 31 },
  { name: "Cathal Dwyer",      email: "cathal.dwyer@greenfieldanalytics.com", address: "12 Baggot St, Dublin",      phone: "+353 86 773 1259", daysAgo: 67 },
];

const count = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
if (count === 0 && !isTest) {
  const insert = db.prepare(
    "INSERT INTO users (id, name, email, address, phone, createdAt) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const now = Date.now();
  for (const u of SEED) {
    insert.run(
      crypto.randomUUID(),
      u.name,
      u.email,
      u.address,
      u.phone || null,
      new Date(now - u.daysAgo * 86400000).toISOString()
    );
  }
}

export default db;
