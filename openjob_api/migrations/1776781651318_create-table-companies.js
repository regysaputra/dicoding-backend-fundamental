/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export function up(pgm) {
  pgm.createTable('companies', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    name: {
      type: 'varchar(255)',
      notNull: true,
    },
    location: {
      type: 'varchar(255)',
    },
    description: {
      type: 'text',
    },
    website: {
      type: 'varchar(255)',
    },
    industry : {
      type: 'varchar(255)',
    },
  });

  pgm.addConstraint('companies', 'unique_company_name_location', {
    unique: ['name', 'location'],
  });
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export function down(pgm) {
  pgm.dropTable('companies');
}
