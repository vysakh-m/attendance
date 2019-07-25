var express   = require('express'),
  bodyParser  = require('body-parser'),
  session     = require('client-sessions');


const puppeteer = require('puppeteer');
var router = express();
router.use(bodyParser.urlencoded({
  extended: true
}));

var middleWare = require('../middleware/index.js');
var uid;
var pass;
var timetable_read = {};
var daily_timetable = middleWare.daily_timetable;
var intent_empty_string = middleWare.intent_empty_string;
var counter = middleWare.counter;
var alter_table = "none";
var thk_res = middleWare.thk_res;
var summary = middleWare.summary;
var c = 0;
var absent_t = {};

//================================Date==========================================
var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var d = new Date();
var day = week[d.getDay()];
var d_1 = d.getDate().toString();
var d_2 = month[d.getMonth()];
var d_3 = d.getFullYear().toString();
var current_date = d_1 + "-" + d_2 + "-" + d_3;
middleWare.current_date = current_date;
middleWare.day = day;

//=============================MODELS===========================================
var stud_var = require('../models/Student.js'),
  abs_datas = require('../models/Absent.js'),
  check_data = require('../models/Check.js'),
  chg_tbl_data = require('../models/ChangedTable.js'),
  day_tbl_data = require('../models/DayTable.js'),
  time_tbl_data = require('../models/TimeTable.js'),
  sumdata = require('../models/Summary.js'),
  logdata = require('../models/Log.js'),
  countdata = require('../models/Count.js'),
  bunkboxdata = require('../models/BunkBox.js');
