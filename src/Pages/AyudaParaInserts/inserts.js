const mysql = require("mysql2");
const genres = require("./genres");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ROOT",
  database: "proyectomanga",
});

const getMangaIdByTitle = (title) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT ID_manga FROM Manga WHERE titulo = ?",
      [title],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.length > 0) {
          resolve(results[0].ID_manga);
        } else {
          reject(new Error(`Manga con título ${title} no encontrado`));
        }
      }
    );
  });
};

const getGeneroIdByName = (name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT ID_Genero FROM Genero WHERE name = ?",
      [name],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results.length > 0) {
          resolve(results[0].ID_Genero); 
        } else {
          reject(new Error(`Género con nombre ${name} no encontrado`));
        }
      }
    );
  });
};

const insertMangaGenero = (mangaId, generoId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO MangaGenero (ID_manga, ID_genero) VALUES (?, ?)",
      [mangaId, generoId],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      }
    );
  });
};

const insertData = async () => {
  for (const [genero, mangas] of Object.entries(genres)) {
    try {
      const generoId = await getGeneroIdByName(genero);

      for (const manga of mangas) {
        try {
          const mangaId = await getMangaIdByTitle(manga);

          await insertMangaGenero(mangaId, generoId);
          console.log(`Relación insertada para ${manga} con género ${genero}`);
        } catch (error) {
          console.error(
            `Error al insertar el manga ${manga}: ${error.message}`
          );
        }
      }
    } catch (error) {
      console.error(
        `Error al obtener el ID del género ${genero}: ${error.message}`
      );
    }
  }
};
insertData()
  .then(() => {
    console.log("Inserciones completadas");
    connection.end();
  })
  .catch((error) => {
    console.error("Error en el proceso de inserción:", error);
    connection.end();
  });
