import {Pool} from "pg";

export default class ApplicationRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async getAllApplication() {
    const query = "SELECT * FROM applications";
    const result = await this.#pool.query(query);
    return result.rows;
  }

  async getApplicationById(id) {
    const query = "SELECT * FROM applications WHERE id = $1";
    const result = await this.#pool.query(query, [id]);
    return result.rows[0];
  }

  async getApplicationByUserId(userId) {
    const query = "SELECT * FROM applications WHERE user_id = $1";
    const result = await this.#pool.query(query, [userId]);
    return result.rows;
  }

  async getApplicationByJobId(jobId) {
    const query = "SELECT * FROM applications WHERE job_id = $1";
    const result = await this.#pool.query(query, [jobId]);
    return result.rows;
  }

  async addApplication({ id, userId, jobId, status }) {
    const query = "INSERT INTO applications (id, user_id, job_id, status) VALUES ($1, $2, $3, $4)";
    await this.#pool.query(query, [id, userId, jobId, status]);
  }

  async updateApplication(id, status) {
    const query = "UPDATE applications SET status = $1 WHERE id = $2";
    await this.#pool.query(query, [status, id]);
  }

  async deleteApplication(id) {
    const query = "DELETE FROM applications WHERE id = $1";
    await this.#pool.query(query, [id]);
  }
}