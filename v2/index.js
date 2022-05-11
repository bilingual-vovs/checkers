const patterns = {
    style: `
        @keyframes active { 
            0% {transform: scale(1, 1);}
            50% {transform: scale(0.8, 0.8);}
            100% {tranfotm: scale(1, 1)}
        }
        @keyframes shake{
            0% {transform: translateX(0);}
            50% {transform: translateX(1vw);}
            100% {transform: translateX(0);}
        }`,
    alert: (id, text)=>{
        return `<div id='${id}' style='background-color:red;position:fixed; top:45vh; left:45vw;padding:5vw;box-shadow: 10px 10px 5px brown;border-radius:10px;z-index:200;'>${text}</div>`
    },
    checkers: {
        white: (id, sizeOfCell, style)=>{
            return `<img id='${id}' src='./img/whiteChecker.png' style='${(style ? style: '') + `transition-duration:500ms;margin:${sizeOfCell*0.1};width:${sizeOfCell*0.8};height:${sizeOfCell*0.8};`}' >`
        },
        black: (id, sizeOfCell, style)=>{
            return `<img id='${id}' src='./img/blackChecker.png' style='${(style ? style: '') + `transition-duration:500ms;margin:${sizeOfCell*0.1};width:${sizeOfCell*0.8};height:${sizeOfCell*0.8};`}' >`
        }
    },
    desk: {
        backgorund: (id, size, position, style)=>{
            return `<div id='${id}' style='${(style ? style: '') + `position:absolute;z-index:22;left:${position.x};top:${position.y};width:${size};height:${size};`}'></div>`
        },
        whiteCell: (id, size, position, style)=>{
            return `<div id='${id}' style='${(style ? style: '') + `position:absolute;z-index:22;left:${position.x};top:${position.y};width:${size};height:${size};background-color:white;`}'></div>`
        },
        blackCell: (id, size, position, style)=>{
            return `<div id='${id}' style='${(style ? style: '') + `position:absolute;z-index:22;left:${position.x};top:${position.y};width:${size};height:${size};background-color:black;`}'></div>`
        }
    }
}



class Desk{
    constructor(size, resolution, position, numOfLines, style){
        this.size = size
        this.resolution = resolution
        this.position = position
        this.numOfLines = numOfLines
        this.choosenChecker = null

        document.body.innerHTML += patterns.desk.backgorund('background-01', size, position, style)
        
        let color = false
        let step = size/resolution
        this.cells = []
        this.checkers = []
        this.alerts = []

        for (let a = 0; a<resolution;a++){
            for(let b = 0; b<resolution;b++){
                document.getElementById('background-01').innerHTML += color ? patterns.desk.blackCell(this.cells.length, step, {x: a*step, y: b*step}):patterns.desk.whiteCell(this.cells.length, step, {x: a*step, y: b*step})
                 
                if(color && (b<numOfLines || resolution-numOfLines<=b)){
                    this.checkers.push(this.createChecker((b<=numOfLines) ? `white-${String(a) + b}`:`black-${String(a) + b}`, {a: a,b: b}, step, (b<=numOfLines) ? true:false, this.cells.length))
                    this.cells.push({
                        a: a,
                        b: b,
                        checkerId: `white-${String(a) + b}`
                    })
                }
                else{
                    this.cells.push({
                        a: a,
                        b: b,
                        checkerId: null
                    })
                }
                color = (resolution%2==0&&b==7) ? color:!color
            }
        }
        document.body.innerHTML += `<style>${patterns.style}</style>`
        for (let key in this) {
            if (typeof this[key] == 'function') {
              this[key] = this[key].bind(this);
            }
          }
        
    }
    createChecker(id, position, sizeOfCell, color, cellId, style){
        document.getElementById(cellId).innerHTML = color ? patterns.checkers.white(id, sizeOfCell, style):patterns.checkers.black(id, sizeOfCell, style)
        return {
            id: id,
            position: position,
            cellId: cellId,
            sizeOfCell: sizeOfCell,
            isLady: false,
            selected: false, 
            color: color,
            style: style
        }
    } 
    checkPosibilityOfMove(checkerID, func){
        let checker = this.checkers.find(elem => checkerID == elem.id)
        let posibilities = []

        if (checker.isLady){

        }
        else{
            if(checker.color){
                if (checker.position.a+1<=this.resolution && checker.position.b+1<=this.resolution) posibilities.push({a: checker.position.a+1, b: checker.position.b+1})
                if (checker.position.a-1>=0 && checker.position.b+1<=this.resolution) posibilities.push({a: checker.position.a-1, b: checker.position.b+1})
            }
            else{
                if (checker.position.a+1<=this.resolution && checker.position.b-1>=this.resolution) posibilities.push({a: checker.position.a+1, b: checker.position.b-1})
                if (checker.position.a-1>=this.resolution && checker.position.b-1>=this.resolution) posibilities.push({a: checker.position.a-1, b: checker.position.b-1})
            }
            
        }
        console.log(posibilities)
    }
    startGame(){
        this.thisMove = true
        document.addEventListener('click', this.eventHandler)
    }
    eventHandler(event){
        if(event.srcElement.id.split("-")[0] == (!this.thisMove ? "white":"black")){
            a.onCheckerClick(event.srcElement.id)
        }
        else if(event.srcElement.id.split("-")[0] == (this.thisMove ? "white":"black")){
            a.shakeElem("background-01")
        }
        
    }
    alert(text, duration){
        document.body.innerHTML += patterns.alert("allert-"+this.alerts.length, text)
        this.alerts.push("allert-"+this.alerts.length)
        
        setTimeout(()=>{
            document.getElementById(this.alerts[0]).remove()
            this.alerts.splice(0, 1)
        }, duration)
    }
    onCheckerClick(checkerId){
        let checker = this.checkers.find(elem => checkerId == elem.id)
        if(checker.selected){
            this.checkerDeselect(checkerId)
            checker.selected = false
        }
        else{
            this.checkers.forEach(elem => {
                elem.selected = false
                this.checkerDeselect(elem.id)
            })
            this.checkerSelect(checkerId)
            checker.selected = true
        }
        
        
    }

    checkerSelect(checkerId){
        document.getElementById(checkerId).style.animationIterationCount = "infinite"
        document.getElementById(checkerId).style.animationName = 'active'
        document.getElementById(checkerId).style.animationDuration = "1.5s"
    }

    checkerDeselect(checkerId){
        document.getElementById(checkerId).style.animationIterationCount = ""
        document.getElementById(checkerId).style.animationName = ""
        document.getElementById(checkerId).style.animationDuration = ""
    }
    shakeElem(id){
        document.getElementById(id).style.animationIterationCount = "6"
        document.getElementById(id).style.animationName = "shake"
        document.getElementById(id).style.animationDuration = "100ms"
        document.getElementById(id).style.boxShadow = "0px 0px 50px red"
        setTimeout(()=>{
            document.getElementById(id).style.animationIterationCount = ""
            document.getElementById(id).style.animationName = ""
            document.getElementById(id).style.animationDuration = ""
            document.getElementById(id).style.boxShadow = ""
        },600)
    }
}

let a = new Desk(800, 8, {x:10,y:10},3, 'border:solid;border-width: 5px;border-color:black;')