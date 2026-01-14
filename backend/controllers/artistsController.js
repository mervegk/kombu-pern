import pool from '../db.js';

export const getArtists = async (req, res) => {
  try {
    const artists = await pool.query(`
      SELECT
        a.id,
        a.name,
        a.description,
        a.birth_date,
        a.birth_year_start,
        a.birth_year_end,
        a.death_date,
        a.death_year_start,
        a.death_year_end,
        a.image,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', w.id,
              'name', w.name,
              'work_date', w.work_date,
              'work_year_start', w.work_year_start,
              'work_year_end', w.work_year_end
            )
          ) FILTER (WHERE w.id IS NOT NULL),
          '[]'
        ) AS works
      FROM artists a
      LEFT JOIN artist_works aw ON aw.artist_id = a.id
      LEFT JOIN works_of_arts w ON w.id = aw.work_of_art_id
      GROUP BY a.id
    `);

    res.status(200).json({ success: true, data: artists.rows });

  } catch (err) {
    console.log(err.message);
  }
}

export const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    const artist = await pool.query(`
      SELECT
        a.id,
        a.name,
        a.birth_date,
        a.birth_year_start,
        a.birth_year_end,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', w.id,
              'name', w.name,
              'work_date', w.work_date,
              'work_year_start', w.work_year_start,
              'work_year_end', w.work_year_end
            )
          ) FILTER (WHERE w.id IS NOT NULL),
          '[]'
        ) AS works

      FROM artists a
      LEFT JOIN artist_works aw ON aw.artist_id = a.id
      LEFT JOIN works_of_arts w ON w.id = aw.work_of_art_id
      WHERE a.id = $1
      GROUP BY a.id
    `, [id]);

    res.status(200).json({ success: true, data: artist.rows[0] });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Create
export const createArtist = async (req, res) => {
  try {
    const {
      name,
      description,
      birth_date,
      birth_year_start,
      birth_year_end,
      death_date,
      death_year_start,
      death_year_end,
      image } = req.body;

    const addArtist = await pool.query(`
        INSERT INTO artists (name, description, birth_date, birth_year_start, birth_year_end, death_date, death_year_start, death_year_end, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
        `, [
      name,
      description,
      birth_date,
      birth_year_start,
      birth_year_end,
      death_date,
      death_year_start,
      death_year_end,
      image]);

    res.status(200).json({ success: true, data: addArtist.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

//Update
export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,
      description,
      birth_date,
      birth_year_start,
      birth_year_end,
      death_date,
      death_year_start,
      death_year_end,
      image } = req.body;

    const editArtist = await pool.query(`
        UPDATE artists
        SET 
        name=$1, description=$2, birth_date=$3, birth_year_start=$4, birth_year_end=$5, death_date=$6, death_year_start=$7, death_year_end=$8, image=$9
        WHERE id=$10
      `, [
      name,
      description,
      birth_date,
      birth_year_start,
      birth_year_end,
      death_date,
      death_year_start,
      death_year_end,
      image,
      id
    ])

    res.status(200).json({ success: true, message: 'Artist was updated successfully' })

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

//Delete
export const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const removeArtWork = await pool.query(`DELETE FROM artists WHERE id = $1`, [id]);
    res.status(200).json({ success: 200, message: "Artist was deleted successfully" })

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}