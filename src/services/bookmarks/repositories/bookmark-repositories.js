import {Pool} from "pg";

export default class BookmarkRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async addBookmark({ id, jobId, userId }) {
    const query = `INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3)`;
    await this.#pool.query(query, [id, userId, jobId]);
  }

  async getAllBookmarkByUserId(userId) {
    const query = `SELECT * FROM bookmarks WHERE user_id = $1`;
    const result = await this.#pool.query(query, [userId]);
    return result.rows;
  }

  async getBookmarkById(id) {
    const query = `SELECT * FROM bookmarks WHERE id = $1`;
    const result = await this.#pool.query(query, [id]);

    return result.rows[0];
  }

  async deleteBookmark(jobId) {
    const query = `DELETE FROM bookmarks WHERE job_id = $1`;
    await this.#pool.query(query, [jobId]);
  }
}