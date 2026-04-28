import {Pool} from "pg";

export default class UploadRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async addDocument({ id, originalName, storedName, mimeType, size, path }) {
    const query = `INSERT INTO documents (id, original_name, stored_name, mime_type, size, path) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [id, originalName, storedName, mimeType, size, path];
    await this.#pool.query(query, values);
  }

  async getAllDocument() {
    const query = `SELECT * FROM documents`;
    const result = await this.#pool.query(query);
    return result.rows;
  }

  async getDocumentById(id) {
    const query = `SELECT * FROM documents WHERE id = $1`;
    const values = [id];
    const result = await this.#pool.query(query, values);
    return result.rows[0];
  }

  async deleteDocumentById(id) {
    const query = `DELETE FROM documents WHERE id = $1 RETURNING id`;
    const values = [id];
    const result = await this.#pool.query(query, values);

    return result.rows[0];
  }
}