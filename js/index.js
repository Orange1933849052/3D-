(function(){
    let oUl = document.querySelector("#wrap ul");
    let aLi = oUl.children;

    //四种形状函数
    let Table =(()=> {
            let coor = [
                {x:0,y:0},
                {x:17,y:0},
                {x:0,y:1},
                {x:1,y:1},
                {x:12,y:1},
                {x:13,y:1},
                {x:14,y:1},
                {x:15,y:1},
                {x:16,y:1},
                {x:17,y:1},
                {x:0,y:2},
                {x:1,y:2},
                {x:12,y:2},
                {x:13,y:2},
                {x:14,y:2},
                {x:15,y:2},
                {x:16,y:2},
                {x:17,y:2}
            ];
            return(i) => {
                let x,y;
                if (i<=17){
                    x=coor[i].x;
                    y=coor[i].y;
                }else if(i<=89){
                    x=i%18;
                    y=(i/18 |0)+2;
                }else if(i<=119){
                    x=(i-90)%15+1.5;
                    y=((i-90)/15 |0)+7;
                }else {
                    x=17;
                    y=6;
                }
                //计算位移
                let tX=(x-8.5)*150,
                    tY=(y-4)*190;
                return `transform:translate(${tX}px,${tY}px)`;
            }
        })();
        
        let Sphere = (()=>{
            let arr =[1,3,7,9,11,14,21,16,12,10,9,7,4,1];
            let x_ = 180/(arr.length-1);
            function getPos(i){
                let sum = 0;
                for(let j=0;j<arr.length;j++){
                    sum += arr[j];
                    if (sum>i){
                        return {ceng:j,ge:arr[j]-(sum-i)};
                    }
                }
            }
            return(i)=>{
                let {ceng,ge} = getPos(i);
                let rX=90-ceng*x_;
                let rY=360/arr[ceng]*(ge+0.5);
                return `transform:rotateY(${rY}deg) rotateX(${rX}deg) translateZ(1000px)`;
            };
            
        })();
        let Helix =(i)=>{
                let rY = i*(360/(125/3.5));
                let tY = (i-125/2)*10;
                return`transform:rotateY(${rY}deg) translateZ(800px) translateY(${tY}px)`;
        };
        let Grid =(i)=>{
                let x = i%5;
                let y = (i%25)/5 |0;
                let z = i/25 |0;
                let tX = (x-2)*300;
                let tY = (y-2)*300;
                let tZ = (2-z)*1000;
                return `transform:translate3d(${tX}px,${tY}px,${tZ}px)`;
        };
        let random = ()=>{
            let tX = (Math.random()*20000-10000)|0,
                tY = (Math.random()*20000-10000)|0,
                tZ = (Math.random()*30000-20000)|0;
            return `transform:translate3d(${tX}px,${tY}px,${tZ}px)`;
        }
    //创建125个li
    ;(function(){
        let html = document.createDocumentFragment();
        let oStyle = document.getElementById("style");
        let css = "";
        for(let i=0;i<125;i++){
            let oLi =document.createElement("li");
            let thisData = data[i] || {"order":"118","name":"Uuo","mass":""};
            oLi.innerHTML = `
            <p>${thisData.name}</p>
            <p>${thisData.order}</p>
            <p>${thisData.mass}</p>
            `;
            html.appendChild(oLi);
            css +=
            `#wrap ul.list.Table li:nth-child(${i+1}){${Table(i)}}`+
            `#wrap ul.list.Sphere li:nth-child(${i+1}){${Sphere(i)}}`+
            `#wrap ul.list.Helix li:nth-child(${i+1}){${Helix(i)}}`+
            `#wrap ul.list.Grid li:nth-child(${i+1}){${Grid(i)}}`+
            `#wrap ul.list.random li:nth-child(${i+1}){${random(i)}}`;
        }
        oStyle.innerText = css;
        oUl.appendChild(html);
        oUl.offetLeft;
        oUl.className = "list Grid";
    })();
    //鼠标控制
    ;(function(){
        let rY=0, rX=0, tZ=-3500
            ,ifDown=false
            ,downX,downY
            ,moveX,moveY
            ,disX,disY
            ,timer=null
            ,lastMoveTime=0
            ;
        //拖曳
        (function(){
            document.addEventListener("mousedown",downEvent);
            document.addEventListener("mousemove",moveEvent);
            document.addEventListener("mouseup",upEvent);
            //按下
            function downEvent (e){
                ifDown = true;
                cancelAnimationFrame(timer);
                disX = 0;
                disY = 0;
                downX = moveX = e.clientX;
                downY = moveY = e.clientY;
            }
            //移动
            function moveEvent (e){
                if(!ifDown)return;
                disX = e.clientX - moveX;
                disY = e.clientY - moveY;
                rY += disX*0.1;
                rX += disY*0.1;
                oUl.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                moveX = e.clientX;
                moveY = e.clientY;
                lastMoveTime = new Date();
            }
            //抬起
            function upEvent (){
                ifDown = false;
                if (new Date - lastMoveTime >200)return;
                (function m(){
                    if(Math.abs(disX)<=0.5 && Math.abs(disY)<=0.5)return;
                    disX *= 0.97;
                    disY *= 0.97;
                    rY += disX*0.1;
                    rX += disY*0.1;
                    oUl.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
                    timer=requestAnimationFrame(m);
                })();
            }
        })();
        //滚轮
        (function(){
            mousewheel (function(e,d){
                tZ += d*200;
                tZ = Math.min(tZ,700);
                tZ = Math.max(tZ,-12000);
                oUl.style.transform = `translateZ(${tZ}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
            });
            function mousewheel (eFn){
                function fn (e){
                    let d = e.wheelDelta || -e.detail;
                    d = d/Math.abs(d);
                    eFn(e,d);
                }
                if(document.onmousewheel===null){
                    document.addEventListener("mousewheel",fn);
                }else{
                    document.addEventListener("DOMMouseScrool",fn);
                }
            }
        })();
    })();
    ;(function(){
        let aBtn = document.querySelectorAll("#wrap ul.btn li");
        let ulClassArr = ["Table","Sphere","Helix","Grid"];
        aBtn.forEach((n,i)=>{
            n.onclick = function(){
                oUl.className = "list "+ulClassArr[i];
            };
        })
    })();
})();