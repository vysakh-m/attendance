var mongoose=require('mongoose');
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
module.exports=mongoose.model("sum_datas",sumSchema);