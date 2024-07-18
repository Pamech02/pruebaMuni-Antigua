const express = require('express');
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password:"",
  database: "muni",
  port: 3306
});

db.connect((err) => {
    if (err) {
      console.error('error connecting to the database:', err.stack);
      return;
    }
    console.log('connected to the database');
  });

app.post('/create', (req, res) => {
   const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const tipo = req.body.tipo;
    const edad = req.body.edad;

    console.log(nombre, apellido, tipo)

    db.query(
        "INSERT INTO estudiantes (nombre, apellido, tipo_estudiante, edad) VALUES (?,?,?,?)",
        [nombre, apellido, tipo, edad],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error inserting values');
            } else {
                res.status(200).send("Values Inserted");
            }
        }
      );
});

app.get("/estudiantes", (req, res) => {
    db.query("SELECT * FROM estudiantes", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

  app.get("/estudiante/:id", (req, res) => {
    const estudianteId = req.params.id; // Obtener el ID del parámetro de la URL
    console.log(estudianteId)
    db.query("SELECT * FROM estudiantes WHERE estudiante_id = ?", [estudianteId], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al obtener el estudiante");
      } else {
        if (result.length > 0) {
          res.send(result[0]); // Devuelve el primer (y debería ser único) resultado encontrado
        } else {
          res.status(404).send("Estudiante no encontrado");
        }
      }
    });
  });
  

  app.put("/update", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const tipo = req.body.tipo;
    const edad = req.body.edad;
    db.query(
      "UPDATE estudiantes SET nombre = ?, apellido = ?, tipo_estudiante = ?, edad = ? WHERE estudiante_id = ?",
      [nombre, apellido, tipo, edad, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
  
  app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM estudiantes WHERE estudiante_id = ?", id, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});









// app.get('/', (req, res) => {
    // const nombre = req.body.nombre;
    // const apellido = req.body.apellido;
    // const tipo = req.body.tipo;
    // const edad = req.body.edad;

    // console.log(nombre, apellido, tipo)
  
   
//     res.send('hola')
//   });

// app.listen(3301,()=>{
//     console.log('Servidor en linea')
// })