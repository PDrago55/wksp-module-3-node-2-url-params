"use strict";
const express = require("express");
const app = express();

const morgan = require("morgan");
const { books } = require("./data/books")
const { top50 } = require("./data/top50");

const PORT = 8000 || process.env.PORT;

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

//question 1.5, getting my popular artists// 
function getTopArtist(){ 
  let groupedObject = {};
  let max = 0;
  let currentTop = "";
  top50.forEach((element) => { 
    //// initialize an empty object that gets filled up which includes the artist name and number of songs in top50//
    if (groupedObject[element.artist] === undefined){ 
    groupedObject[element.artist] = 1} 
      else {groupedObject[element.artist] += 1
    } 
    });
      for (let key in groupedObject) {
      if (groupedObject[key] > max){
      max = groupedObject[key];   
      currentTop = key;
      } 
    } 
    let topArtist = top50.filter((song) => {
      return song.artist === currentTop;
    })
    return topArtist; 
}
// endpoints here
const temphome = (req, res) => res.render("pages/fourOhFour", { title: "bruh you", path: req.originalUrl});
const top50Page = (req, res) => res.render("pages/top50", { title: "Top 50 Swear Words I Never Insert in My Code :)", top50: top50 });
const end = (req, res) => {
  let topArtist = getTopArtist();
  res.render("pages/popular-artists", 
  {title: "Top Artists Baby", topArtist: topArtist})
}
const bookPage = (req, res) => {
  res.render("pages/main", { title: "bunch of books", books: books})
}

// go to an individual book page//
const oneBook = (req, res) => {
  const mahBook = books.find(book => {
      return book.id.toString() === req.params.id;
    });
    console.log('book: ', mahBook);
    res.render('pages/one', {
      title: `this book ${mahBook.title}`,
      book: mahBook,
      bookPage: oneBook
    })
  }
// const link = (req, res) => res.render("pages/test", {title: "Song #", number: req.params.number})

app.get("/books", bookPage);
app.get("/top50", top50Page);
app.get("/", temphome);
app.get("/top50/popular-artists", end);
app.get('/top50/song/:rank', (req, res) => {
  const rank = req.params.rank - 1;
  if (top50[rank]) {    
      res.render('pages/test', {
          title: `Song #${top50[rank].rank}`,
          song: top50[rank]
      });
  } else {
      res.status(404);
      res.render('pages/fourOhFour', {
          title: 'GO BACK',
          path: req.originalUrl
      });
  }
});
app.get('/books/:id', oneBook)
// handle 404s
app.get("*", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "fuck you",
    path: req.originalUrl
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
