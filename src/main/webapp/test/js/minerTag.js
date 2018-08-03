/**
 * minerTag
 */
function TagInfo(tagID){
	//应该从angular的service层查找
	//获取tagList
	var tagList = JSON.parse(window.localStorage.getItem("tagList"));
	var tagName;
	$("#tagDIV").children().children().last().html("");
	for(var i = 0;i<tagList.length;i++){
		if(tagID == tagList[i].id){
			var minerInfos = tagList[i].minerInfos;
			tagName = tagList[i].tagName;
			for(var j = 0;j<minerInfos.length;j++){
				var div = '<li class="col-lg-12"><div class="col-lg-3">'+minerInfos[j].id+'</div><div class="col-lg-8">'+minerInfos[j].nickname+'</div><span class="glyphicon glyphicon-minus-sign HOV" style="color:red;border-radius:20px;" onclick="removeFromTag(this,'+tagID+','+minerInfos[j].id+')"></span></li>';
				$("#tagDIV").children().children().last()/* ul */.append($(div));
			}
		}
	}
	DIVOn($("#tagDIV"));
	$("#tagDIV").children().first().children().first().next().html('<span>'+tagName+'</span><span class="glyphicon glyphicon-edit" style="font-size:12px;color:blue;margin-left:3px;cursor:pointer;" onclick="editTagName(this)"></span>');
}
function editTagName($this){
	var tagName = $($this).prev().html();
	$($this).prev().html('<input type="text" value="'+tagName+'" placeholder="tagName" onchange="tagNameExist(this)">');
	//glyphicon-floppy-disk  glyphicon-edit
	$($this).removeClass("glyphicon-edit");
	$($this).addClass("glyphicon-floppy-disk");
	$($this).attr("onclick","saveNewTag(this)");
}
function saveNewTag($this){
	var json = {tagName:$($this).prev().children().val()};
	//ajax
	$.ajax({
		url:'/CrystalOS/rest/miner/Tag/NameExist',
		type:"POST",
		dataType:'json',
		data:JSON.stringify(json),
		contentType: "application/json",
		headers: {'Authorization': $.cookie('minerToken')},
		cache:false,
		success:function(data){//tag
			console.log(data);
			if(data==true){
				console.log("该tagName已存在");
				disabled($($this).next());
			}else{
				console.log("该tagName可用");
				removeDisabled($($this).next());
			}
		},
		error:function(){
			console.log("error!");
		},
	});
}
//其实和miner.js的delTag一样 
function removeFromTag($this,tagID,minerID){
	//ajax
	var json = {minerID:minerID,tagID:tagID};
	if(confirm("你确定将该矿机（编号 "+minerID+" ）移出这个Tag?")){
		$.ajax({
			url:'/CrystalOS/rest/miner/Tag/del',
			type:"POST",
			dataType:"json",
			contentType: "application/json",
			data:JSON.stringify(json),
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){//minerSet that connecting(根据id)
				console.log(data);
				if(data==true){
					console.log("移出成功");
					$($this).parent().remove();
				}
			},
			error:function(){
				console.log("error!");
			},
		});
	}
}
