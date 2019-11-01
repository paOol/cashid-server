exports.up = knex => {
  return knex.schema.createTable('Requests', table => {
    table.increments('id').primary();
    table.string('request');
    table.string('address');
    table.string('slp_address');
    table.string('signature');
    table.string('action');
    table.string('data');
    table.string('nonce');
    table.jsonb('raw');
    table.timestamp('last_updated').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('Requests');
};
