const PLAYER1 = 'red'
const PLAYER2 = 'yellow'

let turnOngoing = false
let checkerColor = null

const getColumnElements = (column) => {
    return document.getElementsByClassName(column)
}

const columnFull = (columnElements) => {
    if (Array.from(columnElements)
        .filter((element) => {
            // skip dots containing checkers
            currentDot = element.firstChild
            return !currentDot.style.backgroundColor
        })
        .length === 0) { return true }

    return false

}

const clearHighlight = () => {
    const dots = document.getElementsByClassName('dot')

    Array.from(dots).forEach((dot) => {
        dot.style.border = ''
    })
}

const updateVictoryBanner = ({shouldShowPlayer1, shouldShowPlayer2}) => {
    document.getElementById('player-1-wins').hidden = !shouldShowPlayer1
    document.getElementById('player-2-wins').hidden = !shouldShowPlayer2
}

const clear = () => {
    const dots = document.getElementsByClassName('dot')

    Array.from(dots).forEach((dot) => {
        dot.style.backgroundColor = ''
        dot.style.border = ''
    })
    updateVictoryBanner({shouldShowPlayer1: false, shouldShowPlayer2: false})
}

const highlight = (items) => {
    items.forEach((item) => {
        item.firstChild.style.border = "thick solid"
        // console.log(item.id)
    })
}

const getRow = (y) => {
    let row = []
    for(let i = 1; i < 8; i++) {
        row.push(document.getElementById(`${i}-${y}`))
    }

    // highlight(row)

    return row
}

const getColumn = (x) => {
    let column = []
    for(let i = 1; i < 7; i++) {
        column.push(document.getElementById(`${x}-${i}`))
    }

    // highlight(column)

    return column
}

const getDiagonalRL = (start) => {
    const [x, y] = start
    let diagonal = []

    // move to leftmost dot in diagonal
    let i = x
    let j = y
    while (i > 0 && j < 7) {
        i -= 1
        j += 1
    }

    // right up
    i += 1
    j -= 1

    while (i < 8 && j > 0) {
        diagonal.push(document.getElementById(`${i}-${j}`))
        i += 1
        j -= 1
    }

    // highlight(diagonal)

    return diagonal
}

const getDiagonalLR = (start) => {
    const [x, y] = start
    let diagonal = []

    // move to leftmost dot in diagonal
    let i = x
    let j = y
    while (i > 0 && j > 0) {
        i -= 1
        j -= 1
    }

    // right down
    i += 1
    j += 1
    while (i < 8 && j < 7) {
        diagonal.push(document.getElementById(`${i}-${j}`))
        i += 1
        j += 1
    }

    // highlight(diagonal)

    return diagonal
}

const isConnect4 = (items, startColor) => {
    if (items.length < 4) {
        // console.log('not enough dots for connection');
        return false 
    }

    let connection = []

    for (let item of items) {
        if (item.firstChild.style.backgroundColor !== startColor) {
            // console.log('connection interrupted');
            connection = []
            continue
        }

        connection.push(item)
        // console.log('connection continued: ' + connection.length);
        if (connection.length === 4) { break }
    }

    if (connection.length !== 4) {
        // console.log('connection not long enough')
        return false
    }

    clearHighlight()
    highlight(connection)
    return true
}

