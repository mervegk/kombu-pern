import pool from "../db.js";

//Get All
export const getArtWorks = async (req, res) => {
  try {
    const artWorks = await pool.query(`
      SELECT
        w.id,
        w.name,
        w.description,
        w.work_date,
        w.work_year_start,
        w.work_year_end,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', a.id,
              'name', a.name,
              'birth_date', a.birth_date,
              'birth_year_start', a.birth_year_start,
              'birth_year_end', a.birth_year_end
            )
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS artists
      FROM works_of_arts w
      LEFT JOIN artist_works aw ON aw.work_of_art_id = w.id
      LEFT JOIN artists a ON a.id = aw.artist_id
      GROUP BY w.id;
    `);

    res.status(200).json({ success: true, data: artWorks.rows });

  } catch (err) {
    console.log(err.message);
  }
}

//Get Single
export const getartWorkById = async (req, res) => {
  try {
    const { id } = req.params;

    const artWork = await pool.query(`
        SELECT
        w.id,
        w.name,
        w.description,
        w.work_date,
        w.work_year_start,
        w.work_year_end,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', a.id,
              'name', a.name,
              'birth_date', a.birth_date,
              'birth_year_start', a.birth_year_start,
              'birth_year_end', a.birth_year_end
            )
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS artists
      FROM works_of_arts w
      LEFT JOIN artist_works aw ON aw.work_of_art_id = w.id
      LEFT JOIN artists a ON a.id = aw.artist_id
      WHERE w.id = $1
      GROUP BY w.id;
    `, [id]);

    res.status(200).json({ success: true, data: artWork.rows[0] });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}