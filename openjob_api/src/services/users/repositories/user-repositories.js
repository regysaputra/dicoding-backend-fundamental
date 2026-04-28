import {Pool} from "pg";
import {uuidv7} from "uuidv7";
import bcrypt from "bcrypt";
import CacheService from "../../cache/cache-service.js";

export default class UserRepositories {
  #pool;
  #cacheService;

  constructor() {
    this.#pool = new Pool();
    this.#cacheService = new CacheService();
  }

  async createUser({ name, email, password, role }) {
    const id = uuidv7();
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    const values = [id, name, email, hashedPassword, role];
    const result = await this.#pool.query(query, values);

    await this.#cacheService.delete(`user:${id}`);

    return result.rows[0];
  }

  async verifyNewEmail(email) {
    const query = "SELECT email FROM users WHERE email = $1";
    const values = [email];
    const result = await this.#pool.query(query, values);

    return result.rows.length > 0;
  }

  async getUserById(id) {
    const cacheKey = `user:${id}`;

    try {
      const user = await this.#cacheService.get(cacheKey);
      return {
        user: JSON.parse(user),
        source: "cache"
      };
    } catch (error) {
      const query = "SELECT * FROM users WHERE id = $1";
      const values = [id];

      const result = await this.#pool.query(query, values);

      await this.#cacheService.set(cacheKey, JSON.stringify(result.rows[0]), 60 * 60);

      return {
        user: result.rows[0],
        source: "database"
      };
    }
  }

  async getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await this.#pool.query(query, values);
    return result.rows[0];
  }
}