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
var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
var uid;
var absent=[];
var new_absent={};
var pass;
var timetable_read={};
var daily_timetable=[];
var inten_empty={};
var intent_empty_string="none";
var counter=0;
var alter_table="none";
var thk_res="";
var final_timetable={};
var summary={};
var c=0;
var active_users=[];
var active_time=[];
var login_count={};
var t_arr=[];
var change_date="";
var absent_t={};
const fs=require('fs');

const uri = process.env.MONGODB_URI;
mongoose.connect(uri,{dbName:'rsms_attendance',useNewUrlParser:true});
var studSchema=new mongoose.Schema({
	name:String,
	au_uid:String,
	au_pass:String,
	au_class:String
});
var absentSchema=new mongoose.Schema({
	uid:String,
	date:String,
	value:[String]
});
var checkSchema=new mongoose.Schema({
	state:Boolean
});
var changedTableSchema=new mongoose.Schema({
	a_1:String,
	a_2:String,
	a_3:String,
	a_4:String,
	a_5:String,
	a_6:String,
	a_7:String,
	changedval:String
});
var dayTableSchema=new mongoose.Schema({
	daytable:[String]
})
var timeTableSchema=new mongoose.Schema({
	"1_1":String,"1_2":String,"1_3":String,"1_4":String,"1_5":String,"1_6":String,"1_7":String,
	"2_1":String,"2_2":String,"2_3":String,"2_4":String,"2_5":String,"2_6":String,"2_7":String,
	"3_1":String,"3_2":String,"3_3":String,"3_4":String,"3_5":String,"3_6":String,"3_7":String,
	"4_1":String,"4_2":String,"4_3":String,"4_4":String,"4_5":String,"4_6":String,"4_7":String,
	"5_1":String,"5_2":String,"5_3":String,"5_4":String,"5_5":String,"5_6":String,"5_7":String
});
var sumSchema=new mongoose.Schema({
	sumVal:[{
		Date:String,
		Day:String,
		p1:String,
		p2:String,
		p3:String,
		p4:String,
		p5:String,
		p6:String,
		p7:String
	}]
});
var logSchema=new mongoose.Schema({
	log_user:[String],
	log_time:[String]
})
var countSchema=new mongoose.Schema({
	details:[{
		uid:String,
		name:String,
		count:String
	}]
});
var bunkboxSchema=new mongoose.Schema({
	uid:String,
	abs_arr:[String],
	sum_arr:[String],
	per_arr:[String],
	bun_arr:[String],
	toatt_arr:[String]
})

var stud_var=mongoose.model("stud_datas",studSchema);
var abs_datas=mongoose.model("abs_datas",absentSchema);
var check_data=mongoose.model("check_datas",checkSchema);
var chg_tbl_data=mongoose.model("change_table_datas",changedTableSchema);
var day_tbl_data=mongoose.model("day_table_datas",dayTableSchema);
var time_tbl_data=mongoose.model("time_table_datas",timeTableSchema);
var sumdata=mongoose.model("sum_datas",sumSchema);
var logdata=mongoose.model("log_datas",logSchema);
var countdata=mongoose.model("count_datas",countSchema);
var bunkboxdata=mongoose.model("bunk_box_datas",bunkboxSchema);






var uid_list=["U1703137","U1703138","U1703139","U1703140","U1703141","U1703142","U1703143","U1703144","U1703145","U1703146","U1703147","U1703148","U1703149","U1703150","U1703151","U1703152","U1703153","U1703154","U1703155","U1703156","U1703157","U1703158","U1703159","U1703160","U1703161","U1703162","U1703163","U1703164","U1703165","U1703166","U1703167","U1703168","U1703169","U1703170","U1703171","U1703172","U1703173","U1703174","U1703175","U1703176","U1703177","U1703178","U1703179","U1703180","U1703181","U1703182","U1703183","U1703184","U1703185","U1703186","U1703187","U1703188","U1703189","U1703190","U1703191","U1703192","U1703193","U1703194","U1703195","U1703196","U1703197","U1703198","U1703199","U1703200","U1703201","U1703202","U1703203","U1703204"]

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

function work_chk_box(){
	check_data.find({}).deleteMany(function(err){
		if(err){
			console.log(err);
		}else{
			var val=new check_data({state:true});
			val.save(function(err){
				if(err){
					console.log(err);
				}else{
					console.log("CHECKBOX VALUE TICKED SINCE WORKING DAY")
				}
		});
	}
	});
}

