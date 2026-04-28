import {Pool} from "pg";
import CacheService from "../../cache/cache-service.js";

export default class ApplicationRepositories {
  #pool;
  #cacheService;

  constructor() {
    this.#pool = new Pool();
    this.#cacheService = new CacheService();
  }

  async getAllApplication() {
    const query = "SELECT * FROM applications";
    const result = await this.#pool.query(query);
    return result.rows;
  }

  async getApplicationById(id) {
    const cacheKey = `application:id:${id}`;

    try {
      const cachedApplication = await this.#cacheService.get(cacheKey);

      if (cachedApplication) {
        return {
          application: JSON.parse(cachedApplication),
          source: "cache"
        };
      }
    } catch (error) {
      console.log("Error fetching from cache:", error);
    }

    const query = "SELECT * FROM applications WHERE id = $1";
    const result = await this.#pool.query(query, [id]);
    const application = result.rows[0];

    if (application) {
      await this.#cacheService.set(cacheKey, JSON.stringify(application), 60 * 60);
    }

    return {
      application,
      source: "database"
    };
  }

  async getApplicationByUserId(userId) {
    const cacheKey = `application:user:${userId}`;

    try {
      const cachedApplications = await this.#cacheService.get(cacheKey);

      if (cachedApplications) {
        return {
          applications: JSON.parse(cachedApplications),
          source: "cache"
        };
      }
    } catch (error) {
      console.error("Error fetching from cache:", error);
    }

    const query = "SELECT * FROM applications WHERE user_id = $1";
    const result = await this.#pool.query(query, [userId]);

    await this.#cacheService.set(cacheKey, JSON.stringify(result.rows), 60 * 60);

    return {
      applications: result.rows,
      source: "database"
    };
  }

  async getApplicationByJobId(jobId) {
    const cacheKey = `application:job:${jobId}`;

    try {
      const cachedApplications = await this.#cacheService.get(cacheKey);

      if (cachedApplications) {
        return {
          applications: JSON.parse(cachedApplications),
          source: "cache"
        };
      }
    } catch (error) {
      console.error("Error fetching from cache:", error);
    }

    const query = "SELECT * FROM applications WHERE job_id = $1";
    const result = await this.#pool.query(query, [jobId]);

    await this.#cacheService.set(cacheKey, JSON.stringify(result.rows), 60 * 60);

    return {
      applications: result.rows,
      source: "database"
    };
  }

  async addApplication({ id, userId, jobId, status }) {
    const query = "INSERT INTO applications (id, user_id, job_id, status) VALUES ($1, $2, $3, $4)";
    await this.#pool.query(query, [id, userId, jobId, status]);

    await this.#cacheService.delete(`application:id:${id}`);
    await this.#cacheService.delete(`application:user:${userId}`);
    await this.#cacheService.delete(`application:job:${jobId}`);
  }

  async updateApplication(id, status) {
    const selectQuery = "SELECT user_id, job_id FROM applications WHERE id = $1";
    const selectResult = await this.#pool.query(selectQuery, [id]);
    const application = selectResult.rows[0];

    const query = "UPDATE applications SET status = $1 WHERE id = $2";
    await this.#pool.query(query, [status, id]);

    await this.#cacheService.delete(`application:id:${id}`);
    await this.#cacheService.delete(`application:user:${application.user_id}`);
    await this.#cacheService.delete(`application:job:${application.job_id}`);
  }

  async deleteApplication(id) {
    const selectQuery = "SELECT user_id, job_id FROM applications WHERE id = $1";
    const selectResult = await this.#pool.query(selectQuery, [id]);
    const application = selectResult.rows[0];

    if (!application) return 0;

    const deleteQuery = "DELETE FROM applications WHERE id = $1";
    const deleteResult = await this.#pool.query(deleteQuery, [id]);

    await this.#cacheService.delete(`application:id:${id}`);
    await this.#cacheService.delete(`application:user:${application.user_id}`);
    await this.#cacheService.delete(`application:job:${application.job_id}`);

    return deleteResult.rowCount;
  }
}