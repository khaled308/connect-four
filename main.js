class ConnectFour {
    static checkWin(grid) {
        let gameEnded = false
        let game = grid.map((row, rowIndex) => {
            return row.map((item, colIndex) => {
                return {val : item.trim() , col: colIndex , row: rowIndex}
            })
        })

        game = game.flat()
        let connectedRows = 0
        let connectedCols = 0
        let connectedCrossPrevDown = 0
        let connectedCrossPrevUp = 0
        let rowPrev = {}
        let colPrev = {}
        let crossPrevDown = {}
        let crossPrevUp = {}
        let index = -1
        let emptyPlace = false

        for (let item of game) {
        index++
        if(!item.val) emptyPlace = true
        if (!rowPrev.val) rowPrev = item
        if(!colPrev.val) colPrev = item
        if(!crossPrevDown.val) crossPrevDown = item
        if(!crossPrevUp.val) crossPrevUp = item

        //rows condition
        if (rowPrev.row === item.row) {
            connectedRows = helper(rowPrev.val, item.val ,connectedRows)
            if(!connectedRows) rowPrev ={}
            if (connectedRows >= 4) return rowPrev.val
        }
        
        //cols condition
        if (colPrev.col === item.col) {
            connectedCols = helper(colPrev.val, item.val, connectedCols)
            if (!connectedCols) colPrev = {}
            if(connectedCols >= 4) return rowPrev.val
        }

        // horizontal cross condition
        if (crossPrevDown.row + 1 == item.row && crossPrevDown.col + 1 == item.col) {
            [item,crossPrevDown,connectedCrossPrevDown] = crossMovement(item, crossPrevDown, connectedCrossPrevDown)
            if (connectedCrossPrevDown >= 3) return rowPrev.val
        }

        //upper cross condition

        if (crossPrevUp.row + 1 == item.row && crossPrevUp.col == item.col + 1) {
            [item,crossPrevUp,connectedCrossPrevUp] = crossMovement(item, crossPrevUp, connectedCrossPrevUp)
            if (connectedCrossPrevUp >= 3) return rowPrev.val
        }


        //check if game is end or not
        if (item.val && index === game.length - 1 && !emptyPlace) gameEnded = true
        
        }

        function helper(item1, item2,connected = 0) {
        if (item1 === item2 && item1) connected++
            else connected = 0
            return connected
        }

        function crossMovement(item,crossPrev,connectedCrossPrev) {
        connectedCrossPrev = helper(crossPrev.val, item.val, connectedCrossPrev)
            if (!connectedCrossPrev) crossPrev = {}
            if (connectedCrossPrev) crossPrev = item
            return [item,crossPrev,connectedCrossPrev]
        }

        return gameEnded ? 'T' : gameEnded
    }
}

class GameBoard{
    static createGame(grid) {
        const game = document.querySelector('.game')
        for (let i = 0; i < grid.length; i++){
            let html = `
                <div class="row" data-row=${i}>
            `
            for (let j = 0; j <grid[i].length; j++) {
                html += `
                    <div class="col" data-col=${j}></div>
                `
            }
            html += `</div>`
            game.insertAdjacentHTML('beforeend', html)
        }
    }
}

class Player{
    constructor(player) {
        this.player = player
    }
}

class Game{
    #initial =
        [
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ']
        ]
    constructor() {
        this.playerTurn = "O";
        this.playerO = new Player('O')
        this.playerX = new Player('X')
        this.grid = JSON.parse(JSON.stringify(this.#initial))
        GameBoard.createGame(this.grid)
    }
    play(row, col, element) {
        const turnHtml = document.querySelector('.turn')
        let copyOfGrid;
        let playerMove = ''
        if (this.playerTurn === 'O') {
            playerMove = 'O'
            this.grid[+row][+col] = playerMove
            copyOfGrid = this.grid.map(arr => {
                return arr.map(player=>player=== 'X' ? '' : player)
            })
            this.playerTurn = 'X'
        }
        else {
            playerMove = 'X'
            this.grid[+row][+col] = playerMove
            copyOfGrid = this.grid.map(arr => {
                return arr.map(player=>player=== 'O' ? '' : player)
            })
            
            this.playerTurn = 'O'
        }
        turnHtml.textContent = `player ${this.playerTurn}`

        element.classList.add(playerMove.toLowerCase())
        const finished = ConnectFour.checkWin(copyOfGrid)
        if (finished) {
            alert(`player ${finished} win`)
            this.grid = JSON.parse(JSON.stringify(this.#initial))
            resetGame()
        }
        return finished
    }
}

const game = new Game()




document.querySelectorAll('.col').forEach(col => {
    col.addEventListener('click', (e) => {
        const classStyle = e.target.classList
        if(classStyle.contains('o') || classStyle.contains('x') ) return
        const row = e.target.parentElement.dataset.row
        const col = e.target.dataset.col
        game.play(row, col, e.target)
    })
})

function resetGame() {
    document.querySelectorAll('.col').forEach(col => {
        col.classList.remove('o')
        col.classList.remove('x')
    })
}