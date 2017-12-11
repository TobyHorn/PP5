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

//Create a class to assign the API data's values
class searchResults {
    constructor() {
        
        //Create the parameters and set their initial values
        this.img = "";
        this.summary = "";
        this.title = "";
        this.episodes = 0;
        this.type = "";
        this.genre = [];
        this.status = "";
        this.rating = "";
        this.score = 0;
        this.released = "";
    };
};

//Create the controller
class Controller {
    
    //Create controller constructor
    constructor() {
        
        //Create the data array variable
        this.dataArr = [];
        
        //Create reference to the model
        this.model = new Model();
        
        //Create reference to the view
        this.view = new View();
        
        //If local storage is empty
        if (!localStorage.getItem("list")) {
            
            //Hide "My List" if it's empty
            document.querySelectorAll("nav ul li")[2].style.visibility = "hidden";
            document.querySelectorAll("footer ul li")[2].style.visibility = "hidden";
            
        } else {
            
            //Assign the local storage item to the data array
            this.dataArr = JSON.parse(localStorage.getItem("list"));
            
        }
        
        //Create the button variables
        const homeBtn = document.getElementById("homeSearchBtn");
        const navBtn = document.getElementById("navSearchBtn");
        const addBtn = document.getElementById("addAnimeBtn");
        
        //Create the event listeners and bind "this"
        homeBtn.addEventListener("click", this.getResults.bind(this));
        navBtn.addEventListener("click", this.getResults.bind(this));
        addBtn.addEventListener("click", this.submitData.bind(this));
        
    };
    
    //Create a method to get the results
    getResults(e) {
        
        //Create variable to hold the base and end of the api string
        const baseStr = "https://jikan.me/api/anime/";
        let endStr;
        
        //Create a new variable to hold the value of the data array
        let resultArr = this.dataArr;

        //Check to see which search button was clicked and assign the value for endStr respectively
        if (e.target.name == "navSearchBtn") {
            
            endStr = document.getElementById("navSearch").value;
        } else if (e.target.name == "homeSearchBtn") {
            
            endStr = document.getElementById("homeSearch").value;
        }

        //Instantiate the data object
        let searchData = new searchResults();
        
        //Verify the endStr isn't empty
        if (endStr != "" && endStr != "e") {

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
                    
                    //Assign the values tot he user data object
                    searchData.img = resObj.image;
                    searchData.summary = resObj.synopsis;
                    searchData.title = resObj.title;
                    searchData.episodes = parseInt(resObj.episodes);
                    searchData.type = resObj.type;
                    
                    for (let i = 0; i < 3; i++) {
                        searchData.genre.push(resObj.genre[i][1]);
                    }
                    
                    searchData.status = resObj.status;
                    searchData.rating = resObj.rating;
                    searchData.score = parseFloat(resObj.score).toFixed(2);
                    searchData.released = resObj.premiered;
                    
                    //Add the data to the data object
                    resultArr.push(searchData);
                    
                    //Create a new event for the View to listen for
                    let evt = new Event("data_done");

                    //Set the anime property to the value of the newly processed data
                    evt.anime = searchData;

                    //Dispatch the event
                    document.dispatchEvent(evt);
                }
                
            };
            
            //open the xhr object with the json data file
            xhr.open("GET", baseStr + endStr, true);
            
            //send the data
            xhr.send(null); //Set to null due to local hosting
        } else {
            
            //Alert the users of what went wrong
            alert("Error: Numbers only! Do not leave the text field empty!");
        };
        
    };
    
    //Create a method pass along the data to the model and disptach the event
    submitData(e) {
        //Add the item to the local storage
        localStorage.setItem("list", JSON.stringify(this.dataArr));
        
        //Make My List visible
        document.querySelectorAll("nav ul li")[2].style.visibility = "visible";
        document.querySelectorAll("footer ul li")[2].style.visibility = "visible";

        //Create the new event to be listened for by the model
        let evt = new Event("data_collected");

        //Set the anime parameter to the data collected
        evt.anime = this.dataArr;

        //Dispatch the event
        document.dispatchEvent(evt);
    };
    
};

//Create the model
class Model {
    
    constructor() {
        //Listen for the event from the Controller
        document.addEventListener("data_collected", this.dataCollected.bind(this));
    };
    
    dataCollected(e) {
        
        //Create episode array and counter variables
        let epArr = [];
        let i = 0;
        
        
        //Loop through each anime object and add it's episodes to the episode array
        e.anime.forEach(function(){
            epArr.push(parseInt(e.anime[i].episodes));
            i++;
        });
        
        //Calculate the sum of the episodes added
        e.anime.sum = Utils.getTotal(epArr);
    };
};

//Create the view
class View {
    
    constructor() {
        
        //Listen for the data_done event
        document.addEventListener("data_done", this.display.bind(this));
    };
    
    display(e) {
        
        //Assign the values of the result
        document.getElementById("homeImg").src = e.anime.img;
        document.getElementById("homeImg").alt = e.anime.title + " thumbnail";
        document.getElementById("homeSummary").innerHTML = "<p>"+e.anime.summary+"</p>";
        document.getElementById("homeTitle").innerHTML = "<p>"+e.anime.title+"</p>";
        document.getElementById("homeEps").innerHTML = "<p>"+e.anime.episodes+"</p>";
        document.getElementById("homeType").innerHTML = "<p>"+e.anime.type+"</p>";
        document.getElementById("homeGenre").innerHTML = "<p>"+e.anime.genre+"</p>";
        document.getElementById("homeStatus").innerHTML = "<p>"+e.anime.status+"</p>";
        document.getElementById("homeRating").innerHTML = "<p>"+e.anime.rating+"</p>";
        document.getElementById("homeScore").innerHTML = "<p>"+e.anime.score+"</p>";
        document.getElementById("homeReleased").innerHTML = "<p>"+e.anime.released+"</p>";
        
        //Display the section that shows the result
        let resultsSec = document.getElementById("homeResults").style.visibility = "visible";
        
    };
};