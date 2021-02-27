const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
//To render files which are stored locally on our device like style.css and images
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/signup.html`)
});


app.post("/", (req, res) => {
    const firstName =req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    //mailchimp require data in this format
    const data = {
        members: [
            {
                email_address: email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    //turn the data in string
    var jsonData = JSON.stringify(data);

    const url = config.url;

    const options = {
        method: "POST",
        auth: config.authentication
    };
    
    const request = https.request(url, options, (response) => {

        if(response.statusCode === 200){
            res.sendFile(`${__dirname}/success.html`);
        }
        else{
            res.sendFile(`${__dirname}/failure.html`);
        }

        response.on("data",(data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

});


app.post("/failure",(req, res) =>{
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Up and Running on port 3000");
});
