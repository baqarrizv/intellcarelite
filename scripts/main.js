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
            // if (userName=="interactive@ppl.com" && password=="987") 
            // {
            //     showLoader(false);
            //     // showMessage("Login successfull");

                // window.sessionStorage.setItem("userName",userName);
                // window.sessionStorage.setItem("password",password);

            //     window.location.replace("page1.html");
            // } 
            // else 
            // {
            //     showLoader(false);
            //     showMessage("incorrect username or password");
            // }
            //--dummy login

            
            const url=rootUrl+"login";
            console.log("complete url=> "+url);

            // showLoader(true);
            showMessage("processing. please wait.");
            showLoader(true);
            // jquery post
            await $.post(url, 
                            {
                                userName:userName,
                                password:password
                            },
                    function (data, status)
                    {
                        showLoader(false);
                        showMessage("data fetch successfull");                
                        console.log("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
                        console.log("user found :: personId=>"+data.person.personId+", name=>"+data.person.name);

                        //session
                        window.sessionStorage.setItem("userName",userName);
                        window.sessionStorage.setItem("password",password);

                        window.location.replace("page1.html");
                        // alert("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
                        // container.innerHTML = data.person.map(mapUser).join('\n');
                    }
                );

            
        } catch (error) 
        {
            showLoader(false);
            console.log("error=> "+error.value);
            showMessage("Error in data fetching => "+error.value);
            loginOffline(userName, password);
            // fetchOfflineActivities();
            // indexDbReadAll();
        }
    }
    else{
        console.log("fetching offline vals");
        showMessage("app offline");
        loginOffline(userName, password);
        // fetchOfflineActivities();
        // indexDbReadAll();
    }

}


///////////////OFLINE Handling//////////////////////
function loginOffline(userName, password)
{
    if (userName == "interactive@ppl.com" && password=="987") 
    {

        // db.person.where({name: "Dr. INTERACTIVE Group", personId: "38995"}).first(friend => {
        db.person.where({personId: "38995"})
        .first(friend => {
            console.log("Found Person: " + JSON.stringify(friend));
            window.location.replace("page1.html");
        }).catch(error => {
            console.error(error.stack || error);
        });

        
    } else {
        
        console.log("no user found");
        showMessage("No User Found");

    }
    
}

// function fetchOfflineActivities()
// {
//     console.log("reading all records");
//      db.table("activities").toArray()
//      .then(function (data)
//       {
//         container.innerHTML = data.map(mapAct).join('\n\n');
//          console.log(data);
//         }
//      );
//     // indexDbReadAll();
//     // switch(key)
//     // {
//     //     case "login":
//     //     {
//     //         showMessage("fetch from offline okok");
//     //         break;
//     //     }

//     //     default:
//     //         {
//     //             showMessage("incorrect key for offline fetch");
//     //             break;
//     //         }
//     // }
// }
function indexDbInit()
{
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores({
        person: 'personId',
        activities: 'id',
        actions: 'id'
    });

    //Persons
    const bulkArr=[
                    {
                        personId: "38995",
                        name: "Dr. INTERACTIVE Group", 
                        mrNo:"01-18-0042756", 
                        gender:"Male", 
                        age:"48 year(s)  1  month(s) 15 day(s) ( Adult)", 
                        number:"null", 
                        bloodGroup:"A-"
                    }
                ];
    db.person.bulkPut(bulkArr)
    .catch(Dexie.bulkError, function(error) {
        alert ("person Ooops: " + error);
    });

    //Activities
    const bulkArrAct=[
        {id: "5", name: "MY VITALS"},
        {id: "7", name: "Demographics"},
        {id: "6", name: "MEDICATION"},
        {id: "4", name: "APPOINTMENT BOOKING"}
    ];
    db.activities.bulkPut(bulkArrAct)
    .catch(Dexie.bulkError, function(error) {
    alert ("actvities Ooops: " + error);
    });


    //actions
    const bulkArrAction=[
        {
            id: "9",
            activityId: "7", 
            name:"Update Demographics", 
            contents:"null"
        },
        {
            id: "8",
            activityId: "7", 
            name:"View Demographics", 
            contents:"null"
        },
        {
            id: "7",
            activityId: "6", 
            name:"PREVIOUS MEDICATION", 
            contents:"null"
        },
        {
            id: "4",
            activityId: "4", 
            name:"APPOINTMENT_ACKNOWLEDGE", 
            contents:"null"
        },
        {
            id: "10",
            activityId: "4", 
            name:"VIEW APPOINTMENT", 
            contents:"null"
        },
        {
            id: "5",
            activityId: "5", 
            name:"View Vitals", 
            contents:"null"
        },
        {
            id: "6",
            activityId: "5", 
            name:"PREVIOUS VITALS", 
            contents:"null"
        },
    ];
    db.actions.bulkPut(bulkArrAction)
    .catch(Dexie.bulkError, function(error) {
    alert ("action Ooops: " + error);
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