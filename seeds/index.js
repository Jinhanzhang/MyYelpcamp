require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        let images = [
            {
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
            },
            {
                url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
            }
        ]
        try{
            const response = await axios.get('https://api.unsplash.com/photos/random',{
                params: {
                    client_id: 'NHa0krSLBf8EXe8uLiUXXiuV2EEh6awEU7ZBinzC57g',
                    collections: 9046579,
                    orientation: 'landscape',
                    count: 3
                }
            })
            if(response.data&&response.data.length!==0){
                images = response.data.map(res => {
                    return {
                        url: res.urls.regular,
                        filename: `YelpCamp/${res.id}`,
                        thumbnail: res.urls.thumbnail
                    }
                })
            }
        }catch(e){
            // console.log(e);
        }
        
        const camp = new Campground({
            //YOUR USER ID
            author: process.env.YELPCAMP_USER_YELPCAMP,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})