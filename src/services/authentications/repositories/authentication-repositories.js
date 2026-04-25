import {Pool} from "pg";

export default class AuthenticationRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async addToken(token) {
    const query = "INSERT INTO authentications (token) VALUES ($1)";
    const values = [token];

    await this.#pool.query(query, values);
  }

  async getToken(token) {
    const query = "SELECT token FROM authentications WHERE token = $1";
    const values = [token];
    const result = await this.#pool.query(query, values);

    return result.rows[0];
  }

  async deleteToken(token) {
    const query = "DELETE FROM authentications WHERE token = $1";
    const values = [token];

    await this.#pool.query(query, values);
  }
}