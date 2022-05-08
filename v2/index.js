const patterns = {
    checkers: {
        white: (id, sizeOfCell, style)=>{
            return `<img id='${id}' src='./img/whiteChecker.png' style='${(style ? style: '') + `margin:${sizeOfCell*0.1};width:${sizeOfCell*0.8};height:${sizeOfCell*0.8};`}' >`
        },
        black: (id, sizeOfCell, style)=>{
            return `<img id='${id}' src='./img/blackChecker.png' style='${(style ? style: '') + `margin:${sizeOfCell*0.1};width:${sizeOfCell*0.8};height:${sizeOfCell*0.8};`}' >`
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

        document.body.innerHTML += patterns.desk.backgorund('background-01', size, position, style)
        
        let color = false
        let step = size/resolution
        this.cells = []
        let whiteCheckersCount = 0
        let blackCheckersCount = 0

        for (let a = 0; a<resolution;a++){
            for(let b = 0; b<resolution;b++){
                document.getElementById('background-01').innerHTML += color ? patterns.desk.blackCell(this.cells.length, step, {x: a*step, y: b*step}):patterns.desk.whiteCell(this.cells.length, step, {x: a*step, y: b*step})
                
                this.cells.push({
                    a: a,
                    b: b, 
                    checker: (color && (b<numOfLines || resolution-numOfLines<=b)) ? this.createChecker(`white-${whiteCheckersCount}`, {a: a,b: b}, step, (b<=numOfLines) ? true:false, this.cells.length): "none"
                })

                color = (resolution%2==0&&b==7) ? color:!color
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
            style: style
        }
        
    }
}