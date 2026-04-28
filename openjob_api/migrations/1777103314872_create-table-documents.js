/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("documents", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    original_name: {
      type: "varchar(255)",
      notNull: true,
    },
    stored_name: {
      type: "varchar(255)",
      notNull: true,
    },
    mime_type: {
      type: "varchar(255)",
      notNull: true,
    },
    size: {
      type: "integer",
      notNull: true,
    },
    path: {
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
  pgm.dropTable("documents");
};
