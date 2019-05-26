$.extend({
	jigsaw:function(id,imgUri,limitWidth,breakCount,swapCount,completed){
		if(!breakCount || breakCount <=0) breakCount = 3;
		if(!swapCount || swapCount <=0)
			swapCount = breakCount * breakCount;
		if(!limitWidth || limitWidth<=0)
			limitWidth = window.innerWidth;
		var swapBricks = function(b1,b2){
			var x = b1.css('left');
			var y = b1.css('top');
			b1.css('left',b2.css('left'));
			b1.css('top',b2.css('top'));
			b2.css('left',x);
			b2.css('top',y);
			var first = null;
			for(var i = 0; i<bricks.length;i++){
				if(bricks[i][0] === b1[0] || bricks[i][0] == b2[0]){
					if(first == null){
						first = i;
					}else{
						var tmpBrick = bricks[first];
						bricks[first] = bricks[i];
						bricks[i] = tmpBrick;
						break;
					}
				}
			}
		};
		var moveCursorTo = function(brick){
			var cursor1 = $('#cursor1');
			cursor1.css('left',parseInt(brick.css('left')) - 1);
			cursor1.css('top',parseInt(brick.css('top')) -1);
			cursor1.css('display','block');
		}
		var hideCurrsor = function(){
			var cursor1 = $('#cursor1');
			cursor1.css('display','none');
		};
		var verify = function(){
			var success = true;
			for(var i = 0;i < bricks.length;i++){
				if(bricks[i].attr('id') !=i){
					success = false;
					break;
				}
			}
			if(success){
				for(var i = 0;i<bricks.length;i++){
					bricks[i].unbind('click');
				}
				if(completed && completed != undefined){
					completed.apply(this,arguments);
				}
				$("#tip").html("Congratulation,Your success!");
			}
		};
		var mainPanel = $('#' + id);
		mainPanel.css('position','relative');
		var mainImage = new Image();
		var bricks = [];
		var selectedBrick = null;
		mainImage.src = imgUri;
		$(mainImage).load(function(e){
			mainPanel.css('width',this.width + 'px');
			mainPanel.css('height',this.height + 'px');
			var aw = this.width / breakCount;
			var ah = this.height / breakCount;
			var bw = limitWidth / breakCount;
			var limitHeight = this.height * limitWidth / this.width;
			var bh = limitHeight / breakCount;
			for(var row = 0;row < breakCount;row++){
				for(var col = 0;col < breakCount;col++){
					var gameCanvas = $('<canvas />');
					gameCanvas.attr('width',bw + 1 + 'px');
					gameCanvas.attr('height',bh + 1 + 'px');
					gameCanvas.css('position','absolute');
					gameCanvas.css('left',col * bw + 'px');
					gameCanvas.css('top',row * bh + 'px');
					gameCanvas.attr('id',row * breakCount + col);
					gameCanvas.click(function(){
						var current = $(this)
						if(selectedBrick == null){
							selectedBrick = current;
							moveCursorTo(current);
						}else if(selectedBrick[0] == current[0]){
							selectedBrick = null;
							hideCurrsor();
						}else{
							swapBricks(selectedBrick,current);
							selectedBrick = null;
							hideCurrsor();
							verify();
						}
					});
					var gameContext = gameCanvas[0].getContext('2d');
					gameContext.drawImage(
						this,col * aw,row * ah,aw,ah,0,0,bw + 1,bh+ 1
						);
					mainPanel.append(gameCanvas);
					bricks.push(gameCanvas);
				}
			}
			for(var i = 0;i<swapCount;i++){
				var i1 = parseInt(Math.random() * (bricks.length));
				var i2 = parseInt(Math.random() * (bricks.length));
				while(i1 == i2){
					i2 = parseInt(Math.random() * bricks.length);
				}
				swapBricks(bricks[i1],bricks[i2]);
			}
			var cursor1 = $('<div id="cursor1" />');
			cursor1.css('width',bw);
			cursor1.css('height',bh);
			cursor1.css('display','none');
			cursor1.css('position','absolute');
			cursor1.css('border-top','solid 2px #fff');
			cursor1.css('border-left','solid 2px #fff');
			cursor1.css('border-right','solid 2px #fff');
			cursor1.css('border-bottom','solid 2p #fff');
			cursor1.click(function(){
				hideCurrsor();
				selectedBrick = null;
			});
			mainPanel.append(cursor1);
		});
	}
});