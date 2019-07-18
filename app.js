var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
var alert = require('alert-node');
var JSAlert = require("js-alert");
var schedule = require('node-schedule');
var prependFile = require('prepend-file');
var cron = require('node-cron');
var session = require('client-sessions');
app.use(bodyParser.urlencoded({ extended: true }));
var uid;
var absent={};
var new_absent={};
var pass;
var timetable_read={};
var daily_timetable=[];
// var req.session.user="";
var inten_empty={};
var intent_empty_string="none";
var counter=0;
var alter_table="none";
var thk_res="";
var final_timetable={};
var summary={};
var c=0;
var sum_arr=[];
var abs_arr=[];
var per_arr=[];
var bun_arr=[];
var toatt_arr=[];
var active_users=[];
var active_time=[];
var login_count={};
var t_arr=[];
var change_date="";
// var day_att_counter=0;
// app.set('port',());
var uid_list=["U1703137","U1703138","U1703139","U1703140","U1703141","U1703142","U1703143","U1703144","U1703145","U1703146","U1703147","U1703148","U1703149","U1703150","U1703151","U1703152","U1703153","U1703154","U1703155","U1703156","U1703157","U1703158","U1703159","U1703160","U1703161","U1703162","U1703163","U1703164","U1703165","U1703166","U1703167","U1703168","U1703169","U1703170","U1703171","U1703172","U1703173","U1703174","U1703175","U1703176","U1703177","U1703178","U1703179","U1703180","U1703181","U1703182","U1703183","U1703184","U1703185","U1703186","U1703187","U1703188","U1703189","U1703190","U1703191","U1703192","U1703193","U1703194","U1703195","U1703196","U1703197","U1703198","U1703199","U1703200","U1703201","U1703202","U1703203","U1703204"]
var auth={
	'U1703137':{"name":"MOHAMED AIMAN","au_uid":"U1703137","au_pass":"17833","au_class":"S5-CSE-GAMMA"},
	'U1703138':{"name":"MUHSIN AHAMED FAZAL","au_uid":"U1703138","au_pass":"17364","au_class":"S5-CSE-GAMMA"},
	'U1703139':{"name":"NADIN MATHEW","au_uid":"U1703139","au_pass":"17816","au_class":"S5-CSE-GAMMA"},
	'U1703140':{"name":"NAMITHA JAMES","au_uid":"U1703140","au_pass":"17738","au_class":"S5-CSE-GAMMA"},
	'U1703141':{"name":"NAMITHA MARIA BENNY","au_uid":"U1703141","au_pass":"17058","au_class":"S5-CSE-GAMMA"},
	'U1703142':{"name":"NAVANEETH SANKAR EM","au_uid":"U1703142","au_pass":"17406","au_class":"S5-CSE-GAMMA"},
	"U1703143":{"name":"NEELIMA J JIMMY","au_uid":"U1703143","au_pass":"17496","au_class":"S5-CSE-GAMMA"},
	"U1703144":{"name":"NEERAJA RAJENDRA","au_uid":"U1703144","au_pass":"17045","au_class":"S5-CSE-GAMMA"},
	"U1703145":{"name":"NEHA K","au_uid":"U1703145","au_pass":"17082","au_class":"S5-CSE-GAMMA"},
	"U1703146":{"name":"NEHA MARIA SANIL","au_uid":"U1703146","au_pass":"17739","au_class":"S5-CSE-GAMMA"},
	"U1703147":{"name":"NIHAL ZAINUDIN NAINA","au_uid":"U1703147","au_pass":"17325","au_class":"S5-CSE-GAMMA"},
	"U1703148":{"name":"NIKHITHA THERESA ANTONY","au_uid":"U1703148","au_pass":"17300","au_class":"S5-CSE-GAMMA"},
	"U1703149":{"name":"NIKITA ARUN","au_uid":"U1703149","au_pass":"17497","au_class":"S5-CSE-GAMMA"},
	"U1703150":{"name":"NILEENA SUNIL","au_uid":"U1703150","au_pass":"17498","au_class":"S5-CSE-GAMMA"},
	"U1703151":{"name":"NIPUN ANOOB","au_uid":"U1703151","au_pass":"17740","au_class":"S5-CSE-GAMMA"},
	"U1703152":{"name":"NITHIN K M","au_uid":"U1703152","au_pass":"17076","au_class":"S5-CSE-GAMMA"},
	"U1703153":{"name":"NITHIN VALIYAVEEDU","au_uid":"U1703153","au_pass":"17015","au_class":"S5-CSE-GAMMA"},
	"U1703154":{"name":"NITIN RAJESH","au_uid":"U1703154","au_pass":"17741","au_class":"S5-CSE-GAMMA"},
	"U1703155":{"name":"NIVEDITHA VARMA","au_uid":"U1703155","au_pass":"17742","au_class":"S5-CSE-GAMMA"},
	"U1703156":{"name":"NOEL VIJI THALIATH","au_uid":"U1703156","au_pass":"17743","au_class":"S5-CSE-GAMMA"},
	"U1703157":{"name":"O.V. VARSHA","au_uid":"U1703157","au_pass":"17013","au_class":"S5-CSE-GAMMA"},
	"U1703158":{"name":"POOJA HARI","au_uid":"U1703158","au_pass":"17744","au_class":"S5-CSE-GAMMA"},
	"U1703159":{"name":"PRASIDH PRABUDHAN","au_uid":"U1703159","au_pass":"17174","au_class":"S5-CSE-GAMMA"},
	"U1703160":{"name":"PRAVEEN P","au_uid":"U1703160","au_pass":"17099","au_class":"S5-CSE-GAMMA"},
	"U1703161":{"name":"RAHUL S KUMAR","au_uid":"U1703161","au_pass":"17052","au_class":"S5-CSE-GAMMA"},
	"U1703162":{"name":"RAJIKA RAJESH","au_uid":"U1703162","au_pass":"17499","au_class":"S5-CSE-GAMMA"},
	"U1703163":{"name":"REENA MARY CHERIAN","au_uid":"U1703163","au_pass":"17500","au_class":"S5-CSE-GAMMA"},
	"U1703165":{"name":"RIA VARGHESE","au_uid":"U1703165","au_pass":"17501","au_class":"S5-CSE-GAMMA"},
	"U1703167":{"name":"RINTA SUSAN THOMAS","au_uid":"U1703167","au_pass":"17503","au_class":"S5-CSE-GAMMA"},
	"U1703168":{"name":"RITTA JERRARD","au_uid":"U1703168","au_pass":"17200","au_class":"S5-CSE-GAMMA"},
	"U1703170":{"name":"ROSHAN ANISH MEDAMANA","au_uid":"U1703170","au_pass":"17746","au_class":"S5-CSE-GAMMA"},
	"U1703171":{"name":"ROSHAN REJU","au_uid":"U1703171","au_pass":"17747","au_class":"S5-CSE-GAMMA"},
	"U1703172":{"name":"SACHIN SAJI MATHEW","au_uid":"U1703172","au_pass":"17049","au_class":"S5-CSE-GAMMA"},
	"U1703173":{"name":"SAIGOPIKA R","au_uid":"U1703173","au_pass":"17084","au_class":"S5-CSE-GAMMA"},
	"U1703174":{"name":"SANJANA RACHEL NINAN","au_uid":"U1703174","au_pass":"17748","au_class":"S5-CSE-GAMMA"},
	"U1703175":{"name":"SANJAY SONY","au_uid":"U1703175","au_pass":"17150","au_class":"S5-CSE-GAMMA"},
	"U1703176":{"name":"SANJU JACOB EBEY","au_uid":"U1703176","au_pass":"17749","au_class":"S5-CSE-GAMMA"},
	"U1703177":{"name":"SARA PHILO SHAJI","au_uid":"U1703177","au_pass":"17504","au_class":"S5-CSE-GAMMA"},
	"U1703178":{"name":"SARANG SURESH K","au_uid":"U1703178","au_pass":"17324","au_class":"S5-CSE-GAMMA"},
	"U1703179":{"name":"SARATH PRADEEP","au_uid":"U1703179","au_pass":"17141","au_class":"S5-CSE-GAMMA"},
	"U1703180":{"name":"SHALON WALTER","au_uid":"U1703180","au_pass":"17075","au_class":"S5-CSE-GAMMA"},
	"U1703181":{"name":"SHAWN BINU KOSHY","au_uid":"U1703181","au_pass":"17750","au_class":"S5-CSE-GAMMA"},
	"U1703182":{"name":"SHERIN BABY","au_uid":"U1703182","au_pass":"17151","au_class":"S5-CSE-GAMMA"},
	"U1703183":{"name":"SHREYA KURIAN","au_uid":"U1703183","au_pass":"17505","au_class":"S5-CSE-GAMMA"},
	"U1703184":{"name":"SIKHA SUNIL","au_uid":"U1703184","au_pass":"17817","au_class":"S5-CSE-GAMMA"},
	"U1703185":{"name":"SNEHA JOHNSON","au_uid":"U1703185","au_pass":"17095","au_class":"S5-CSE-GAMMA"},
	"U1703186":{"name":"SRESHTA JOHN ANTONY","au_uid":"U1703186","au_pass":"17319","au_class":"S5-CSE-GAMMA"},
	"U1703187":{"name":"SREYAMOL K R","au_uid":"U1703187","au_pass":"17634","au_class":"S5-CSE-GAMMA"},
	"U1703188":{"name":"SUJEESH V P","au_uid":"U1703188","au_pass":"17220","au_class":"S5-CSE-GAMMA"},
	"U1703189":{"name":"SULAKSHANA SARAH MATHEW","au_uid":"U1703189","au_pass":"17506","au_class":"S5-CSE-GAMMA"},
	"U1703190":{"name":"SURYA RATNAM CHERIAN","au_uid":"U1703190","au_pass":"17751","au_class":"S5-CSE-GAMMA"},
	"U1703191":{"name":"SWAPNA THOMAS","au_uid":"U1703191","au_pass":"17507","au_class":"S5-CSE-GAMMA"},
	"U1703192":{"name":"TESSA PAUL","au_uid":"U1703192","au_pass":"17752","au_class":"S5-CSE-GAMMA"},
	"U1703193":{"name":"THANIMA MANOJ","au_uid":"U1703193","au_pass":"17320","au_class":"S5-CSE-GAMMA"},
	"U1703194":{"name":"TINA JOSEPH","au_uid":"U1703194","au_pass":"17509","au_class":"S5-CSE-GAMMA"},
	"U1703195":{"name":"TOM K THOMAS","au_uid":"U1703195","au_pass":"17510","au_class":"S5-CSE-GAMMA"},
	"U1703196":{"name":"TONEY K JOSE","au_uid":"U1703196","au_pass":"17163","au_class":"S5-CSE-GAMMA"},
	"U1703197":{"name":"TREASA MANI","au_uid":"U1703197","au_pass":"17511","au_class":"S5-CSE-GAMMA"},
	"U1703198":{"name":"UMESH P L","au_uid":"U1703198","au_pass":"17020","au_class":"S5-CSE-GAMMA"},
	"U1703199":{"name":"VIJAY VINOD","au_uid":"U1703199","au_pass":"17218","au_class":"S5-CSE-GAMMA"},
	"U1703200":{"name":"VIKRAM SARVESH","au_uid":"U1703200","au_pass":"17068","au_class":"S5-CSE-GAMMA"},
	"U1703201":{"name":"VINAY","au_uid":"U1703201","au_pass":"17753","au_class":"S5-CSE-GAMMA"},
	"U1703202":{"name":"VISHAK J NAIR","au_uid":"U1703202","au_pass":"17818","au_class":"S5-CSE-GAMMA"},
	"U1703203":{"name":"VYSAKH MURALI","au_uid":"U1703203","au_pass":"17239","au_class":"S5-CSE-GAMMA"},
	"U1703204":{"name":"VYSAKH THACHILETH POULOSE","au_uid":"U1703204","au_pass":"17512","au_class":"S5-CSE-GAMMA"}
}
var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var week=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("styles"));

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
	httpOnly: true,
  secure: true,
  ephemeral: true
}));
app.use(session({
  cookieName: 'asession',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
	httpOnly: true,
  secure: true,
  ephemeral: true
}));
var d=new Date();
console.log("INITIAL"+d);
var day=week[d.getDay()];
var d_1=d.getDate().toString();
var d_2=month[d.getMonth()];
var d_3=d.getFullYear().toString();
var current_date=d_1+"-"+d_2+"-"+d_3;

