const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

// Initialize variables for the game
let player = 'X'
let isPauseGame = false
let isGameStart = false

// Array of win conditions
const inputCells = ['', '', '',
                    '', '', '',
                    '', '', '']

// Array of win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
]

// Add click event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
})

function tapCell(cell, index) {
    if (cell.textContent === '' && !isPauseGame) {
        isGameStart = true
        updateCell(cell, index)

        // After player's move, let the AI make its move
        if (!checkWinner()) {
            changePlayer()
            minimaxPick()  // Tougher AI with Minimax
        }
    }
}

function updateCell(cell, index) {
    cell.textContent = player
    inputCells[index] = player
    cell.style.color = (player === 'X') ? '#1892EA' : '#A737FF'
}

function changePlayer() {
    player = (player === 'X') ? 'O' : 'X'
}

function minimaxPick() {
    isPauseGame = true

    setTimeout(() => {
        let bestMove = -1
        let bestScore = -Infinity

        inputCells.forEach((cell, index) => {
            if (cell === '') {
                inputCells[index] = player
                let score = minimax(inputCells, 0, false)
                inputCells[index] = ''
                if (score > bestScore) {
                    bestScore = score
                    bestMove = index
                }
            }
        })

        updateCell(cells[bestMove], bestMove)

        if (!checkWinner()) {
            changePlayer()
            isPauseGame = false
        }
    }, 1000)  // Delay AI move by 1 second
}

// Minimax Algorithm with depth for AI optimization
function minimax(board, depth, isMaximizing) {
    let result = evaluateBoard()
    if (result !== null) return result - depth  // Adjusting score by depth for faster wins and slower losses

    if (isMaximizing) {
        let bestScore = -Infinity
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O'
                let score = minimax(board, depth + 1, false)
                board[i] = ''
                bestScore = Math.max(score, bestScore)
            }
        }
        return bestScore
    } else {
        let bestScore = Infinity
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X'
                let score = minimax(board, depth + 1, true)
                board[i] = ''
                bestScore = Math.min(score, bestScore)
            }
        }
        return bestScore
    }
}

// Evaluate board for terminal states (win, lose, draw)
function evaluateBoard() {
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] === 'O' && inputCells[b] === 'O' && inputCells[c] === 'O') {
            return 10  // AI wins
        } else if (inputCells[a] === 'X' && inputCells[b] === 'X' && inputCells[c] === 'X') {
            return -10  // Player wins
        }
    }
    if (inputCells.every(cell => cell !== '')) return 0  // Draw
    return null  // Game ongoing
}

// Check if there's a winner
function checkWinner() {
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] === player && inputCells[b] === player && inputCells[c] === player) {
            declareWinner([a, b, c])
            return true
        }
    }

    if (inputCells.every(cell => cell !== '')) {
        declareDraw()
        return true
    }
    return false
}

function declareWinner(winningIndices) {
    titleHeader.textContent = `${player} Wins!`
    isPauseGame = true

    winningIndices.forEach((index) => {
        cells[index].style.background = '#2A2343'
    })

    restartBtn.style.visibility = 'visible'
}

function declareDraw() {
    titleHeader.textContent = 'Draw!'
    isPauseGame = true
    restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer) {
    if (!isGameStart) {
        player = selectedPlayer
        if (player === 'X') {
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        } else {
            xPlayerDisplay.classList.remove('player-active')
            oPlayerDisplay.classList.add('player-active')
        }
    }
}

restartBtn.addEventListener('click', () => {
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('')
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
    })
    isPauseGame = false
    isGameStart = false
    titleHeader.textContent = 'Choose'
})
