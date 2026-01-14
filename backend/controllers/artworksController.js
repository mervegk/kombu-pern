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
    console.error(err.message);
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
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

//Create
export const addArtWork = async (req, res) => {
  try {
    const {
      name,
      description,
      work_date,
      work_year_start,
      work_year_end,
      artists,
      picture
    } = req.body;

    const createArtWork = await pool.query(`
      INSERT INTO works_of_arts
        (name, description, work_date, work_year_start, work_year_end, picture)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [name, description, work_date, work_year_start, work_year_end, picture]);

    const insertedId = createArtWork.rows[0].id;

    if (artists?.length > 0) {
      for (let i = 0; i < artists.length; i++) {
        await pool.query(`
          INSERT INTO artist_works (artist_id, work_of_art_id)
          VALUES ($1, $2)
        `, [artists[i].id, insertedId]);
      }
    }

    res.json({ success: true, data: createArtWork.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

//Update
export const updateArtWork = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      work_date,
      work_year_start,
      work_year_end,
      picture } = req.body;

    const editArtWork = await pool.query(`
      UPDATE works_of_arts 
      SET 
      name = $1, description = $2, work_date = $3, work_year_start = $4, work_year_end = $5, picture = $6
      WHERE id = $7
    `, [
      name,
      description,
      work_date,
      work_year_start,
      work_year_end,
      picture,
      id
    ]);

    res.status(200).json({ success: true, message: 'Art work was updated successfully' })

  } catch (err) {
    console.error(err.error);
    res.status(400).json({ success: false, error: err.message });
  }
}

//Delete
export const deleteArtWork = async (req, res) => {
  try {
    const { id } = req.params;
    const removeArtWork = await pool.query(`DELETE FROM works_of_arts WHERE id = $1`, [id]);
    res.status(200).json({ success: 200, message: "Art work was deleted successfully" })

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}