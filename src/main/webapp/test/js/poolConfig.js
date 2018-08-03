/**
 * poolConfig
 */
function sendConfigToAll(id){
		var json = {id:id};
		console.log("sendConfigToAll(json):"+JSON.stringify(json));
		$.ajax({
			url:'/CrystalOS/rest/webSocket/startUp/Stop',
			type:'POST',
			dataType:'json',
			contentType: 'application/json',
			data:JSON.stringify(json),
			headers: {'Authorization': $.cookie('minerToken')},
			cache:false,
			success:function(data){
				console.log(data);
				/*if(data=="exception"){
					console.log("发送期间发生未知错误Σ(っ°Д°;)っ");
				}else */if(data.length!=0){
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
	function sendConfigByTag($this,id){
		if($($this).next().html()==undefined){
			//将tagSelect塞进sendConfigByTag
			$($this).after($("#tagSelect"));
			$("#tagSelect").removeClass("hidden");
		}else{//已存在
			if(confirm("确定选这个tag?("+$("#tagSelect").val()+")\n点击确认即可发送命令")){
				console.log("发送");
				var json = {id:id,tagName:$("#tagSelect").val()};
				console.log("sendConfigByTag(json): "+JSON.stringify(json));
				$.ajax({
					url:'/CrystalOS/rest/webSocket/startUp/Tag',
					type:'POST',
					dataType:'json',
					contentType: 'application/json',
					data:JSON.stringify(json),
					headers: {'Authorization': $.cookie('minerToken')},
					cache:false,
					success:function(data){
						console.log(data);
						if(data.length!=0){
							for(var i=0;i<data.length;i++){
								console.log("矿机 "+data[i]+" 未能发送成功（该机器没有连接上）");
							}
						}else{
							console.log("已成功发送到该Tag的全部机器");
						}
					},
					error:function(data){
						console.log(data);
						console.log("error!");
					},
				});
			}
		}
	}
	function sendConfigToSingle($this,id){
		if($($this).next().html()==undefined){
			//将tagSelect塞进sendConfigByTag
			$($this).after($("#nickNameSelect"));
			$("#nickNameSelect").removeClass("hidden");
		}else{
			if(confirm("确定选这个miner?("+$("#nickNameSelect option:selected").html()+")\n点击确认即可发送命令")){
				var json = {id:id,minerID:Number.parseInt($("#nickNameSelect option:selected").val())};
				console.log("sendConfigToSingle(json): "+JSON.stringify(json));
				$.ajax({
					url:'/CrystalOS/rest/webSocket/startUp/Miner',
					type:'POST',
					dataType:'json',
					contentType: 'application/json',
					data:JSON.stringify(json),
					headers: {'Authorization': $.cookie('minerToken')},
					cache:false,
					success:function(data){
						console.log(data);
						if(data=="true"){
							console.log("发送成功~");
						}else{
							console.log("矿机ID为 "+data+" 发送失败");
						}
					},
					error:function(data){
						console.log(data);
						console.log("error!");
					},
				});
			}
		}
	}
	//blablabla...
	function deletePoolConfig(){
		
	}
	/*function editConfig(poolConfigID){
		//在本地找poolConfigID
		var poolConfigList = window.localStorage.setItem("poolConfigList",JSON.stringify(data));
		//遍历
	}*/