//==============================================================================
var uid_list = ["U1703137", "U1703138", "U1703139", "U1703140", "U1703141", "U1703142", "U1703143", "U1703144", "U1703145", "U1703146", "U1703147", "U1703148", "U1703149", "U1703150", "U1703151", "U1703152", "U1703153", "U1703154", "U1703155", "U1703156", "U1703157", "U1703158", "U1703159", "U1703160", "U1703161", "U1703162", "U1703163", "U1703164", "U1703165", "U1703166", "U1703167", "U1703168", "U1703169", "U1703170", "U1703171", "U1703172", "U1703173", "U1703174", "U1703175", "U1703176", "U1703177", "U1703178", "U1703179", "U1703180", "U1703181", "U1703182", "U1703183", "U1703184", "U1703185", "U1703186", "U1703187", "U1703188", "U1703189", "U1703190", "U1703191", "U1703192", "U1703193", "U1703194", "U1703195", "U1703196", "U1703197", "U1703198", "U1703199", "U1703200", "U1703201", "U1703202", "U1703203", "U1703204"];
//===============================SESSION========================================
router.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
//==============================ROOT ROUTE======================================
router.get("/", function(req, res) {
  if (!req.session.user) {
    res.redirect('login');
  } else {
    res.redirect('home');
  }
});
//============================LOGIN GET=========================================
router.get("/login", function(req, res) {
  res.render('login.ejs', {
    in_cred: "none",
    in_pass: "none"
  });
});
//===========================LOGIN POST=========================================
router.post("/home", function(req, res) {
  var stud_db = {};
  uid = req.body.user;
  pass = req.body.pass;
  uid = uid.toUpperCase();
  var counter = 0;
  for (var i = 0; i < uid_list.length; i++) {
    if (uid_list[i] === uid) {
      counter++;
      break;
    }
  }
  stud_var.find({
    au_uid: req.body.user
  }, function(err, result) {
    if (err) {
      console.log(err);
      console.log("ERROR in Finding Student Data")
    } else {
      stud_db = result[0];
      if (counter > 0) {
        if (stud_db.au_uid === uid && stud_db.au_pass === pass) {
          req.session.user = uid;
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          //log_datas
          logdata.find({}, function(err, result) {
            if (err) {
              console.log(err);
              console.log("ERROR in Finding Student Data")
            } else {
              var log_temp = result[0];
              var log_user = log_temp["log_user"];
              var log_time = log_temp["log_time"];
              log_user.unshift(stud_db.name);
              log_time.unshift(time);
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
                      console.log("ERROR")
                    } else {
                      console.log("USER LOGS UPDATED");
                    }
                  });
                }
              });
            }
          });
          console.log("Login Success " + stud_db.name + " " + time);
          (async () => {
            const browser = await puppeteer.launch({
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*']
            });
            const page = await browser.newPage();
            await page.goto('https://www.rajagiritech.ac.in/stud/ktu/student');
            await page.type('input[name="Userid"]', uid);
            await page.type('input[name="Password"]', pass);
            await page.click('input[type="submit"]');
            await page.goto('https://www.rajagiritech.ac.in/stud/ktu/Student/Leave.asp');
            await page.evaluate(() => {
              document.querySelector('select[name="code"]').selectedIndex = 3;
            });
            await page.click('input[type="submit"]');
            //await page.screenshot({path: 'scrap_target.png'}); //Necessary to make the page load fully for screenshot, so scraping works perfectly
            //instead of above statement waitfor function used
            await page.waitFor(2000);
            const data = await page.$$eval('table tr td[valign="middle"]', tds => tds.map((td) => {
              return td.innerText;
            }));
            data.splice(0, 9);
            var i = 0;
            var absent = [];
            while (data.length != 0) {
              var d = data.splice(0, 8);
              var key = d[0];
              var values = d.slice(1, 8);
              absent_t.uid = uid;
              absent_t.date = key;
              absent_t.value = values;
              absent.push(absent_t);
              absent_t = {};
              i++
            }


            function explode() {
              //DELETE ALL ABSENT ENTRIES OF USER
              abs_datas.find({
                uid: uid
              }).deleteMany(function(err) {
                if (err) {
                  console.log(err);
                } else {
                  //ADD ALL THE ABSENT ENTRIES OF USER
                  absent.forEach(function(arrayItem) {
                    var s_data = new abs_datas(arrayItem);
                    s_data.save(function(err) {
                      if (err) {
                        console.log("ERROR")
                      }
                    });
                  });
                }
              });

              //CHECKBOX
              check_data.find({}, function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  var chk = result[0]["state"];
                  var sum_arr = [];
                  var abs_arr = [];
                  var per_arr = [];
                  var bun_arr = [];
                  var toatt_arr = [];
                  if (chk === false) { //NECESSARY ELSE /HOME WOULD NOT LOAD IF CHECKBOX==FALSE
                    //TIMETABLE
                    time_tbl_data.find({}, function(err, result) {
                      if (err) {
                        console.log(err);
                      } else {
                        timetable_read = result[0];

                        //DAYTABLE
                        day_tbl_data.find({}, function(err, result) {
                          if (err) {
                            console.log(err);
                          } else {
                            day_table = result[0]["daytable"];
                            //=========================================
                            //SUMMARY
                            sumdata.find({}, function(err, result) {
                              if (err) {
                                console.log(err);
                                console.log("ERROR in loading Summary")
                              } else {
                                data3 = result[0]["sumVal"].toString();
                                var count_301 = (data3.match(/CS301/g) || []).length;
                                var count_303 = (data3.match(/CS303/g) || []).length;
                                var count_305 = (data3.match(/CS305/g) || []).length;
                                var count_307 = (data3.match(/CS307/g) || []).length;
                                var count_309 = (data3.match(/CS309/g) || []).length;
                                var elective = (data3.match(/Elective/g) || []).length;
                                var count_331 = (data3.match(/CS331/g) || []).length;
                                var count_333 = (data3.match(/CS333/g) || []).length;
                                var count_341 = (data3.match(/CS341/g) || []).length;
                                sum_arr.push(count_301);
                                sum_arr.push(count_303);
                                sum_arr.push(count_305);
                                sum_arr.push(count_307);
                                sum_arr.push(count_309);
                                sum_arr.push(elective);
                                sum_arr.push(count_331);
                                sum_arr.push(count_333);
                                sum_arr.push(count_341);
                                //DBWORK
                                var abs_db;
                                abs_datas.find({
                                  uid: uid
                                }, function(err, result) {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    var data4 = result.toString()
                                    var a_count_301 = (data4.match(/CS301/g) || []).length;
                                    var a_count_303 = (data4.match(/CS303/g) || []).length;
                                    var a_count_305 = (data4.match(/CS305/g) || []).length;
                                    var a_count_307 = (data4.match(/CS307/g) || []).length;
                                    var a_count_309 = (data4.match(/CS309/g) || []).length;
                                    //Elective
                                    var a = (data4.match(/CS361/g) || []).length;
                                    var b = (data4.match(/CS365/g) || []).length;
                                    var c = (data4.match(/CS367/g) || []).length;
                                    var d = (data4.match(/CS369/g) || []).length;
                                    var a_elective = a + b + c + d;
                                    //=======
                                    var a_count_331 = (data4.match(/CS331/g) || []).length;
                                    var a_count_333 = (data4.match(/CS333/g) || []).length;
                                    var a_count_341 = (data4.match(/CS341/g) || []).length;
                                    abs_arr.push(a_count_301);
                                    abs_arr.push(a_count_303);
                                    abs_arr.push(a_count_305);
                                    abs_arr.push(a_count_307);
                                    abs_arr.push(a_count_309);
                                    abs_arr.push(a_elective);
                                    abs_arr.push(a_count_331);
                                    abs_arr.push(a_count_333);
                                    abs_arr.push(a_count_341);
                                    for (var i = 0; i < 9; i++) {
                                      var temp_val = sum_arr[i] - abs_arr[i];
                                      var temp_va = temp_val / sum_arr[i];
                                      var temp_v = temp_va * 100;
                                      per_arr.push(temp_v.toFixed(2));
                                    }
                                    for (var i = 0; i < 9; i++) {
                                      var loop_temp_sum = sum_arr[i];
                                      var loop_temp_abs = abs_arr[i];
                                      var j = 1;
                                      var k = 1;
                                      var bunk_count = 0;
                                      var att_count = 0;
                                      while (j != 0) {
                                        if (loop_temp_abs * 4 < loop_temp_sum) {
                                          bunk_count++;
                                          loop_temp_abs++;
                                          loop_temp_sum++;
                                        } else {
                                          j = 0;
                                        }
                                      }
                                      if (bunk_count == 0) {
                                        var loop_temp_sum = sum_arr[i];
                                        var loop_temp_abs = abs_arr[i];
                                        while (k != 0) {
                                          if (loop_temp_abs * 4 > loop_temp_sum) {
                                            att_count++;
                                            loop_temp_sum++;
                                          } else {
                                            k = 0;
                                          }
                                        }
                                        if (att_count != 0) {
                                          att_count++;
                                        }
                                      } else if (bunk_count > 0) {
                                        bunk_count--;
                                      }
                                      bun_arr.push(bunk_count);
                                      toatt_arr.push(att_count);
                                    }
                                    //BUNKBOXWRITE
                                    bunkboxdata.find({
                                      uid: uid
                                    }).deleteMany(function(err) {
                                      if (err) {
                                        console.log(err);
                                      } else {
                                        var t5_data = new bunkboxdata({
                                          uid: uid,
                                          abs_arr: abs_arr,
                                          sum_arr: sum_arr,
                                          per_arr: per_arr,
                                          bun_arr: bun_arr,
                                          toatt_arr: toatt_arr
                                        });
                                        t5_data.save(function(err) {
                                          if (err) {
                                            console.log(err);
                                          } else {
                                            res.render('profile.ejs', {
                                              stud_name: stud_db.name,
                                              class_name: stud_db.au_class,
                                              date: middleWare.current_date,
                                              day: middleWare.day,
                                              check_ed: " ",
                                              arr: day_table,
                                              table_arr: timetable_read,
                                              hidstr: middleWare.intent_empty_string,
                                              response: thk_res,
                                              hidyesorno: alter_table,
                                              absent_arr: abs_arr,
                                              summary_arr: sum_arr,
                                              percent_arr: per_arr,
                                              bunk_arr: bun_arr,
                                              attend_arr: toatt_arr
                                            });
                                          }
                                        });
                                      }
                                    });


                                  }
                                });
                              }
                            });
                            //=========================================
                          }
                        });
                      }
                    });
                  } else { //Else condition is necessary, otherwise on entering home route from login, the toggle button will be always turned OFF (tried it)
                    //TIMETABLE
                    time_tbl_data.find({}, function(err, result) {
                      if (err) {
                        console.log(err);
                      } else {
                        timetable_read = result[0];
                        //DAYTABLE
                        day_tbl_data.find({}, function(err, result) {
                          if (err) {
                            console.log(err);
                          } else {
                            day_table = result[0]["daytable"];
                            //SUMMARY
                            sumdata.find({}, function(err, result) {
                              if (err) {
                                console.log(err);
                              } else {
                                data3 = result[0]["sumVal"].toString();
                                var count_301 = (data3.match(/CS301/g) || []).length;
                                var count_303 = (data3.match(/CS303/g) || []).length;
                                var count_305 = (data3.match(/CS305/g) || []).length;
                                var count_307 = (data3.match(/CS307/g) || []).length;
                                var count_309 = (data3.match(/CS309/g) || []).length;
                                var elective = (data3.match(/Elective/g) || []).length;
                                var count_331 = (data3.match(/CS331/g) || []).length;
                                var count_333 = (data3.match(/CS333/g) || []).length;
                                var count_341 = (data3.match(/CS341/g) || []).length;
                                sum_arr.push(count_301);
                                sum_arr.push(count_303);
                                sum_arr.push(count_305);
                                sum_arr.push(count_307);
                                sum_arr.push(count_309);
                                sum_arr.push(elective);
                                sum_arr.push(count_331);
                                sum_arr.push(count_333);
                                sum_arr.push(count_341);
                                var abs_db;
                                abs_datas.find({
                                  uid: uid
                                }, function(err, result) {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    var data4 = result.toString()
                                    var a_count_301 = (data4.match(/CS301/g) || []).length;
                                    var a_count_303 = (data4.match(/CS303/g) || []).length;
                                    var a_count_305 = (data4.match(/CS305/g) || []).length;
                                    var a_count_307 = (data4.match(/CS307/g) || []).length;
                                    var a_count_309 = (data4.match(/CS309/g) || []).length;
                                    //Elective
                                    var a = (data4.match(/CS361/g) || []).length;
                                    var b = (data4.match(/CS365/g) || []).length;
                                    var c = (data4.match(/CS367/g) || []).length;
                                    var d = (data4.match(/CS369/g) || []).length;
                                    var a_elective = a + b + c + d;
                                    //=======
                                    var a_count_331 = (data4.match(/CS331/g) || []).length;
                                    var a_count_333 = (data4.match(/CS333/g) || []).length;
                                    var a_count_341 = (data4.match(/CS341/g) || []).length;
                                    abs_arr.push(a_count_301);
                                    abs_arr.push(a_count_303);
                                    abs_arr.push(a_count_305);
                                    abs_arr.push(a_count_307);
                                    abs_arr.push(a_count_309);
                                    abs_arr.push(a_elective);
                                    abs_arr.push(a_count_331);
                                    abs_arr.push(a_count_333);
                                    abs_arr.push(a_count_341);
                                    for (var i = 0; i < 9; i++) {
                                      var temp_val = sum_arr[i] - abs_arr[i];
                                      var temp_va = temp_val / sum_arr[i];
                                      var temp_v = temp_va * 100;
                                      per_arr.push(temp_v.toFixed(2));
                                    }
                                    for (var i = 0; i < 9; i++) {
                                      var loop_temp_sum = sum_arr[i];
                                      var loop_temp_abs = abs_arr[i];
                                      var j = 1;
                                      var k = 1;
                                      var bunk_count = 0;
                                      var att_count = 0;
                                      while (j != 0) {
                                        if (loop_temp_abs * 4 < loop_temp_sum) {
                                          bunk_count++;
                                          loop_temp_abs++;
                                          loop_temp_sum++;
                                        } else {
                                          j = 0;
                                        }
                                      }
                                      if (bunk_count == 0) {
                                        var loop_temp_sum = sum_arr[i];
                                        var loop_temp_abs = abs_arr[i];
                                        while (k != 0) {
                                          if (loop_temp_abs * 4 > loop_temp_sum) {
                                            att_count++;
                                            loop_temp_sum++;
                                          } else {
                                            k = 0;
                                          }
                                        }
                                      } else if (bunk_count > 0) {
                                        bunk_count--;
                                      }
                                      bun_arr.push(bunk_count);
                                      toatt_arr.push(att_count);
                                    }
                                    //BUNKBOXWRITE
                                    bunkboxdata.find({
                                      uid: uid
                                    }).deleteMany(function(err) {
                                      if (err) {
                                        console.log(err);
                                      } else {
                                        var t5_data = new bunkboxdata({
                                          uid: uid,
                                          abs_arr: abs_arr,
                                          sum_arr: sum_arr,
                                          per_arr: per_arr,
                                          bun_arr: bun_arr,
                                          toatt_arr: toatt_arr
                                        });
                                        t5_data.save(function(err) {
                                          if (err) {
                                            console.log(err);
                                          } else {
                                            res.render('profile.ejs', {
                                              stud_name: stud_db.name,
                                              class_name: stud_db.au_class,
                                              date: middleWare.current_date,
                                              day: middleWare.day,
                                              check_ed: "checked",
                                              arr: day_table,
                                              table_arr: timetable_read,
                                              hidstr: middleWare.intent_empty_string,
                                              response: thk_res,
                                              hidyesorno: alter_table,
                                              absent_arr: abs_arr,
                                              summary_arr: sum_arr,
                                              percent_arr: per_arr,
                                              bunk_arr: bun_arr,
                                              attend_arr: toatt_arr
                                            });
                                          }
                                        });
                                      }
                                    });

                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });

            }
            setTimeout(explode, 100);

            await browser.close();
          })();
        } else {
          res.render('login.ejs', {
            in_cred: "none",
            in_pass: ""
          });
          console.log("Invalid Password");
        }

      } else {
        res.render('login.ejs', {
          in_cred: "",
          in_pass: "none"
        });
        console.log("Invalid UID");

      }
      //below braces are for end of stud_datas DB
    }
  });
});
//================================HOME GET ROUTE================================
router.get("/home", function(req, res) {
  var stud_db;
  stud_var.find({
    au_uid: req.session.user
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      stud_db = result[0];
      if (!req.session.user) {
        res.redirect('login');
      } else {
        //DAYTABLE
        day_tbl_data.find({}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            daily_timetable = result[0]["daytable"];
            //CHECKBOX
            check_data.find({}, function(err, result) {
              if (err) {
                console.log(err);
              } else {
                var chk = result[0]["state"];
                if (chk === false) {
                  //TIMETABLE
                  time_tbl_data.find({}, function(err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      timetable_read = result[0];
                      //BUNKBOX
                      bunkboxdata.find({
                        uid: req.session.user
                      }, function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          var abs_arr = result[0].abs_arr;
                          var sum_arr = result[0].sum_arr;
                          var per_arr = result[0].per_arr;
                          var bun_arr = result[0].bun_arr;
                          var toatt_arr = result[0].toatt_arr;
                          res.render('profile.ejs', {
                            stud_name: stud_db.name,
                            class_name: stud_db.au_class,
                            date: middleWare.current_date,
                            day: middleWare.day,
                            check_ed: " ",
                            arr: daily_timetable,
                            table_arr: timetable_read,
                            hidstr: middleWare.intent_empty_string,
                            response: thk_res,
                            hidyesorno: alter_table,
                            absent_arr: abs_arr,
                            summary_arr: sum_arr,
                            percent_arr: per_arr,
                            bunk_arr: bun_arr,
                            attend_arr: toatt_arr
                          });
                        }
                      });
                    }
                  });
                } else {
                  //TIMETABLE
                  time_tbl_data.find({}, function(err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      timetable_read = result[0];
                      //BUNKBOX
                      bunkboxdata.find({
                        uid: req.session.user
                      }, function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          abs_arr = result[0].abs_arr;
                          sum_arr = result[0].sum_arr;
                          per_arr = result[0].per_arr;
                          bun_arr = result[0].bun_arr;
                          toatt_arr = result[0].toatt_arr;
                          res.render('profile.ejs', {
                            stud_name: stud_db.name,
                            class_name: stud_db.au_class,
                            date: middleWare.current_date,
                            day: middleWare.day,
                            check_ed: "checked",
                            arr: daily_timetable,
                            table_arr: timetable_read,
                            hidstr: middleWare.intent_empty_string,
                            response: thk_res,
                            hidyesorno: alter_table,
                            absent_arr: abs_arr,
                            summary_arr: sum_arr,
                            percent_arr: per_arr,
                            bunk_arr: bun_arr,
                            attend_arr: toatt_arr
                          });
                        }
                      });

                    }
                  });
                }
              }
            });
          }
        });
      }
    }
  });
});

