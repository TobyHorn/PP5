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
        
        //Listen for the dom to load completely
        window.addEventListener("DOMContentLoaded", this.loaded(this));
    };
    
    loaded(e) {
        
        //Create variables
        let btns = document.querySelectorAll(".editBtn");
        let i = 0;
        
        //Loop through each button
        btns.forEach(function() {
            
            //Assign each button a unique btnNum
            btns[i].btnNum = i;
            
            //add an event listener to each button
            btns[i].addEventListener("click", e.edit.bind(e));
            
            //Increment the counter
            i++;
        });
    }
    
    edit(e) {
        
        document.getElementById("overlay").style.display = "block";
        
        let edit = new Event("edit_list");
        
        edit.item = this.list[e.target.btnNum];
        edit.btnID = e.target.btnNum;
        
        document.dispatchEvent(edit);
        
        
        //Gets the list item's based on the button's btnNum
        console.log(this.list[e.target.btnNum]);
    }
};

//Create the Model
class Model {
    
    constructor() {
        document.addEventListener("edit_list", this.editItem.bind(this));
    };
    
    editItem(e) {
        let title = document.getElementById("listTitle");
        let status = document.getElementById("listStatus");
        let eps = document.getElementById("listEps");
        let rate = document.getElementById("listRating");
        let statusIndex;
        
        switch (e.item.listStatus) {
            case "Watching":
                statusIndex = 1;
                break;
            case "Completed":
                statusIndex = 2;
                break;
            case "On-Hold":
                statusIndex = 3;
                break;
            case "Dropped":
                statusIndex = 4;
                break;
        };
        
        title.value = e.item.title;
        status.value = statusIndex;
        eps.value = e.item.listEps;
        rate.value = e.item.listRating;
        
        let list = JSON.parse(localStorage.getItem("list"))
        
        document.getElementById("saveBtn").addEventListener("click", () => {
            let newItem = list[e.btnID];
            
            newItem.title = title.value;
            newItem.listStatus = status.options[status.selectedIndex].text;
            newItem.listEps = parseInt(eps.value);
            newItem.listRating = parseInt(rate.value);
            
            list[e.btnID] = newItem;
            
            localStorage.setItem("list", JSON.stringify(list));
            
            location = location;
        });
        
        document.getElementById("cancelBtn").addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";
        });
    };
};

//Create the View
class View {
    
    constructor() {
        
        //Listen for the list_done event
        document.addEventListener("list_done", this.display.bind(this));
        
    };
    
    //Create a display method
    display(e) {
        
        //Create a counter variable
        let i = 0;
        let listStat = "";
        
        //Loop through the list array
        e.list.forEach(function() {
            
            console.log(e.list[i]);
            
            if (e.list[i].listStatus == 1) {
                listStat = "n/a";
            } else {
                listStat = e.list[i].listStatus;
            }
            
            //Write the html elements and values to be displayed on the dom
            document.getElementById("list").innerHTML += "<article><ul><li><p>Title: " + e.list[i].title + "</p></li><li><p>Status: "+listStat+"</p></li><li><p>Episodes: "+e.list[i].listEps+" / " + e.list[i].episodes + "</p></li><li><p>Rating: "+e.list[i].listRating+" / 10</p></li><li><button type='button' class='editBtn' id='listEdit' " + i + ">Edit</button></li></ul></article>";
            
            //Increment the counter
            i++;
        });
        
    };
};