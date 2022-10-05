let addToy = false;
const collection = document.getElementById("toy-collection")
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
const form = document.querySelector("form");
let toyArray

const toyURL = "http://localhost:3000/toys"

document.addEventListener("DOMContentLoaded", () => {

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys()

  form.addEventListener("submit", newToy)
});

function renderToys(toys) {
  toys.forEach(toy => renderToy(toy))
}

function renderToy(toy) {
  const div = document.createElement("div")
  div.className = "card"

  const h2 = document.createElement("h2")
  h2.innerText = toy.name

  const img = document.createElement("img")
  img.src = toy.image
  img.className = "toy-avatar"

  const p = document.createElement("p")
  p.innerHTML = `${toy.likes} Likes`
  p.id = `${toy.id}-like`

  const button = document.createElement("button")
  button.className = "like-btn"
  button.id = toy.id
  button.innerText = "Likes ❤️"
  button.addEventListener("click", liker)

  div.append(h2, img, p, button)
  collection.append(div)
}

function newToy(e) {
  e.preventDefault()
  const nameEntry = e.target.name.value
  const imageEntry = e.target.image.value

  fetch(toyURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept" : "application/json"
    },
    body: JSON.stringify({
      "name": nameEntry,
      "image": imageEntry,
      "likes": 0
    })
  })
  .then(resp => resp.json())
  .then(toy => {
    renderToy(toy)
    toyArray = toy
  })
}

function liker(e) {
  let toyID = e.target.id
    fetch(`http://localhost:3000/toys/${toyID}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      "likes": toyArray[toyID-1].likes + 1
    })
  })
  .then(resp => resp.json())
  .then(() => {
    toyArray[toyID-1].likes++
    document.getElementById(`${toyID}-like`).innerHTML = `${toyArray[toyID-1].likes} Likes`
  })
}

function fetchToys() {
  fetch(toyURL)
  .then(resp => resp.json())
  .then(data => {
    toyArray = data
    renderToys(toyArray)
  })
}
