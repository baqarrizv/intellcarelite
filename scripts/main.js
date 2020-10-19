// let rootUrl="https://192.168.0.103/intellcarelite_p/api/";
// let rootUrl="https://www.pakfirst.org/intellcarelite_p/api/";
// let rootUrl="http://10.190.14.14:1700/IntellCareLite/";
let rootUrl="http://203.99.60.222:1700/IntellCareLite/";//{live}
//objects//
const inp_username = document.getElementById('inp_uname');
const inp_password = document.getElementById('inp_pass');
const btn_login = document.getElementById('btn_login');
const btn_addToHome = document.getElementById('btn_addToHome');
const container = document.getElementById('container');
const messageInd = document.getElementById('messageIndicator');
const notification1 = document.getElementById('notification-1');
const preLoader = document.getElementById('loader');
//--objects--//

let lastInsertedId=0;
var db;
var request;
let befInstalPrompt;

//window before install
window.addEventListener('beforeinstallprompt', (e) => {
    console.log("before install");
    e.preventDefault();
    befInstalPrompt = e;
    btn_addToHome.addEventListener('click',addToHome);
    // btn_addToHome.addEventListener('click',checkAppOpenStat());
});

//window app insalled
window.addEventListener('appinstalled', (e)=>{
    console.log("App is installed");
    location.reload();
});

//window load
window.addEventListener('load', e=>{
    // updateNews();
    // updateLocalNews();

    // servie worker registration
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log(`Service Worker registered`);
        } catch (error) {
            console.log(`Service Worker registeration failed`);
        }
    } 

    indexDbInit();
});

//dom initialize
const initialize = async function(){    
    checkAppOpenStat();
    //
    await importLibraries();
    //--//

    // $('#notification-1').toast('show');
    btn_login.addEventListener('click',validateLogin);
    // btn_addToHome.addEventListener('click',addToHome);
    // btn_addToHome.addEventListener('click',addToHome);
    // btn_login.addEventListener('click',addToHome());
}

async function importLibraries()
{
    //jquery import
    var jQueryScript = document.createElement('script');  
    jQueryScript.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js');
    document.head.appendChild(jQueryScript);

    //Bootstrap import
    var bsScript = document.createElement('script');  
    bsScript.setAttribute('src','https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js');
    document.head.appendChild(bsScript);
    //--//

    //DEXIE import
    var dexieScript = document.createElement('script');  
    dexieScript.setAttribute('src','https://unpkg.com/dexie@latest/dist/dexie.js');
    document.head.appendChild(dexieScript);
    //--//

    // btn_addToHome.addEventListener('click',addToHome);

    // $('#btn_addToHome').on('click',function(){
    //     $('#notification-1').toast('show');
    //   });

    // $('#notification-1').toast('show');
}

//CUSTOMS//
const addToHome = function()
{


    // alert("adding to home");
    console.log("adding to home");
    // $('#notification-1').toast('show');
    // $('#notification-1').toast('show');

    // notification1.toast('show');
    // $('#notification-1').toast('show');

    if (navigator.platform == "iPhone" || navigator.platform == "iPad" || navigator.platform == "iPod")
    {
        // console.log("IOS detected");
        showMessage("IOS DETECTED");
        alert("IOS detected");
    }
     else 
     {
        showMessage("Other Than IOS");
        console.log("Other than IOS");

        befInstalPrompt.prompt();
        befInstalPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome=='accepted') 
            {
                console.log('accepted the install prompt');
            } else {
                console.log('rejected the install prompt');
            }
        });
    }


    
}

