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
        
        //Create variables to use
        this.dataArr = [];
        
        window.addEventListener("DOMContentLoaded", this.getTop(this));
    };
    
    //Create a method to use to get the top anime
    getTop(e) {
        
        //Create variables
        const baseStr = "https://jikan.me/api/anime/";
        let counter = 1;
        let animeId;
        
        //Assign the dataArr to a variable
        let topArr = this.dataArr;
        
        
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
        
        
        
        
        /*I need to get access to the items within the topData object here*/
        
        /*Below are the tests I've ran. I can't think of any other ways to get access 
        to the values pulled in from the API above*/
        
        
        
        console.log(this.dataArr[0]); //This returns an object that appears to be empty but has parameter values
        
        console.log(topArr[1]); //This returns an object that appears to be empty but has parameter values
        
        console.log(e.dataArr[2]); //This returns an object that appears to be empty but has parameter values
        
        console.log(this.dataArr[0].title); //This returns an empty value
        
        console.log(topArr[0].title); //This returns an empty value
        
        console.log(e.dataArr[0].title); //This returns an empty value
        
    };
    
    
};