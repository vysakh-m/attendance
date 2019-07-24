var mongoose=require('mongoose');
var countSchema=new mongoose.Schema({
	details:[{
		uid:String,
		name:String,
		count:String
	}]
});
module.exports=mongoose.model("count_datas",countSchema);