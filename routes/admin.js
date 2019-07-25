var express     = require('express');
var router      = express();
var bodyParser  = require('body-parser');
var session     = require('client-sessions');
router.use(bodyParser.urlencoded({
  extended: true
}));

var t_arr = [];
var change_date="";
var middleWare = require('../middleware/index.js');
//============================MODELS============================================
var stud_var    = require('../models/Student.js'),
    sumdata     = require('../models/Summary.js'),
    logdata     = require('../models/Log.js'),
    countdata   = require('../models/Count.js'),
    bunkboxdata = require('../models/BunkBox.js');
//==========================SESSIONS============================================
router.use(session({
  cookieName: 'asession',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));
//================================ROOT ROUTE====================================
router.get("/admin", function(req, res) {
  if (!req.asession.user) {
    res.redirect("/admin/login");
  } else {
    res.redirect("/admin/home");
  }
});
//===============================LOGIN GET ROUTE================================
router.get("/admin/login", function(req, res) {
  res.render('adminlogin.ejs', {
    in_cred: "none"
  });
});
//=============================LOGIN POST ROUTE=================================
router.post("/admin/home", function(req, res) {
  uid = req.body.user;
  pass = req.body.pass;
  if (uid == "admin" && pass == "kava2kaka") {
    req.asession.user = uid;
    res.redirect('/admin/home');
  } else {
    res.render('adminlogin.ejs', {
      in_cred: ""
    });
  }

});

//===========================ADMIN HOME ROUTE===================================
router.get("/admin/home", function(req, res) {
  if (!req.asession.user) {
    res.redirect('login');
  } else {
    //log_datas
    logdata.find({}, function(err, result) {
      if (err) {
        console.log(err);
        console.log("ERROR in Finding Student Log Data")
      } else {
        var log_temp = result[0];
        var log_user = log_temp["log_user"];
        var log_time = log_temp["log_time"];
        var u_id = "U1703"
        var count = 0;
        var data2 = log_user.toString();
        stud_var.find({
          "au_class": "S5-CSE-GAMMA"
        }, function(err, result) {
          if (err) {
            console.log(err);
            console.log("ERROR in Finding Student Data")
          } else {
            var log_count_arr = [];
            stud_db_arr = result;
            var k = 0;
            for (var i = 137; i < 205; i++) {
              if (i == 164 || i == 166 || i == 169) {
                continue;
              }
              var u_i_d = u_id + i.toString();
              var temp_name = "";
              temp_name = stud_db_arr[k].name;
              login_count = {};
              login_count.uid = u_i_d;
              var t = temp_name;
              login_count.name = t;
              var regex = new RegExp(t, "g");
              var count = (data2.match(regex) || []).length;
              login_count.count = count;
              log_count_arr.push(login_count);
              k++;
            }
            //WRITING LOG
            countdata.find({}).deleteMany(function(err) {
              if (err) {
                console.log(err);
              } else {
                var t2_data = new countdata({
                  details: log_count_arr
                });
                t2_data.save(function(err) {
                  if (err) {
                    console.log("ERROR")
                  } else {
                    res.render('adminhome.ejs', {
                      log_user: log_user,
                      log_time: log_time,
                      log_count: log_count_arr
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
//==============================ADMIN SUMMARY ROUTE=============================
router.get("/admin/summary", function(req, res) {
  if (!req.asession.user) {
    res.redirect('login');
  } else {
    //SUMMARY
    sumdata.find({}, function(err, result) {
      if (err) {
        console.log(err);
        console.log("ERROR in loading Summary")
      } else {
        var summary = result[0]["sumVal"];
        res.render('adminsummary.ejs', {
          sumarr: summary,
          c_arr: t_arr,
          d_change: "none"
        });
      }
    });
  }
});
//=================SUMMARY CHANGE TABLE POST ROUTE==============================
router.post("/admin/changetable", function(req, res) {
  //SUMMARY
  sumdata.find({}, function(err, result) {
    if (err) {
      console.log(err);
      console.log("ERROR in loading Summary")
    } else {
      var summary = result[0]["sumVal"];
      change_date = req.body.change;
      for (var i = 0; i <= summary.length - 1; i++) {
        if (summary[i]["Date"] == change_date) {
          t_arr.push(summary[i]["Date"]);
          t_arr.push(summary[i]["Day"]);
          t_arr.push(summary[i]["p1"]);
          t_arr.push(summary[i]["p2"]);
          t_arr.push(summary[i]["p3"]);
          t_arr.push(summary[i]["p4"]);
          t_arr.push(summary[i]["p5"]);
          t_arr.push(summary[i]["p6"]);
          t_arr.push(summary[i]["p7"]);
          break;
        }
      }
      res.render('adminsummary.ejs', {
        sumarr: summary,
        c_arr: t_arr,
        d_change: ""
      });
      t_arr = [];
    }
  });
});
//========================ADMIN SAVE TABLE ROUTE================================
router.post("/admin/savechanges", function(req, res) {
  //SUMMARY
  sumdata.find({}, function(err, result) {
    if (err) {
      console.log(err);
      console.log("ERROR in loading Summary")
    } else {
      var summary = result[0]["sumVal"];
      for (var i = 0; i <= summary.length - 1; i++) {
        if (summary[i]["Date"] == change_date) {
          if (req.body.save === "SAVE") {
            summary[i]["p1"] = req.body["p1"];
            summary[i]["p2"] = req.body.p2;
            summary[i]["p3"] = req.body.p3;
            summary[i]["p4"] = req.body.p4;
            summary[i]["p5"] = req.body.p5;
            summary[i]["p6"] = req.body.p6;
            summary[i]["p7"] = req.body.p7;
            break;
          } else if (req.body.save == "DELETE") {
            console.log("DELETED SUMMARY ENTRY");
            summary.splice(i, 1);
            break;
          }

        }
      }
      middleWare.summaryUpdate(summary);
      //Delay required for the above function to write to DB. Without it, /admin/summary will be called even without updating the summary value
      setTimeout(function() {
        // res.render('adminsummary.ejs',{sumarr:summary,c_arr:t_arr,d_change:"none"});
        res.redirect("/admin/summary");
      }, 2000);
    }
  });
});
//=============================ADMIN LOGOUT=====================================
router.get("/admin/logout", function(req, res) {
  if (!req.asession.user) {
    res.redirect('login');
  } else {
    req.asession.reset();
    res.redirect("login");
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("Admin Logout Successful " + " " + time);
  }
});

module.exports = router;