const scanNeighbors = (start, startColor) => {

    // move to left dot
    let x = start[0] - 1
    let y = start[1]

    for (let i = 0; i < 8; i++) {
        if (!(x > 7 || y > 6 || x < 1 || y < 1)) {
            const dotId = `${x}-${y}`
            const dot = document.getElementById(dotId)
            // console.log('neighbor dot: ' + dotId);
            // console.log('neighbor dot color: ' + dot.firstChild.style.backgroundColor);

            if (startColor === dot.firstChild.style.backgroundColor) {
                // dot.firstChild.style.border = "thick solid"

                let xDirection = start[0] - x
                let yDirection = start[1] - y

                if (yDirection === 0 && xDirection !== 0) {
                    //check row
                    // console.log('check row')
                    const row = getRow(start[1])

                    if (isConnect4(row, startColor)) { return true }
                }
                else if (xDirection === 0 && yDirection !== 0) {
                    //check column
                    // console.log('check column')
                    const column = getColumn(start[0])

                    if (isConnect4(column, startColor)) { return true }
                }
                else if ((xDirection > 0 && yDirection < 0) || xDirection < 0 && yDirection > 0) {
                    //check right-up/left-down diagonal
                    // console.log('check right-up/left-down diagonal');
                    const diagonalRL = getDiagonalRL(start)

                    if (isConnect4(diagonalRL, startColor)) { return true }
                }
                else if ((xDirection < 0 && yDirection < 0) || (xDirection > 0 && yDirection > 0)) {
                    //check left-up/right-down diagonal
                    // console.log('check left-up/right-down diagonal');
                    const diagonalLR = getDiagonalLR(start)

                    if (isConnect4(diagonalLR, startColor)) { return true }
                }
            }
        }

        if (i === 0) {
            // move to top left dot
            y = y - 1
        }
        else if (i === 1 || i == 2) {
            // move to top dot or move to top right dot
            x = x + 1
        }
        else if (i === 3 || i === 4) {
            // move to right dot or move to bottom right dot
            y = y + 1
        }
        else if (i === 5 || i == 6) {
            // move to bottom dot or move to bottom left dot
            x = x - 1
        }
    }

    return false
}

const checkConnection = (startLocation) => {

    clearHighlight()

    // console.log('Checking connection...');
    // console.log(startLocation);
    // console.log('start color: ' + startLocation.firstChild.style.backgroundColor);

    // startLocation.firstChild.style.border = "thick solid"
    

    const start = startLocation.id.split('-').map((item) => {
        return parseInt(item)
    })

    // console.log(start);

    let startColor = startLocation.firstChild.style.backgroundColor

    if (scanNeighbors(start, startColor)) { 
        console.log('GAME OVER!');
        console.log(checkerColor + ' WINS!!');
        endGame()

        if (checkerColor === PLAYER1) {
            updateVictoryBanner({shouldShowPlayer1: true, shouldShowPlayer2: false})

        }
        else {
            updateVictoryBanner({shouldShowPlayer1: false, shouldShowPlayer2: true})
        }

    }
}

const placeChecker = (columnElements, checkerColor) => {

    Array.from(columnElements)
        .filter((element) => {
            // skip dots containing checkers
            return !element.firstChild.style.backgroundColor
        })
        .forEach((element, i, arr) => {
            setTimeout(() => {
                // console.log('Checker falling');
                // console.log('dot-' + i);

                // revert previous dot to default
                if (!(i - 1 === -1)) { columnElements[i - 1].firstChild.style.backgroundColor = '' }

                // show checker on dot
                element.firstChild.style.backgroundColor = checkerColor

                // end turn
                if (i === arr.length - 1) {
                    turnOngoing = false
                    checkConnection(element)
                }
            }, i * 500)
    })
}

const releaseChecker = (e) => {
    e.preventDefault()

    // check if turn ongoing
    if (turnOngoing) { return }

    // console.log('dropped checker: ' + checkerColor);
    // console.log(e.target.parentElement.className);

    // get target column
    const column = e.target.parentElement.className
    if (!column || !column.includes('column-')) {
        // console.log('dot not selected');
        turnOngoing = false
        return
    }

    // get dots in column
    const columnElements = getColumnElements(column)

    // check column for vacancy
    if (columnFull(columnElements)) { return }

    // start turn
    turnOngoing = true

    // set player
    if (checkerColor) { checkerColor === PLAYER1 ? checkerColor = PLAYER2 : checkerColor = PLAYER1 }
    else { checkerColor = PLAYER1 }

    // place checker in column
    placeChecker(columnElements, checkerColor)

}

const startGame = (e) => {
    console.log('start');
    const gameBoard = document.getElementById('game-board')
    const playerIcons = document.getElementsByClassName('player')

    Array.from(playerIcons).forEach((item, i) => {
        if (i === 0) { item.style.backgroundColor = PLAYER1 }
        if (i === 1) { item.style.backgroundColor = PLAYER2 }
    })

    gameBoard.addEventListener('click', releaseChecker)
}

const endGame = () => {
    const gameBoard = document.getElementById('game-board')
    gameBoard.removeEventListener('click', releaseChecker)
}

const resetGame = (e) => {
    console.log('reset');
    clear()
    startGame()
}

const startButton = document.getElementById('startButton')
startButton.addEventListener('click', startGame)

const resetButton = document.getElementById('resetButton')
resetButton.addEventListener('click', resetGame)

// startGame()