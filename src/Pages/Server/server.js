const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./connection");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 5000;
const { body, validationResult } = require("express-validator");
const SECRET_KEY = "clave_secreta_para_jwt";

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Token recibido:", token);
  if (!token) return res.status(401).send("Acceso denegado");

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Error verificando token:", err);
      return res.status(403).send("Token inválido");
    }
    req.user = user;
    next();
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  res.send(`Hola, ${req.user.nombreUsuario}. Esta es una ruta protegida.`);
});

app.use(bodyParser.json());
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.post("/check-user", (req, res) => {
  const { email, nombreUsuario } = req.body;

  db.query(
    "SELECT * FROM usuario WHERE email = ? OR NombreUsuario = ?",
    [email, nombreUsuario],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error en el servidor");
      }
      if (results.length > 0) {
        return res.status(200).json({ exists: true });
      }
      res.status(200).json({ exists: false });
    }
  );
});

app.post("/register", (req, res) => {
  const { email, nombreUsuario, password } = req.body;

  db.query(
    "SELECT * FROM usuario WHERE email = ? OR NombreUsuario = ?",
    [email, nombreUsuario],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error en el servidor");
      }
      if (results.length > 0) {
        return res.status(400).json({ exists: true });
      }

      db.query(
        "INSERT INTO usuario (email, NombreUsuario, password) VALUES (?, ?, ?)",
        [email, nombreUsuario, password],
        (err) => {
          if (err) {
            return res.status(500).send("Error al registrar el usuario");
          }
          res.status(200).send("Usuario registrado con éxito");
        }
      );
    }
  );
});

app.post(
  "/login",
  [
    body("NombreUsuario")
      .isLength({ min: 1 })
      .withMessage("El nombre de usuario o correo es obligatorio"),
    body("password")
      .isLength({ min: 1 })
      .withMessage("La contraseña es obligatoria"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { NombreUsuario, password } = req.body;
    console.log("Datos recibidos:", NombreUsuario, password);

    db.query(
      "SELECT * FROM usuario WHERE NombreUsuario = ? OR email = ?",
      [NombreUsuario, NombreUsuario],
      (err, results) => {
        if (err) {
          console.error("Error en el servidor:", err);
          return res.status(500).send("Error en el servidor");
        }

        console.log("Resultados de la consulta:", results);

        if (results.length === 0) {
          console.log("Usuario no encontrado");
          return res.status(401).send("Usuario o contraseña incorrectos");
        }

        const user = results[0];
        if (user.password !== password) {
          console.log("Contraseña incorrecta para el usuario:", NombreUsuario);
          return res.status(401).send("Usuario o contraseña incorrectos");
        }

        const token = jwt.sign(
          { userId: user.ID_Usuario, nombreUsuario: user.NombreUsuario },
          SECRET_KEY,
          { expiresIn: "1h" }
        );
        console.log("Inicio de sesión exitoso para:", user.NombreUsuario);
        res.status(200).json({
          token,
          nombre: user.NombreUsuario,
        });
      }
    );
  }
);

app.get("/search/manga", (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res
      .status(400)
      .json({ error: "El parámetro 'search' es requerido." });
  }

  const sql = `SELECT ID_manga, titulo, ID_portada FROM manga WHERE titulo LIKE ?`;
  const queryParam = `${searchQuery}%`;

  db.query(sql, [queryParam], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    res.json(results);
  });
});


app.get("/advanced-search", (req, res) => {
  const genres = req.query.genres;

  if (!genres) {
    return res
      .status(400)
      .json({ error: "El parámetro 'genres' es requerido." });
  }

  const genreList = genres.split(",");
  const placeholders = genreList.map(() => "?").join(",");

  const sql = `
    SELECT DISTINCT m.ID_manga, m.titulo, m.ID_portada
    FROM manga m
    JOIN mangagenero gm ON m.ID_manga = gm.ID_manga
    JOIN genero g ON gm.ID_genero = g.ID_genero
    WHERE g.name IN (${placeholders})
    GROUP BY m.ID_manga
    HAVING COUNT(DISTINCT g.name) = ?
  `;

  db.query(sql, [...genreList, genreList.length], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
    res.json(results);
  });
});

app.get("/profile", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.query(
    "SELECT NombreUsuario, Bio, EXP FROM usuario WHERE ID_Usuario = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error en el servidor" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(results[0]);
    }
  );
});

app.get("/manga/:id", (req, res) => {
  const mangaId = req.params.id;

  db.query(
    "SELECT titulo, title, sinopsis, serializacion, ID_Portada FROM manga WHERE ID_manga = ?",
    [mangaId],
    (err, results) => {
      if (err) {
        console.error("Error en el servidor:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Manga no encontrado" });
      }

      const manga = results[0];

      db.query(
        "SELECT g.name FROM Genero g JOIN MangaGenero mg ON g.ID_Genero = mg.ID_Genero WHERE mg.ID_manga = ?",
        [mangaId],
        (err, genreResults) => {
          if (err) {
            console.error("Error al obtener géneros:", err);
            return res.status(500).json({ error: "Error al obtener géneros" });
          }

          const genres = genreResults.map((row) => row.name);
          res.status(200).json({
            ...manga,
            genres: genres,
          });
        }
      );
    }
  );
});

app.put("/profile/update", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { bio } = req.body;

  db.query(
    "UPDATE usuario SET Bio = ? WHERE ID_Usuario = ?",
    [bio, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Error en el servidor" });
      }
      res.json({ message: "Bio actualizada con éxito" });
    }
  );
});

app.get("/mangas", (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = (parseInt(req.query.page) || 0) * limit;
  db.query(
    "SELECT ID_manga, titulo, title, ID_Portada FROM manga LIMIT ? OFFSET ?",
    [limit, offset],
    (err, results) => {
      if (err) {
        console.error("Error en el servidor:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No se encontraron mangas." });
      }

      const mangas = results;

      const mangaIds = mangas.map((manga) => manga.ID_manga);

      db.query(
        `SELECT mg.ID_manga, g.name 
         FROM Genero g 
         JOIN MangaGenero mg ON g.ID_Genero = mg.ID_Genero 
         WHERE mg.ID_manga IN (?)`,
        [mangaIds],
        (err, genreResults) => {
          if (err) {
            console.error("Error al obtener géneros:", err);
            return res.status(500).json({ error: "Error al obtener géneros" });
          }
          const genresByManga = mangaIds.reduce((acc, id) => {
            acc[id] = genreResults
              .filter((genre) => genre.ID_manga === id)
              .map((genre) => genre.name);
            return acc;
          }, {});
          const mangasWithGenres = mangas.map((manga) => ({
            ...manga,
            genres: genresByManga[manga.ID_manga] || [],
          }));

          res.status(200).json({ mangas: mangasWithGenres });
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
