// let rootUrl="http://10.190.14.14:1700/IntellCareLite/";
// let rootUrl="http://203.99.60.222:1700/IntellCareLite/";//{live}
let rootUrl="https://203.99.60.222:1701/IntellCareLite/";//{live}
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

//add to home
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
        console.log("IOS detected");
        // showMessage("IOS DETECTED");
        // alert("IOS detected");
    }
     else 
     {
        // showMessage("Other Than IOS");
        console.log("Other than IOS");

        befInstalPrompt.prompt();
        befInstalPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome=='accepted') 
            {
                // location.reload();
                console.log('accepted the install prompt');
            } else {
                console.log('rejected the install prompt');
            }
        });
    }


    
}

function checkAppOpenStat()
{


    // if (navigator.userAgent.indexOf("Win") != -1){ console.log("Windows OS"); }
    // if (navigator.userAgent.indexOf("Mac") != -1) {console.log("Macintosh"); }
    // if (navigator.userAgent.indexOf("Linux") != -1) {console.log("Linux OS"); }
    // if (navigator.userAgent.indexOf("Android") != -1) {console.log("Android OS"); }
    // if (navigator.userAgent.indexOf("like Mac") != -1) {console.log("iOS"); }

    console.log("user agent => "+navigator.userAgent);
    console.log("platform => "+navigator.platform);
    console.log("get OS => "+getOS());

    // for (let i = 0; i < navigator.userAgent.length; i++) 
    // {
    //     console.log(navigator.userAgent.indexOf(i));
        
    // }





    let displayMode = 'browser tab';
    console.log("standalone=>"+navigator.standalone);
    if (navigator.standalone) {
        displayMode = 'standalone-ios';
        // alert("standalone-ios");
        
    }
    if (window.matchMedia('(display-mode: standalone)').matches) 
    {
        displayMode = 'standalone';        
        // alert("standalone");
    }
    
    // Log launch display mode to analytics
    console.log('DISPLAY_MODE_LAUNCH:', displayMode);
    // alert("display mode : "+displayMode);
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
//--add to home

//OS Handling//
function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
  }
