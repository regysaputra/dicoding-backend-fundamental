/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("bookmarks", {
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
      onDelete: "CASCADE",
    },
  });

  pgm.createIndex("bookmarks", "user_id", { unique: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("bookmarks");
};
