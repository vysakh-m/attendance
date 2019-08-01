var express     = require('express'),
  bodyParser    = require('body-parser'),
  alert         = require('alert-node'),
  JSAlert       = require("js-alert"),
  schedule      = require('node-schedule'),
  prependFile   = require('prepend-file'),
  cron          = require('node-cron'),
  session       = require('client-sessions'),
  mongoose      = require('mongoose'),
  http          = require("http");

const puppeteer = require('puppeteer');
var app = express();
//================================HTTPS=========================================
//=======================COMMENT DURING DEVELOPMENT=============================
function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
app.use(requireHTTPS);
//================================ROUTES========================================
var adminRoute  = require('./routes/admin.js');
var userRoute   = require('./routes/user.js');
var middleWare  = require('./middleware/index.js');
app.use(adminRoute);
app.use(userRoute);
//==============================================================================
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("styles"));
//==============================================================================
var daily_timetable = middleWare.daily_timetable;
var counter = middleWare.counter;
var thk_res = middleWare.thk_res;
var summary = middleWare.summary;
var intent_empty_string = middleWare.intent_empty_string;
var c = 0;
const fs = require('fs');
var pingval = 0;
//===============================PING===========================================
setInterval(function() {
  if (pingval % 6 == 0) {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("Ping at " + time);
  }
  http.get("http://attdemo.herokuapp.com/");
  pingval++;
}, 300000);
//==============================MONGO CONNECT===================================
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  dbName: 'rsms_attendance',
  useNewUrlParser: true
});
//===============================MODELS=========================================
var stud_var = require('./models/Student.js'),
  abs_datas = require('./models/Absent.js'),
  check_data = require('./models/Check.js'),
  chg_tbl_data = require('./models/ChangedTable.js'),
  day_tbl_data = require('./models/DayTable.js'),
  time_tbl_data = require('./models/TimeTable.js'),
  sumdata = require('./models/Summary.js'),
  logdata = require('./models/Log.js'),
  countdata = require('./models/Count.js'),
  bunkboxdata = require('./models/BunkBox.js');