function summaryUpdate(data){
	sumdata.find({}).deleteMany(function(err){
		if(err){
			console.log(err);
		}else{
			var val=new sumdata({sumVal:data});
			val.save(function(err){
				if(err){
					console.log(err);
				}else{
					console.log("SUMMARY UPDATED")
				}
		});
	}
	});
}


function dateupdate(){

	function daily_table_db(data){
		console.log(data);
		day_tbl_data.find({}).deleteMany(function(err){
				if(err){
					console.log(err);
				}else{
					var temp_data = new day_tbl_data({daytable:data});
					temp_data.save(function(err){
					if(err){
						console.log("ERROR")
					}else{
						console.log("DAY'S TIMETABLE WRITTEN");
					}
					});
				}
				});
	}


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

		check_data.find({}).deleteMany(function(err){
			if(err){
				console.log(err);
			}
		});
			var val=new check_data({state:false});
			val.save(function(err){
				if(err){
					console.log(err);
				}else{
					console.log("CHECKBOX UNTICKED SINCE SATURDAY OR SUNDAY");
				}
			});
	}else if(d.getDay()==1){
		work_chk_box();
		daily_timetable=[];
		for(var i=1;i<8;i++){
			var temp="1_"+i.toString();
			daily_timetable.push(temp);
		}
		daily_table_db(daily_timetable);
	}else if(d.getDay()==2){
		work_chk_box();
		daily_timetable=[];
		for(var i=1;i<8;i++){
			var temp="2_"+i.toString();
			daily_timetable.push(temp);
		}
		daily_table_db(daily_timetable);
	}else if(d.getDay()==3){
		work_chk_box();
		daily_timetable=[];
		for(var i=1;i<8;i++){
			var temp="3_"+i.toString();
			daily_timetable.push(temp);
		}
		daily_table_db(daily_timetable);
	}else if(d.getDay()==4){
		work_chk_box();
		daily_timetable=[];
		for(var i=1;i<8;i++){
			var temp="4_"+i.toString();
			daily_timetable.push(temp);
		}
		daily_table_db(daily_timetable);
	}else if(d.getDay()==5){
		work_chk_box();
		daily_timetable=[];
		for(var i=1;i<8;i++){
			var temp="5_"+i.toString();
			daily_timetable.push(temp);
		}
		daily_table_db(daily_timetable);
	}
}
//add the below code inside the above function during final submit
//already done


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
	//SUMMARY
	sumdata.find({},function(err,result){
	if(err){
		console.log(err);
		console.log("ERROR in loading Summary")
	}else{
		var summary=result[0]["sumVal"];
  	res.render('adminsummary.ejs',{sumarr:summary,c_arr:t_arr,d_change:"none"});
}
});
});
app.post("/admin/changetable",function(req,res){
	//SUMMARY
	sumdata.find({},function(err,result){
	if(err){
		console.log(err);
		console.log("ERROR in loading Summary")
	}else{
		var summary=result[0]["sumVal"];
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
		res.render('adminsummary.ejs',{sumarr:summary,c_arr:t_arr,d_change:""});
		t_arr=[];
	}
	});
});
app.post("/admin/savechanges",function(req,res){
	//SUMMARY
	sumdata.find({},function(err,result){
	if(err){
		console.log(err);
		console.log("ERROR in loading Summary")
	}else{
		var summary=result[0]["sumVal"];
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
		summaryUpdate(summary);
	// res.render('adminsummary.ejs',{sumarr:summary,c_arr:t_arr,d_change:"none"});
	res.redirect("/admin/summary");
}
});
});
app.get("/admin/home",function(req,res){
	if(!req.asession.user){
		res.redirect('login');
	}else{
				//log_datas
				logdata.find({},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					var log_temp=result[0];
					var log_user=log_temp["log_user"];
					var log_time=log_temp["log_time"];
					var u_id="U1703"
					var count=0;
					var data2=log_user.toString();
					stud_var.find({"au_class":"S5-CSE-GAMMA"},function(err,result){
					if(err){
						console.log(err);
						console.log("ERROR in Finding Student Data")
					}else{
						var log_count_arr=[];
						stud_db_arr=result;
						var k=0;
						for(var i=137;i<205;i++){
							if(i==164 || i==166 || i==169){
								continue;
							}
							var u_i_d=u_id+i.toString();
							var temp_name="";
							temp_name=stud_db_arr[k].name;
							login_count={};
							login_count.uid=u_i_d;
							var t=temp_name;
							login_count.name=t;
							var regex = new RegExp(t, "g");
							var count=(data2.match(regex) || []).length;
							login_count.count=count;
							log_count_arr.push(login_count);
							console.log(log_count_arr);
							k++;
				}
				//WRITING LOG
				countdata.find({}).deleteMany(function(err){
				if(err){
					console.log(err);
				}else{
					var t2_data = new countdata({details:log_count_arr});
					t2_data.save(function(err){
					if(err){
						console.log("ERROR")
					}else{
						res.render('adminhome.ejs',{log_user:log_user,log_time:log_time,log_count:log_count_arr});
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


app.post("/admin/home",function(req,res){
	uid = req.body.user;
	pass = req.body.pass;
	if(uid=="admin" && pass=="kava2kaka"){
		req.asession.user = uid;
		res.redirect('/admin/home');
	}else{
		res.render('adminlogin.ejs',{in_cred:""});
	}

});

app.post("/home",function(req,res){
	var stud_db={};
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
	stud_var.find({au_uid:req.body.user},function(err,result){
		if(err){
			console.log(err);
			console.log("ERROR in Finding Student Data")
		}else{
			console.log(result);
			stud_db=result[0];
		  if(counter>0){
		    if(stud_db.au_uid===uid && stud_db.au_pass===pass){
						req.session.user = uid;
						var today = new Date();
						var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
						//log_datas
						logdata.find({},function(err,result){
						if(err){
							console.log(err);
							console.log("ERROR in Finding Student Data")
						}else{
							var log_temp=result[0];
							var log_user=log_temp["log_user"];
							var log_time=log_temp["log_time"];
							log_user.unshift(stud_db.name);
							log_time.unshift(time);
							logdata.find({}).deleteMany(function(err){
								if(err){
									console.log(err);
								}else{
									var tl_data = new logdata({log_user:log_user,log_time:log_time});
									tl_data.save(function(err){
									if(err){
										console.log("ERROR")
									}else{
										console.log("USER LOGS UPDATED");
									}
									});
								}
								});
					}
					});






		        console.log("Login Success " + stud_db.name+" " + time);
		        (async () => {
		          const browser = await puppeteer.launch({ headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*']});
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
							await page.screenshot({path: 'scrap_target.png'}); //Necessary to make the page load fully for screenshot, so scraping works perfectly
		          const data = await page.$$eval('table tr td[valign="middle"]', tds => tds.map((td) => {
		          return td.innerText;
		          }));
		          data.splice(0,9);
							console.log(data);
							var i=0;
							var absent=[];
		          while(data.length!=0){
		            var d = data.splice(0,8);
		            var key = d[0];
		            var values=d.slice(1,8);
								absent_t.uid=uid;
		            absent_t.date=key;
		            absent_t.value=values;
								console.log(absent_t);
								absent.push(absent_t);
								absent_t={};
								i++
		          }
							console.log(absent);


							function explode(){
								//DELETE ALL ABSENT ENTRIES OF USER
								console.log("DELETE ALL ABSENT ENTRIES OF USER");
								abs_datas.find({ uid:uid }).deleteMany(function(err){
									if(err){
										console.log(err);
									}else{
										//ADD ALL THE ABSENT ENTRIES OF USER
										console.log("ADD ALL THE ABSENT ENTRIES OF USER");
										absent.forEach(function(arrayItem) {
												var s_data = new abs_datas(arrayItem);
												s_data.save(function(err){
													if(err){
														console.log("ERROR")
													}else{
														console.log(arrayItem);
													}
												});
										});
									}
								});

								//CHECKBOX
								console.log("CHECKBOX");
								check_data.find({},function(err,result){
									if(err){
										console.log(err);
										console.log("ERROR in Finding Student Data")
									}else{
										var chk = result[0]["state"];
										var sum_arr=[];
										var abs_arr=[];
										var per_arr=[];
										var bun_arr=[];
										var toatt_arr=[];
										if(chk===false){ //NECESSARY ELSE /HOME WOULD NOT LOAD IF CHECKBOX==FALSE
											//TIMETABLE
											console.log("TIMETABLE 1")
											time_tbl_data.find({},function(err,result){
												if(err){
													console.log(err);
												}else{
													timetable_read=result[0];

												//DAYTABLE
												day_tbl_data.find({},function(err,result){
												if(err){
													console.log(err);
													console.log("ERROR in Finding Data")
												}else{
													day_table=result[0]["daytable"];
													//=========================================
													//SUMMARY
													sumdata.find({},function(err,result){
													if(err){
														console.log(err);
														console.log("ERROR in loading Summary")
													}else{
														data3=result[0]["sumVal"].toString();
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
														//DBWORK
														var abs_db;
														abs_datas.find({uid:uid},function(err,result){
															if(err){
																console.log(err);
																console.log("ERROR in Finding Student Data")
															}else{
																var data4=result.toString()
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
																//BUNKBOXWRITE
																bunkboxdata.find({uid:uid}).deleteMany(function(err){
																if(err){
																	console.log(err);
																}else{
																	var t5_data = new bunkboxdata({uid:uid,abs_arr:abs_arr,sum_arr:sum_arr,per_arr:per_arr,bun_arr:bun_arr,toatt_arr:toatt_arr});
																	t5_data.save(function(err){
																	if(err){
																		console.log("ERROR")
																	}else{
																		res.render('profile.ejs',{stud_name:stud_db.name , class_name:stud_db.au_class,data:current_date,date:current_date,day:day,check_ed:" ",arr:day_table,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
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
									}else{ //Else condition is necessary, otherwise on entering home route from login, the toggle button will be always turned OFF (tried it)
										//TIMETABLE
										console.log("TIMETABLE 2")
										time_tbl_data.find({},function(err,result){
											if(err){
												console.log(err);
											}else{
												timetable_read=result[0];
														//DAYTABLE
														day_tbl_data.find({},function(err,result){
														if(err){
															console.log(err);
															console.log("ERROR in Finding Data")
														}else{
															day_table=result[0]["daytable"];
															//SUMMARY
															sumdata.find({},function(err,result){
															if(err){
																console.log(err);
																console.log("ERROR in loading Summary")
															}else{
																data3=result[0]["sumVal"].toString();
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
																var abs_db;
																abs_datas.find({uid:uid},function(err,result){
																	if(err){
																		console.log(err);
																		console.log("ERROR in Finding Student Data")
																	}else{
																		var data4=result.toString()
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
																		//BUNKBOXWRITE
																		bunkboxdata.find({uid:uid}).deleteMany(function(err){
																		if(err){
																			console.log(err);
																		}else{
																			var t5_data = new bunkboxdata({uid:uid,abs_arr:abs_arr,sum_arr:sum_arr,per_arr:per_arr,bun_arr:bun_arr,toatt_arr:toatt_arr});
																			t5_data.save(function(err){
																			if(err){
																				console.log("ERROR")
																			}else{
																				res.render('profile.ejs',{stud_name:stud_db.name , class_name:stud_db.au_class,data:current_date,date:current_date,day:day,check_ed:"checked",arr:day_table,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
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
		      }else{
						res.render('login.ejs',{in_cred:"none",in_pass:""});
		        console.log("Invalid Password");
		      }

		  }else{
				res.render('login.ejs',{in_cred:"",in_pass:"none"});
		    console.log("Invalid UID");

		  }
//below braces are for end of stud_datas DB
}
});
    });

		app.get("/home",function(req,res){
			var stud_db;
			stud_var.find({au_uid:req.session.user},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					stud_db=result[0];
					if(!req.session.user){
						res.redirect('login');
					}else{
						//DAYTABLE
						day_tbl_data.find({},function(err,result){
						if(err){
							console.log(err);
							console.log("ERROR in Finding Data")
						}else{
							daily_timetable=result[0]["daytable"];
						//CHECKBOX
						check_data.find({},function(err,result){
							if(err){
								console.log(err);
								console.log("ERROR in Finding Student Data")
							}else{
								var chk = result[0]["state"];
								if(chk===false){
									//TIMETABLE
									time_tbl_data.find({},function(err,result){
										if(err){
											console.log(err);
										}else{
											timetable_read=result[0];
											//BUNKBOX
											bunkboxdata.find({uid:req.session.user},function(err,result){
											if(err){
												console.log(err);
												console.log("ERROR in Finding Student Data")
											}else{
												var abs_arr=result[0].abs_arr;
												var sum_arr=result[0].sum_arr;
												var per_arr=result[0].per_arr;
												var bun_arr=result[0].bun_arr;
												var toatt_arr=result[0].toatt_arr;
											res.render('profile.ejs',{stud_name:stud_db.name , class_name:stud_db.au_class,data:current_date,date:current_date,day:day,check_ed:" ",arr:daily_timetable,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
										}
									});
								}
							});
						}else{
							//TIMETABLE
							time_tbl_data.find({},function(err,result){
								if(err){
									console.log(err);
								}else{
									timetable_read=result[0];
									//BUNKBOX
									bunkboxdata.find({uid:req.session.user},function(err,result){
									if(err){
										console.log(err);
										console.log("ERROR in Finding Student Data")
									}else{
										abs_arr=result[0].abs_arr;
										sum_arr=result[0].sum_arr;
										per_arr=result[0].per_arr;
										bun_arr=result[0].bun_arr;
										toatt_arr=result[0].toatt_arr;
									res.render('profile.ejs',{stud_name:stud_db.name , class_name:stud_db.au_class,data:current_date,date:current_date,day:day,check_ed:"checked",arr:daily_timetable,table_arr:timetable_read,hidstr:intent_empty_string,response:thk_res,hidyesorno:alter_table,absent_arr:abs_arr,summary_arr:sum_arr,percent_arr:per_arr,bunk_arr:bun_arr,attend_arr:toatt_arr});
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
				//the 2 braces below are of stud_datas DB
			}
		});
		});
		app.get("/logout",function(req,res){
			var stud_db;
			stud_var.find({au_uid:req.session.user},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					stud_db=result[0];
					if(!req.session.user){
						res.redirect('login');
					}else{
						var t=stud_db.name;
						req.session.reset();
						res.redirect("/login");
						var today = new Date();
						var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
						console.log("Logout Successful "+t+" "+time);
					}
				}
			});
		})
		app.get("/instructions",function(req,res){
			var stud_db;
			stud_var.find({au_uid:req.session.user},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					stud_db=result[0];
					if(!req.session.user){
						res.redirect('login');
					}else{
						res.render('instructions.ejs',{stud_name:stud_db.name , class_name:stud_db.au_class});
					}
				}
			});
		});


		// absent.forEach(function(arrayItem) {
		// 		var s_data = new abs_datas(arrayItem);
		// 		s_data.save(function(err){
		// 			if(err){
		// 				console.log("ERROR")
		// 			}
		// 		});


		//ROUTE ASSOCIATED WITH CHECKBOX
		app.post("/workday",function(req,res){

			if(Object.keys(req.body).length==0){
				check_data.find({}).deleteMany(function(err){
					if(err){
						console.log(err);
					}else{
						console.log("stage 1")
						var val=new check_data({state:false});
						console.log("stage 2")
						val.save(function(err){
							if(err){
								console.log(err);
							}else{
								console.log("CHECKBOX UNTICKED");
							}
						});
					}
				});

			}else{
				check_data.find({}).deleteMany(function(err){
					if(err){
						console.log(err);
					}else{
						console.log("stage 1")
						var val=new check_data({state:true});
						console.log("stage 2")
						val.save(function(err){
							if(err){
								console.log(err);
							}else{
								console.log("CHECKBOX TICKED");
							}
						});

					}
				});

			}
			console.log("redirect")
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
			chg_tbl_data.find({}).deleteMany(function(err){
			if(err){
				console.log(err);
			}else{
				var t_data = new chg_tbl_data(req.body);
				t_data.save(function(err){
				if(err){
					console.log("ERROR")
				}
				});
			}
			});
			thk_res="Thank You for your response"
			intent_empty_string="none"
			alter_table="none";
			res.redirect('/home');
		});

		app.post("/timetable",function(req,res){
					time_tbl_data.find({}).deleteMany(function(err){
					if(err){
						console.log(err);
					}else{
						var table_data = new time_tbl_data(req.body);
						console.log(req.body);
						console.log("________");
						console.log(table_data);
						table_data.save(function(err){
						if(err){
							console.log("ERROR")
						}else{
							res.redirect('timetable');
						}
						});
					}
					});
		});

		app.get("/summary",function(req,res){
			var stud_db;
			stud_var.find({au_uid:req.session.user},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					stud_db=result[0];
					if(!req.session.user){
						res.redirect('login');
					}else{
						//SUMMARY
						sumdata.find({},function(err,result){
						if(err){
							console.log(err);
							console.log("ERROR in loading Summary")
						}else{
							var summary=result[0]["sumVal"];
						res.render('summary.ejs',{stud_name:stud_db.name , class_name:stud_db.au_class,sumarr:summary});
					}
					});
				}
			}
		});
		});

		app.get("/timetable",function(req,res){
			var stud_db;
			stud_var.find({au_uid:req.session.user},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					stud_db=result[0];
					if(!req.session.user){
						res.redirect('login');
					}else{
						//TIMETABLE
						time_tbl_data.find({},function(err,result){
							if(err){
								console.log(err);
							}else{
								timetable_read=result[0];
							res.render('ttable.ejs',{stud_name:stud_db.name , class_name:stud_db.au_class,table:timetable_read});
						}
					});
				}
			}
		});
		});




		//===========================================================================
		var resetTime = new Date();
		resetTime.setHours(12,30,0);

		function loop() {
			var empty=[];
			var d=new Date();
			console.log("Inside LOOP");
			check_data.find({},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					var chk = result[0]["state"];
					//SUMMARY
					sumdata.find({},function(err,result){
					if(err){
						console.log(err);
						console.log("ERROR in loading Summary")
					}else{
						var sum=result[0]["sumVal"];
						if(chk===true){
								console.log("Checkbox Ticked");
									if(counter==0){ //No change in day's timetable
											if(d.getDay()==1){
												empty.push(current_date);
												empty.push("Monday");
												for(i=1;i<=7;i++){
													var temp="1_"+ i.toString();
													empty.push(temp);
												}
												//TIMETABLE
												time_tbl_data.find({},function(err,result){
													if(err){
														console.log(err);
													}else{
														ftt=result[0];
												}
												});
												function madedelay(){
													summary={};
													summary["Date"]=empty[0];
													summary["Day"]=empty[1];
													summary["p1"]=ftt["1_1"]; //Could have used the above temp array. But nevermind.
													summary["p2"]=ftt["1_2"];
													summary["p3"]=ftt["1_3"];
													summary["p4"]=ftt["1_4"];
													summary["p5"]=ftt["1_5"];
													summary["p6"]=ftt["1_6"];
													summary["p7"]=ftt["1_7"];
													console.log(summary);
													sum.unshift(summary);
													summary={};
													summaryUpdate(sum);
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
												//TIMETABLE
												time_tbl_data.find({},function(err,result){
													if(err){
														console.log(err);
													}else{
														ftt=result[0];
												}
												});
												function madedelay(){
													console.log("Inside Made Delay");
													summary={};
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
													summary={};
													summaryUpdate(sum);
												}
												setTimeout(madedelay,5000);

											}else if(d.getDay()==3){
												empty.push(current_date);
												empty.push("Wednesday");
												for(i=1;i<=7;i++){
													var temp="3_"+ i.toString();
													empty.push(temp);
												}
												//TIMETABLE
												time_tbl_data.find({},function(err,result){
													if(err){
														console.log(err);
													}else{
														ftt=result[0];
												}
												});
												function madedelay(){
													summary={};
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
													summary={};
													summaryUpdate(sum);
												}
												setTimeout(madedelay,5000);
											}else if(d.getDay()==4){
												empty.push(current_date);
												empty.push("Thursday");
												for(i=1;i<=7;i++){
													var temp="4_"+ i.toString();
													empty.push(temp);
												}
												//TIMETABLE
												time_tbl_data.find({},function(err,result){
													if(err){
														console.log(err);
													}else{
														ftt=result[0];
												}
												});
												function madedelay(){
													summary={};
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
													summary={};
													summaryUpdate(sum);
												}
												setTimeout(madedelay,5000);
											}else if(d.getDay()==5){
												empty.push(current_date);
												empty.push("Friday");
												for(i=1;i<=7;i++){
													var temp="5_"+ i.toString();
													empty.push(temp);
												}
												//TIMETABLE
												time_tbl_data.find({},function(err,result){
													if(err){
														console.log(err);
													}else{
														ftt=result[0];
												}
												});
												function madedelay(){
													summary={};
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
													summary={};
													summaryUpdate(sum);
												}
												setTimeout(madedelay,5000);
											}
								}else if(counter==1){ //Change in day's table

								chg_tbl_data.find({},function(err,result){
								if(err){
									console.log(err);
									console.log("ERROR in Finding Student Data")
								}else{
									ftt = result[0];
									console.log("CHANGED")
									console.log(result);
									console.log(ftt);
										console.log("Read data from changed table");
									}
									});
									function madedelay(){
										var c_name=d.getDay();
										var c_day=week[c_name];
										summary={};
										summary["Date"]=current_date;
										summary["Day"]=c_day;
										summary["p1"]=ftt["a_1"];
										summary["p2"]=ftt["a_2"];
										summary["p3"]=ftt["a_3"];
										summary["p4"]=ftt["a_4"];
										summary["p5"]=ftt["a_5"];
										summary["p6"]=ftt["a_6"];
										summary["p7"]=ftt["a_7"];
										console.log(summary);
										sum.unshift(summary);
										summary={};
										summaryUpdate(sum);
									}
									setTimeout(madedelay,5000);

								}

		}else{
			console.log("CHECKBOX UNTICKED");
		}
	}
		});
	}
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


		// //Testing
		// cron.schedule('00 28 21 * * 0-6', () => { //CRON JOB FOR ADDING DAILY SCHEDULE TO SUMMARY 23:00
		// 	counter=0;
		// 	dateupdate();
  	// 	console.log('Date Update at 12:15 AM');
		// 	console.log(current_date);
		// },{
		// 	timeZone:'Asia/Kolkata'
		// });
		// cron.schedule('00 27 21 * * 0-6', () => { //CRON JOB FOR ADDING DAILY SCHEDULE TO SUMMARY 23:00
		// 	counter=0;
		// 	dateupdate();
  	// 	console.log('Date Update at 12:15 AM');
		// 	console.log(current_date);
		// },{
		// 	timeZone:'Asia/Kolkata'
		// });
		// cron.schedule('00 26 21 * * 0-6', () => { //CRON JOB FOR ADDING DAILY SCHEDULE TO SUMMARY 23:00
		// 	counter=0;
		// 	dateupdate();
  	// 	console.log('Date Update at 12:15 AM');
		// 	console.log(current_date);
		// },{
		// 	timeZone:'Asia/Kolkata'
		// });
		// cron.schedule('00 25 21 * * 0-6', () => { //CRON JOB FOR ADDING DAILY SCHEDULE TO SUMMARY 23:00
		// 	counter=0;
		// 	dateupdate();
  	// 	console.log('Date Update at 12:15 AM');
		// 	console.log(current_date);
		// },{
		// 	timeZone:'Asia/Kolkata'
		// });




		cron.schedule('30 21 15 * * 0-6', () => { //CRON JOB FOR DAILY DATE UPDATE 00:15
			counter=0;
			dateupdate();
  		console.log('Date Update at 12:15 AM');
			console.log(current_date);
			//LOGDATA
			logdata.find({},function(err,result){
			if(err){
				console.log(err);
				console.log("ERROR in Finding Student Data")
			}else{
				var log_temp=result[0];
				var log_user=log_temp["log_user"];
				var log_time=log_temp["log_time"];
				log_user.unshift(current_date);
				log_time.unshift(" ");
					//LOGWRITE
					logdata.find({}).deleteMany(function(err){
					if(err){
						console.log(err);
					}else{
						var tl_data = new logdata({log_user:log_user,log_time:log_time});
						tl_data.save(function(err){
						if(err){
							console.log("ERROR")
						}
						});
					}
					});
				}
			});





		},{
			timeZone:'Asia/Kolkata'
		});
		cron.schedule('00 25 00 * * 0-6', () => { //CRON JOB FOR ADDING DAILY SCHEDULE TO SUMMARY 23:00
			loop();
		},{
			timeZone:'Asia/Kolkata'
		});
		cron.schedule('00 13 03 * * 0-6', () => { //CRON JOB TO SHOW OPTIONS TO CHANGE DAY'S TABLE 16:30
			// dailytablecheck();
			check_data.find({},function(err,result){
				if(err){
					console.log(err);
					console.log("ERROR in Finding Student Data")
				}else{
					var chk = result[0]["state"];
					if(chk===true){
						intent_empty_string="";
						thk_res=""
					}
			}
			});
		},{
			timeZone:'Asia/Kolkata'
		});
		cron.schedule('00 50 04 * * 0-6', () => { //CRON JOB FOR DISABLE OPTIONS TO CHANGE DAY'S TIMETABLE 22:30
			// dailytablecheck();
			intent_empty_string="none";
			thk_res=""
		},{
			timeZone:'Asia/Kolkata'
		});

app.listen(process.env.PORT || 5000,function(){
  console.log("Server Started");
})
