import "./styles.css";
// Reading the element from html using their Id
document.getElementById("app").innerHTML = "";
let boardEl = document.getElementById("gameboard");
let mcounEl = document.getElementById("minecount");
let result = document.getElementById("result");
let rbtnEl = document.getElementById("refresh-btn");
// creating a randon number of columns rows and mines
let cols = Math.floor(Math.random() * 5) + 5;
let rows = Math.floor(Math.random() * 5) + 5;
// Getting the total dimension
let dim = cols * rows;
// calculating the maximum width of the game board
let maxWidth = cols * 40;
// calculating the no of mines to be inserted
let noOfMines = Math.floor(dim / 5);
// creating a random array of mines and empty tiles
let randomArray = Array(noOfMines)
  .fill("M")
  .concat(Array(cols * rows - noOfMines).fill("E"))
  .sort(() => Math.random() - 0.5);
// initializing various arrays to store the respective indexes
let minesInd = [];
let flaggedInd = [];
let otherInd = [];
// Maintaining the game over variable
let gameover = false;
// setting the min and max width of the gaming area
boardEl.style.minWidth = maxWidth + "px";
boardEl.style.maxWidth = maxWidth + "px";
// displaying the no of mines inserted
mcounEl.textContent = noOfMines;
// initializing the boardArray1 to store the html div elements
let boardArray1 = [];
// initializing the count to zero
let count = 0;
// nested for loops for creating the div elements
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    // creating a html div element
    const element = document.createElement("div");
    // Assigning count as its Id to maintain uniqueness
    element.id = count;
    // Adding the styling to the div element
    element.classList.add("tile");
    // adding "M" class to mines and "E" class to other div elements
    element.classList.add(randomArray[count]);
    // Creating a tile object
    const tile = {
      element,
      i,
      j,
      // checking whether the element consists a Mine or not
      mine: randomArray[count] === "M" ? true : false
    };
    // Adding left click event listener
    tile.element.addEventListener("click", (e) => {
      revealTile(e.target);
    });
    // Adding right click event listener
    tile.element.addEventListener("contextmenu", (e) => {
      // Preventing the default method of the event
      e.preventDefault();
      markTile(e, tile);
    });
    // Pushing the div elements to the boardArray1
    boardArray1.push(tile.element);
    // Checking the presesnce of Mine in the div element
    if (tile.mine) {
      // if Mine present then storing its index in the minesInd array
      minesInd.push(count);
    } else {
      // If no Mine present then stroing the index in the otherInd array
      otherInd.push(count);
    }
    // Incrementing the count by 1
    count += 1;
  }
}
// calculating the number of div's the user need to click to win the game
let revealToWin = otherInd.length;

// adding numbers to the div elements
for (let i = 0; i < boardArray1.length; i++) {
  // initializing the total to 0
  let total = 0;
  // checking whether its an edge div element
  const isLeftEdge = i % cols === 0;
  const isRightEdge = i % cols === cols - 1;
  // If Mine not present i  div element
  if (boardArray1[i].classList.contains("E")) {
    // If left edge and has a mine in the i-1 index
    if (i > 0 && !isLeftEdge && boardArray1[i - 1].classList.contains("M"))
      // Incrementing the total
      total++;
    // If right edge and has mine in i+1-cols index
    if (
      i > cols - 1 &&
      !isRightEdge &&
      boardArray1[i + 1 - cols].classList.contains("M")
    )
      // Incrementing total
      total++;
    // if i>cols and i-cols has a Mine then increment total
    if (i > cols && boardArray1[i - cols].classList.contains("M")) total++;
    // if i>cols+1 and left edge and i-1-cols index has a Mine
    if (
      i > cols + 1 &&
      !isLeftEdge &&
      boardArray1[i - 1 - cols].classList.contains("M")
    )
      // Incrementing total
      total++;
    // if i<dim-2 and is a right edge and i+1 index has a Mine
    if (
      i < dim - 2 &&
      !isRightEdge &&
      boardArray1[i + 1].classList.contains("M")
    )
      // Incrementing total
      total++;
    // if i<dim-cols and not a left edge and i-1+cols index has a Mine
    if (
      i < dim - cols &&
      !isLeftEdge &&
      boardArray1[i - 1 + cols].classList.contains("M")
    )
      // Incrementing total
      total++;
    // if i<dim-2*cols-2 and not a right edge and i+1+cols index has a Mine
    if (
      i < dim - 2 * cols - 2 &&
      !isRightEdge &&
      boardArray1[i + 1 + cols].classList.contains("bomb")
    )
      // Incrementing total
      total++;
    // if i<dim-cols-1 and i+cols index has a Mine
    if (i < dim - cols - 1 && boardArray1[i + cols].classList.contains("M"))
      // Incrementing total
      total++;
    // Setting the total to the data attribute of the div element
    boardArray1[i].setAttribute("data", total);
  }
}
// Function to create the gaming area
function create(boardArray1) {
  // Clearing the content of gaming area
  boardEl.textContent = "";
  // Loop to append div elements to the gaming area
  for (let i of boardArray1) {
    boardEl.append(i);
  }
}
// Function call to create the gaming area
create(boardArray1);
// left click event function to reveal the div element
function revealTile(e) {
  // checking if game is over
  if (gameover) {
    return;
  }
  // checking if the div is already revealed or it has been flagged
  if (
    e.classList.contains("reveal") ||
    e.classList.contains("mine") ||
    e.classList.contains("flagged")
  ) {
    return;
  }
  // Checking whether the div element has a Mine
  if (e.classList.contains("M")) {
    // setting gameover to true
    e.result = "over";
    gameover = true;
    // adding mine class to the div element
    e.classList.add("mine");
    // Adding Mine image to the div element
    e.textContent = "💣";
    // Function call to reveal all other mines
    revealMines(minesInd);
  } else {
    // If not a Mine div elament
    // Decrementing the reveal to win by 1 to maintain count of remainiing div elements
    revealToWin -= 1;
    // If all the div elements which doesn't have a Mine are opened
    if (revealToWin === 0) {
      // Setting the gameover to true
      gameover = true;
      // Showing the winning result of the game
      result.textContent = "Hooray You have won the Game";
    }
    // Getting the value of the data attributee of the div element
    let total = e.getAttribute("data");
    // If the total is not 0
    if (parseInt(total) !== 0) {
      // Adding the checked class to the div element
      e.classList.add("checked");
      // adding the total to the div element
      e.innerHTML = total;
      // Adding the reveal class to the div element
      e.classList.add("reveal");
      return;
    }
    // If total is zero adding the reveal and zero class to the div element
    e.classList.add("reveal", "zero");
    // Function call to tcheck other empty div elements nearby
    checkSquare(e, e.id, cols);
  }
}

