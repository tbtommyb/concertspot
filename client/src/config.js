import random from "./scripts/random.js";

const PRODUCTION_PATH = "https://www.concertspot.co.uk";
const DEV_PATH = "http://localhost:8080";

const config = {
    env: process.env.NODE_ENV || "dev",
    event: {
        scrollDuration: 300
    },
    map: {
        center: {
            lat: 51.508056,
            lng: -0.128056
        },
        zoom: 13,
        markers: []
    },
    marker: {
        animation: 2,
        zIndex: {
            max: 10,
            min: 1
        }
    },
    search: {
        radius: 3,
        range: 3
    },
    splash: {
        heading: "Find the perfect gig",
        message: "Discover great new events. Just enter the music you're looking for and your location. We'll do the rest."
    },
    messages: {
        noResults: "No events were found. Please try different search terms",
        error: "Sorry, something went wrong. Please try again",
        validation: "invalid date"
    },
    placeholder: {
        artist: "artist / genre",
        location: "town / postcode",
        submit: "Find events"
    },
    url: {
        search: (process.env.NODE_ENV === "production" ? PRODUCTION_PATH : DEV_PATH) + "/api/search",
    },
    splashImages: [
        {
            filename: "splash1.jpg",
            url: "https://flic.kr/p/5DEeJe",
            author: "Dan Cox"
        },
        {
            filename: "splash2.jpg",
            url: "https://flic.kr/p/9WM1a3",
            author: "Jojo Bombardo"
        },
        {
            filename: "splash3.jpg",
            url: "https://flic.kr/p/bR9F88",
            author: "Elise"
        },
        {
            filename: "splash4.jpg",
            url: "https://flic.kr/p/dvHqFH",
            author: "Montecruz Foto"
        },
        {
            filename: "splash5.jpg",
            url: "https://flic.kr/p/iSEUmr",
            author: "Christian Bowman"
        },
        {
            filename: "splash6.jpg",
            url: "https://flic.kr/p/EqqPjq",
            author: "Bruno"
        }
    ],
    getRandomSplashImage: function() {
        return this.splashImages[random(this.splashImages.length)];
    }
};

export default config;
