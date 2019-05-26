$(function(){
	var level = 3;
	var curimg = 0;
	//定义装载图片的数组变量
	var arrImg = new Array("image9/image12.jpg","image9/thumb_image1.jpg","image9/thumb_image2.jpg");
	$("#indexjigsaw ul li input").each(function(i){
		$(this).bind("click",function(){
			switch(i){
				case 0:
					level = 3;
					break;
				case 1:
					level = 4
					break;
				case 2:
					level = 5
					break;
			}
			loadjisaw(level,arrImg[curimg]);
		})
	});
	$("#indexjigsaw .ulimg li").each(function(i){
		$(this).bind("click",function(){
			clearCss();
			$(this).removeClass("defalut");
			$(this).addClass("focus");
			curimg = i;
			switch(i){
				case 0:
					loadjisaw(level,arrImg[0]);
					break;
				case 1:
					loadjisaw(level,arrImg[1]);
					break;
				case 2:
					loadjisaw(level,arrImg[2]);
					break;
			}
		})
	});
	clearCss = function(){
		$("#indexjigsaw .ulimg li").each(function(){
			$(this).removeClass("focus");
			$(this).addClass("defalut");
		})
	}
	loadjisaw = function(level,url){
		$("#tip").html("");
		$('#gamePanel').empty();
		$.jigsaw('gamePanel',url,290,level,16,function(){});
	}
	//初始化
	loadjisaw(level,arrImg[0]);
});