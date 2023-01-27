require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/tienda";

mongoose.set('strictQuery', false);
mongoose.connect(DB_URI)
    .then( db => console.log("Conectado a servidor DB"))
    .catch( error => console.log(error) )

app.use(express.static("public"));
app.use(express.json());

const Articulo = mongoose.model("Articulo",  new mongoose.Schema(
    {
        nombre: {type: String, default: "Sin Nombre"},
        precio: {type: Number, default: 0}
    }
));

app.get("/api/articulos", cors(), (req, res) => {
    Articulo.find(
        {},
        (err, data) => {if (err) res.json(err); else res.json(data)}
    );
});

app.post("/api/articulos", (req, res) => {
    new Articulo(
        {
            nombre: req.body.nombre,
            precio: req.body.precio
        }
    ).save((error, data) => {if (error) res.json(err); else res.json(data)});
});

app.delete("/api/articulos/:id", (req, res) => {
    Articulo.findOneAndRemove(
        { _id: req.params.id },
        (err, data) => {if (err) res.json(err); else res.json(data)}
    );
});

app.put("/api/articulos/:id", (req, res) => {
    Articulo.findOneAndUpdate(
        { _id: req.params.id },
        {$set: { nombre: req.body.nombre, precio: req.body.precio}},
        (err, data) => {if (err) res.json(err); else res.json(data)}
    );
});

app.listen(PORT, () => {console.log("Iniciado servidor web")});

/* let articulos = [{
    nombre: "Camisa",
    precio: 22
}, {
    nombre: "Botas",
    precio: 55
}];

app.get("/api/articulos", (req, res) => { 
    res.json(articulos);
});

app.post("/api/articulos", (req, res) => {
    articulos.push(
        {
            nombre: req.body.nombre,
            precio: req.body.precio
        }
    );
    res.json(articulos);
});

app.delete("/api/articulos/:id", (req, res) => { 
    articulos.splice(req.params.id, 1);
    // articulos = articulos.filter((value, index) => index != req.params.id);
    res.json(articulos);
});

app.put("/api/articulos/:id", (req, res) => { 
    articulos[req.params.id] = req.body;
    res.json(articulos);
}); */

