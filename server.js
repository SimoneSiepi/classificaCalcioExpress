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
//console.log(squadre);

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
  res.render("index", { squadre });
});

app.post("/calcoloClassifica",(req,res)=>{
  const { squadraCasa, squadraOspite, goalCasa, goalOspite } = req.body;
  const indexCasa=squadre.findIndex((team)=> team.nomeSquadra===squadraCasa);
  const indexOspite=squadre.findIndex((team)=> team.nomeSquadra===squadraOspite);
  if (goalCasa>goalOspite) {
    squadre[indexCasa].punti+=3;
  }else if (goalOspite>goalCasa) {
    squadre[indexOspite].punti+=3;
  }else if (goalCasa==goalOspite) {
    squadre[indexCasa].punti+=1;
    squadre[indexOspite].punti+=1;
  }
  save();
  res.render("index",{  squadre });
});

app.get("/classifica", (req,res)=>{
  res.render("classifica",{ squadre })
});

app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
