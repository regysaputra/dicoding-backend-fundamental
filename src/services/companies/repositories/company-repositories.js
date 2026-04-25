import {Pool} from "pg";

export default class CompanyRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async addCompany({ id, name, location, description }) {
    const query = "INSERT INTO companies (id, name, location, description) VALUES ($1, $2, $3, $4)";
    const values = [id, name, location, description];
    await this.#pool.query(query, values);
  }

  async getCompanyById(id) {
    const query = "SELECT * FROM companies WHERE id = $1";
    const values = [id];
    const result = await this.#pool.query(query, values);
    return result.rows[0];
  }

  async getCompanyByNameAndLocation(name, location) {
    const query = "SELECT * FROM companies WHERE LOWER(name) = LOWER($1) AND LOWER(location) = LOWER($2)";
    const values = [name, location];

    const result = await this.#pool.query(query, values);
    return result.rows;
  }

  async getAllCompanies() {
    const query = "SELECT * FROM companies";
    const result = await this.#pool.query(query);
    return result.rows;
  }

  async updateCompany(id, name, location, description) {
    const query = "UPDATE companies SET name = $1, location = $2, description = $3 WHERE id = $4";
    const values = [name, location, description, id];
    await this.#pool.query(query, values);
  }

  async deleteCompany(id) {
    const query = "DELETE FROM companies WHERE id = $1";
    const values = [id];

    await this.#pool.query(query, values);
  }
}