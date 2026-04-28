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
    folder: {
      type: "varchar(100)",
    },
    note: {
      type: "text",
    },
    priority: {
      type: "smallint",
      notNull: true,
      default: 0,
    },
    is_archived: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    is_reminder_enabled: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    reminder_at: {
      type: "timestamp",
    },
    last_viewed_at: {
      type: "timestamp",
    },
    source: {
      type: "varchar(100)",
    },
    utm_campaign: {
      type: "varchar(100)",
    },
    utm_medium: {
      type: "varchar(100)",
    },
    utm_source: {
      type: "varchar(100)",
    },
    device_type: {
      type: "varchar(50)",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    deleted_at: {
      type: "timestamp",
    },
  });

  pgm.addConstraint("bookmarks", "bookmarks_user_id_job_id_unique", {
    unique: ["user_id", "job_id"],
  });

  pgm.createIndex("bookmarks", "user_id");
  pgm.createIndex("bookmarks", "job_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("bookmarks");
};
