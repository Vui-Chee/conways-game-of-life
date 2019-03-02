(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,n){"use strict";n.r(t);var l=n(0),a=n.n(l),r=n(2),i=n.n(r),s=n(3),o=n(4),c=n(6),u=n(5),v=n(7),d=function(e){for(var t,n=e.startingCorner,l=e.numCols,r=e.liveCells,i=e.disabled,s=e.click,o=e.row,c=[],u=n.y;u<n.y+l;u++){t=a.a.createElement("button",{disabled:i,onClick:s.bind(void 0,o,u)});var v,d="grid-cell";d+=i?"":" hover";try{r[o][u]&&(d+=" live")}catch(h){}v=a.a.createElement("div",{className:d,key:u},t),c.push(v)}return a.a.createElement("div",{className:"grid-row"}," ",c)},h=function(e){for(var t=[],n=e.startingCorner.x;n<e.startingCorner.x+e.numRows;n++)t.push(a.a.createElement(d,Object.assign({key:n,row:n},e)));return a.a.createElement("div",{className:"grid"},t)},m="Use arrow keys to move window.",f="Simulation has started.",y="Select any number cells to be live and click start.",C="Click pause to stop the simulation.",g=40,b=38,k=37,E=39,p=function(e){var t=e.text,n=e.click,l=e.customStyles,r=e.disabled;return a.a.createElement("div",{className:"game-button ".concat(l)},a.a.createElement("button",{onClick:n,disabled:r},a.a.createElement("b",null,t)))},w=function(e){return e.hasStarted?a.a.createElement("b",null,a.a.createElement("p",null,f),a.a.createElement("p",null,C)):a.a.createElement("b",null,a.a.createElement("p",null,m),a.a.createElement("p",null,y))},S=function(e){function t(){var e,n;Object(s.a)(this,t);for(var l=arguments.length,a=new Array(l),r=0;r<l;r++)a[r]=arguments[r];return(n=Object(c.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(a)))).state={startingCorner:{x:0,y:0},liveCells:{},hasStarted:!1,numRows:12,numCols:12},n.toggleLife=function(){n.setState(function(e){return{hasStarted:!e.hasStarted}})},n.toggleCell=function(e,t){var l=n.state.liveCells,a=Object.assign({},l);try{if(!a[e][t])throw"insert cell";n.removeCell(e,t,a)}catch(r){n.insertCell(e,t,a)}n.setState({liveCells:a})},n.clearLiveCells=function(){n.setState({liveCells:{}})},n.moveWindow=function(e){e.preventDefault();var t={x:n.state.startingCorner.x,y:n.state.startingCorner.y};if(e.keyCode===g)t.x++;else if(e.keyCode===b)t.x--;else if(e.keyCode===k)t.y--;else{if(e.keyCode!==E)return;t.y++}n.setState({startingCorner:t})},n}return Object(v.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this;window.addEventListener("keydown",this.moveWindow),setInterval(function(){e.state.hasStarted&&e.tick()},1e3)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("keydown",this.moveWindow)}},{key:"findNeighbours",value:function(e,t){for(var n=this.state.liveCells,l=[],a=[],r=e-1;r<=e+1;r++)for(var i=t-1;i<=t+1;i++)if(e!==r||t!==i)try{void 0!==n[r][i]?l.push({x:r,y:i}):a.push({x:r,y:i})}catch(s){a.push({x:r,y:i})}return{liveNeighbours:l,deadNeighbours:a}}},{key:"insertCell",value:function(e,t,n){try{n[e][t]=!0}catch(l){n[e]={},n[e][t]=!0}}},{key:"removeCell",value:function(e,t,n){try{Object.keys(n[e]).length<=1?delete n[e]:delete n[e][t]}catch(l){}}},{key:"countTotalLiveCells",value:function(e){var t=0;return Object.keys(e).forEach(function(n){t+=Object.keys(e[n]).length}),t}},{key:"tick",value:function(){var e=this,t=this.state.liveCells,n={};Object.keys(t).forEach(function(l){Object.keys(t[l]).forEach(function(t){var a=[parseInt(l),parseInt(t)],r=a[0],i=a[1],s=e.findNeighbours(r,i),o=s.liveNeighbours,c=s.deadNeighbours;o.length>=2&&o.length<=3&&e.insertCell(r,i,n),c.forEach(function(t){3===e.findNeighbours(t.x,t.y).liveNeighbours.length&&e.insertCell(t.x,t.y,n)})})}),this.setState({hasStarted:this.countTotalLiveCells(n)>0,liveCells:n})}},{key:"render",value:function(){var e=this.state,t=e.numRows,n=e.numCols,l=e.liveCells,r=e.hasStarted,i=e.startingCorner;return a.a.createElement(a.a.Fragment,null,a.a.createElement("h1",null," Conway's Game of Life "),a.a.createElement(w,{hasStarted:r}),a.a.createElement("p",null,"Number of Live Cells : ",this.countTotalLiveCells(l)),a.a.createElement(h,{startingCorner:i,numRows:t,numCols:n,liveCells:l,click:this.toggleCell,disabled:r}),a.a.createElement(p,{text:r?"pause":"start",click:this.toggleLife,customStyles:r?"pause":""}),a.a.createElement(p,{text:r?"--":"clear",click:this.clearLiveCells,disabled:r}))}}]),t}(l.Component);i.a.render(a.a.createElement(S,null),document.getElementById("root"))},8:function(e,t,n){e.exports=n(14)}},[[8,1,2]]]);
//# sourceMappingURL=main.ea8711e1.chunk.js.map