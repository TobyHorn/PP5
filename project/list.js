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

//Create the controller
class Controller {
    
    constructor() {
        
        //Create reference to the model
        this.model = new Model();
        
        //Create reference to the view
        this.view = new View();
        
        this.list = JSON.parse(localStorage.getItem("list"));
        
        //Create a new event for the View to listen for
        let evt = new Event("list_done");
        
        //Set the list property to the value of the newly processed data
        evt.list = this.list;
        
        //Dispatch the event
        document.dispatchEvent(evt);
    };
};

//Create the Model
class Model {
    
    constructor() {
        
    };
};

//Create the View
class View {
    
    constructor() {
        
        //Listen for the data_done event
        document.addEventListener("list_done", this.display.bind(this));
        
    };
    
    //Create a display method
    display(e) {
        
        //Create a counter variable
        let i = 0;
        
        //Loop through the list array
        e.list.forEach(function() {
            
            //Write the html elements and values to be displayed on the dom
            document.getElementById("list").innerHTML += "<article id='listItem" + i + "'><ul><li><p>Title: " + e.list[i].title + "</p></li><li><p>Type: " + e.list[i].type + "</p></li><li><p>Episodes: " + e.list[i].episodes + "</p></li></ul><button type='button' id='listEdit'>Edit</button></article>";
            
            //Increment the counter
            i++;
        });
        
    }
};