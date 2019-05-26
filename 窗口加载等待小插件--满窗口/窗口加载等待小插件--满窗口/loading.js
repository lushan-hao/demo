//loading
//body中加上下面这句: <div id="loadingzzz" class="loading">Loading pages...</div>
function loadingStart(e,frameId){
	
	e.loading=function(frameId){
		$(frameId).html('');
	    $(frameId).append('<div class="loading">Loading pages...</div>');
	    var timer=setInterval(function(){
	      if($(frameId).length>59){
	        $(e['.loading']).remove();
	      }
	    },50)
	    clearInterval(timer);
	};
	e.loading(frameId);
}
