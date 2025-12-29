const boardSize = 8
const mineCount = 10

const board = document.getElementById("board")
const minesDisplay = document.getElementById("mines-count")
const restartBtn = document.getElementById("restart")

let cells = []
let mines = []
let gameOver = false

function initGame() {
  board.innerHTML = ""
  cells = []
  mines = []
  gameOver = false
  minesDisplay.textContent = `地雷：${mineCount}`

  board.style.gridTemplateColumns = `repeat(${boardSize}, 42px)`

  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cell.dataset.index = i

    cell.addEventListener("click", () => openCell(i))
    cell.addEventListener("contextmenu", e => {
      e.preventDefault()
      toggleFlag(cell)
    })

    board.appendChild(cell)
    cells.push(cell)
  }

  placeMines()
}

function placeMines() {
  while (mines.length < mineCount) {
    const index = Math.floor(Math.random() * cells.length)
    if (!mines.includes(index)) mines.push(index)
  }
}

function openCell(index) {
  if (gameOver) return
  const cell = cells[index]
  if (cell.classList.contains("open") || cell.classList.contains("flag")) return

  cell.classList.add("open")

  if (mines.includes(index)) {
    revealMines()
    alert("💥 遊戲結束！你踩到地雷了")
    gameOver = true
    return
  }

  const count = countMines(index)
  if (count > 0) {
    cell.textContent = count
  } else {
    openAround(index)
  }

  checkWin()
}

function countMines(index) {
  return getNeighbors(index).filter(i => mines.includes(i)).length
}

function openAround(index) {
  getNeighbors(index).forEach(i => openCell(i))
}

function getNeighbors(index) {
  const x = index % boardSize
  const y = Math.floor(index / boardSize)
  const neighbors = []

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
        neighbors.push(ny * boardSize + nx)
      }
    }
  }
  return neighbors
}

function toggleFlag(cell) {
  if (gameOver || cell.classList.contains("open")) return
  cell.classList.toggle("flag")
  cell.textContent = cell.classList.contains("flag") ? "🚩" : ""
}

function revealMines() {
  mines.forEach(i => {
    cells[i].classList.add("mine")
    cells[i].textContent = "💣"
  })
}

function checkWin() {
  const openedCells = cells.filter(c => c.classList.contains("open")).length
  if (openedCells === cells.length - mineCount) {
    alert("🎉 恭喜你成功排雷！")
    gameOver = true
  }
}

restartBtn.addEventListener("click", initGame)

initGame()