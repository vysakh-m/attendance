var mongoose=require('mongoose');
var absentSchema=new mongoose.Schema({
	uid:String,
	date:String,
	value:[String]
});
module.exports=mongoose.model("abs_datas",absentSchema);