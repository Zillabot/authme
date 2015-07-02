
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tweets', function(table) {
    table.increments('tweetid');
    table.string('tweet');
    table.timestamp('posted_at').defaultTo(knex.raw('now()'));
    table.string('username');
    // table.string('user_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tweets');
};
