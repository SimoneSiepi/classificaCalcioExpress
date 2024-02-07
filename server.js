const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const filePath = "dati.json";

function fileExists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      //controlla se l'errore è dovuto alla mancanza del file
      return false;
    } else {
      throw error;
    }
  }
}

function read() {
  try {
    if (fileExists(filePath)) {
      const datiJson = fs.readFileSync(filePath, "utf-8");
      //console.log("dati json"+datiJson)
      return JSON.parse(datiJson);
    } else {
      // Il file non esiste, crea un nuovo file con dati predefiniti
      const defaultData = {
        squadre: [
          { squadra: "Atalanta", punti: 0 },
          { squadra: "Fiorentina", punti: 0 },
          // Aggiungi altre squadre secondo necessità
        ],
      };
      write(defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Errore durante la lettura del file:", error);
    return [];
  }
}

function write(datiJson) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(datiJson, null, 1), "utf-8");
  } catch (error) {
    console.error("Errore durante la scrittura del file:", error);
  }
}

function save() {
  write(squadre);
}

const squadre = read();
console.log(squadre);

app.set("view engine", "pug");
app.set("views", "./views");

//midleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname, "public", "img")));
app.use(express.static(path.join(__dirname, "public", "script")));

//root
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/form_calcio", (req, res) => {
  res.render("form", { squadre: squadre.squadre });
});

app.post("/calcoloClassifica",(req,res)=>{
  
});

app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
