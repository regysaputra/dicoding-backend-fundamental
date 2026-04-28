import {Pool} from "pg";
import CacheService from "../../cache/cache-service.js";

export default class CompanyRepositories {
  #pool;
  #cacheService;

  constructor() {
    this.#pool = new Pool();
    this.#cacheService = new CacheService();
  }

  async #cacheCompany(cacheKey, company) {
    if (company) {
      await this.#cacheService.set(cacheKey, JSON.stringify(company), 60 * 60);
    }
  }

  async addCompany({ id, name, location, description, ownerUserId }) {
    const query = "INSERT INTO companies (id, name, location, description, owner_user_id) VALUES ($1, $2, $3, $4, $5)";
    const values = [id, name, location, description, ownerUserId];
    await this.#pool.query(query, values);

    await this.#cacheService.delete(`company:${id}`);
  }

  async getCompanyById(id) {
    const cacheKey = `company:${id}`;

    try {
      const cachedCompany = await this.#cacheService.get(cacheKey);

      if (cachedCompany) {
        return {
          company: JSON.parse(cachedCompany),
          source: "cache"
        };
      }
    } catch (error) {
      // Treat cache failures as a miss and fall back to the database.
    }

    const query = "SELECT * FROM companies WHERE id = $1";
    const values = [id];
    const result = await this.#pool.query(query, values);
    const company = result.rows[0];

    await this.#cacheCompany(cacheKey, company);

    return {
      company,
      source: "database"
    };
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
    const result = await this.#pool.query(query, values);

    await this.#cacheService.delete(`company:${id}`);
    return result.rowCount;
  }

  async deleteCompany(id) {
    const query = "DELETE FROM companies WHERE id = $1";
    const values = [id];
    const result = await this.#pool.query(query, values);
    
    await this.#cacheService.delete(`company:${id}`);
    return result.rowCount;
  }
}