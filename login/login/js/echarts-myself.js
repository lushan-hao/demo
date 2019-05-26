function drawECharts(container,option){
	
	require.config({
        paths: {
            echarts: '/vpayserver/js'
        }
    });
    
    // 使用
    require(
        [
            'echarts',
            'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(container); 
           
            // 为echarts对象加载数据 
            myChart.setOption(option,true); 
        }
    );
}

function setTab(m,n){  
    
    var tli=document.getElementById("menu"+m).getElementsByTagName("li");  
     
    var mli=document.getElementById("main"+m).getElementsByTagName("ul");  
     
    for(i=0;i<tli.length;i++){  
     
     tli[i].className=i==n?"hover":"";  
     
     mli[i].style.display=i==n?"block":"none";  
     
    }  
     
   }  