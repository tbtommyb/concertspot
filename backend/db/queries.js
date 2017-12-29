const conn = require("./connection");

async function getGenreList() {
    const result = await conn.query(
        `SELECT DISTINCT genres.name
                FROM artist_genres genres
                ORDER BY genres.name;`);
    return result.rows.map(genre => genre.name);
}

async function getGenresForArtist(artist) {
    const result = await conn.query(
        `SELECT genres.name, genres.weighting
                FROM artists
                INNER JOIN artist_genres genres
                ON artists.id = genres.artist_id
                WHERE LOWER(artists.name) = LOWER($1)
                AND genres.weighting >= 0.2
                ORDER BY genres.weighting DESC;`, [artist]);
    return result.rows;
}

module.exports = {
  getGenreList,
  getGenresForArtist
};
