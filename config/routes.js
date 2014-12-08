var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
  console.log('Home page');
});


module.exports = router;
