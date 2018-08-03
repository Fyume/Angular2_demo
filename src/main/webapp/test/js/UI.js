/**
 * 
 */
/*******  select类型的div处理  ***********/
var Menu1_font=["","Monitor","Stats","Rigs","Wallets"];
var Menu1_span=["","icon-desktop","icon-bar-chart","icon-dashboard","icon-credit-card"];
function showLi($this,menu){
	var menu_font,menu_span,menuID;
	switch(menu){
		case 1:
			menuID = "MenuSelect";
			menu_font = Menu1_font;
			menu_span = Menu1_span;
	}
	for(var i=0;i<menu_font.length-1;i++){
		var li = '<li class="MyLi" onclick="defaultLi(this,'+menu+')"><span class="'+menu_span[i+1]+'"></span> <span>'+Menu1_font[i+1]+'</span></li>';
		$("#"+menuID).append($(li));
	}
	$($this).attr("onclick","event.cancelBubble = true;hiddenLi(this,"+menu+")");
	$(document).one("click",function(e){
        if($(e.target).closest($("#"+menuID)).length == 0){
        	$("#defaultLi").parent().click();
        }
	});
}
function hiddenLi($this,menu){
	var i=0;
	var menu_font,menu_span,menuID;
	switch(menu){
		case 1:
			menuID = "MenuSelect";
			menu_font = Menu1_font;
			menu_span = Menu1_span;
	}
	$("#"+menuID+" li").each(function(){
		i++;
		if(i>1){
			$(this).remove();
		}
	});
	$($this).attr("onclick","event.cancelBubble = true;showLi(this,"+menu+")");
}
function defaultLi($this,menu){
	var defaultFont = $($this).children().first().next().html();//
	switch(menu){
	case 1:
		menuID = "MenuSelect";
		menu_font = Menu1_font;
		menu_span = Menu1_span;
	}
	//修改选中的li
	//0,1,2,3
	var n = $.inArray(defaultFont, menu_font);
	switch(n){
		case 0:
	}
	var span_class = $("#defaultLi").children().first();
	var span_font = span_class.next();
	span_class.attr("class",menu_span[n]);
	span_font.html(menu_font[n]);
	//修改数组
	/*var temp = menu_span[n];
	menu_span[n] = menu_span[0];
	menu_span[0] = temp;
	temp = menu_font[n];
	menu_font[n] = menu_font[0];
	menu_font[0] = temp;*/
	//刷新ul
	$("#defaultLi").parent().click();
}
/******** 左导航栏 ********/
function showLeft(){
	$("#Cover").removeClass("hidden");
	$("#leftMenu").css("width","317px");
	var i = 0;
	$("#leftMenu ul:first-child li").each(function(){
		i++;
		if(i>1){
			$(this).removeClass("hidden");
		}else{
			$(this).addClass("hidden");
		}
	});
}
function closeLeft(){
	$("#Cover").addClass("hidden");
	$("#leftMenu").css("width","50px");
	var i = 0;
	$("#leftMenu ul:first-child li").each(function(){
		i++;
		if(i>1){
			$(this).addClass("hidden");
		}else{
			$(this).removeClass("hidden");
		}
	});
}