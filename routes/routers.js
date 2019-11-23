/** @module routes/routers
 * Exposes all routers
 */
'use strict';

try {
  dirEntries.forEach(function (dirEntry) {
    const stats = fs.statSync(base + dirEntry);
    // Try to load router of dir
    if (stats.isDirectory()) {
      try {
        const router = require(base + dirEntry + '/router');
        // Add router to our list of routers;
        routers[dirEntry] = router;
      } catch (err) {
        console.log('Could not get router for ' + dirEntry);
        console.log(err.toString() + err.stack);
      }
    }
  });
} catch (err) {
  console.log('Error while loading routers.');
  console.log(err.stack);
  // We don't know what happened, export empty object
  const routers = {'Error': 'Error while loading routers.'};
} finally {
  module.exports = routers;
}

