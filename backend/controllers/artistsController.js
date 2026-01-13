import pool from '../db.js'

export const getArtists = async (req, res) => {
  try {
    const artists = await pool.query(`
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
      GROUP BY a.id
    `);

    res.json(artists.rows);
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

    res.json(artist.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}