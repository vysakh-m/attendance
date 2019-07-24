var mongoose=require('mongoose');
var bunkboxSchema=new mongoose.Schema({
	uid:String,
	abs_arr:[String],
	sum_arr:[String],
	per_arr:[String],
	bun_arr:[String],
	toatt_arr:[String]
});
module.exports=mongoose.model("bunk_box_datas",bunkboxSchema);