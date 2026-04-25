/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("applications", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    job_id: {
      type: "uuid",
      notNull: true,
      references: "jobs",
    },
    status: {
      type: "varchar(255)",
      notNull: true,
    },
  });

  pgm.createIndex("applications", "user_id", { unique: true });
  pgm.createIndex("applications", "job_id", { unique: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
