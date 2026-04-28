import { Pool } from "pg";

export default class ApplicationNotificationRepository {
  #pool;

  constructor() {
    this.#pool = new Pool();
  }

  async getByApplicationId(applicationId) {
    const query = `
      SELECT
        a.id AS application_id,
        a.created_at AS application_date,
        applicant.id AS applicant_id,
        applicant.name AS applicant_name,
        applicant.email AS applicant_email,
        owner.id AS owner_id,
        owner.name AS owner_name,
        owner.email AS owner_email,
        j.id AS job_id,
        j.title AS job_title,
        c.id AS company_id,
        c.name AS company_name
      FROM applications a
      JOIN users applicant ON applicant.id = a.user_id
      JOIN jobs j ON j.id = a.job_id
      JOIN companies c ON c.id = j.company_id
      JOIN users owner ON owner.id = c.owner_user_id
      WHERE a.id = $1
      LIMIT 1
    `;

    const result = await this.#pool.query(query, [applicationId]);
    return result.rows[0] || null;
  }
}