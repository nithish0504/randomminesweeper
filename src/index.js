import "./styles.css";

document.getElementById("app").innerHTML = "";
let boardEl = document.getElementById("gameboard");
let mcounEl = document.getElementById("minecount");
let result = document.getElementById("result");

let cols = Math.floor(Math.random() * 10) + 5;
let rows = Math.floor(Math.random() * 10) + 5;
let dim = cols * rows;
let maxWidth = cols * 40;
let noOfMines = Math.floor(dim / 5);
let randomArray = Array(noOfMines)
  .fill("M")
  .concat(Array(cols * rows - noOfMines).fill("E"))
  .sort(() => Math.random() - 0.5);
let minesInd = [];
let flaggedInd = [];
let otherInd = [];
let gameover = false;
boardEl.style.minWidth = maxWidth + "px";
boardEl.style.maxWidth = maxWidth + "px";
mcounEl.textContent = noOfMines;

let boardArray1 = [];
let count = 0;
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const element = document.createElement("div");
    element.id = count;
    element.classList.add("tile");
    element.classList.add(randomArray[count]);
    const tile = {
      element,
      i,
      j,
      mine: randomArray[count] === "M" ? true : false
    };
    tile.element.addEventListener("click", (e) => {
      revealTile(e.target);
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(e, tile);
    });

    boardArray1.push(tile.element);
    if (tile.mine) {
      minesInd.push(count);
    } else {
      otherInd.push(count);
    }
    count += 1;
  }
}
console.log(minesInd);
let revealToWin = otherInd.length;

//add numbers
for (let i = 0; i < boardArray1.length; i++) {
  let total = 0;
  const isLeftEdge = i % cols === 0;
  const isRightEdge = i % cols === cols - 1;

  if (boardArray1[i].classList.contains("E")) {
    if (i > 0 && !isLeftEdge && boardArray1[i - 1].classList.contains("M"))
      total++;
    if (
      i > cols - 1 &&
      !isRightEdge &&
      boardArray1[i + 1 - cols].classList.contains("M")
    )
      total++;
    if (i > cols && boardArray1[i - cols].classList.contains("M")) total++;
    if (
      i > cols + 1 &&
      !isLeftEdge &&
      boardArray1[i - 1 - cols].classList.contains("M")
    )
      total++;
    if (
      i < dim - 2 &&
      !isRightEdge &&
      boardArray1[i + 1].classList.contains("M")
    )
      total++;
    if (
      i < dim - cols &&
      !isLeftEdge &&
      boardArray1[i - 1 + cols].classList.contains("M")
    )
      total++;
    if (
      i < dim - 2 * cols - 2 &&
      !isRightEdge &&
      boardArray1[i + 1 + cols].classList.contains("bomb")
    )
      total++;
    if (i < dim - cols - 1 && boardArray1[i + cols].classList.contains("M"))
      total++;
    boardArray1[i].setAttribute("data", total);
  }
}

function create(boardArray1) {
  boardEl.textContent = "";
  for (let i of boardArray1) {
    boardEl.append(i);
  }
}
create(boardArray1);

function revealTile(e) {
  if (gameover) {
    return;
  }
  if (
    e.classList.contains("reveal") ||
    e.classList.contains("mine") ||
    e.classList.contains("flagged")
  ) {
    return;
  }
  if (e.classList.contains("M")) {
    e.result = "over";
    gameover = true;
    e.classList.add("mine");
    e.textContent = "💣";
    revealMines(minesInd);
  } else {
    revealToWin -= 1;
    if (revealToWin === 0) {
      gameover = true;
      result.textContent = "Hooray You have won the Game";
    }
    let total = e.getAttribute("data");
    if (parseInt(total) !== 0) {
      e.classList.add("checked");

      e.innerHTML = total;
      e.classList.add("reveal");
      return;
    }
    e.classList.add("reveal", "zero");
    checkSquare(e, e.id, cols);
  }
}

//check neighboring boardArray1 once square is clicked
function checkSquare(square, currentId, width) {
  const isLeftEdge = currentId % width === 0;
  const isRightEdge = currentId % width === width - 1;

  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) {
      const newId = boardArray1[parseInt(currentId) - 1].id;
      //const newId = parseInt(currentId) - 1   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId > width - 1 && !isRightEdge) {
      const newId = boardArray1[parseInt(currentId) + 1 - width].id;
      //const newId = parseInt(currentId) +1 -width   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId > width) {
      const newId = boardArray1[parseInt(currentId - width)].id;
      //const newId = parseInt(currentId) -width   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId > width + 1 && !isLeftEdge) {
      const newId = boardArray1[parseInt(currentId) - 1 - width].id;
      //const newId = parseInt(currentId) -1 -width   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId < dim - 2 && !isRightEdge) {
      const newId = boardArray1[parseInt(currentId) + 1].id;
      //const newId = parseInt(currentId) +1   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId < dim - width && !isLeftEdge) {
      const newId = boardArray1[parseInt(currentId) - 1 + width].id;
      //const newId = parseInt(currentId) -1 +width   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId < dim - 2 * width - 2 && !isRightEdge) {
      const newId = boardArray1[parseInt(currentId) + 1 + width].id;
      //const newId = parseInt(currentId) +1 +width   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId < dim - 2 * width - 2) {
      const newId = boardArray1[parseInt(currentId) + width].id;
      //const newId = parseInt(currentId) +width   ....refactor
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
  }, 10);
}

function markTile(e, tile) {
  if (gameover) {
    return;
  }
  if (
    e.target.classList.contains("reveal") ||
    e.target.classList.contains("mine")
  ) {
    return;
  }

  if (e.target.classList.contains("flagged")) {
    e.target.textContent = "";
    e.target.classList.remove("flagged");
    const index = flaggedInd.indexOf(parseInt(e.target.id));
    if (index > -1) {
      flaggedInd.splice(index, 1);
    }
  } else {
    e.target.textContent = " 🚩 ";
    e.target.classList.add("flagged");
    let find = e.target.id;
    flaggedInd.push(parseInt(find));
    checkResult(minesInd, flaggedInd);
    mcounEl.textContent = minesInd.length - flaggedInd.length;
    if (mcounEl.textContent == 0) {
      specialCheckResult(minesInd, flaggedInd);
    }
  }
}
minesInd.sort(function (a, b) {
  return b - a;
});
console.log(minesInd);

function revealMines(minesInd) {
  for (let i of minesInd) {
    let mineTile = document.getElementById(i);
    mineTile.classList.add("mine");
    mineTile.textContent = "💣";
  }
  result.textContent = "You have lost the game";
}
minesInd.sort(function (a, b) {
  return b - a;
});

function checkResult(minesInd, flaggedInd) {
  flaggedInd.sort(function (a, b) {
    return b - a;
  });

  if (JSON.stringify(minesInd) === JSON.stringify(flaggedInd)) {
    gameover = true;
    result.textContent = "Hooray You have won the Game";
  }
}

function specialCheckResult(minesInd, flaggedInd) {
  flaggedInd.sort(function (a, b) {
    return b - a;
  });

  if (JSON.stringify(minesInd) === JSON.stringify(flaggedInd)) {
    gameover = true;
    result.textContent = "Hooray You have won the Game";
  } else {
    gameover = true;
    result.textContent = "You have lost the game";
  }
}

let rbtnEl = document.getElementById("refresh-btn");
rbtnEl.addEventListener("click", refresh);
function refresh() {
  location.reload();
}
