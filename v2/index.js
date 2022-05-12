
const patterns = {
    style: `
        *{
            transition-duration: 0.7s
        }
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
            return `<img id='${id}' src='./img/whiteChecker.png' style='${(style ? style: '') + `z-index:24;position:absolute;transition-duration:700ms;margin:${sizeOfCell*0.1};width:${sizeOfCell*0.8};height:${sizeOfCell*0.8};`}' >`
        },
        black: (id, sizeOfCell, style)=>{
            return `<img id='${id}' src='./img/blackChecker.png' style='${(style ? style: '') + `z-index:24;position:absolute;transition-duration:700ms;margin:${sizeOfCell*0.1};width:${sizeOfCell*0.8};height:${sizeOfCell*0.8};`}' >`
        },
        hint : (id, sizeOfCell, style)=>{
            return `<img id='${id}' src='./img/hintChecker.png' style='${(style ? style: '') + `z-index:24;position:absolute;transition-duration:700ms;margin:${sizeOfCell*0.2};width:${sizeOfCell*0.6};height:${sizeOfCell*0.6};`}' >`
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
        this.thisMove = true

        document.body.innerHTML += patterns.desk.backgorund('background-01', size, position, style)
        
        let color = false
        let step = size/resolution
        this.cells = []
        this.checkers = []
        this.alerts = []
        this.sizeOfCell = step
        this.hints = []

        for (let a = 0; a<resolution;a++){
            for(let b = 0; b<resolution;b++){
                document.getElementById('background-01').innerHTML += color ? patterns.desk.blackCell(this.cells.length, step, {x: a*step, y: b*step}):patterns.desk.whiteCell(this.cells.length, step, {x: a*step, y: b*step})
                 
                if(color && (b<numOfLines || resolution-numOfLines<=b)){
                    this.checkers.push(this.createChecker((b<=numOfLines) ? `white-${String(a) + b}`:`black-${String(a) + b}`, {a: a,b: b}, step, (b<=numOfLines) ? true:false, this.cells.length))
                    this.cells.push({
                        a: a,
                        b: b,
                        id: String(this.cells.length),
                        checkerId: `white-${String(a) + b}`
                    })
                }
                else{
                    this.cells.push({
                        a: a,
                        b: b,
                        id: String(this.cells.length),
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
            isLady: false,
            selected: false, 
            color: color,
            childHints: [],
            style: style
        }
    }  
    createHint({a, b, parent, id, atack}){
        document.getElementById(this.cells.find(elem => elem.a == a && elem.b == b).id).innerHTML = patterns.checkers.hint(id, this.sizeOfCell)
        this.checkers.find(elem => elem.id == parent.id).childHints.push(id)
        this.hints.push({
            id: id,
            a: a,
            b: b,
            checkerId: parent.id,
            atack: atack,
            cellId: this.cells.find(elem => elem.a == a && elem.b == b)
        })
        return {
            id: id,
            a: a,
            b: b,
            checkerId: parent.id,
            atack: atack,
            cellId: this.cells.find(elem => elem.a == a && elem.b == b)
        }
    }
    moveChecker(id, a, b){
        let checkerAsset = {}
        for(let key in document.getElementById(id)){
            checkerAsset[key] = document.getElementById(id)[key]
        }
        
        document.getElementById(id).style.left = String(a*this.sizeOfCell) + "px"
        document.getElementById(id).style.top = String(b*this.sizeOfCell) + "px"
        let checker = this.checkers.find(elem => elem.id == id)
        checker.childHints.forEach(elemnt =>{
            this.hints.splice(this.hints.indexOf(this.hints.find(elem => elemnt == elem.id), 1))
        })
        checker.position ={a: a, b: b}
        let cell = this.cells.find(elem => elem.a == a && elem.b == b)
        this.checkerDeselect(id)
        document.getElementById(id).remove()
        document.getElementById(cell.id).innerHTML = checker.color ? patterns.checkers.white(id, this.sizeOfCell): patterns.checkers.black(id, this.sizeOfCell)
        cell.checkerId = checker.id
        this.cells.find(elem => elem.id == checker.cellId).checkerId == "none"
        this.thisMove = !this.thisMove
    }
    deleteChecker(id){
        document.getElementById(id).remove()
        this.checkers.splice(this.checkers.indexOf(this.checkers.find(elem=> elem.id == id)), 1)
    }
    checkPosibilityOfMove(checker, a, b){
        let move = false
        if (checker.isLady){
            for(let i = 0; i< 7; i++){
                if(checker.position.a + a <this.resolution && checker.position.a + a>=0 
                    &&
                    checker.position.b + (checker.color ? b : -b) <this.resolution && checker.position.b + (checker.color ? b : -b)>=0
                    &&
                    this.checkers.find(elem => elem.position.a == checker.position.a + a && elem.position.b == b)){
                    move = []
                    move.push({
                        a: checker.position.a + a,
                        b: checker.position.b + (checker.color ? b : -b),
                        points: null,
                        id: String(a) + b + "-hint",
                        parent: checker,
                        functions: [this.moveChecker]
                    })
                }
                else{
                    break
                }
            }
        }
        else{
            if(checker.position.a + a <this.resolution && checker.position.a + a>=0 
                &&
                checker.position.b + (checker.color ? b : -b) <this.resolution && checker.position.b + (checker.color ? b : -b)>=0
                &&
                !this.checkers.find(elem => elem.position.a == checker.position.a + a && elem.position.b == checker.position.b + (checker.color ? b: -b))){
                move = []
                move.push({
                    a: checker.position.a + a,
                    b: checker.position.b + (checker.color ? b : -b),
                    points: null,
                    id: String(checker.position.a + a) + checker.position.b + b + "-hint",
                    parent: checker,
                    atack: false,
                    functions: [this.moveChecker]
                })
            }
        }
        return move
    }
    checkPosibilityOfAtack(checker, a, b){
        let move = []
        if(checker.isLady){

        }
        else{
            let cell = this.checkers.find(elem => elem.position.a == checker.position.a + a && elem.position.b == checker.position.b + (checker.color ? b:-b) && (checker.color? "white" :"black")  != elem.id.split("-")[0]
            &&
            !this.checkers.find(elem => elem.position.a == checker.position.a + a*2 && elem.position.b == checker.position.b + (checker.color ? b:-b)*2))
            if(cell){
                move.push({
                    a: checker.position.a + a*2,
                    b: checker.position.b + (checker.color ? b : -b)*2,
                    points: null,
                    id: String(checker.position.a + a) + checker.position.b + b + "-hint",
                    parent: checker,
                    atack: this.checkers.find(elem => elem.position.a == checker.position.a + a && elem.position.b == checker.position.b + (checker.color ? b:-b) && (checker.color? "white" :"black") != elem.id.split("-")[0]),
                    functions: [this.moveChecker]
                })
                // let modifiedChecker = checker
                // modifiedChecker.position.a = checker.position.a + a*2
                // modifiedChecker.position.b = checker.position.b + (checker.color ? b : -b)*2
                // let atack =  this.checkPosibilityOfAtack(modifiedChecker)
            }
        }
        return move
    }
    buildHints(checkerID){
        let checker = this.checkers.find(elem => checkerID == elem.id)
        let posibilities = []
        let moveInA = [1, -1, 1, -1]
        let moveInB = [1, 1, -1, -1]
        
        for (let i = 0; i<4;i++){
            let posibilityOfMove = i>1 ? false:this.checkPosibilityOfMove(checker, moveInA[i], moveInB[i])
            let posibilityOfAtack = this.checkPosibilityOfAtack(checker, moveInA[i], moveInB[i])
            if (posibilityOfMove) {
                posibilityOfMove.forEach(elem => posibilities.push(elem))
            }
            else if(posibilityOfAtack){
                posibilityOfAtack.forEach(elem => posibilities.push(elem))
            }
        }
            

        posibilities.forEach(elem => {
            this.createHint(elem)
        })
    }
    startGame(){
        this.thisMove = true
        document.addEventListener('click', this.eventHandler)
    }
    eventHandler(event){
        if(event.srcElement.id.split("-")[0] == (a.thisMove ? "white":"black")){
            a.onCheckerClick(event.srcElement.id)
        }
        else if(event.srcElement.id.split("-")[0] == (!a.thisMove ? "white":"black")){
            a.shakeElem("background-01")
        }
        else if(event.srcElement.id.split("-")[1] == "hint") {
            if(a.hints.find(elem => elem.id == event.srcElement.id).atack){
                a.deleteChecker(a.hints.find(elem => elem.id == event.srcElement.id).atack.id)
            }
            a.moveChecker(a.hints.find(elem => elem.id == event.srcElement.id).checkerId, a.hints.find(elem => elem.id == event.srcElement.id).a,a.hints.find(elem => elem.id == event.srcElement.id).b)
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
        this.buildHints(checkerId)
    }

    checkerDeselect(checkerId){
        document.getElementById(checkerId).style.animationIterationCount = ""
        document.getElementById(checkerId).style.animationName = ""
        document.getElementById(checkerId).style.animationDuration = ""
        this.checkers.find(elem => elem.id == checkerId).childHints.forEach(elem => document.getElementById(elem).remove())
        this.checkers.find(elem => elem.id == checkerId).childHints.forEach(elemnt =>{
            this.hints.splice(this.hints.indexOf(this.hints.find(elem => elemnt == elem.id), 1))
        })
        this.checkers.find(elem => elem.id == checkerId).childHints = []
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
a.startGame()