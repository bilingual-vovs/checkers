class Desk {
    constructor(size, resolution, position, numberOfLines, firstMove, style){
        this.size = size
        this.numberOfLines = numberOfLines
        this.firstMove = firstMove 
        this.style = style
        this.resolution = resolution
        this.position = position
        let step = size / resolution
        let cells = []
        let b = 0
        let color = false
        this.whiteCheckersCount = 0
        this.blackCheckersCount = 0
        let desk =  `<div style='${(style ? style : "" )+ `height:${size}px;width:${size}px;position:absolute;left:${position.x}px; top:${position.y}px`}' id='desk'>
                
            </div>` 
        document.body.innerHTML += desk
        for(let a = 0; a<resolution;){

            document.getElementById("desk").innerHTML += `<div id='${String(a)+b}' style='display:flex;align-items:center;width:${step};height:${step};position:absolute;left:${a*step}px; top:${b*step}px;background-color:${color ? "white":"black"};'></div>`
            
            
            if(b<numberOfLines){
                cells.push({
                    posX: a*step,
                    posY: b*step,
                    a: a,
                    b: b,
                    checker: !color ? this.createChecker(false, {x:a,y:b}, String(a)+b, step,function(){}):"none"
                })
            }
            else if(b>=resolution-numberOfLines){
                cells.push({
                    posX: a*step,
                    posY: b*step,
                    a: a,
                    b: b,
                    checker: !color ? this.createChecker(true, {x:a,y:b}, String(a)+b, step,function(){}):"none"
                })
            }
            
            if(b >= resolution-1){
                b = 0
                a++
                if(resolution%2 == 1){
                    color = !color
                }
            }
            else{
                b++
                color = !color
            }
        }
        
        this.cells=cells
    }
    createChecker(color, position, divId, step){
        if(color){
            this.whiteCheckersCount++
            return new Checker(color, position, "white"+String(this.whiteCheckersCount-1), divId, step)
        }else{
            this.blackCheckersCount++
            return new Checker(color, position, "black"+String(this.blackCheckersCount-1), divId, step)
        }
        
        
    }
    startGame(firstMove){
        let win = false
        let move = firstMove
        while(!win){


            move = ! move
        }
    }
    
}

class Checker{
    constructor(color, position, id, divId, size, onclick){
        this.color = color
        this.position = position
        this.id = id
        this.status = "soliger"
        document.getElementById(divId).innerHTML += `<div onclick='${onclick}' id='${id}' style='margin:${size*0.1}px;background-color:${color? "red":"blue"};border-color:${color?"black":"white"};border-width:3px;border:solid;border-radius:100%;display:flex;width: ${size*0.8}px;height:${size*0.8}px;'></div>`
        
    }
    moveSoliger(){

    }
    chekPosobylyty(){

    }
}