function checkAppOpenStat()
{
    let displayMode = 'browser tab';
    console.log("standalone=>"+navigator.standalone);
    if (navigator.standalone) {
        displayMode = 'standalone-ios';
        
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
        displayMode = 'standalone';
    }
    
    // Log launch display mode to analytics
    console.log('DISPLAY_MODE_LAUNCH:', displayMode);
    switch (displayMode) {
        case "browser tab":
        {
            btn_addToHome.style.visibility = "visible";
            // showMessage("Browser Tab");
            // console.log("Browser Tab");            
            break;
        }
        case "standalone":
        {            
            btn_addToHome.style.visibility = "hidden";
            // showMessage("stand alone");
            // console.log("stand alone");            
            break;
        }        
        case "standalone-ios":
        {            
            btn_addToHome.style.visibility = "hidden";
            // showMessage("stand alone ios");
            // console.log("stand alone");            
            break;
        }
    
        default:
        {
            btn_addToHome.style.visibility = "visible";
            // showMessage("Browser Tab");
            break;
        }
    }
    // console.log();
}

const validateLogin = function (params) 
{
    // alert("clicked");
    console.log("validate login");
    // let username = inp_username.value;
    // let pass = inp_password.value;
    // login(username, pass);
    if(navigator.onLine)
    {
        showMessage(false);
        let username = inp_username.value;
        let pass = inp_password.value;
        let errcount=0;
        let errmsg = "";

        if (username=="") {
            errcount++;
            errmsg="user name can not be empty\n";
        }

        if (pass=="" ) 
        {
            errcount++;
            errmsg+="password can not be empty";
        }

        if (errcount==0) 
        {
            login(username, pass);
        }
        else{
            showMessage(errmsg);
        }

    }
    else{
        // showMessage("No Internet Connection!");
        fetchOfflineActivities();
    }
};

//data handling
async function login(userName, password)
{
    console.log("login username=>"+userName+", pass=>"+password);   

    
    
    if (navigator.onLine) 
    {
        try {

            //dummy login
            if (userName=="interactive@ppl.com" && password=="987") 
            {
                showLoader(false);
                // showMessage("Login successfull");

                window.location.replace("page1.html");
            } 
            else 
            {
                showLoader(false);
                showMessage("incorrect username or password");
            }
            //--dummy login

            // const url=rootUrl+"auth/getall";
            // const url=rootUrl+"login";
            // console.log("complete url=> "+url);

            // // showLoader(true);
            // showMessage("processing. please wait.");
            // showLoader(true);
            // // jquery post
            // await $.post(url, 
            //         {
            //             userName:userName,
            //             password:password
            //         },
            //         function (data, status)
            //         {
            //             showLoader(false);
            //             showMessage("data fetch successfull");                
            //             console.log("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
            //             // alert("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
            //             container.innerHTML = data.user.map(mapUser).join('\n');
            //         }
            //     );

            
        } catch (error) 
        {
            showLoader(false);
            console.log("error=> "+error.value);
            showMessage("Error in data fetching");
            // fetchOfflineActivities();
            // indexDbReadAll();
        }
    }
    else{
        console.log("fetching offline vals");
        // fetchOfflineActivities();
        // indexDbReadAll();
    }

}


