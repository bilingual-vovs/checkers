let settings = {
    resolution: 8,
    size: 800,
    position: {x: 100, y: 100},
    numberOfLines: 3,
    nameOfWhites: "White",
    nameOfBlacks: "Black",
    firstMove: true, //white
    multiAtack: true, 
    ladise: true, 
    backAtack: true,
    mustAtack: true,
    visualSetings: {}
}
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
        checker: (id,a,b, sizeOfCell, color, style)=>{
            return `<img id='${id}' src='./img/${color? "white":"black"}Checker.png' style='${(style ? style: '') + `left: ${a+sizeOfCell*0.1}; top: ${b+sizeOfCell*0.1};z-index:24;position:absolute;transition-duration:700ms;width:${sizeOfCell*0.8};height:${sizeOfCell*0.8};`}' >`
        },
        hint : (id, a, b, sizeOfCell, style)=>{
            return `<img id='${id}' src='./img/hintChecker.png' style='${(style ? style: '') + `left: ${a+0.2*sizeOfCell};top:${b+0.2*sizeOfCell}display:none;z-index:24;position:absolute;transition-duration:700mswidth:${sizeOfCell*0.6};height:${sizeOfCell*0.6};`}' >`
        }
    },
    desk: {
        backgorund: (id, size, position, style)=>{
            return `<div id='${id}' style='${(style ? style: '') + `position:absolute;z-index:22;left:${position.x};top:${position.y};width:${size};height:${size};`}'></div>`
        },
        cell: (id, size, position, color, style)=>{
            return `<div id='${id}' style='${(style ? style: '') + `position:absolute;z-index:22;left:${position.x*size}px;top:${position.y*size}px;width:${size};height:${size};background-color:${color? "white": "black"};`}'></div>`
        },
        
    }
}

class Desk{
    constructor(settings, patterns){
        this.settings = settings
        this.patterns = patterns
        this.sizeOfCell = settings.size/settings.resolution
        this.move = settings.firstMove

        this.hints = {
            get length(){
                let lenth = 0
                for(let key in this){
                    lenth++
                }
                return lenth-1
            }
        }
        this.checkers = {
            get length(){
                let lenth = 0
                for(let key in this){
                    lenth++
                }
                return lenth-1
            }
        }

        document.body.innerHTML += patterns.desk.backgorund("desk-01", settings.size, settings.position, 'border: solid 10px black;')

        let color = false
        for(let a = 0; a<settings.resolution; a++){
            for(let b = 0; b<settings.resolution;b++){
                document.getElementById("desk-01").innerHTML += patterns.desk.cell("c"+a+b, this.sizeOfCell, {x:a,y:b}, color)

                if(b<settings.numberOfLines && !color){
                    this.createChecker(a, b, false)
                }
                else if(b>=settings.resolution-settings.numberOfLines && !color){
                    this.createChecker(a, b, true)
                }
                
                if(b != settings.resolution-1){
                    color = !color
                }
                else if(settings.resolution%2!=0){
                    color = !color
                }
            }
        }
        this.startGame()
    }
    createChecker(a, b, color){
        document.getElementById("desk-01").innerHTML += this.patterns.checkers.checker("c"+(color? "w":"b")+a+b, a*this.sizeOfCell, b*this.sizeOfCell, this.sizeOfCell, color)
        
        this.checkers["c"+(color? "w":"b")+a+b] = {
            a,
            b,
            id: "c"+(color? "w":"b")+a+b,
            color,
            hints: [],
            delete: ()=>{
                document.getElementById("c"+(color? "w":"b")+a+b).remove()
                console.log(this.checkers["c"+(color? "w":"b")+a+b])
                delete this.checkers["c"+(color? "w":"b")+a+b]
            },
            move: ()=>{},
            buildHints: ()=>{
                document.getElementById("desk-01").innerHTML += this.patterns.checkers.hint("h"+this.checkers.length, this.checkers["c"+(color? "w":"b")+a+b].a, this.checkers["c"+(color? "w":"b")+a+b].b, this.settings.sizeOfCell)
            },
            __proto__: this
        }
    }
    eventHandler(){}
    startGame(){}
    buildHintsGlobal(){}
    checkWining(){}
}
let desk = new Desk(settings, patterns)