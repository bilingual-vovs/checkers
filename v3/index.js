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

        document.body.innerHTML += patterns.desk.backgorund('background-01', size, position, style)
        
        let color = false
        let step = size/resolution
        this.cells = []
        this.checkers = []
        this.alerts = []
        this.sizeOfCell = step

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
    createHint({a, b, parent, id}){
        document.getElementById(this.cells.find(elem => elem.a == a && elem.b == b).id).innerHTML = patterns.checkers.hint(id, this.sizeOfCell)
        this.checkers.find(elem => elem.id == parent.id).childHints.push(id)
        return {
            id: id,
            a: a,
            b: b,
            checkerId: parent.id,
            cellId: this.cells.find(elem => elem.a == a && elem.b == b)
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
    
}
   