function dateupdate(){
	d=new Date();
	day=week[d.getDay()];
	d_1=d.getDate().toString();
	d_2=month[d.getMonth()];
	d_3=d.getFullYear().toString();
	current_date=d_1+"-"+d_2+"-"+d_3;
	//======
	console.log("INSIDE DATE UPDATE");
	if(d.getDay()==0 || d.getDay()==6){
		const fs = require('fs');
		fs.writeFile('data/checkbox.txt', JSON.stringify(inten_empty, null, 2) ,function(err,result){
			console.log("CHANGED TO NULL SINCE SATURDAY OR SUNDAY");
			intent_empty_string="none"
		});
	}else if(d.getDay()==1){
		for(var i=1;i<8;i++){
			var temp="1_"+i.toString();
			daily_timetable.push(temp);
		}
	}else if(d.getDay()==2){
		for(var i=1;i<8;i++){
			var temp="2_"+i.toString();
			daily_timetable.push(temp);
		}
	}else if(d.getDay()==3){
		for(var i=1;i<8;i++){
			var temp="3_"+i.toString();
			daily_timetable.push(temp);
		}
	}else if(d.getDay()==4){
		for(var i=1;i<8;i++){
			var temp="4_"+i.toString();
			daily_timetable.push(temp);
		}
	}else if(d.getDay()==5){
		for(var i=1;i<8;i++){
			var temp="5_"+i.toString();
			daily_timetable.push(temp);
		}
	}
}
//add the below code inside the above function during final submit
//already done
	const fs = require('fs');
	fs.writeFile('data/daytable.txt', JSON.stringify(daily_timetable, null, 2) ,function(err,result){
		console.log("DAY'S TIMETABLE WRITTEN");
	});

