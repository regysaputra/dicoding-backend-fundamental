/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.addColumns("companies", {
    owner_user_id: {
      type: "uuid",
      references: "users",
      onDelete: "SET NULL",
    },
  });

  pgm.createIndex("companies", "owner_user_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropIndex("companies", "owner_user_id");
  pgm.dropColumns("companies", ["owner_user_id"]);
};
