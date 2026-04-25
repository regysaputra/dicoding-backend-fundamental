import {Pool} from "pg";
import {uuidv7} from "uuidv7";
import bcrypt from "bcrypt";

export default class UserRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async createUser({ name, email, password, role }) {
    const id = uuidv7();
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    const values = [id, name, email, hashedPassword, role];
    const result = await this.#pool.query(query, values);

    return result.rows[0];
  }

  async verifyNewEmail(email) {
    const query = "SELECT email FROM users WHERE email = $1";
    const values = [email];
    const result = await this.#pool.query(query, values);

    return result.rows.length > 0;
  }

  async getUserById(id) {
    console.log("id getUserById:", id);
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];

    const result = await this.#pool.query(query, values);
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await this.#pool.query(query, values);
    return result.rows[0];
  }
}