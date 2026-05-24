setTimeout(function(){
var ks=[];var bs=[];
for(var k=1;k<=15;k++){ks.push(k);bs.push(k%2===1?4/(k*Math.PI):0);}
var d1={x:ks,y:bs,type:'bar',name:'|bₙ| kare dalga',marker:{color:'#60a5fa'}};
var layout={paper_bgcolor:'#0a0a0a',plot_bgcolor:'#0a0a0a',font:{color:'#e8e8e8'},xaxis:{title:'armonik n',gridcolor:'#1f2937',zerolinecolor:'#374151',dtick:1},yaxis:{title:'|bₙ|',gridcolor:'#1f2937',zerolinecolor:'#374151'},legend:{orientation:'h',y:1.08,xanchor:'center',x:0.5},margin:{t:30,r:20,b:50,l:50}};
Plotly.newPlot('plot-l2-coefs-tr',[d1],layout,{displayModeBar:false,responsive:true});
},250);