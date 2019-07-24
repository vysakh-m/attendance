var mongoose=require('mongoose');
var checkSchema=new mongoose.Schema({
	state:Boolean
});
module.exports=mongoose.model("check_datas",checkSchema);