import {Pool} from "pg";
import CacheService from "../../cache/cache-service.js";

export default class BookmarkRepositories {
  #pool;
  #cacheService;

  constructor() {
    this.#pool = new Pool();
    this.#cacheService = new CacheService();
  }

  async addBookmark({ id, jobId, userId }) {
    const query = `INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3)`;
    await this.#pool.query(query, [id, userId, jobId]);

    await this.#cacheService.delete(`bookmark:${id}`);
    await this.#cacheService.delete(`bookmark:${userId}`);
  }

  async getAllBookmarkByUserId(userId) {
    const cacheKey = `bookmark:user:${userId}`;

    try {
      const bookmarks = await this.#cacheService.get(cacheKey);

      if (bookmarks) {
        return {
          bookmarks: JSON.parse(bookmarks),
          source: "cache"
        };
      }
    } catch(error) {
      const query = `SELECT * FROM bookmarks WHERE user_id = $1`;
      const result = await this.#pool.query(query, [userId]);

      await this.#cacheService.set(cacheKey, JSON.stringify(result.rows), 60 * 60);

      return {
        bookmarks: result.rows,
        source: "database"
      };
    }
  }

  async getBookmarkById(id, jobId, userId) {
    const cacheKey = `bookmark:${id}`;

    try {
      const cachedBookmark = await this.#cacheService.get(cacheKey);

      if (cachedBookmark) {
        const bookmark = JSON.parse(cachedBookmark);

        if (bookmark?.job_id === jobId && bookmark?.user_id === userId) {
          return bookmark;
        }
      }
    } catch (error) {
      // Cache miss should fall back to DB lookup.
    }

    const query = `SELECT * FROM bookmarks WHERE id = $1 AND job_id = $2 AND user_id = $3`;
    const result = await this.#pool.query(query, [id, jobId, userId]);
    const bookmark = result.rows[0];

    if (bookmark) {
      await this.#cacheService.set(cacheKey, JSON.stringify(bookmark), 60 * 60);
    }

    return bookmark;
  }

  async deleteBookmark(jobId, userId) {
    const query = `DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id`;
    const result = await this.#pool.query(query, [jobId, userId]);

    for (const bookmark of result.rows) {
      await this.#cacheService.delete(`bookmark:${bookmark.id}`);
    }

    await this.#cacheService.delete(`bookmark:user:${userId}`);

    return result.rowCount;
  }
}