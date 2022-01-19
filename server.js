const { dqpb } = require("cli-spinners");
const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "tinaroot",
    database: "movie_db",
  },
  console.log(`Connected to the movie_db database.`)
);

// GET request for movies
app.get("/api/movies", (req, res) => {
  // Send a message to the client
  res.json(`${req.method} request received to get movies`);
  // Log our request to the terminal
  console.info(`${req.method} request received to get movies`);
  // Query database
  db.query("SELECT * FROM movies", (err, results) => console.table(results));
});

// POST request to add movie to database
app.post("/api/add-movie", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a movie`);

  // Destructuring the body
  const { title } = req.body;

  if (title) {
    const newMovie = {
      title,
    };
    db.query(
      `INSERT INTO movies (title) VALUES (?)`,
      newMovie.title,
      function (err, results) {
        console.log(
          `${newMovie.title} was successfully added to the movies table.`
        );
      }
    );
    const response = {
      status: "success",
      body: newMovie,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting movie");
  }
});

// GET request for reviews
app.get("/api/:movie/reviews", (req, res) => {
  // Send a message to the client
  res.json(`${req.method} request received to get reviews`);
  // Log our request to the terminal
  console.info(`${req.method} request received to get reviews`);
  const movie = req.params["movie"];
  db.query(
    `SELECT movies.id FROM movies WHERE title = ?`,
    movie,
    function (err, results) {
      const movieID = results[0].id;
      console.log(movieID);
      // Query database
      db.query(
        "SELECT reviews.review, movies.title FROM reviews JOIN movies ON reviews.movie_id = ? WHERE movies.id = ?",
        [movieID, movieID],
        (err, results) => console.table(results)
      );
    }
  );
});
// POST request to add movie to database
app.post('/api/update-review', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring the body
  const { movie_id, review } = req.body;

  if (movie_id && review) {
    const newReview = {
      movie_id,
      review,
    };
    db.query(
      `INSERT INTO reviews (movie_id, review) VALUES (?,?)`,
      [newReview.movie_id, newReview.review],
      function (err, results) {
        console.log(
          `${newReview.review} was successfully added to the reviews table for the movie id: ${newReview.movie_id}.`
        );
      }
    );
    const response = {
      status: "success",
      body: newReview,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting review");
  }
});

// DELETE request to delete movie from database
app.delete('/api/movie/:id', (req, res) => {
// Log that a DELETE request was received
console.info(`${req.method} request received to delete a movie`);
const movieID = req.params['id'];
if(movieID){
db.query(`DELETE FROM movies WHERE movies.id = ?`, movieID, (err, results) => {
  console.log(`Movie with the id of ${movieID} was successfully deleted.`);
});
const response = {
  status: "success",
  body: movieID,
};

console.log(response);
res.status(201).json(response);
}else {
  res.status(500).json("Error in deleting movie");
}
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
