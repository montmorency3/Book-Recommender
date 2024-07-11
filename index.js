import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;
const URLSearch = "https://openlibrary.org/search.json?";
const URLCover = "https://covers.openlibrary.org/b/isbn/";
const relevantFields = "&fields=title,author_name,isbn,language,subject"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", async (req, res) =>{
    res.render("index.ejs");
})

app.post("/get-result", async (req,res) => {
    const author = req.body.author;
    const subject = req.body.subjects;
    const language = req.body.language;
    console.log(req.body);
    try {
        console.log(URLSearch + `subject="${subject}"&language=${language}&author="${author}"` + relevantFields);
        const response = await axios.get(URLSearch + `title="${subject}"&language=${language}&author="${author}"` + relevantFields);
        console.log(URLSearch + `subject="${subject}"&language=${language}&author="${author}"`+relevantFields)

        const data = response.data.docs
        // pick a random book from the list
        var index = Math.floor(Math.random() * data.length);

        if (data.length === 0){
            // no books match your search 
            res.send("no books match your search");
        } else if (data[index].isbn.length === 0 ){
            //no isbn found for book
            res.send("isnb not found");
        } else {
            // check if we can find image
            

            const isbn = data[index].isbn[0];
            var ImgURL = URLCover + isbn + "-L.jpg?default=false";
            await axios.get(ImgURL)
                .catch(function (error) {
                    if (error.response) {
                        console.log("image not found");
                        ImgURL = "https://www.forewordreviews.com/books/covers/error-of-understanding.jpg"
                    }
                    });
            res.render("index.ejs", {url:ImgURL, title: data[index].title, author: data[index].author_name});
            
    
        }

    } catch (error){
        res.sendStatus(404);
    }
    


})

app.listen(port, (req, res) => {
    console.log("listening in port " + port);

})