// Function to check the nearby div elements after a div element is clicked
function checkSquare(square, currentId, width) {
  // Checking if left edge or right edge
  const isLeftEdge = currentId % width === 0;
  const isRightEdge = currentId % width === width - 1;
  // setTimeout function to happen after 10 milliseconds
  setTimeout(() => {
    // Reccursion function call to reveal the nearby div elements
    if (currentId > 0 && !isLeftEdge) {
      const newId = boardArray1[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      if (newSquare.getAttribute("data") === "0") {
        revealTile(newSquare);
      }
    }
    if (currentId > width - 1 && !isRightEdge) {
      const newId = boardArray1[parseInt(currentId) + 1 - width].id;
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
// Right click event Function to flag the div element
function markTile(e, tile) {
  // Checking if the game is over
  if (gameover) {
    return;
  }
  // Checking if the div is already revealed
  if (
    e.target.classList.contains("reveal") ||
    e.target.classList.contains("mine")
  ) {
    return;
  }
  // Checking if the div is already flagged
  if (e.target.classList.contains("flagged")) {
    // Removing the flag content from the div element
    e.target.textContent = "";
    // Removing the flagged class from the div element
    e.target.classList.remove("flagged");
    // Finding the index of the Id in the flaggedInd array
    const index = flaggedInd.indexOf(parseInt(e.target.id));
    // Checking if the index is returned
    if (index > -1) {
      // Removing the index from the flaggedInd array as the div element is unflagged
      flaggedInd.splice(index, 1);
    }
  } else {
    // If the div is not already flagged adding the flag content to the div element
    e.target.textContent = " 🚩 ";
    // Adding the flagged class to the div element
    e.target.classList.add("flagged");
    // Getting the id of the flagged div element
    let find = e.target.id;
    // Pushing the id to the flaggedInd array
    flaggedInd.push(parseInt(find));
    // Function call to check the result of the game
    checkResult(minesInd, flaggedInd);
    // UPdating the textcontent of the mines left span element
    mcounEl.textContent = minesInd.length - flaggedInd.length;
    if (mcounEl.textContent == 0) {
      // If the no of flags equal to no of mines
      // Then function call to check the result of the game
      specialCheckResult(minesInd, flaggedInd);
    }
  }
}
// Sorting the minesInd array in descending order
minesInd.sort(function (a, b) {
  return b - a;
});
// Function to reveal all the mines
function revealMines(minesInd) {
  for (let i of minesInd) {
    // Loop to reveal all the Mines
    let mineTile = document.getElementById(i);
    mineTile.classList.add("mine");
    mineTile.textContent = "💣";
  }
  // Showing the result in result element
  result.textContent = "You have lost the game";
}
// Sorting the minesInd array in descending order
minesInd.sort(function (a, b) {
  return b - a;
});
// Function to check the result of the game as the user inserts flags
function checkResult(minesInd, flaggedInd) {
  // Sorting the flaggedInd array in descending order
  flaggedInd.sort(function (a, b) {
    return b - a;
  });
  // Stringifying both the arrys and comparing them if all the mines are flagged
  if (JSON.stringify(minesInd) === JSON.stringify(flaggedInd)) {
    // Setting the gameover to true
    gameover = true;
    // Showing the result in result element
    result.textContent = "Hooray You have won the Game";
  }
}
// Function to check the result of the game after all flags are inserted
function specialCheckResult(minesInd, flaggedInd) {
  // Sorting the flaggedInd array in descending order
  flaggedInd.sort(function (a, b) {
    return b - a;
  });
  // Stringifying both the arrys and comparing them if all the mines are flagged
  if (JSON.stringify(minesInd) === JSON.stringify(flaggedInd)) {
    // Setting the gameover to true
    gameover = true;
    // Showing the result in result element
    result.textContent = "Hooray You have won the Game";
  } else {
    // Setting the gameover to true
    gameover = true;
    // Showing the result in result element
    result.textContent = "You have lost the game";
  }
}
// Adding click Event listener to the play again button
rbtnEl.addEventListener("click", refresh);
// Click Event function to refresh the page to create a new game
function refresh() {
  // Refreshing the page
  location.reload();
}
//
