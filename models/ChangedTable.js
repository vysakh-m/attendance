var mongoose=require('mongoose');
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
module.exports=mongoose.model("change_table_datas",changedTableSchema);