//================================DATA==========================================
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// ===================================DATE======================================
var d = new Date();
var day = week[d.getDay()];
var d_1 = d.getDate().toString();
var d_2 = month[d.getMonth()];
var d_3 = d.getFullYear().toString();
var current_date = d_1 + "-" + d_2 + "-" + d_3;
middleWare.current_date = current_date;
middleWare.day = day;
//===========================CHECKBOX TICK(WORKING DAY)=========================
function work_chk_box() {
  check_data.find({}).deleteMany(function(err) {
    if (err) {
      console.log(err);
    } else {
      var val = new check_data({
        state: true
      });
      val.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("CHECKBOX VALUE TICKED SINCE WORKING DAY")
        }
      });
    }
  });
}
//===========================DATE UPDATE========================================
function dateupdate() {

  function daily_table_db(data) {
    console.log(data);
    day_tbl_data.find({}).deleteMany(function(err) {
      if (err) {
        console.log(err);
      } else {
        var temp_data = new day_tbl_data({
          daytable: data
        });
        temp_data.save(function(err) {
          if (err) {
            console.log("ERROR")
          } else {
            console.log("DAY'S TIMETABLE WRITTEN");
          }
        });
      }
    });
  };
  d = new Date();
  day = week[d.getDay()];
  d_1 = d.getDate().toString();
  d_2 = month[d.getMonth()];
  d_3 = d.getFullYear().toString();
  current_date = d_1 + "-" + d_2 + "-" + d_3;
  console.log(current_date);
  middleWare.current_date = current_date;
  middleWare.day = day;
  console.log("INSIDE DATE UPDATE");
  if (d.getDay() == 0 || d.getDay() == 6) {
    const fs = require('fs');

    check_data.find({}).deleteMany(function(err) {
      if (err) {
        console.log(err);
      }
    });
    var val = new check_data({
      state: false
    });
    val.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("CHECKBOX UNTICKED SINCE SATURDAY OR SUNDAY");
      }
    });
  } else if (d.getDay() == 1) {
    work_chk_box();
    daily_timetable = [];
    for (var i = 1; i < 8; i++) {
      var temp = "1_" + i.toString();
      daily_timetable.push(temp);
    }
    daily_table_db(daily_timetable);
  } else if (d.getDay() == 2) {
    work_chk_box();
    daily_timetable = [];
    for (var i = 1; i < 8; i++) {
      var temp = "2_" + i.toString();
      daily_timetable.push(temp);
    }
    daily_table_db(daily_timetable);
  } else if (d.getDay() == 3) {
    work_chk_box();
    daily_timetable = [];
    for (var i = 1; i < 8; i++) {
      var temp = "3_" + i.toString();
      daily_timetable.push(temp);
    }
    daily_table_db(daily_timetable);
  } else if (d.getDay() == 4) {
    work_chk_box();
    daily_timetable = [];
    for (var i = 1; i < 8; i++) {
      var temp = "4_" + i.toString();
      daily_timetable.push(temp);
    }
    daily_table_db(daily_timetable);
  } else if (d.getDay() == 5) {
    work_chk_box();
    daily_timetable = [];
    for (var i = 1; i < 8; i++) {
      var temp = "5_" + i.toString();
      daily_timetable.push(temp);
    }
    daily_table_db(daily_timetable);
  }
}
//CODE FOR REDIRECTING ALL INVALID ROUTES, PROBABLY TO A HTML FILE WITH 404 CONTENT
//USE LATER IF NECESSARY
// app.get('*', function(req, res) {
//       res.send("ERROR 404");
// });
//========================LOOP FUNCTION=========================================
function loop() {
  var empty = [];
  var d = new Date();
  console.log("Inside LOOP");
  check_data.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      var chk = result[0]["state"];
      //SUMMARY
      sumdata.find({}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var sum = result[0]["sumVal"];
          if (chk === true) {
            console.log("Checkbox Ticked");
            if (middleWare.counter == 0) { //No change in day's timetable
              if (d.getDay() == 1) {
                empty.push(middleWare.current_date);
                empty.push("Monday");
                for (i = 1; i <= 7; i++) {
                  var temp = "1_" + i.toString();
                  empty.push(temp);
                }
                //TIMETABLE
                time_tbl_data.find({}, function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    ftt = result[0];
                  }
                });

                function madedelay() {
                  summary = {};
                  summary["Date"] = empty[0];
                  summary["Day"] = empty[1];
                  summary["p1"] = ftt["1_1"]; //Could have used the above temp array. But nevermind.
                  summary["p2"] = ftt["1_2"];
                  summary["p3"] = ftt["1_3"];
                  summary["p4"] = ftt["1_4"];
                  summary["p5"] = ftt["1_5"];
                  summary["p6"] = ftt["1_6"];
                  summary["p7"] = ftt["1_7"];
                  sum.unshift(summary);
                  summary = {};
                  middleWare.summaryUpdate(sum);
                }
                setTimeout(madedelay, 5000);
              } else if (d.getDay() == 2) {
                empty.push(middleWare.current_date);
                empty.push("Tuesday");
                for (i = 1; i <= 7; i++) {
                  var temp = "2_" + i.toString();
                  empty.push(temp);
                }
                //TIMETABLE
                time_tbl_data.find({}, function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    ftt = result[0];
                  }
                });

                function madedelay() {
                  summary = {};
                  summary["Date"] = empty[0];
                  summary["Day"] = empty[1];
                  summary["p1"] = ftt["2_1"];
                  summary["p2"] = ftt["2_2"];
                  summary["p3"] = ftt["2_3"];
                  summary["p4"] = ftt["2_4"];
                  summary["p5"] = ftt["2_5"];
                  summary["p6"] = ftt["2_6"];
                  summary["p7"] = ftt["2_7"];
                  sum.unshift(summary);
                  summary = {};
                  middleWare.summaryUpdate(sum);
                }
                setTimeout(madedelay, 5000);

              } else if (d.getDay() == 3) {
                empty.push(middleWare.current_date);
                empty.push("Wednesday");
                for (i = 1; i <= 7; i++) {
                  var temp = "3_" + i.toString();
                  empty.push(temp);
                }
                //TIMETABLE
                time_tbl_data.find({}, function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    ftt = result[0];
                  }
                });

                function madedelay() {
                  summary = {};
                  summary["Date"] = empty[0];
                  summary["Day"] = empty[1];
                  summary["p1"] = ftt["3_1"];
                  summary["p2"] = ftt["3_2"];
                  summary["p3"] = ftt["3_3"];
                  summary["p4"] = ftt["3_4"];
                  summary["p5"] = ftt["3_5"];
                  summary["p6"] = ftt["3_6"];
                  summary["p7"] = ftt["3_7"];
                  sum.unshift(summary);
                  summary = {};
                  middleWare.summaryUpdate(sum);
                }
                setTimeout(madedelay, 5000);
              } else if (d.getDay() == 4) {
                empty.push(middleWare.current_date);
                empty.push("Thursday");
                for (i = 1; i <= 7; i++) {
                  var temp = "4_" + i.toString();
                  empty.push(temp);
                }
                //TIMETABLE
                time_tbl_data.find({}, function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    ftt = result[0];
                  }
                });

                function madedelay() {
                  summary = {};
                  summary["Date"] = empty[0];
                  summary["Day"] = empty[1];
                  summary["p1"] = ftt["4_1"];
                  summary["p2"] = ftt["4_2"];
                  summary["p3"] = ftt["4_3"];
                  summary["p4"] = ftt["4_4"];
                  summary["p5"] = ftt["4_5"];
                  summary["p6"] = ftt["4_6"];
                  summary["p7"] = ftt["4_7"];
                  sum.unshift(summary);
                  summary = {};
                  middleWare.summaryUpdate(sum);
                }
                setTimeout(madedelay, 5000);
              } else if (d.getDay() == 5) {
                empty.push(middleWare.current_date);
                empty.push("Friday");
                for (i = 1; i <= 7; i++) {
                  var temp = "5_" + i.toString();
                  empty.push(temp);
                }
                //TIMETABLE
                time_tbl_data.find({}, function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    ftt = result[0];
                  }
                });

                function madedelay() {
                  summary = {};
                  summary["Date"] = empty[0];
                  summary["Day"] = empty[1];
                  summary["p1"] = ftt["5_1"];
                  summary["p2"] = ftt["5_2"];
                  summary["p3"] = ftt["5_3"];
                  summary["p4"] = ftt["5_4"];
                  summary["p5"] = ftt["5_5"];
                  summary["p6"] = ftt["5_6"];
                  summary["p7"] = ftt["5_7"];
                  sum.unshift(summary);
                  summary = {};
                  middleWare.summaryUpdate(sum);
                }
                setTimeout(madedelay, 5000);
              }
            } else if (middleWare.counter == 1) { //Change in day's table

              chg_tbl_data.find({}, function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  ftt = result[0];
                  console.log("Read data from changed table");
                }
              });

              function madedelay() {
                var c_name = d.getDay();
                var c_day = week[c_name];
                summary = {};
                summary["Date"] = middleWare.current_date;
                summary["Day"] = c_day;
                summary["p1"] = ftt["a_1"];
                summary["p2"] = ftt["a_2"];
                summary["p3"] = ftt["a_3"];
                summary["p4"] = ftt["a_4"];
                summary["p5"] = ftt["a_5"];
                summary["p6"] = ftt["a_6"];
                summary["p7"] = ftt["a_7"];
                sum.unshift(summary);
                summary = {};
                middleWare.summaryUpdate(sum);
              }
              setTimeout(madedelay, 5000);

            }

          } else {
            console.log("CHECKBOX UNTICKED");
          }
        }
      });
    }
  });
}
//================================CRON JOBS=====================================
cron.schedule('00 05 00 * * 0-6', () => { //CRON JOB FOR DAILY DATE UPDATE 00:05
  middleWare.counter = 0;
  pingval = 0;
  dateupdate();
  console.log('Date Update at 12:05 AM');
  console.log(middleWare.current_date);
  //LOGDATA
  logdata.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      var log_temp = result[0];
      var log_user = log_temp["log_user"];
      var log_time = log_temp["log_time"];
      log_user.unshift(middleWare.current_date);
      log_time.unshift(" ");
      //LOGWRITE
      logdata.find({}).deleteMany(function(err) {
        if (err) {
          console.log(err);
        } else {
          var tl_data = new logdata({
            log_user: log_user,
            log_time: log_time
          });
          tl_data.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
}, {
  timeZone: 'Asia/Kolkata'
});

cron.schedule('00 00 23 * * 0-6', () => { //CRON JOB FOR ADDING DAILY SCHEDULE TO SUMMARY 23:00
  loop();
}, {
  timeZone: 'Asia/Kolkata'
});

cron.schedule('00 30 16 * * 0-6', () => { //CRON JOB TO SHOW OPTIONS TO CHANGE DAY'S TABLE 16:30
  // dailytablecheck();
  check_data.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      var chk = result[0]["state"];
      console.log(chk);
      if (chk === true) {
        middleWare.intent_empty_string = "";
        middleWare.thk_res = ""
      }
    }
  });
}, {
  timeZone: 'Asia/Kolkata'
});

cron.schedule('00 30 22 * * 0-6', () => { //CRON JOB FOR DISABLE OPTIONS TO CHANGE DAY'S TIMETABLE 22:30
  // dailytablecheck();
  middleWare.intent_empty_string = "none";
  middleWare.thk_res = ""
}, {
  timeZone: 'Asia/Kolkata'
});
//==============================================================================
app.listen(process.env.PORT || 5000, function() {
  console.log("Server Started");
});
