import {Pool} from "pg";

export default class JobRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async addJob(payload) {
    const query = `INSERT INTO jobs (
        id,
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`;

    const values = [
      payload.id,
      payload.company_id,
      payload.category_id,
      payload.title,
      payload.description,
      payload.job_type,
      payload.experience_level,
      payload.location_type,
      payload.location_city,
      payload.salary_min,
      payload.salary_max,
      payload.is_salary_visible,
      payload.status,
    ];

    await this.#pool.query(query, values);
  }

  async getJobById(id) {
    const query = "SELECT * FROM jobs WHERE id = $1";
    const values = [id];
    const result = await this.#pool.query(query, values);
    return result.rows[0];
  }

  async getAllJob({ title, companyName } = {}) {
    const whereClauses = [];
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      whereClauses.push(`j.title ILIKE $${values.length}`);
    }

    if (companyName) {
      values.push(`%${companyName}%`);
      whereClauses.push(`c.name ILIKE $${values.length}`);
    }

    const whereSql = whereClauses.length > 0
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const query = `
      SELECT j.*
      FROM jobs j
      JOIN companies c ON c.id = j.company_id
      ${whereSql}
    `;

    const result = await this.#pool.query(query, values);
    return result.rows;
  }

  async getJobByCompanyId(jobCompanyId) {
    const query = "SELECT * FROM jobs WHERE company_id = $1";
    const values = [jobCompanyId];
    const result = await this.#pool.query(query, values);
    return result.rows;
  }

  async getJobByCategoryId(jobCategoryId) {
    const query = "SELECT * FROM jobs WHERE category_id = $1";
    const values = [jobCategoryId];
    const result = await this.#pool.query(query, values);
    return result.rows;
  }

  async updateJob(id, payload) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    values.push(id);

    const query = `UPDATE jobs
    SET ${fields.join(", ")} 
    WHERE id = $${index}
  `;

    const result = await this.#pool.query(query, values);
    return result.rows[0];
  }

  async deleteJob(id) {
    const query = "DELETE FROM jobs WHERE id = $1";
    const values = [id];

    await this.#pool.query(query, values);
  }
}