app.get("/",function(req,res){
	if(!req.session.user){
		res.redirect('login');
	}else{
		res.redirect('home')
	}

});
app.get("/login",function(req,res){
  res.render('login.ejs',{in_cred:"none",in_pass:"none"});
});
app.get("/admin/login",function(req,res){
  res.render('adminlogin.ejs',{in_cred:"none"});
});
app.get("/admin/logout",function(req,res){
	if(!req.asession.user){
		res.redirect('login');
	}else{
		req.asession.reset();
		res.redirect("login");
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		console.log("Admin Logout Successful "+" "+time);
	}
});
app.get("/admin/summary",function(req,res){
	fs.readFile('data/summary.txt', 'utf-8', (err, data) => {
		if (err) throw err;
		summary=JSON.parse(data)
  res.render('adminsummary.ejs',{sumarr:summary,c_arr:t_arr,d_change:"none"});
});
});
app.post("/admin/changetable",function(req,res){
	console.log(req.body);
	fs.readFile('data/summary.txt', 'utf-8', (err, data) => {
		if (err) throw err;
		summary=JSON.parse(data);
		change_date=req.body.change;
		console.log(req.body);
		for(var i=0;i<=summary.length-1;i++){
			if(summary[i]["Date"]==change_date){
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
		console.log(t_arr);
		res.render('adminsummary.ejs',{sumarr:summary,c_arr:t_arr,d_change:""});
		t_arr=[];
	});
});
app.post("/admin/savechanges",function(req,res){
	fs.readFile('data/summary.txt', 'utf-8', (err, data) => {
		if (err) throw err;
		summary=JSON.parse(data);
		console.log(req.body)
		for(var i=0;i<=summary.length-1;i++){
			if(summary[i]["Date"]==change_date){
				summary[i]["p1"]=req.body["p1"];
				summary[i]["p2"]=req.body.p2;
				summary[i]["p3"]=req.body.p3;
				summary[i]["p4"]=req.body.p4;
				summary[i]["p5"]=req.body.p5;
				summary[i]["p6"]=req.body.p6;
				summary[i]["p7"]=req.body.p7;
				break;
			}
		}
		fs.writeFile('data/summary.txt', JSON.stringify(summary, null, 2) ,function(err,result){
		});
	res.render('adminsummary.ejs',{sumarr:summary,c_arr:t_arr,d_change:"none"});
});
});
app.get("/admin/home",function(req,res){
	if(!req.asession.user){
		res.redirect('login');
	}else{
		fs.readFile('data/log_user.txt', 'utf-8', (err, data2) => {
			if (err) throw err;
			var u_id="U1703"
			var count=0;
			var log_user=JSON.parse(data2);
			for(var i=137;i<205;i++){
				if(i==164 || i==166 || i==169){
					continue;
				}
				var u_i_d=u_id+i.toString();
				login_count[u_i_d]={};
				login_count[u_i_d].uid=u_i_d;
				var t=auth[u_i_d].name;
				login_count[u_i_d].name=t;
				var regex = new RegExp(t, "g");
				var count=(data2.match(regex) || []).length;
				login_count[u_i_d].count=count;
			}

			fs.writeFile('data/log_count.txt', JSON.stringify(login_count, null, 2) ,function(err,result){
				console.log("User Name added to Log");
			});
			fs.readFile('data/log_time.txt', 'utf-8', (err, data3) => {
				if (err) throw err;
				var log_time=JSON.parse(data3);
				res.render('adminhome.ejs',{log_user:log_user,log_time:log_time,log_count:login_count});
				});
			});

	}

});


app.post("/admin/home",function(req,res){
	uid = req.body.user;
	pass = req.body.pass;
	if(uid=="admin" && pass=="kava2kaka"){
		req.asession.user = uid;
		fs.readFile('data/log_user.txt', 'utf-8', (err, data2) => {
			if (err) throw err;
			var u_id="U1703"
			var count=0;
			var log_user=JSON.parse(data2);
			for(var i=137;i<205;i++){
				if(i==164 || i==166 || i==169){
					continue;
				}
				var u_i_d=u_id+i.toString();
				login_count[u_i_d]={};
				login_count[u_i_d].uid=u_i_d;
				var t=auth[u_i_d].name;
				login_count[u_i_d].name=t;
				var regex = new RegExp(t, "g");
				var count=(data2.match(regex) || []).length;
				login_count[u_i_d].count=count;
			}

			fs.writeFile('data/log_count.txt', JSON.stringify(login_count, null, 2) ,function(err,result){
				console.log("User Name added to Log");
			});
			fs.readFile('data/log_time.txt', 'utf-8', (err, data3) => {
				if (err) throw err;
				var log_time=JSON.parse(data3);
				res.render('adminhome.ejs',{log_user:log_user,log_time:log_time,log_count:login_count});
			});
		});
	}else{
		res.render('adminlogin.ejs',{in_cred:""});
	}

});

app.post("/home",function(req,res){
  uid = req.body.user;
  pass = req.body.pass;
	uid=uid.toUpperCase();
	// req.session.user=uid;
  var counter=0;
  for(var i=0;i<uid_list.length;i++){
    if(uid_list[i]===uid){
      console.log(uid_list[i]);
      counter++;
    }
  }
  if(counter>0){
    if(auth[uid].au_uid===uid && auth[uid].au_pass===pass){
				req.session.user = uid;
				var today = new Date();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				fs.readFile('data/log_user.txt', 'utf-8', (err, data2) => {
					if (err) throw err;
					var log_user=JSON.parse(data2);
					log_user.unshift(auth[uid].name);
					fs.writeFile('data/log_user.txt', JSON.stringify(log_user, null, 2) ,function(err,result){
						console.log("User Name added to Log");
					});

				});
				fs.readFile('data/log_time.txt', 'utf-8', (err, data3) => {
					if (err) throw err;
					var log_time=JSON.parse(data3)
					log_time.unshift(time);
					fs.writeFile('data/log_time.txt', JSON.stringify(log_time, null, 2) ,function(err,result){
						console.log("User Login time added to Log");
					});
				});
        console.log("Login Success " + auth[uid].name+" " + time);
        (async () => {
          const browser = await puppeteer.launch({ headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox']});
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
          const data = await page.$$eval('table tr td[valign="middle"]', tds => tds.map((td) => {
          return td.innerText;
          }));
          data.splice(0,9);
          for(var i=0;i<=data.length+10;i++){
            var d = data.splice(0,8);
            var key = d[0];
            var values=d.slice(1,8);
            absent[key]={};
            absent[key].key=key;
            absent[key].value=values;
          }


					function explode(){
						const fs = require('fs');
						var link='absent/'+uid+'.txt';
						fs.writeFile(link, JSON.stringify(absent, null, 2) ,function(err,result){
							console.log("ABSENT DATA WRITTEN TO FILE");
							fs.readFile('data/checkbox.txt', 'utf-8', (err, data) => {
								if (err) throw err;
								var chkbox=JSON.parse(data)
								if(Object.keys(chkbox).length==0){
									fs.readFile('data/timetable.txt', 'utf-8', (err, data1) => {
										if (err) throw err;
										timetable_read=JSON.parse(data1)
										// console.log("READ FILE");
										fs.readFile('data/daytable.txt', 'utf-8', (err, data2) => {
											if (err) throw err;
											var day_table=JSON.parse(data2)
											//=========================================
											fs.readFile('data/summary.txt', 'utf-8', (err, data3) => {
												if (err) throw err;
												var count_301=(data3.match(/CS301/g) || []).length;
												var count_303=(data3.match(/CS303/g) || []).length;
												var count_305=(data3.match(/CS305/g) || []).length;
												var count_307=(data3.match(/CS307/g) || []).length;
												var count_309=(data3.match(/CS309/g) || []).length;
												var elective=(data3.match(/Elective/g) || []).length;
												var count_331=(data3.match(/CS331/g) || []).length;
												var count_333=(data3.match(/CS333/g) || []).length;
												var count_341=(data3.match(/CS341/g) || []).length;
												sum_arr.push(count_301);
												sum_arr.push(count_303);
												sum_arr.push(count_305);
												sum_arr.push(count_307);
												sum_arr.push(count_309);
												sum_arr.push(elective);
												sum_arr.push(count_331);
												sum_arr.push(count_333);
												sum_arr.push(count_341);
												// console.log(sum_arr);
												var link='absent/'+"U1703143"+'.txt';
												fs.readFile(link, 'utf-8', (err, data4) => {
													if (err) throw err;
													var a_count_301=(data4.match(/CS301/g) || []).length;
													var a_count_303=(data4.match(/CS303/g) || []).length;
													var a_count_305=(data4.match(/CS305/g) || []).length;
													var a_count_307=(data4.match(/CS307/g) || []).length;
													var a_count_309=(data4.match(/CS309/g) || []).length;
													var a_elective=(data4.match(/Elective/g) || []).length;
													var a_count_331=(data4.match(/CS331/g) || []).length;
													var a_count_333=(data4.match(/CS333/g) || []).length;
													var a_count_341=(data4.match(/CS341/g) || []).length;
													abs_arr.push(a_count_301);
													abs_arr.push(a_count_303);
													abs_arr.push(a_count_305);
													abs_arr.push(a_count_307);
													abs_arr.push(a_count_309);
													abs_arr.push(a_elective);
													abs_arr.push(a_count_331);
													abs_arr.push(a_count_333);
													abs_arr.push(a_count_341);
													// console.log(abs_arr);
													for(var i=0;i<9;i++){
														var temp_val = sum_arr[i]-abs_arr[i];
														var temp_va= temp_val/sum_arr[i];
														var temp_v=temp_va*100;
														per_arr.push(temp_v.toFixed(2));
													}
													// console.log(per_arr);
													for(var i=0;i<9;i++){
														var loop_temp_sum=sum_arr[i];
														var loop_temp_abs=abs_arr[i];
														var j =1;
														var k =1;
														var bunk_count=0;
														var att_count=0;
														while(j!=0){
															if(loop_temp_abs*4<loop_temp_sum){
																bunk_count++;
																loop_temp_abs++;
																loop_temp_sum++;
															}else{
																j=0;
															}
														}
														if(bunk_count==0){
															var loop_temp_sum=sum_arr[i];
															var loop_temp_abs=abs_arr[i];
															while(k!=0){
																if(loop_temp_abs*4>loop_temp_sum){
																	att_count++;
																	loop_temp_sum++;
																}else{
																	k=0;
																}
															}
															if(att_count!=0){
																att_count++;
															}
														}else if(bunk_count>0){
															bunk_count--;
														}
														bun_arr.push(bunk_count);
														toatt_arr.push(att_count);
													}
													// console.log(bun_arr);
													res.render('profile.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class,data:current_date,date:current_date,day:day,check_ed:" ",arr:day_table,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
												});
											});
											//=========================================

									});
								});
							}else{ //Else condition is necessary, otherwise on entering home route from login, the toggle button will be always turned OFF (tried it)
										fs.readFile('data/timetable.txt', 'utf-8', (err, data1) => {
										if (err) throw err;
										timetable_read=JSON.parse(data1)
										// console.log("READ FILE");
												fs.readFile('data/daytable.txt', 'utf-8', (err, data2) => {
													if (err) throw err;
													var day_table=JSON.parse(data2)
													fs.readFile('data/summary.txt', 'utf-8', (err, data3) => {
														if (err) throw err;
														var count_301=(data3.match(/CS301/g) || []).length;
														var count_303=(data3.match(/CS303/g) || []).length;
														var count_305=(data3.match(/CS305/g) || []).length;
														var count_307=(data3.match(/CS307/g) || []).length;
														var count_309=(data3.match(/CS309/g) || []).length;
														var elective=(data3.match(/Elective/g) || []).length;
														var count_331=(data3.match(/CS331/g) || []).length;
														var count_333=(data3.match(/CS333/g) || []).length;
														var count_341=(data3.match(/CS341/g) || []).length;
														sum_arr.push(count_301);
														sum_arr.push(count_303);
														sum_arr.push(count_305);
														sum_arr.push(count_307);
														sum_arr.push(count_309);
														sum_arr.push(elective);
														sum_arr.push(count_331);
														sum_arr.push(count_333);
														sum_arr.push(count_341);
														// console.log(sum_arr);
														var link='absent/'+"U1703143"+'.txt';
														fs.readFile(link, 'utf-8', (err, data4) => {
															if (err) throw err;
															var a_count_301=(data4.match(/CS301/g) || []).length;
															var a_count_303=(data4.match(/CS303/g) || []).length;
															var a_count_305=(data4.match(/CS305/g) || []).length;
															var a_count_307=(data4.match(/CS307/g) || []).length;
															var a_count_309=(data4.match(/CS309/g) || []).length;
															var a_elective=(data4.match(/Elective/g) || []).length;
															var a_count_331=(data4.match(/CS331/g) || []).length;
															var a_count_333=(data4.match(/CS333/g) || []).length;
															var a_count_341=(data4.match(/CS341/g) || []).length;
															abs_arr.push(a_count_301);
															abs_arr.push(a_count_303);
															abs_arr.push(a_count_305);
															abs_arr.push(a_count_307);
															abs_arr.push(a_count_309);
															abs_arr.push(a_elective);
															abs_arr.push(a_count_331);
															abs_arr.push(a_count_333);
															abs_arr.push(a_count_341);
															// console.log(abs_arr);
															for(var i=0;i<9;i++){
																var temp_val = sum_arr[i]-abs_arr[i];
																var temp_va= temp_val/sum_arr[i];
																var temp_v=temp_va*100;
																per_arr.push(temp_v.toFixed(2));
															}
															// console.log(per_arr);
															for(var i=0;i<9;i++){
																var loop_temp_sum=sum_arr[i];
																var loop_temp_abs=abs_arr[i];
																var j =1;
																var k=1;
																var bunk_count=0;
																var att_count=0;
																while(j!=0){
																	if(loop_temp_abs*4<loop_temp_sum){
																		bunk_count++;
																		loop_temp_abs++;
																		loop_temp_sum++;
																	}else{
																		j=0;
																	}
																}
																if(bunk_count==0){
																	var loop_temp_sum=sum_arr[i];
																	var loop_temp_abs=abs_arr[i];
																	while(k!=0){
																		if(loop_temp_abs*4>loop_temp_sum){
																			att_count++;
																			loop_temp_sum++;
																		}else{
																			k=0;
																		}
																	}
																}else if(bunk_count>0){
																	bunk_count--;
																}
																bun_arr.push(bunk_count);
																toatt_arr.push(att_count);
															}
															res.render('profile.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class,data:current_date,date:current_date,day:day,check_ed:"checked",arr:day_table,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
												});
											});
										});
									});
						}
					});
				});
			}
					setTimeout(explode, 10000);

          await browser.close();
        })();
      }else{
				res.render('login.ejs',{in_cred:"none",in_pass:""});
        console.log("Invalid Password");
      }
  }else{
		res.render('login.ejs',{in_cred:"",in_pass:"none"});
    console.log("Invalid UID");

  }
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// const fs=require('fs');
	// var link='absent/'+uid+'.txt';
	// function delaying(){
	// 	fs.readFile(link, 'utf-8', (err, data) => {
	// 		if (err) throw err;
	// 		var new_absent=JSON.parse(data)
	// 		console.log(new_absent);
	// });
	// }
	// setTimeout(delaying,50000);
    });

		app.get("/home",function(req,res){
			if(!req.session.user){
				res.redirect('login');
			}else{
			const fs = require('fs');
			fs.readFile('data/checkbox.txt', 'utf-8', (err, data) => {
				if (err) throw err;
				var chkbox=JSON.parse(data)
				if(Object.keys(chkbox).length==0){
					fs.readFile('data/timetable.txt', 'utf-8', (err, data1) => {
						if (err) throw err;
						timetable_read=JSON.parse(data1)

						res.render('profile.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class,data:current_date,date:current_date,day:day,check_ed:" ",arr:daily_timetable,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
					});
				}else{
					fs.readFile('data/timetable.txt', 'utf-8', (err, data1) => {
					if (err) throw err;
					timetable_read=JSON.parse(data1)
					res.render('profile.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class,data:current_date,date:current_date,day:day,check_ed:"checked",arr:daily_timetable,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
					});
			}
			});
		}
		});
		app.get("/logout",function(req,res){
			if(!req.session.user){
				res.redirect('login');
			}else{
				var index = active_users.indexOf(req.session.user);
				if (index > -1) {
	  			active_users.splice(index, 1);
					active_time.splice(index,1);
				}
				var t=auth[req.session.user].name;
				req.session.reset();
				res.redirect("/login");
				var today = new Date();
				var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
				console.log("Logout Successful "+t+" "+time);
			}
		})
		app.get("/instructions",function(req,res){
			if(!req.session.user){
				res.redirect('login');
			}else{
				res.render('instructions.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class});
			}

		});


		//ROUTE ASSOCIATED WITH CHECKBOX
		app.post("/workday",function(req,res){
			const fs = require('fs');
			fs.writeFile('data/checkbox.txt', JSON.stringify(req.body, null, 2) ,function(err,result){
				if(Object.keys(req.body).length==0){
					console.log("CHECKBOX UNTICKED");
				}else{
					console.log("CHECKBOX TICKED")
				}
			});
			res.redirect('/home');
		});


		app.post("/ttable_alter",function(req,res){
			console.log(req.body);
			if(req.body.yesno==='No'){
				alter_table="";
				thk_res="";
				intent_empty_string="none"
				counter=1;
				res.redirect('/home');
				console.log("Change in Day's Timetable");
			}else if(req.body.yesno==='Yes'){
				counter=0;
				thk_res="Thank You for your response"
				alter_table="none";
				intent_empty_string="none"
				res.redirect('/home');
				console.log("No Change in Day's Timetable");
			}
		});

		//Both the routes below serves the purpose of getting the schedule of the day if the normal timetable was not followed correctly
		app.post("/ttable_alter_absent",function(req,res){
			alter_table="";
			thk_res="";
			intent_empty_string="none"
			counter=1;
			res.redirect('/home');
		});
		app.post('/edittable',function(req,res){
			console.log(req.body);
			fs.writeFile('data/changed_table.txt', JSON.stringify(req.body, null, 2) ,function(err,result){
				console.log(" NEW TIMETABLE FOR THAT SPECIFIC DAY WRITTEN");
			});
			thk_res="Thank You for your response"
			intent_empty_string="none"
			alter_table="none";
			res.redirect('/home');
		});

		app.post("/timetable",function(req,res){
			const fs = require('fs');
			final_timetable['Monday']={};
			final_timetable['Tuesday']={};
			final_timetable['Wednesday']={};
			final_timetable['Thursday']={};
			final_timetable['Friday']={};
			var temp_arr=Object.keys(req.body);
			for(i=0;i<temp_arr.length;i++){
				if(temp_arr[i]=="1_1" || temp_arr[i]=="1_2" || temp_arr[i]=="1_3" || temp_arr[i]=="1_4" || temp_arr[i]=="1_5"){
					final_timetable['Monday'][temp_arr[i]]=req.body[temp_arr[i]];
				}else if(temp_arr[i]=="2_1" || temp_arr[i]=="2_2" || temp_arr[i]=="2_3" || temp_arr[i]=="2_4" || temp_arr[i]=="2_5"){
					final_timetable['Tuesday'][temp_arr[i]]=req.body[temp_arr[i]];
				}else if(temp_arr[i]=="3_1" || temp_arr[i]=="3_2" || temp_arr[i]=="3_3" || temp_arr[i]=="3_4" || temp_arr[i]=="3_5"){
					final_timetable['Wednesday'][temp_arr[i]]=req.body[temp_arr[i]];
				}else if(temp_arr[i]=="4_1" || temp_arr[i]=="4_2" || temp_arr[i]=="4_3" || temp_arr[i]=="4_4" || temp_arr[i]=="4_5"){
					final_timetable['Thursday'][temp_arr[i]]=req.body[temp_arr[i]];
				}else if(temp_arr[i]=="5_1" || temp_arr[i]=="5_2" || temp_arr[i]=="5_3" || temp_arr[i]=="5_4" || temp_arr[i]=="5_5"){
					final_timetable['Friday'][temp_arr[i]]=req.body[temp_arr[i]];
				}
			}
			fs.writeFile('data/finalisedtimetable.txt', JSON.stringify(final_timetable, null, 2) ,function(err,result){
				console.log(" TIMETABLE WRITTEN");
			});

			fs.writeFile('data/timetable.txt', JSON.stringify(req.body, null, 2) ,function(err,result){
				console.log(" TIMETABLE WRITTEN");
			});
			res.render('ttable.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class,table:req.body});
		});
		app.get("/summary",function(req,res){
			if(!req.session.user){
				res.redirect('login');
			}else{
			const fs = require('fs');
			fs.readFile('data/summary.txt', 'utf-8', (err, data) => {
				if (err) throw err;
				summary=JSON.parse(data)
				// console.log(summary);
				res.render('summary.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class,sumarr:summary});
			});
		}
		});

		app.get("/timetable",function(req,res){
			if(!req.session.user){
				res.redirect('login');
			}else{
			const fs = require('fs');
			fs.readFile('data/timetable.txt', 'utf-8', (err, data) => {
				if (err) throw err;
				timetable_read=JSON.parse(data)
				console.log("READ FILE");
			});
			setTimeout(function() {
				res.render('ttable.ejs',{stud_name:auth[req.session.user].name , class_name:auth[req.session.user].au_class,table:timetable_read});
		}, 3000);
		}
		});




		//===========================================================================
		var resetTime = new Date();
		resetTime.setHours(12,30,0);

		function loop() {
			var empty=[];
			var d=new Date();
			console.log("Inside LOOP");
			const fs = require('fs');
				fs.readFile('data/checkbox.txt', 'utf-8', (err, data) => {
					if (err) throw err;
					var chkbox=JSON.parse(data)
					fs.readFile('data/summary.txt', 'utf-8', (err, data) => {
						if (err) throw err;
						var sum=JSON.parse(data)
						if(Object.keys(chkbox).length!=0){
								console.log("Checkbox Ticked");
									if(counter==0){ //No change in day's timetable
											if(d.getDay()==1){
												empty.push(current_date);
												empty.push("Monday");
												for(i=1;i<=7;i++){
													var temp="1_"+ i.toString();
													empty.push(temp);
												}
												const fs = require('fs');
												fs.readFile('data/timetable.txt', 'utf-8', (err, data) => {
													if (err) throw err;
													ftt=JSON.parse(data);
												});
												function madedelay(){
													summary["Date"]=empty[0];
													summary["Day"]=empty[1];
													summary["p1"]=ftt["1_1"]; //Could have used the above temp array. But nevermind.
													summary["p2"]=ftt["1_2"];
													summary["p3"]=ftt["1_3"];
													summary["p4"]=ftt["1_4"];
													summary["p5"]=ftt["1_5"];
													summary["p6"]=ftt["1_6"];
													summary["p7"]=ftt["1_7"];
													sum.unshift(summary);
													fs.writeFile('data/summary.txt', JSON.stringify(sum, null, 2) ,function(err,result){
													});
												}
												setTimeout(madedelay,5000);
											}else if(d.getDay()==2){
												console.log("INSIDE Second Loop)");
												empty.push(current_date);
												empty.push("Tuesday");
												for(i=1;i<=7;i++){
												var temp="2_"+ i.toString();
												empty.push(temp);
												}
												console.log(empty);
												const fs = require('fs');
												fs.readFile('data/timetable.txt', 'utf-8', (err, data) => {
													if (err) throw err;
													ftt=JSON.parse(data);
												});
												function madedelay(){
													console.log("Inside Made Delay");
													summary["Date"]=empty[0];
													summary["Day"]=empty[1];
													summary["p1"]=ftt["2_1"];
													summary["p2"]=ftt["2_2"];
													summary["p3"]=ftt["2_3"];
													summary["p4"]=ftt["2_4"];
													summary["p5"]=ftt["2_5"];
													summary["p6"]=ftt["2_6"];
													summary["p7"]=ftt["2_7"];
													sum.unshift(summary);
													fs.writeFile('data/summary.txt', JSON.stringify(sum, null, 2) ,function(err,result){
													});
												}
												setTimeout(madedelay,5000);

											}else if(d.getDay()==3){
												empty.push(current_date);
												empty.push("Wednesday");
												for(i=1;i<=7;i++){
												var temp="3_"+ i.toString();
												empty.push(temp);
												}
												const fs = require('fs');
												fs.readFile('data/timetable.txt', 'utf-8', (err, data) => {
													if (err) throw err;
													ftt=JSON.parse(data);
												});
												function madedelay(){
													summary["Date"]=empty[0];
													summary["Day"]=empty[1];
													summary["p1"]=ftt["3_1"];
													summary["p2"]=ftt["3_2"];
													summary["p3"]=ftt["3_3"];
													summary["p4"]=ftt["3_4"];
													summary["p5"]=ftt["3_5"];
													summary["p6"]=ftt["3_6"];
													summary["p7"]=ftt["3_7"];
													sum.unshift(summary);
													fs.writeFile('data/summary.txt', JSON.stringify(sum, null, 2) ,function(err,result){
													});
												}
												setTimeout(madedelay,5000);
											}else if(d.getDay()==4){
												empty.push(current_date);
												empty.push("Thursday");
												for(i=1;i<=7;i++){
												var temp="4_"+ i.toString();
												empty.push(temp);
												}
												const fs = require('fs');
												fs.readFile('data/timetable.txt', 'utf-8', (err, data) => {
													if (err) throw err;
													ftt=JSON.parse(data);
												});
												function madedelay(){
													summary["Date"]=empty[0];
													summary["Day"]=empty[1];
													summary["p1"]=ftt["4_1"];
													summary["p2"]=ftt["4_2"];
													summary["p3"]=ftt["4_3"];
													summary["p4"]=ftt["4_4"];
													summary["p5"]=ftt["4_5"];
													summary["p6"]=ftt["4_6"];
													summary["p7"]=ftt["4_7"];
													sum.unshift(summary);
													fs.writeFile('data/summary.txt', JSON.stringify(sum, null, 2) ,function(err,result){
													});
												}
												setTimeout(madedelay,5000);
											}else if(d.getDay()==5){
												empty.push(current_date);
												empty.push("Friday");
												for(i=1;i<=7;i++){
												var temp="5_"+ i.toString();
												empty.push(temp);
												}
												const fs = require('fs');
												fs.readFile('data/timetable.txt', 'utf-8', (err, data) => {
													if (err) throw err;
													ftt=JSON.parse(data);
												});
												function madedelay(){
													summary["Date"]=empty[0];
													summary["Day"]=empty[1];
													summary["p1"]=ftt["5_1"];
													summary["p2"]=ftt["5_2"];
													summary["p3"]=ftt["5_3"];
													summary["p4"]=ftt["5_4"];
													summary["p5"]=ftt["5_5"];
													summary["p6"]=ftt["5_6"];
													summary["p7"]=ftt["5_7"];
													sum.unshift(summary);
													fs.writeFile('data/summary.txt', JSON.stringify(sum, null, 2) ,function(err,result){
													});
												}
												setTimeout(madedelay,5000);
											}
								}else if(counter==1){ //Change in day's table
									fs.readFile('data/changed_table.txt', 'utf-8', (err, data) => {
										if (err) throw err;
										ftt=JSON.parse(data)
										console.log("Read data from changed table");
									});
									function madedelay(){
										var c_name=d.getDay();
										var c_day=week[c_name];
										summary["Date"]=current_date;
										summary["Day"]=c_day;
										summary["p1"]=ftt["a_1"];
										summary["p2"]=ftt["a_2"];
										summary["p3"]=ftt["a_3"];
										summary["p4"]=ftt["a_4"];
										summary["p5"]=ftt["a_5"];
										summary["p6"]=ftt["a_6"];
										summary["p7"]=ftt["a_7"];
										sum.unshift(summary);
										fs.writeFile('data/summary.txt', JSON.stringify(sum, null, 2) ,function(err,result){
										});
									}
									setTimeout(madedelay,5000);

								}

		}else{
			console.log("CHECKBOX UNTICKED");
		}
		});
	});
}

//COMMENT THIS OUT LATER BEFORE DEPLOYMENT
// function dailytablecheck(){ //FUNCTION USED to be called by cron job daily once
// 	var currentD = new Date();
// 	var startHappyHourD = new Date();
// 	startHappyHourD.setHours(12,00,0); // 6.30 pm
// 	var endHappyHourD = new Date();
// 	endHappyHourD.setHours(23,55,0); // 11.55 pm
// 	if(currentD >= startHappyHourD && currentD < endHappyHourD ){
// 			intent_empty_string="";
// 	}else{
// 			intent_empty_string="none";
// 	}
// }


		// var c_date = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		// var daily_c_value = new Date();
		// daily_c_value.setHours(11,22,0);
		// console.log(daily_c_value);
		cron.schedule('20 54 08 * * 0-6', () => { //CRON JOB FOR DAILY DATE UPDATE 00:15
			counter=0;
			dateupdate();
  		console.log('Date Update at 12:15 AM');
			console.log(current_date);

			fs.readFile('data/log_user.txt', 'utf-8', (err, data2) => {
				if (err) throw err;
				var log_user=JSON.parse(data2);

				log_user.unshift(current_date);
				fs.writeFile('data/log_user.txt', JSON.stringify(log_user, null, 2) ,function(err,result){
					// console.log("User Name added to Log");
				});
			});
			fs.readFile('data/log_time.txt', 'utf-8', (err, data3) => {
				if (err) throw err;
				var log_time=JSON.parse(data3)
				log_time.unshift(" ");
				fs.writeFile('data/log_time.txt', JSON.stringify(log_time, null, 2) ,function(err,result){
					// console.log("User Login time added to Log");
				});
			});

		},{
			timeZone:'Asia/Kolkata'
		});
		cron.schedule('00 00 23 * * 0-6', () => { //CRON JOB FOR ADDING DAILY SCHEDULE TO SUMMARY 23:00
			loop();
		},{
			timeZone:'Asia/Kolkata'
		});
		cron.schedule('00 30 13 * * 0-6', () => { //CRON JOB TO SHOW OPTIONS TO CHANGE DAY'S TABLE 16:30
			// dailytablecheck();
			fs.readFile('data/checkbox.txt', 'utf-8', (err, data) => {
				if (err) throw err;
				var chkbox=JSON.parse(data)
				if(Object.keys(chkbox).length!=0){
					intent_empty_string="";
					thk_res=""
				}
			});
		},{
			timeZone:'Asia/Kolkata'
		});
		cron.schedule('00 32 04 * * 0-6', () => { //CRON JOB FOR DISABLE OPTIONS TO CHANGE DAY'S TIMETABLE 22:30
			// dailytablecheck();
			intent_empty_string="none";
			thk_res=""
		},{
			timeZone:'Asia/Kolkata'
		});

app.listen(process.env.PORT || 5000,function(){
  console.log("Server Started");
})