//=================================LOGOUT ROUTE=================================
router.get("/logout", function(req, res) {
  var stud_db;
  stud_var.find({
    au_uid: req.session.user
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      stud_db = result[0];
      if (!req.session.user) {
        res.redirect('login');
      } else {
        var t = stud_db.name;
        req.session.reset();
        res.redirect("/login");
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log("Logout Successful " + t + " " + time);
      }
    }
  });
});
//===============================INSTRUCTIONS ROUTE=============================
router.get("/instructions", function(req, res) {
  var stud_db;
  stud_var.find({
    au_uid: req.session.user
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      stud_db = result[0];
      if (!req.session.user) {
        res.redirect('login');
      } else {
        res.render('instructions.ejs', {
          stud_name: stud_db.name,
          class_name: stud_db.au_class
        });
      }
    }
  });
});
//==================ROUTE ASSOCIATED WITH CHECKBOX==============================
router.post("/workday", function(req, res) {

  if (Object.keys(req.body).length == 0) {
    check_data.find({}).deleteMany(function(err) {
      if (err) {
        console.log(err);
      } else {
        var val = new check_data({
          state: false
        });
        val.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("CHECKBOX UNTICKED");
          }
        });
      }
    });

  } else {
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
            console.log("CHECKBOX TICKED");
          }
        });

      }
    });

  }
  res.redirect('/home');
});