//--OS Handling--//

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

                window.sessionStorage.setItem("userName",userName);
                window.sessionStorage.setItem("password",password);

                window.location.replace("page1.html");
            } 
            else 
            {
                showLoader(false);
                showMessage("incorrect username or password");
            }
            //--dummy login

            
            // const url=rootUrl+"login";
            // console.log("complete url=> "+url);

            // showLoader(true);
            showMessage("processing. please wait.");
            showLoader(true);



            //conn check
            // await $.get("http://203.99.60.222:1700/IntellCareLite/checkGet", function(data, status){
                // const url=rootUrl+"checkGet";
                // console.log("complete url=> "+url);
                // await $.get(rootUrl+"checkGet", function(data, status){
                
                //     console.log(`${data}`);
                // });

                //check for internal connectivity of live ip
                // 10.190.14.35

                // let promise = await fetch(url, 
                //     {
                //         method: "GET", // POST, PUT, DELETE, etc.
                //         headers: 
                //         {
                //         // the content type header value is usually auto-set
                //         // depending on the request body
                //         "Content-Type": "text/plain;charset=UTF-8",
                //         "Host": "203.99.60.222:1700",
                //         // "Origin": "http://localhost:81"
                //         "Origin": "https://admin.aldermin.com"
                //         },
                //         body: undefined, // string, FormData, Blob, BufferSource, or URLSearchParams
                //         referrer: "about:client", // or "" to send no Referer header,
                //         // or an url from the current origin
                //         referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
                //         mode: "no-cors", // same-origin, no-cors
                //         credentials: "same-origin", // omit, include
                //         cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
                //         redirect: "follow", // manual, error
                //         integrity: "", // a hash, like "sha256-abcdef1234567890"
                //         keepalive: false, // true
                //         signal: undefined, // AbortController to abort request
                //         window: window // null
                //   })
                //   .then(data => console.log(data));

                //   console.log("response:: "+promise.json());




                // const url=rootUrl+"login";
                // console.log("complete url=> "+url);

                //   //post
                //   let promise = await fetch(url, 
                //     {
                //         method: "POST", // POST, PUT, DELETE, etc.
                //         headers: 
                //         {
                //         // the content type header value is usually auto-set
                //         // depending on the request body
                //         "Content-Type": "application/json;charset=UTF-8",
                //         "Host": "203.99.60.222:1701",
                //         // "Origin": "http://localhost:81"
                //         "Origin": "https://admin.aldermin.com"
                //         },
                //         body: JSON.stringify(
                //                 {
                //                     userName:userName,
                //                     password:password
                //                 }
                //             ), // string, FormData, Blob, BufferSource, or URLSearchParams
                //         // referrer: "about:client", // or "" to send no Referer header,
                //         // or an url from the current origin
                //         // referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
                //         mode: "cors", // same-origin, no-cors
                //         credentials: "same-origin", // omit, include
                //         cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
                //         redirect: "follow", // manual, error
                //         integrity: "", // a hash, like "sha256-abcdef1234567890"
                //         keepalive: false, // true
                //         signal: undefined, // AbortController to abort request
                //         window: window // null
                //   })
                //   .then(response => {
                //     if (!response.ok) {
                //         console.log(response.json())
                //             .catch(() => {
                //                 // Couldn't parse the JSON
                //                 throw new Error(response.status);
                //             })
                //             .then(({message}) => {
                //                 // Got valid JSON with error response, use it
                //                 throw new Error(message || response.status);
                //             });
                //     }
                //     // Successful response, parse the JSON and return the data
                //     console.log(response.json());
                // });

                //   console.log("response:: "+promise.json());










            // jquery post
        //     await $.post(url, 
        //                     {
        //                         userName:userName,
        //                         password:password
        //                     },
        //             function (data, status)
        //             {
        //                 showLoader(false);
        //                 showMessage("data fetch successfull");                
        //                 console.log("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
        //                 console.log("user found :: personId=>"+data.person.personId+", name=>"+data.person.name);

        //                 //session
        //                 window.sessionStorage.setItem("userName",userName);
        //                 window.sessionStorage.setItem("password",password);

        //                 // window.location.replace("page1.html");
        //                 // alert("Success: " + data.success+", message: "+data.message + "\nStatus: " + status);
        //                 // container.innerHTML = data.person.map(mapUser).join('\n');
        //             },
        //             "json"
        //         )
        //         .done(function(msg){})
        //         .fail(function(xhr, status, error)
        //         {
        //             console.log("err xhr:: "+xhr);
        //             console.log("err status:: "+status);
        //             console.log("err error:: "+error);
        //         });

            
        } catch (error) 
        {
            showLoader(false);
            console.log("error=> "+error);
            console.log("error=> "+error.name);
            console.log("error=> "+error.message);
            console.log("error=> "+error.stack);
            showMessage("Error in data fetching => "+error.value);
            // loginOffline(userName, password);
            // fetchOfflineActivities();
            // indexDbReadAll();
        }
    }
    else{
        console.log("fetching offline vals");
        showMessage("app offline");
        // loginOffline(userName, password);
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
        .first(person => {
            window.sessionStorage.setItem("userName", userName);
            window.sessionStorage.setItem("password", password);
            window.sessionStorage.setItem("name", person.name);

            console.log("Found Person: " + JSON.stringify(person));
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
                        name: "Interactive Group", 
                        mrNo:"01-18-0042756", 
                        gender:"Male", 
                        age:"48 year(s)  1  month(s) 18 day(s) ( Adult)", 
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
        {
            id: "8",
            activityId: "7", 
            name:"View Demographics", 
            contents:"null"
        },
        {
            id: "9",
            activityId: "7", 
            name:"Update Demographics", 
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