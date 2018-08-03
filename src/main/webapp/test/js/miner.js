/**
 * 		miner
 */
//前端jq测试用，没详细写
	var MinerID = [];//minerID数组
	function tagBtn($this){
		var ID = $($this).parent().parent().children().first().html();
		if($($this).is(':checked')){
			//push
			MinerID.push(Number.parseInt(ID));
		}else{
			//pop
			var index  = $.inArray(Number.parseInt(ID),MinerID);
			if(index!=-1){
				MinerID.splice(index,1);
			}
		}
		//
		if(MinerID.length!=0){
			removeDisabled($("#saveTag"));
			removeDisabled($("#saveTag").next());
		}else{
			disabled($("#saveTag"));
			disabled($("#saveTag").next());
		}
		//MinerID.push(Number.parseInt(value));
	}
	
	function saveTag1($this){
		//弹出tagName div
		$("#tagNameDIV").removeClass("hidden");
		/*alert("你需要添加的机器id:"+MinerID);*/
	}
	function saveTag_cancel(){
		$("#tagNameDIV").addClass("hidden");
	}
	function tagNameExist($this){
		var value = {tagName:$($this).val()};
		$.ajax({
			url:'/CrystalOS/rest/miner/Tag/NameExist',
			type:"POST",
			dataType:'json',
			data:JSON.stringify(value),
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
	function saveTag2($this){
		var json = {miners:MinerID,tagName:$($this).prev().val()};
		$.ajax({
			url:'/CrystalOS/rest/miner/Tag/add',
			type:"POST",
			dataType:'json',
			data:JSON.stringify(json),
			contentType: "application/json",
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){//tag
				console.log(data);
				if(data.length==0){
					console.log("添加成功");
				}	
				$("#tagNameDIV").addClass("hidden");
			},
			error:function(){
				console.log("error!");
			},
		});
	}
	function getConnecting(){
		$.ajax({
			url:'/CrystalOS/rest/webSocket/connecting',
			type:"POST",
			contentType: "application/json",
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){//"minerSet" that connecting(根据machineUid)
				console.log(data);
				var i =0;
				var length;
				if(data==null){
					length=1;
				}
				$("#minerInfo tbody tr").each(function(){//遍历修改状态
					i++;
					
					var val = $(this).children().first().next()/* .next().next().next() */.html();
					if(i>2&&$(this).children().first().children().attr("type")==undefined){
						var rs = false;
						for(var j = 0;j<length;j++){
							if(data[j]==val){
								rs = true;
							}
						}
						if(rs){
							console.log("bingo!!");
							$(this).children().first().next().next().next().next().next().html('<span style="color:green;font-size:20px;font-weight:900;">·</span>(连接中)');
						}else{
							$(this).children().first().next().next().next().next().next().html('<span style="color:red;font-size:20px;font-weight:900;">·</span>(未连接)');
						}
					}
				});
			},
			error:function(){
				console.log("error!");
			},
		});
	}
	function getStatus(){
		$.ajax({
			url:'/CrystalOS/rest/webSocket/status',
			type:'POST',
			dataType:'json',
			contentType: 'application/json',
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){//status(List<String>)
				console.log("status: "+data);
				var i =0;
				$("#minerInfo tbody tr").each(function(){//遍历修改状态
					i++;
					var machineUid = $(this).children().first().next().html();
					if(i>2&&$(this).children().first().children().attr("type")==undefined){
						var rs = false;
						var status = "";
						$.each(data,function(key,value){
							console.log(key+"-"+value);
							if(key==machineUid){
								rs = true;
								status = value;
							}
						});
						var workStatus = $(this).children().first().next().next().next().next().next().next().next();
						if(rs){//<td>status</td>
							console.log("bingo!!");
							workStatus.html('<span style="color:red;font-size:20px;font-weight:900;">'+status+'</span>');
						}else{
							workStatus.html('<span style="color:#c0c0c0;font-size:20px;font-weight:900;">stop</span>');
						}
					}
				});
			},
			error:function(data){
				console.log(data);
				console.log("error!");
			},
		});
	}
	function addTag(){
		var tagList = JSON.parse(window.localStorage.getItem("tagList"));
		for(var i = 0;i<tagList.length;i++){
			var minerInfos = tagList[i].minerInfos;
			var tagName = tagList[i].tagName;
			var tagID = tagList[i].id;
			for(var j = 0;j<minerInfos.length;j++){
				var div = '<div class="tag" onmouseover="tagCloseOn(this,'+minerInfos[j].id+','+tagID+')">'+tagName+'</div>';
				$("#tag_"+minerInfos[j].id).append($(div));
			}
		}
	}
	//miner里面的tag
	function tagCloseOn($this,minerID,tagID){
		$("#TagClose").attr("onclick","delTag("+minerID+","+tagID+")");
		$("#TagClose").removeClass("hidden");
		$($this).attr("onmouseout","tagCloseOff(this)");
		$($this).append($("#TagClose"));
	}
	function tagCloseOff($this){
		$($this).removeAttr("onmouseout");
		$("#TagClose").addClass("hidden");
	}
	function delTag(minerID,tagID){
		var json = {minerID:minerID,tagID:tagID};
		if(confirm("你确定删除该tag?")){
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
						console.log("删除成功");
					}
				},
				error:function(){
					console.log("error!");
				},
			});
		}
	}
	function addToExistTag($this){
		var tagNameInput = $($this).prev().prev().prev();
		tagNameInput.addClass("hidden");
		tagNameInput.before($("#tagSelect"));
		$("#tagSelect").removeClass("hidden");
		
		var saveBtn = $($this).prev().prev();
		saveBtn.attr("onclick","appendIntoTag()");
		saveBtn.val("Append");
		console.log($("#tagSelect").val());
		if($("#tagSelect").val()!=null){
			removeDisabled(saveBtn);
		}
		$($this).val("newTag");
		$($this).attr("onclick","newTag(this)");
	}
	function newTag($this){
		var tagNameInput = $($this).prev().prev().prev();
		tagNameInput.removeClass("hidden");
		$("#tagSelect").addClass("hidden");
		
		var saveBtn = $($this).prev().prev();
		saveBtn.attr("onclick","saveTag2(this)");
		saveBtn.val("save");
		disabled(saveBtn);
		$($this).val("addToExistTag");
		$($this).attr("onclick","addToExistTag(this)");
	}
	function appendIntoTag(){
		var json = {TagName:$("#tagSelect").val(),MinerID:MinerID};
		$.ajax({
			url:'/CrystalOS/rest/miner/Tag/append',
			type:"POST",
			dataType:'json',
			data:JSON.stringify(json),
			contentType: "application/json",
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){
				console.log(data);
				if(data==true){
					console.log("添加成功");
				}	
				$("#tagNameDIV").addClass("hidden");
			},
			error:function(){
				console.log("error!");
			},
		});
	}
	function startUp($this){
		/*$($this).after($("#configSelect"));*/
		changeTable_CurrentConfig($("#configInfo1"),JSON.parse(window.currentConfig));
		$("#configDIV").removeClass("hidden");
		$("#configSelect1").attr("onchange","alterConfigDiv()");
		$("#configSelect2").attr("onchange","alterConfigDiv2()");
	}
	function alterConfigDiv(){
		var configID = Number.parseInt($("#configSelect1").val());
		//查询详细信息
		var poolConfigs = JSON.parse(window.localStorage.getItem("poolConfigList"));
		$.each(poolConfigs,function(i,item){
			if(poolConfigs[i].id==configID){
				changeTable_CurrentConfig($("#configInfo1"),poolConfigs[i]);
			}
		});
	}
	function alterConfigDiv2(){
		var configID = Number.parseInt($("#configSelect2").val());
		//查询详细信息
		if(configID!=-1){
			var poolConfigs = JSON.parse(window.localStorage.getItem("poolConfigList"));
			$.each(poolConfigs,function(i,item){
				if(poolConfigs[i].id==configID){
					changeTable_CurrentConfig($("#configInfo2"),poolConfigs[i]);
				}
			});
		}else{
			$("#configInfo2").html("");
		}
	}
	function changeTable_CurrentConfig(table,config){
		var otherOptions="";
		$.each(config.otherOptions,function(i,item){
			otherOptions = otherOptions+i+":"+item+"<br/>";
		});
		var div = '<tr><td colspan="13">配置 '+config.id+'(ID) </td></tr><tr><td>id</td><td>muid</td><td>profileName</td><td>miner</td><td>fork</td><td>algo</td><td>pool</td><td>wallet</td><td>password</td><td>otherOptions</td></tr><tr><td>'+config.id+'</td><td>'+config.muid+'</td><td>'+config.profileName+'</td><td>'+config.miner+
		'</td><td>'+config.fork+'</td><td>'+config.algo+'</td><td>'+config.pool+'</td><td>'+config.wallet+'</td><td>'
		+config.password+'</td><td>'+otherOptions+'</td></tr>';
		table.html("");
		table.append($(div));
	}
	function selectAll($this){
		var i = 0;
		$("#minerInfo tbody tr").each(function(){
			i++;
			if(i>2&&$(this).children().first().children().attr("type")==undefined){
				var select = $(this).children().first().next().next().next().next().children();
				if(!select.is(':checked')){
					select.click();
				}
			}
		});
		$($this).attr("onclick","deselectAll(this)");
	}
	function deselectAll($this){
		var i = 0;
		$("#minerInfo tbody tr").each(function(){
			i++;
			if(i>2&&$(this).children().first().children().attr("type")==undefined){
				var select = $(this).children().first().next().next().next().next().children();
				if(select.is(':checked')){
					select.click();
				}
			}
		});
		$($this).attr("onclick","selectAll(this)");
	}
	function launcher(){
		var json = {p1:Number.parseInt($("#configSelect1").val()),
				p2:Number.parseInt($("#configSelect2").val()),
				miners:MinerID};
		$.ajax({
			url:'/CrystalOS/rest/webSocket/startUp/duo',
			type:"POST",
			dataType:'json',
			data:JSON.stringify(json),
			contentType: "application/json",
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){//machineUid that launcher failed
				console.log(data);
				if(data==false){
					console.log("沒有機器連接中");
				}else if(data.length==0){
					console.log("添加成功");
				}else{
					for(var i=0;i<data.length;i++){
						console.log("矿机("+data[i]+")发送失败(可能未连接,可能你没有权限)");
					}
				}
			},
			error:function(){
				console.log("error!");
			},
		});
	}
	function shutDownAll(){
		console.log("shutdown");
		$.ajax({
			url:'/CrystalOS/rest/webSocket/shutDown/All',
			type:'POST',
			dataType:'json',
			contentType: 'application/json',
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){
				console.log(data);
				/*if(data=="exception"){
					console.log("发送期间发生未知错误Σ(っ°Д°;)っ");
				}else */
				if(data.length!=0){
					for(var i=0;i<data.length;i++){
						console.log("矿机 "+data[i]+" 未能发送成功（该机器没有连接上）");
					}
				}else{
					console.log("已成功发送到全部机器");
				}
			},
			error:function(data){
				console.log(data);
				console.log("error!");
			},
		});
	}