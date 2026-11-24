'use strict';
// One geometry algorithm for component windows and internal functional symbols.
(() => {
    function route(a,aSide,b,bSide,aOwner,bOwner,obstacles=[]) {
      const normals={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
      function escape(p,side,owner) {
        const [dx,dy]=normals[side];let distance=14;
        for(const r of obstacles) {
          if(r.owner===owner)continue;
          const crossing=dx?p.y>r.y&&p.y<r.y+r.h:p.x>r.x&&p.x<r.x+r.w;
          const gap=dx?(dx>0?r.x-p.x:p.x-r.x-r.w):(dy>0?r.y-p.y:p.y-r.y-r.h);
          if(crossing&&gap>0)distance=Math.min(distance,gap/2);
        }
        return {x:p.x+dx*Math.max(3.5,distance),y:p.y+dy*Math.max(3.5,distance)};
      }
      function blocked(p,q) {
        const e=.01;
        return obstacles.some(r=>Math.abs(p.y-q.y)<e?
          p.y>r.y+e&&p.y<r.y+r.h-e&&Math.max(p.x,q.x)>r.x+e&&Math.min(p.x,q.x)<r.x+r.w-e:
          p.x>r.x+e&&p.x<r.x+r.w-e&&Math.max(p.y,q.y)>r.y+e&&Math.min(p.y,q.y)<r.y+r.h-e);
      }
      function compact(items) {
        const result=[];
        for(const p of items) {
          if(result.length&&Math.hypot(p.x-result.at(-1).x,p.y-result.at(-1).y)<.01)continue;
          while(result.length>1) {
            const a=result.at(-2),b=result.at(-1);
            const vertical=Math.abs(a.x-b.x)<.01&&Math.abs(b.x-p.x)<.01&&(b.y-a.y)*(p.y-b.y)>=0;
            const horizontal=Math.abs(a.y-b.y)<.01&&Math.abs(b.y-p.y)<.01&&(b.x-a.x)*(p.x-b.x)>=0;
            if(vertical||horizontal)result.pop();else break;
          }
          result.push(p);
        }return result;
      }
      const start=escape(a,aSide,aOwner),end=escape(b,bSide,bOwner);
      const xs=[start.x,end.x,(start.x+end.x)/2,...obstacles.flatMap(r=>[r.x,r.x+r.w])];
      const ys=[start.y,end.y,(start.y+end.y)/2,...obstacles.flatMap(r=>[r.y,r.y+r.h])];
      const candidates=[...xs.map(x=>[start,{x,y:start.y},{x,y:end.y},end]),...ys.map(y=>[start,{x:start.x,y},{x:end.x,y},end])];
      let best=null,cost=Infinity;
      for(const raw of candidates) {
        const points=compact(raw);if(points.slice(1).some((q,i)=>blocked(points[i],q)))continue;
        const length=points.slice(1).reduce((n,p,i)=>n+Math.abs(p.x-points[i].x)+Math.abs(p.y-points[i].y),0)+points.length*8;
        if(length<cost){best=points;cost=length;}
      }
      if(!best) {
        const unique=xs=>[...new Set(xs)].sort((a,b)=>a-b),gx=unique(xs),gy=unique(ys);
        const first=gy.indexOf(start.y)*gx.length+gx.indexOf(start.x),last=gy.indexOf(end.y)*gx.length+gx.indexOf(end.x);
        const queue=[first],seen=new Map([[first,null]]);
        for(let i=0;i<queue.length;i++) {
          const key=queue[i],x=key%gx.length,y=Math.floor(key/gx.length);
          if(key===last){best=[];for(let k=key;k!==null;k=seen.get(k))best.push({x:gx[k%gx.length],y:gy[Math.floor(k/gx.length)]});best.reverse();break;}
          for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const xx=x+dx,yy=y+dy,next=yy*gx.length+xx;
            if(xx<0||yy<0||xx>=gx.length||yy>=gy.length||seen.has(next)||blocked({x:gx[x],y:gy[y]},{x:gx[xx],y:gy[yy]}))continue;
            seen.set(next,key);queue.push(next);
          }
        }
      }
      // Normal entry/exit are retained even if a manually crowded layout has no clear middle route.
      const points=compact([a,...(best||[start,{x:end.x,y:start.y},end]),b]);
      return 'M '+points.map(p=>p.x+' '+p.y).join(' L ');
    }
 window.ChipOpenboxOrthogonalRouting={route};
})();