///////////////OFLINE Handling//////////////////////
function fetchOfflineActivities()
{
    indexDbReadAll();
    // switch(key)
    // {
    //     case "login":
    //     {
    //         showMessage("fetch from offline okok");
    //         break;
    //     }

    //     default:
    //         {
    //             showMessage("incorrect key for offline fetch");
    //             break;
    //         }
    // }
}
function indexDbInit()
{
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores({
        user: 'id',
        activities: 'activityLogId'
    });

    const bulkArr=[
                    {id: "0010", email: "test@gmail", pass:"test123", date_create:"12:01:00"},
                    {id: "0011", email: "test2@gmail", pass:"test2123", date_create:"12:02:00"}
                ];
    db.user.bulkPut(bulkArr)
    .catch(Dexie.bulkError, function(error) {
        alert ("user Ooops: " + error);
    });

    const bulkArrAct=[
        {activityLogId: "4", activityId: "4", actionId:"4", contentId:"5", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE INVESTIGATION"},
        {activityLogId: "5", activityId: "5", actionId:"5", contentId:"6", activityName:"MY VITALS", actionName:"VVIEW VITALS", contentName:"VIEW VITAL PULSE"},
        {activityLogId: "6", activityId: "6", actionId:"7", contentId:"10", activityName:"MEDICATION", actionName:"PREVIOUS MEDICATION", contentName:"MEDICINE FREQUENCY"},
        {activityLogId: "4", activityId: "4", actionId:"4", contentId:"4", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE FEVER"}        
    ];
db.activities.bulkPut(bulkArrAct)
.catch(Dexie.bulkError, function(error) {
alert ("actvities Ooops: " + error);
});


    
}

async function indexDbRead() {

    await db.user.get('0010')
    .then(function(user){

        alert("user=>"+user.email);

    })
    .cathc(function(error)
    {
        alert("user not found");
    });


    // var transaction = db.transaction(["user"]);
    // var objectStore = transaction.objectStore("user");
    // var request = objectStore.get("00-03");
    
    // request.onerror = function(event) {
    //    alert("Unable to retrieve daa from database!");
    // };
    
    // request.onsuccess = function(event) {
    //    // Do something with the request.result!
    //    if(request.result) {
    //       alert("Email: " + request.result.email + ", Pass: " + request.result.pass);
    //    } else {
    //       alert("Kenny couldn't be found in your database!");
    //    }
    // };
 }
 
 function indexDbReadAll() {
    //  db.table("user").toArray()
    //  .then(function (data)
    //   {
    //     container.innerHTML = data.map(mapUser).join('\n\n');
    //      console.log(data);
    //     }
    //  );
    console.log("reading all records");
     db.table("activities").toArray()
     .then(function (data)
      {
        container.innerHTML = data.map(mapAct).join('\n\n');
         console.log(data);
        }
     );
 } 

 function indexDbAdd(id, email, pass) {
    db.user.put({id: id, email: email, pass:pass})
    .catch(function(error) 
    {
        alert ("Ooops: " + error);
    }); 




    // var request = db.transaction(["user"], "readwrite")
    // .objectStore("user")
    // .add({ id: id, email: email, pass:pass });
    // // .add({ id: "00-03", email: email, pass:pass });
    
    // request.onsuccess = function(event) {
    //     console.log("added");
    //     lastInsertedId++;
    // //    alert("Kenny has been added to your database.");
    // };
    
    // request.onerror = function(event) {
    //     console.log("unable to add");
    // //    alert("Unable to add data\r\nKenny is aready exist in your database! ");
    // }
 }
//-----------------------------------------------//

const testAlert = function(){
    if (navigator.onLine) 
    {
        alert("login in process, username=> "+inp_username.value+", pass=>"+inp_password.value); 
        
        // indexDbRead();
        indexDbReadAll();
    }
    else{
        alert("no internet connection");
    }
    
}

const submitLogin = function(ev)
{
    ev.preventDefault();
    ev.stopPropagation();
    // alert('hello how are');


    let valid = true;

    let email = document.getElementById('input_email');
    let pass = document.getElementById('input_pass');

    let errorMsg ="";
    if(email.value === "")
    {
        valid = false;
        errorMsg="Email ";
        // showMessage("email cannot be null");
        // alert('email cannot be null');
    }
    
    if(pass.value === "")
    {
        valid = false;
        // alert('password cannot be null');
        errorMsg+=", Password ";
    }

    if (valid) 
    {
        createUser(email.value, pass.value);
    }
     else 
    {
        // alert('incorrect vallue');
        errorMsg=" value incorrect!";
        showMessage(errorMsg);

    }

}

// const createUser = function(email, pass)
async function createUser(email, pass)
{  

    try {
        const url=rootUrl+"auth/login";

        // showLoader(true);
        showMessage("creating user");
        indexDbAdd(lastInsertedId, email, pass);
        //jquery get
        await $.get(url, {param:email, param2:pass},
            function(data, status){ 
            showMessage("user created successfully");            
            // showLoader(false);
            // alert("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
        });
        
    } catch (error) 
    {
        // showLoader(false);
        showMessage("No Internet Connection");
    }

    

    //jquery post
    // $.post(url,
    // {
    //     login_id: "Donald Duck",
    //     pass: "Duckburg"
    // },
    // function(data, status){
    //     alert("success: " + data.success+"\nMessage: "+ data.message + "\nStatus: " + status);
    // });

    // const url=rootUrl+"auth/login";
    // alert("okok, url=>"+url);
    // // const data={
    // //     login_id:email,
    // //     pass:pass
    // // };

    // const otherParams = {
    //     mehtod:'POST',
    //     // credentials:'same-origin',
    //     headers:{
    //         'Content-Type':'application/json',
    //     },
    //     body : JSON.stringify({
    //         'login_id' : email,
    //         'pass' : pass

    //     })
    // };

    // // fetch("https://jsonplaceholder.typicode.com/posts", { 
    // fetch(url, 
    //     { 
      
    //     // Adding method type 
    //     method: "POST", 
        
    //     // Adding body or contents to send 
    //     body: JSON.stringify({ 
    //         login_id: email, 
    //         pass: pass
    //     }), 
        
    //     // Adding headers to the request 
    //     headers: { 
    //         "Content-type": "application/json; charset=UTF-8"
    //     } 
    // }) 
  
    // // Converting to JSON 
    // .then(response => response.json()) 
    
    // // Displaying results to console 
    // .then(json => console.log(json));





    ////
//     fetch('https://jsonplaceholder.typicode.com/todos/1')
//   .then(response => response.json())
//   .then(json => console.log(json))


    // const response = await fetch(url, otherParams)
    // .then(response=>{console.log(response.json());})
    // .then(data=>{console.log('success:',data);})
    // .catch(error=>{console.error('Error:',error);})
}

async function viewdata()
{
    //dexie.js, dexie-syncable.js e.t.c
    // alert('loading data view. please wait...');

    try {
        const url=rootUrl+"auth/getall";

        // const res= await fetch(url);
        // const json = await res.json();
        // container.innerHTML = json.user.map(mapUser).join('\n');

        // showLoader(true);
        showMessage("processing. please wait.");
        // jquery get
        await $.get(url, 
            function(data, status){
            // showLoader(false);
            showMessage("data fetch successfull");
            
            // alert("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
            container.innerHTML = data.user.map(mapUser).join('\n');
            
        })
        .fail(function(){
            // showLoader(false);
            showMessage("unable to load data");
            //   alert("no internet connection");
            
        });
    } catch (error) 
    {
        // showLoader(false);
        showMessage("No Internet Connection");
    }

    

    
}
function mapUser(user)
{

    // indexDbAdd(user.id, user.email, user.pass);

    return `
    <div class="user">            
            <h4>${user.email}</h4>
            <h3>${user.pass}</h3>            
            <p>${user.date_create}</p>            
        </div>
        `;
}

function mapAct(activities)
{

    // indexDbAdd(user.id, user.email, user.pass);

    return `
    <div class="activities">            
            <h4>${activities.activityLogId}</h4>
            <h3>${activities.activityName}</h3>            
            <p>${activities.contentName}</p>            
        </div>
        `;
}

function signup()
{
    // showLoader(false);
    showMessage(false);
}

function showLoader(show)
{
    if (show) 
    {
        preLoader.style.visibility = "visible";
        console.log("loader visible");
    }
    else{
        preLoader.style.visibility = "hidden";
        console.log("loader hidden");
    }
}

function showMessage(message)
{
    if (!message) 
    {
        messageInd.style.visibility = "hidden";
    }
    else{
        messageInd.style.visibility = "visible";
        messageInd.innerHTML = message;
    }
}


document.addEventListener('DOMContentLoaded', initialize);




// const otherParams = {
    // mehtod:'POST',
    // mode:'cors',
    // cache:'no-cache',
    // credentials:'same-origin',
    // headers:{
    //     'Content-Type':'application/json; charset=UTF-8'
    // },
    // redirect:'follow',
    // referrerPolicy:'no-referrer',
//     body:JSON.stringify(Data)
// };