//========ROUTE CHECKING WHETHER DAY'S TABLE WAS FOLLOWED CORRECTLY (Y/N)=======
router.post("/ttable_alter", function(req, res) {
  if (req.body.yesno === 'No') {
    alter_table = "";
    thk_res = "";
    middleWare.intent_empty_string = "none"
    middleWare.counter = 1;
    res.redirect('/home');
    console.log("Change in Day's Timetable");
  } else if (req.body.yesno === 'Yes') {
    middleWare.counter = 0;
    thk_res = "Thank You for your response"
    alter_table = "none";
    middleWare.intent_empty_string = "none"
    res.redirect('/home');
    console.log("No Change in Day's Timetable");
  }
});

//Both the routes below serves the purpose of getting the schedule of the day if the normal timetable was not followed correctly
//=================SHOWING DROPDOWN MENU FOR CHANGED TABLE======================
router.post("/ttable_alter_absent", function(req, res) {
  alter_table = "";
  thk_res = "";
  middleWare.intent_empty_string = "none"
  middleWare.counter = 1;
  res.redirect('/home');
});
//=================SAVING CHANGED TABLE TO DB===================================
router.post('/edittable', function(req, res) {
  chg_tbl_data.find({}).deleteMany(function(err) {
    if (err) {
      console.log(err);
    } else {
      var t_data = new chg_tbl_data(req.body);
      t_data.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
  thk_res = "Thank You for your response"
  middleWare.intent_empty_string = "none"
  alter_table = "none";
  res.redirect('/home');
});
//==========================TIMETABLE EDIT ROUTE=================================
router.post("/timetable", function(req, res) {
  time_tbl_data.find({}).deleteMany(function(err) {
    if (err) {
      console.log(err);
    } else {
      var table_data = new time_tbl_data(req.body);
      table_data.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('timetable');
        }
      });
    }
  });
});
//===========================SUMMARY GET ROUTE==================================
router.get("/summary", function(req, res) {
  var stud_db;
  stud_var.find({
    au_uid: req.session.user
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      stud_db = result[0];
      if (!req.session.user) {
        res.redirect('login');
      } else {
        //SUMMARY
        sumdata.find({}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            var summary = result[0]["sumVal"];
            res.render('summary.ejs', {
              stud_name: stud_db.name,
              class_name: stud_db.au_class,
              sumarr: summary
            });
          }
        });
      }
    }
  });
});
//======================TIMETABLE GET ROUTE=====================================
router.get("/timetable", function(req, res) {
  var stud_db;
  stud_var.find({
    au_uid: req.session.user
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      stud_db = result[0];
      if (!req.session.user) {
        res.redirect('login');
      } else {
        //TIMETABLE
        time_tbl_data.find({}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            timetable_read = result[0];
            res.render('ttable.ejs', {
              stud_name: stud_db.name,
              class_name: stud_db.au_class,
              table: timetable_read
            });
          }
        });
      }
    }
  });
});

module.exports = router;
