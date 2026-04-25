import {Pool} from "pg";

export default class CategoryRepositories {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async addCategory(id, name) {
    await this.#pool.query("INSERT INTO categories (id, name) VALUES ($1, $2)", [id, name]);
  }

  async getAllCategory() {
    const query = "SELECT * FROM categories";

    const result = await this.#pool.query(query);

    return result.rows;
  }

  async getCategoryById(id) {
    const query = "SELECT * FROM categories WHERE id = $1";
    const value = [id];

    const result = await this.#pool.query(query, value);

    return result.rows[0];
  }

  async updateCategoryById(id, name) {
    const query = "UPDATE categories SET name = $1 WHERE id = $2";
    const value = [name, id];

    await this.#pool.query(query, value);
  }

  async deleteCategoryById(id) {
    const query = "DELETE FROM categories WHERE id = $1";
    const value = [id];

    await this.#pool.query(query, value);
  }
}