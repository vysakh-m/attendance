var mongoose=require('mongoose');
var studSchema=new mongoose.Schema({
	name:String,
	au_uid:String,
	au_pass:String,
	au_class:String
});
module.exports=mongoose.model("stud_datas",studSchema);