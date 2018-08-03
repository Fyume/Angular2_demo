$(document).ready(function(){
	var userInfo = window.localStorage.getItem("userInfo");
	$("#wallet_select").bind("click",function(){
		$("#wallet").val($("#wallet_select").val());
	});
	
	if(userInfo==null||userInfo=="null"){
		console.log("未登录");
	}else{
		console.log("已登录");
		disabled($("#loginBtn"));
		removeDisabled($("#logOutBtn"));
	}
});
//用户注册
function submitForm1(){
	alert(JSON.stringify($("#form1").serializeJSON()));
	$.ajax({
		url:'/CrystalOS/rest/user/register',
		type:"POST",
		dataType:'json',
		contentType: "application/json",
		data:JSON.stringify($("#form1").serializeJSON()),
		cache:false,
		success:function(data){
			console.log(data);
			if(data==true){
				console.log("注册用户成功");
			}else{
				console.log("注册用户失败");
			}
		},
		error:function(){
			console.log("error!");
		},
	});
}
//判断username可用
function userNameExist($this){
	$.ajax({
		url:'/CrystalOS/rest/user/UserNameExist',
		type:"POST",
		dataType:'json',
		contentType: "application/json",
		data:$($this).val(),
		cache:false,
		success:function(data){
			if(data==true){
				console.log("该用户名已存在");
			}else{
				console.log("该用户名可用");
			}
		},
		error:function(){
			console.log("error!");
		},
	});
}
//登录
function submitForm2($this){
	$.ajax({
		url:'/CrystalOS/rest/user/login',
		type:"POST",
		dataType:'json',
		contentType: "application/json",
		data:JSON.stringify($("#form2").serializeJSON()),
		headers: {'Authorization': $.cookie('Token')},
		cache:false,
		success:function(data){
			console.log(data);
			if(data==false){
				debugger
				console.log("登录失败");
			}else if(data=="exception"){
				debugger
				console.log("异常");
			}else{
				debugger
				$.cookie('Token',data.token,{expires:7,path:'/'});
				//还有minerToken，walletToken
				$.cookie('minerToken',data.minerToken,{expires:7,path:'/'});
				$.cookie('walletToken',data.walletToken,{expires:7,path:'/'});
				console.log($.cookie('minerToken'));
				/*$.cookie('JSESESSIONID',data.JSESESSIONID,{expires:7,path:'/'});*/
				window.localStorage.setItem("userInfo",JSON.stringify(data.userInfo));//
				console.log("登录成功");
				disabled($($this));
				removeDisabled($($this).next());
			}
		},
		error:function(data){
			if(data.responseText=="你已登录"){
				console.log(data.responseText);
			}else{
				console.log("error!");
			}
		},
	});
}
//登出
function logOut($this){
	window.localStorage.setItem("userInfo",null);
	$.cookie('Token', null, { path: '/' });
	$.cookie('minerToken', null, { path: '/' });
	$.cookie('walletToken', null, { path: '/' });
	disabled($($this));
	removeDisabled($($this).prev());
	console.log("已登出");
}
//注册矿机
function ExistNickName($this){
	console.log("token:"+$.cookie('minerToken'));
	$.ajax({
		url:'/CrystalOS/rest/miner/existName',
		type:"POST",
		dataType:'json',
		contentType: 'application/json',
		data:JSON.stringify($($this).serializeJSON()),
		headers: {'Authorization': $.cookie('minerToken')},
		cache:false,
		success:function(data){
			console.log(data);
			if(data==false){
				console.log("该nickName可用");
				removeDisabled($($this).parent().children().last())
			}else{
				console.log("该nickName已存在");
				disabled($($this).parent().children().last());
			}
		},
		error:function(data){
			console.log(data);
			console.log("error!");
		},
	});
}
function submitForm3($this){
	debugger
	console.log(JSON.stringify($("#form3").serializeJSON()));
	$.ajax({
		url:'/CrystalOS/rest/miner/register',
		type:"POST",
		dataType:'json',
		contentType: 'application/json',
		data:JSON.stringify($("#form3").serializeJSON()),
		headers: {'Authorization': $.cookie('minerToken')},
		cache:false,
		success:function(data){//minerInfo 更新数据
			console.log(data);
			if(data==false){
				console.log("注册机器失败");
			}else{
				console.log("注册机器成功");
			}
		},
		error:function(){
			console.log("error!");
		},
	});
}
function random($this){
	var ps = $.uuid();
	$($this).prev().prev().val(ps.substring(ps.length-8));
}
function switchPs($this){
	var type = $($this).prev().attr("type");
	if(type=="text"){
		$($this).prev().attr("type","password");
		$($this).addClass("glyphicon-eye-close");
		$($this).removeClass("glyphicon-eye-open");
	}else{
		$($this).removeClass("glyphicon-eye-close");
		$($this).addClass("glyphicon-eye-open");
		$($this).prev().attr("type","text");
	}
}
/*************Config＆Wallet******************/
function DIVOn(id){
	$(id).removeClass("hidden");
}
function DIVOff(id){
	$(id).addClass("hidden");
}
//Config测试
function addField($this){
	//添加field和value输入框
	var left = '<li><input type="text" placeholder="field"></li>';
	var right = '<li><input type="text" placeholder="value" name="value"></li>';
	$("#left").append($(left));
	$($this).parent().before($(right));
	//更改添加按钮
	$($this).attr("value","saveField");
	$($this).addClass("btn-info");
	$($this).removeClass("btn-default");
	$($this).attr("onclick","saveField(this)");
	//加入取消按钮
	var div = '<input type="button" class="btn btn-default" value="cancel" onclick="cancelField(this)">';
	$($this).after($(div));
	//禁用两个功能按钮的功能
	disabled($($this).parent().next().children());
}
function cancelField($this){
	//清除生成的div
	$("#left li:last-child").remove();
	$($this).parent().prev().remove();
	//还原添加按钮
	$($this).prev().attr("value","+");
	$($this).prev().attr("onclick","addField(this)");
	$($this).prev().addClass("btn-default");
	$($this).prev().removeClass("btn-info");
	//恢复两个功能按钮的功能
	removeDisabled($($this).parent().next().children());
	//清除取消按钮
	$($this).remove();
}
function saveField($this){
	//field输入框变成文本形式
	var field = $("#left li:last-child input[type='text']").val();
	$("#left li:last-child").html(field);
	//修改value输入框的name
	$($this).parent().prev().children().attr("name","otherOptions["+field+"]");
	$($this).parent().prev().children().attr("placeholder",field);
	//还原添加按钮
	$($this).attr("value","+");
	$($this).attr("onclick","addField(this)");
	$($this).addClass("btn-default");
	$($this).removeClass("btn-info");
	//清除取消按钮
	$($this).next().remove();
	//恢复两个功能按钮的功能
	removeDisabled($($this).parent().next().children());
}
function ConfigSave(){
	debugger
	var MinerTag = JSON.stringify($("#form4").serializeJSON());
	console.log(MinerTag);
	$.ajax({
		url:'/CrystalOS/rest/miner/Config/Add',
		type:'POST',
		contentType: 'application/json',
		data:JSON.stringify($("#form4").serializeJSON()),
		headers: {'Authorization': $.cookie('minerToken')},
		cache:false,
		success:function(data){
			console.log(data);
			if(data=="clear"){
				window.localStorage.setItem("userInfo",null);
				console.log("请重新登录");
			}else if(data=="true"||data==true){
				console.log("Config已保存");
			}else{
				console.log("Config保存失败");
			}
		},
		error:function(data){
			console.log(data);
			console.log("error!");
		},
	});
}
//wallet测试
var address = 1;
function addField2($this){
	var div = '<li><input name="address['+address+']" type="text" placeholder="address'+(address+1)+'"></li>';
	$($this).parent().before($(div));
	var btn2 = '<input type="button" class="btn btn-danger" value="-" onclick="decField2(this)">';
	if($($this).next().html()==undefined){
		$($this).after($(btn2));
	}
	address++;
}
function decField2($this){
	$($this).parent().prev().remove();
	address--;
	if($($this).parent().prev().children().attr("placeholder")=="address"){
		$($this).remove();
	}
}
function WalletSave(){
	var wallet = JSON.stringify($("#form5").serializeJSON());
	console.log(wallet);
	$.ajax({
		url:'/CrystalOS/rest/wallet/add',
		type:'POST',
		dataType:'json',
		contentType: 'application/json',
		data:JSON.stringify($("#form5").serializeJSON()),
		headers: {'Authorization': $.cookie('walletToken')},
		cache:false,
		success:function(data){
			console.log(data);
			if(data=="clear"){
				window.localStorage.setItem("userInfo",null);
				console.log("请重新登录");
			}else if(data=="true"||data==true){
				console.log("wallet已保存");
			}else{
				console.log("wallet保存失败");
			}
		},
		error:function(data){
			console.log(data);
			console.log("error!");
		},
	});
}
//测试
/*function test(){
	$.ajax({
		url:'/CrystalOS/rest/user/test',
		type:"get",
		dataType:'json',
		cache:false,
		headers: {'Authorization': $.cookie('Token')},
		success:function(data){
			console.log(data);
			alert(JSON.stringify(data));
		},
		error:function(data){
			console.log(data);
			if(data.responseText=="clean"){
				$.cookie('Token',null);
				console.log("授权过期或者错误,请重新登录!");
			}
		},
	});
}*/
//局部加载页面
function loadHTML(path){
	$("#view").load(path);
}
function disabled($this){
	$($this).attr("disabled","disabled");
	$($this).addClass("disabled");
}
function removeDisabled($this){
	$($this).removeAttr("disabled");
	$($this).removeClass("disabled");
}
function setCookieNull(name){
	$.cookie(name,null);
}