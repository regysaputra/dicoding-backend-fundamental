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
    cover_letter: {
      type: "text",
    },
    resume_url: {
      type: "varchar(255)",
    },
    portfolio_url: {
      type: "varchar(255)",
    },
    expected_salary: {
      type: "integer",
      check: "expected_salary >= 0",
    },
    availability_date: {
      type: "date",
    },
    source: {
      type: "varchar(100)",
    },
    notes: {
      type: "text",
    },
    reviewed_by: {
      type: "uuid",
      references: "users",
    },
    reviewed_at: {
      type: "timestamp",
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
  });

  // A user can only apply once per job, but users/jobs can have many applications.
  pgm.addConstraint("applications", "applications_user_id_job_id_unique", {
    unique: ["user_id", "job_id"],
  });

  pgm.createIndex("applications", "user_id");
  pgm.createIndex("applications", "job_id");
  pgm.createIndex("applications", "status");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("applications");
};
