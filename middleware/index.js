var sumdata = require('../models/Summary.js');

middlewareObject = {};
middlewareObject.counter = 0;
middlewareObject.daily_timetable = [];
middlewareObject.thk_res = "";
middlewareObject.summary = {};
middlewareObject.intent_empty_string = "none";
middlewareObject.current_date = "";
middlewareObject.day = "";
middlewareObject.summaryUpdate = function(data) {
  sumdata.find({}).deleteMany(function(err) {
    if (err) {
      console.log(err);
    } else {
      var val = new sumdata({
        sumVal: data
      });
      val.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("SUMMARY UPDATED")
        }
      });
    }
  });
}
module.exports = middlewareObject;
