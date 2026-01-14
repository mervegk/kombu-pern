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
export const addArtist = async (req, res) => {
  const { name, description, birth_date, birth_year_start, birth_year_end, death_date, death_year_start, death_year_end, image } = req.body;

  const createArtist = await pool.query(`
      INSERT INTO artists (name, description, birth_date, birth_year_start, birth_year_end, death_date, death_year_start, death_year_end, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
      `, [name, description, birth_date, birth_year_start, birth_year_end, death_date, death_year_start, death_year_end, image])

  res.status(200).json({ success: true, data: createArtist.rows[0] });
  try {

  } catch (err) {
    console.error(err);
  }
}