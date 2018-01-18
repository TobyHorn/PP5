//Create an event listener to only run when the page is fully loaded
window.addEventListener('load', function(){
    
    //Instantiate the Singleton
    const myAPI = API.getInstance();
    
});
    
//Create the class to be used as the Singleton
class API {
    
    constructor() {
        //Instantiate the controller class
        const controller = new Controller();
    };
    
    //Create a method to check for a Singleton
    static getInstance() {
        
        //Run a conditional to check to see if there is already a Singleton instantiated.
        if (!API._instance) {
            
            //Create a new Singleton instance
            API._instance = new API();
            
            //Return the singleton instance
            return API._instance;
            
        } else {
            //If there is already a singleton created, send a custom error message.
            throw "Error: You can only have a single instance of this project!";
        };
        
    };
};

//Create object to hold data
class topData {
    
    constructor() {
        
    };
};

//Create the class to instantiate with the singleton
class Controller {
    
    constructor() {
        
        if (!localStorage.getItem("list")) {
            
            //Hide "My List" if it's empty
            document.querySelectorAll("nav ul li")[2].style.visibility = "hidden";
            document.querySelectorAll("footer ul li")[2].style.visibility = "hidden";
            
        }
        
        //Create variables to use
        this.dataArr = [];
        
        //Listen for the dom to load
        window.addEventListener("DOMContentLoaded", this.getTop(this));
    };
    
    //Create a method to use to get the top anime
    getTop(e) {
        
        //Create variables
        const baseStr = "https://jikan.me/api/anime/";
        let counter = 1;
        let animeId;
        let loops = 0;
        
        //Assign the dataArr to a variable
        let topArr = this.dataArr;
        
        //Instantiate the model and view
        this.model = new Model();
        this.view = new View();
        
        //Loop through 10 times
        for (let i = 10; i > 0; i--) {
            
            //Instantiate the topData object
            let topResult = new topData();
            
            //Create a switch to assign the animeId based on the counter variable
            switch (counter) {

                case 1:
                    animeId = 5114;
                    break;
                case 2:
                    animeId = 32281;
                    break;
                case 3:
                    animeId = 28977;
                    break;
                case 4:
                    animeId = 9253;
                    break;
                case 5:
                    animeId = 9969;
                    break;
                case 6:
                    animeId = 11061;
                    break;
                case 7:
                    animeId = 820;
                    break;
                case 8:
                    animeId = 15417;
                    break;
                case 9:
                    animeId = 35247;
                    break;
                case 10:
                    animeId = 15335;
                    break;
                default:
                    animeId = 0;
            };
            
            //Create xhr request
            const xhr = new XMLHttpRequest();

            //Run the onload method
            xhr.onload = function () { 
                
                //Increment the loops counter
                loops++;
                
                //get the API response and parse it to JSON
                const resObj = JSON.parse(xhr.responseText);

                //Check if the status code is 404
                if (xhr.status == 404) {

                    //Display the error string if the item isn't found
                    alert(resObj.error);

                } else {

                    //Assign the values to the user data object
                    topResult.img = resObj.image;
                    topResult.summary = resObj.synopsis;
                    topResult.title = resObj.title;
                    topResult.episodes = parseInt(resObj.episodes);
                    topResult.type = resObj.type;
                    topResult.genre = [];
                    
                    //Loop through and only assign the first 3 genre
                    for (let j = 0; j < 3; j++) {
                        
                        //Verify the anime has more than 2 genre
                        if (resObj.genre[2] !== undefined) {
                            
                            topResult.genre.push(resObj.genre[j][1]);
                            
                        };
                    };

                    topResult.status = resObj.status;
                    topResult.rating = resObj.rating;
                    topResult.score = parseFloat(resObj.score).toFixed(2);
                    topResult.released = resObj.premiered;
                    
                };
                
                //Verify that all 10 items have loaded before trying to access their values
                if (loops == 10) {
                    
                    //Create a new event
                    let evt = new Event("top-loaded");
                    
                    //Assign the results' array to the event's parameter 
                    evt.top = topArr;
                    
                    //Dispatch the event
                    document.dispatchEvent(evt);
                }
            };
            
            //open the xhr object with the json data file
            xhr.open("GET", baseStr + animeId, true);

            //send the data
            xhr.send(null); //Set to null due to local hosting
            
            //Add the data to the data object
            topArr.push(topResult);
            
            //Increment the counter variable
            counter++;
            
        };
    };
    
    
};

//create Model
class Model {
    
    constructor() {
        
    }
    
}

//create View
class View {
    
    constructor() {
        
        //Listen for the top-loaded event to be dispatched then run an anonymous function
        document.addEventListener("top-loaded", (e) => {
            
            //Create variables to be used
            let i = 0;
            let ul = document.getElementById("top");
            
            //loop through all 10 items
            e.top.forEach(() => {
                
                //Check if the genre is undefined, if so change it's value to "Unknown"
                let genre = e.top[i].genre[0] != undefined ? e.top[i].genre[0] : "Unknown";
                
                //Assign and display each item's values
                ul.innerHTML += "<li><img src='"+e.top[i].img+"' alt='"+e.top[i].title+" thumbnail' width='112.5px' height='175px' /><article><ul><li>"+e.top[i].title+"</li><li>"+e.top[i].episodes+"</li><li>"+e.top[i].type+"</li><li>"+genre+"</li></ul><p>"+e.top[i].summary+"</p></article></li>";
                
                //Increment the counter
                i++;
            });
            
        });
    }
    
}