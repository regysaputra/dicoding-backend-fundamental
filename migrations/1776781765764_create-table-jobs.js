/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("jobs", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    company_id: {
      type: "uuid",
      notNull: true,
      references: "companies",
      onDelete: "CASCADE",
    },
    category_id: {
      type: "uuid",
      notNull: true,
      references: "categories",
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    job_type: {
      type: "varchar(255)",
      notNull: true,
    },
    experience_level: {
      type: "varchar(255)",
      notNull: true,
    },
    location_type: {
      type: "varchar(255)",
      notNull: true,
    },
    location_city: {
      type: "varchar(255)",
    },
    salary_min: {
      type: "integer",
    },
    salary_max: {
      type: "integer",
    },
    is_salary_visible: {
      type: "boolean",
      default: true,
    },
    status: {
      type: "varchar(255)",
      notNull: true,
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("jobs");
};
