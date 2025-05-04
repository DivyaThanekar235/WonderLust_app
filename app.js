const express = require("express");
const Listing = require("./models/listing.js");
const app =express();
const mongoose = require("mongoose");
const path = require('path');
const methodOverride  = require('method-override');
const engine = require('ejs-mate');


//connect database
const MONGO_URL =  "mongodb://127.0.0.1:27017/wonderlust";
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL)
}

//connect EJS
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "/public")));
//index route
app.get("/listings",async(req, res)=>{
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs",{allListings});
});

//new Route
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
}) 

//show route
app.get("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

//create route
app.post("/listings",async(req, res)=>{
  const newListing =new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})

//Edit route
app.get("/listings/:id/edit",async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

//Update Route
app.put("/listings/:id",async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})



//port number
app.listen(8080, ()=>{
 console.log("server is listening on port 8080");
})