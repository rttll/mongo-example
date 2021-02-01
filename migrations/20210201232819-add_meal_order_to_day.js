module.exports = {
  async up(db, client) {
    await db.collection('days').updateMany({}, {$set: {mealOrder: []} })
  },
  
  async down(db, client) {
    await db.collection('days').updateMany({}, {$unset: {mealOrder: []} })
  }
};
