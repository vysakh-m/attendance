var mongoose=require('mongoose');
var timeTableSchema=new mongoose.Schema({
	"1_1":String,"1_2":String,"1_3":String,"1_4":String,"1_5":String,"1_6":String,"1_7":String,
	"2_1":String,"2_2":String,"2_3":String,"2_4":String,"2_5":String,"2_6":String,"2_7":String,
	"3_1":String,"3_2":String,"3_3":String,"3_4":String,"3_5":String,"3_6":String,"3_7":String,
	"4_1":String,"4_2":String,"4_3":String,"4_4":String,"4_5":String,"4_6":String,"4_7":String,
	"5_1":String,"5_2":String,"5_3":String,"5_4":String,"5_5":String,"5_6":String,"5_7":String
});
module.exports=mongoose.model("time_table_datas",timeTableSchema);