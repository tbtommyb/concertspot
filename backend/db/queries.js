const conn = require("./connection");

const getGenreList = (cb) => {
    conn.query(`SELECT DISTINCT genres.name
                FROM artist_genres genres
                ORDER BY genres.name;`,
        (err, result) => {
            if(err) return cb(err);
            cb(null, result.rows.map(genre => genre.name));
        });
};

const getGenresForArtist = (artist, cb) => {
    conn.query(`SELECT genres.name, genres.weighting
                FROM artists
                INNER JOIN artist_genres genres
                ON artists.id = genres.artist_id
                WHERE LOWER(artists.name) = LOWER($1)
                AND genres.weighting >= 0.2
                ORDER BY genres.weighting DESC;`,
    [artist], (err, result) => {
        if(err) return cb(err);
        cb(null, result.rows);
    });
};

module.exports = {
  getGenreList,
  getGenresForArtist
};
