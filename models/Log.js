var mongoose=require('mongoose');
var logSchema=new mongoose.Schema({
	log_user:[String],
	log_time:[String]
});
module.exports=mongoose.model("log_datas",logSchema);