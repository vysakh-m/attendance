var mongoose=require('mongoose');
var dayTableSchema=new mongoose.Schema({
	daytable:[String]
});
module.exports=mongoose.model("day_table_datas",dayTableSchema);