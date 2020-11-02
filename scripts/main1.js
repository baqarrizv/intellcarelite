// import Dexie from 'dexie';

// let rootUrl="https://www.pakfirst.org/intellcarelite_p/api/";
let rootUrl="https://203.99.60.222:1701/IntellCareLite/";//{live}
//objects//
const container2 = document.getElementById('container2');
const preLoader = document.getElementById('loader');
const messageInd2 = document.getElementById('messageIndicator2');
const username = document.getElementById('username');
const btn_addToHome2 = document.getElementById('btn_addToHome2');

//--objects--//
var db;
let befInstalPrompt;

//window before install
window.addEventListener('beforeinstallprompt', (e) => {
    console.log("before install");
    e.preventDefault();
    befInstalPrompt = e;
    btn_addToHome2.addEventListener('click',addToHome2);
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
    // console.log("second page load");
    // alert("second page load");

    // servie worker registration
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log(`Service Worker registered`);
        } catch (error) {
            console.log(`Service Worker registeration failed`);
        }
    } 
});

//dom initialize
const initialize = async function(){    
    //
    await importLibraries();
    //--//



    // userName.innerHTML = window.sessionStorage.getItem("userName");
    
    // btn_addToHome2.addEventListener('click',addToHome2);

    // fetchOfflineActivities();
    // populaateFromSession();
    // btn_login.addEventListener('click',validateLogin);
    // indexDbReadAll();
    // indexDbInitp2();
}

async function importLibraries()
{
    console.log("importing libraries.....");
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
}

//CUSTOMS//
function populaateFromSession()
{
    username.innerHTML = window.sessionStorage.getItem('name');
}


const addToHome2 = function()
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
        // showMessage("IOS DETECTED");
        alert("IOS detected");
    }
     else 
     {
        // showMessage("Other Than IOS");
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





///////////////OFLINE Handling//////////////////////
function fetchOfflineActivities()
{

    const bulkArrAct = JSON.parse(`{
            "activities": [
                {
                    "id": 5,
                    "name": "My Vitals",
                    "actions": [
                        {
                            "id": 6,
                            "activityId": 5,
                            "name": "Previous Vitals",
                            "contents": null
                        },
                        {
                            "id": 5,
                            "activityId": 5,
                            "name": "View Vitals",
                            "contents": null
                        }
                    ]
                },
                {
                    "id": 6,
                    "name": "Medication",
                    "actions": [
                        {
                            "id": 7,
                            "activityId": 6,
                            "name": "Previous Medication",
                            "contents": null
                        }
                    ]
                },
                {
                    "id": 7,
                    "name": "Demographics",
                    "actions": [
                        {
                            "id": 8,
                            "activityId": 7,
                            "name": "View Demographics",
                            "contents": null
                        },
                        {
                            "id": 9,
                            "activityId": 7,
                            "name": "Update Demographics",
                            "contents": null
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "Appointment Booking",
                    "actions": [
                        {
                            "id": 10,
                            "activityId": 4,
                            "name": "View Appointment",
                            "contents": null
                        },
                        {
                            "id": 4,
                            "activityId": 4,
                            "name": "Appointment Acknowledge",
                            "contents": null
                        }
                    ]
                },
                {
                    "id": 8,
                    "name": "Patient Attachments",
                    "actions": [
                        {
                            "id": 11,
                            "activityId": 8,
                            "name": "View Attachments",
                            "contents": null
                        }
                    ]
                }
            ]
        }`);


    // const bulkArrAct=[
    //     {
    //         "id": 5,
    //         "name": "MY VITALS",
    //         "actions": [
    //             {
    //                 "id": 5,
    //                 "activityId": 5,
    //                 "name": "View Vitals",
    //                 "contents": null
    //             },
    //             {
    //                 "id": 6,
    //                 "activityId": 5,
    //                 "name": "PREVIOUS VITALS",
    //                 "contents": null
    //             }
    //         ]
    //     },
    //     {
    //         "id": 7,
    //         "name": "Demographics",
    //         "actions": [
    //             {
    //                 "id": 8,
    //                 "activityId": 7,
    //                 "name": "View Demographics",
    //                 "contents": null
    //             },
    //             {
    //                 "id": 9,
    //                 "activityId": 7,
    //                 "name": "Update Demographics",
    //                 "contents": null
    //             }
    //         ]
    //     },
    //     {
    //         "id": 6,
    //         "name": "MEDICATION",
    //         "actions": [
    //             {
    //                 "id": 7,
    //                 "activityId": 6,
    //                 "name": "PREVIOUS MEDICATION",
    //                 "contents": null
    //             }
    //         ]
    //     },
    //     {
    //         "id": 4,
    //         "name": "APPOINTMENT BOOKING",
    //         "actions": [
    //             {
    //                 "id": 4,
    //                 "activityId": 4,
    //                 "name": "APPOINTMENT_ACKNOWLEDGE",
    //                 "contents": null
    //             },
    //             {
    //                 "id": 10,
    //                 "activityId": 4,
    //                 "name": "VIEW APPOINTMENT",
    //                 "contents": null
    //             }
    //         ]
    //     }
    // ];

    container2.innerHTML = bulkArrAct.activities.map(mapAct2).join('\n\n');

    //--------------------------------------------------------//
    // let bulkArrAct = db.activities.toArray();

    // console.log("activities=>"+bulkArrAct);


    // container2.innerHTML = bulkArrAct.map(mapAct2).join('\n\n');

    //-------------------------------------------------------//


    // db.activities.bulkPut(bulkArrAct)
    // .then(function(){
    //     // indexDbReadAll();
    // })
    // .catch(Dexie.bulkError, function(error) {
    // alert ("actvities Ooops: " + error);
    // });



    // indexDbInit();

    // console.log("reading all records");
    //  db.table("activities").toArray()
    //  .then(function (data)
    //   {
    //     container2.innerHTML = data.map(mapAct2).join('\n\n');
    //      console.log(data);
    //     }
    //  );
    // container.innerHTML = bulkArrAct.map(mapAct).join('\n\n');
    // container2.innerHTML = bulkArrAct.map(mapAct2).join('\n\n');

    // indexDbReadAll();

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
function indexDbInitp2()
{
    //db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
        {   person: "personId, name, mrNo, gender, age, number, bloodGroup, firstName, middleName, lastname, dob, maritalStatus, cnic, email, streetAddress, district, province, city, country, base64EncodedPicture",
            activities: "id, name, actions"
        }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });

    let bulkArrAct = db.activities.toArray();

    console.log("activities=>"+bulkArrAct);

    // fetchOfflineActivities();


//--//
    // db.version(dbversion).stores({
    //     user: 'id',
    //     activities: 'activityLogId'
    // });

    // const bulkArrAct=[
    //     {activityLogId: "4", activityId: "4", actionId:"4", contentId:"5", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE INVESTIGATION"},
    //     {activityLogId: "5", activityId: "5", actionId:"5", contentId:"6", activityName:"MY VITALS", actionName:"VVIEW VITALS", contentName:"VIEW VITAL PULSE"},
    //     {activityLogId: "6", activityId: "6", actionId:"7", contentId:"10", activityName:"MEDICATION", actionName:"PREVIOUS MEDICATION", contentName:"MEDICINE FREQUENCY"},
    //     {activityLogId: "4", activityId: "4", actionId:"4", contentId:"4", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE FEVER"}        
    // ];
    // db.activities.bulkPut(bulkArrAct)
    // .then(function(){
    //     indexDbReadAll();
    // })
    // .catch(Dexie.bulkError, function(error) {
    // alert ("actvities Ooops: " + error);
    // });
    
    // indexDbReadAll();
    // db.version(dbversion).stores({
    //     user: 'id',
    //     activities: 'activityLogId'
    // });

//     const bulkArr=[
//                     {id: "0010", email: "test@gmail", pass:"test123", date_create:"12:01:00"},
//                     {id: "0011", email: "test2@gmail", pass:"test2123", date_create:"12:02:00"}
//                 ];
//     db.user.bulkPut(bulkArr)
//     .catch(Dexie.bulkError, function(error) {
//         alert ("user Ooops: " + error);
//     });

//     const bulkArrAct=[
//         {activityLogId: "4", activityId: "4", actionId:"4", contentId:"5", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE INVESTIGATION"},
//         {activityLogId: "5", activityId: "5", actionId:"5", contentId:"6", activityName:"MY VITALS", actionName:"VVIEW VITALS", contentName:"VIEW VITAL PULSE"},
//         {activityLogId: "6", activityId: "6", actionId:"7", contentId:"10", activityName:"MEDICATION", actionName:"PREVIOUS MEDICATION", contentName:"MEDICINE FREQUENCY"},
//         {activityLogId: "4", activityId: "4", actionId:"4", contentId:"4", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE FEVER"}        
//     ];
// db.activities.bulkPut(bulkArrAct)
// .catch(Dexie.bulkError, function(error) {
// alert ("actvities Ooops: " + error);
// });


    
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
 
//  function indexDbReadAll() {
//     //  db.table("user").toArray()
//     //  .then(function (data)
//     //   {
//     //     container.innerHTML = data.map(mapUser).join('\n\n');
//     //      console.log(data);
//     //     }
//     //  );
//     // console.log("read all");
//     // console.log("reading all records");
//     //  db.table("activities").toArray()
//     //  .then(function (data)
//     //   {
//     //     container.innerHTML = data.map(mapAct).join('\n\n');
//     //      console.log(data);
//     //     }
//     //  );

//     // const bulkArrAct=[
//     //     {activityLogId: "4", activityId: "4", actionId:"4", contentId:"5", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE INVESTIGATION"},
//     //     {activityLogId: "5", activityId: "5", actionId:"5", contentId:"6", activityName:"MY VITALS", actionName:"VVIEW VITALS", contentName:"VIEW VITAL PULSE"},
//     //     {activityLogId: "6", activityId: "6", actionId:"7", contentId:"10", activityName:"MEDICATION", actionName:"PREVIOUS MEDICATION", contentName:"MEDICINE FREQUENCY"},
//     //     {activityLogId: "4", activityId: "4", actionId:"4", contentId:"4", activityName:"APPOINTMENT BOOKING", actionName:"APPOINTMENT_ACKNOWLEDGE", contentName:"VSIT PLAN DIAGNOSE FEVER"}        
//     // ];
//     // const bulkArrAct=[
//     //     {
//     //         id: "7",
//     //         name: "Demographics",
//     //         actions: 
//     //         [
//     //             {
//     //                 id: "9",
//     //                 activityId: "7",
//     //                 name: "Update (Demographics)",
//     //                 contents: "null"
//     //             },
//     //             {
//     //                 id: "8",
//     //                 activityId: "7",
//     //                 name: "View (Demographics)",
//     //                 contents: null
//     //             }
//     //         ]
//     //     },
//     //     {
//     //         id: "6",
//     //         name: "MEDICATION",
//     //         actions: 
//     //         [
//     //             {
//     //                 id: "7",
//     //                 activityId: "6",
//     //                 name: "PREVIOUS MEDICATION",
//     //                 contents: "null"
//     //             }
//     //         ]
//     //     },
//     //     {
//     //         id: "4",
//     //         name: "APPOINTMENT BOOKING",
//     //         actions: 
//     //         [
//     //             {
//     //                 id: "4",
//     //                 activityId: "4",
//     //                 name: "APPOINTMENT_ACKNOWLEDGE",
//     //                 contents: "null"
//     //             }
//     //         ]
//     //     },
//     //     {
//     //         id: "5",
//     //         name: "MY VITALS",
//     //         actions: 
//     //         [
//     //             {
//     //                 id: "5",
//     //                 activityId: "5",
//     //                 name: "VVIEW VITALS",
//     //                 contents: "null"
//     //             },
//     //             {
//     //                 id: "6",
//     //                 activityId: "5",
//     //                 name: "PREVIOUS VITALS",
//     //                 contents: "null"
//     //             }
//     //         ]
//     //     }
//     // ];
//     // // container.innerHTML = bulkArrAct.map(mapAct).join('\n\n');
//     // container2.innerHTML = bulkArrAct.map(mapAct2).join('\n\n');
//     // console.log("reading all records");
//     // db.table("activities").toArray()
//     // .then(function (data)
//     //  {
//     //    container.innerHTML = data.map(mapAct).join('\n\n');
//     //     console.log(data);
//     //    }
//     // );
//  } 

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

function mapAct2(activities)
{

    // indexDbAdd(user.id, user.email, user.pass);

    console.log("mapping act 2");
    return `<div class="list-group list-custom-small list-icon-0">
                <a data-toggle="collapse" href="#collapse-${activities.id}">
                    <i class="fa font-14 fa fa-user color-blue2-dark"></i>
                    <span class="font-14">${activities.name}</span>
                    <i class="fa fa-angle-down"></i>
                </a>
            </div>
            `
            +
            activities.actions.map(mapAction2).join("\n\n");
            
{/* <div class="collapse" id="collapse-${activities.activityLogId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${activities.contentName}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div> */}

    // return `
    // <div class="activities">            
    //         <h4>${activities.activityLogId}</h4>
    //         <h3>${activities.activityName}</h3>            
    //         <p>${activities.contentName}</p>            
    //     </div>
    //     `;
}
function mapAction2(actions)
{
    if (actions.id == "4") 
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToAppointmentNew()">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }
    else if (actions.id == "10") 
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToAppointmentView()">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }
    else if (actions.id == "5") 
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToVitalView()">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }    
    else if (actions.id == "6") //previos vital
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToVitalPrevious()">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }
    else if (actions.id == "8") 
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToDemographView()">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }
    else if (actions.id == "9") 
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToDemographUpdate()">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }
    else
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }
    
}

function goToAppointmentView()
{
    console.log("going to next view");
    // window.location.href = "view_appointment.html";
    window.location.href = "list_appointment.html";
}

function goToAppointmentNew()
{
    console.log("going to next view");
    window.location.href = "new_appointment.html";
}
function goToVitalPrevious()
{
    console.log("going to next view");
    // window.location.href = "list_vitals.html";
}
function goToVitalView()
{
    console.log("going to next view");
    window.location.href = "list_vitals.html";

    
}
function goToDemographView()
{
    console.log("going to next view");
    window.location.href = "view_demographics.html";
}
function goToDemographUpdate()
{
    console.log("going to next view");
    window.location.href = "edit_demographics.html";
}
// function goToVitalList()
// {
//     console.log("going to next view");
//     window.location.href = "list_vitals.html";
// }


function checkFunction()
{
    var sPath = window.location.pathname;
    //var sPage = sPath.substring(sPath.lastIndexOf('\\') + 1);
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    // alert(sPage);

    if(sPage == "page1.html")
    {
        // alert("getting vitals");

        // fetchVitals();
        fetchOfflineActivities();

    }
    else if(sPage == "list_vitals.html")
    {
        // alert("getting vitals");

        fetchVitals();


    }
    else if(sPage == "view_demographics.html")
    {
        alert("getting demograp");
    }

}

//DATA HANDLING
async function fetchVitals()
{

    try {


        // showMessage("processing. please wait.");
        // showLoader(true);

        const url=rootUrl+"viewVitals";
        console.log("complete url=> "+url);

        let personId="38995";
        let actionId="5";

        //   //post
        await fetch(url, 
        {
            method: "POST", // POST, PUT, DELETE, etc.
            headers: 
            {
            // the content type header value is usually auto-set
            // depending on the request body
            "Content-Type": "application/json;charset=UTF-8",
            "Host": "203.99.60.222:1701",
            // "Origin": "http://localhost:81"
            "Origin": "https://admin.aldermin.com"
            },
            body: JSON.stringify(
                    {
                        personId:personId,
                        actionId:actionId
                    }
                ), // string, FormData, Blob, BufferSource, or URLSearchParams
            // referrer: "about:client", // or "" to send no Referer header,
            // or an url from the current origin
            // referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
            mode: "cors", // same-origin, no-cors
            credentials: "same-origin", // omit, include
            cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
            redirect: "follow", // manual, error
            integrity: "", // a hash, like "sha256-abcdef1234567890"
            keepalive: false, // true
            signal: undefined, // AbortController to abort request
            window: window // null
        })
        .then(response => 
        {
            if (!response.ok) {
                console.log("response=>"+response.json())
                    .catch(() => {
                        // Couldn't parse the JSON
                        console.log("throwing err");
                        throw new Error(response.status);
                    })
                    .then(({message}) => {
                        // Got valid JSON with error response, use it
                        console.log("throwing err with msg");
                        throw new Error(message || response.status);
                    });
            }
            // Successful response, parse the JSON and return the data
            console.log(response.json());
            
            // handleLoginResponse(response);
        })
        .catch(function(error) {
            console.log("erro handlingr");
            console.log(error);
        });

            //   console.log(promise.json());
        
    } catch (error) 
    {
        // showLoader(false);
        // console.log("error=> "+error);
        // console.log("error=> "+error.name);
        // console.log("error=> "+error.message);
        // console.log("error=> "+error.stack);
        // showMessage("Error in data fetching => "+error.value);
        // loginOffline(userName, password);
        // fetchOfflineActivities();
        // indexDbReadAll();

        //dummy login

        
    }

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

// function showMessage(message)
// {
//     if (!message) 
//     {
//         messageInd2.style.visibility = "hidden";
//     }
//     else{
//         messageInd2.style.visibility = "visible";
//         messageInd2.innerHTML = message;
//     }
// }
///////////INDEX DB MANAGEMENT///////////////////////////

// function indexDbInit()
// {
//     let dbname = "icalite_p";
//     let dbversion=1;

//     db = new Dexie(dbname);
//     db.version(dbversion).stores({
//         user: 'id'
//     });

//     //
//     // Put some data into it
//     //
//     const bulkArr=[
//                     {id: "0010", email: "test@gmail", pass:"test123", date_create:"12:01:00"},
//                     {id: "0011", email: "test2@gmail", pass:"test2123", date_create:"12:02:00"}
//                 ];
//     db.user.bulkPut(bulkArr)
//     .catch(Dexie.bulkError, function(error) {
//         //
//         // Finally don't forget to catch any error
//         // that could have happened anywhere in the
//         // code blocks above.
//         //
//         alert ("Ooops: " + error);
//     });


//     //prefixes of implementation that we want to test
//     // window.indexedDB = window.indexedDB || window.mozIndexedDB || 
//     // window.webkitIndexedDB || window.msIndexedDB;

//     // //prefixes of window.IDB objects
//     // window.IDBTransaction = window.IDBTransaction || 
//     // window.webkitIDBTransaction || window.msIDBTransaction;
//     // window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
//     // window.msIDBKeyRange

//     // if (!window.indexedDB) {
//     //     window.alert("Your browser doesn't support a stable version of IndexedDB.")
//     // }

//     // const userData = [
//     //     { id: "00-01", email: "jareer786@gmail.com", pass:"654321" }
//     // ];
    
//     // request = window.indexedDB.open("newDatabase", 1);

//     // request.onerror = function(event) {
//     //     console.log("error: ");
//     // };

//     // request.onsuccess = function(event) {
//     //     db = request.result;
//     //     console.log("success: "+ db);
//     // };

//     // request.onupgradeneeded = function(event) {
//     //     var db = event.target.result;
//     //     var objectStore = db.createObjectStore("user", {keyPath: "id"});
//     //     // var objectStore2 = db.createObjectStore("clients", {keyPath: "id"});
        
//     //     // for (var i in userData) {
//     //     //     // objectStore.add(userData[i]);
//     //     //     // objectStore2.add(userData[i]);
//     //     //     lastInsertedId++;
//     //     // }
//     // }
// }

// async function indexDbRead() {

//     await db.user.get('0010')
//     .then(function(user){

//         alert("user=>"+user.email);

//     })
//     .cathc(function(error)
//     {
//         alert("user not found");
//     });


//     // var transaction = db.transaction(["user"]);
//     // var objectStore = transaction.objectStore("user");
//     // var request = objectStore.get("00-03");
    
//     // request.onerror = function(event) {
//     //    alert("Unable to retrieve daa from database!");
//     // };
    
//     // request.onsuccess = function(event) {
//     //    // Do something with the request.result!
//     //    if(request.result) {
//     //       alert("Email: " + request.result.email + ", Pass: " + request.result.pass);
//     //    } else {
//     //       alert("Kenny couldn't be found in your database!");
//     //    }
//     // };
//  }
 
//  function indexDbReadAll() {
//      db.table("user").toArray()
//      .then(function (data)
//       {
//         container.innerHTML = data.map(mapUser).join('\n\n');
//          console.log(data);
//         }
//      );
//     // var objectStore = db.transaction("user").objectStore("user");
    
//     // objectStore.openCursor().onsuccess = function(event) {
//     //    var cursor = event.target.result;
       
//     //    if (cursor) {
//     //       alert("Email for id " + cursor.key + " is " + cursor.value.email + ", pass: " + cursor.value.pass);
//     //       cursor.continue();
//     //    } else {
//     //       alert("No more entries!");
//     //    }
//     // };
//  } 

//  function indexDbAdd(id, email, pass) {
//     db.user.put({id: id, email: email, pass:pass})
//     .catch(function(error) 
//     {
//         alert ("Ooops: " + error);
//     }); 




//     // var request = db.transaction(["user"], "readwrite")
//     // .objectStore("user")
//     // .add({ id: id, email: email, pass:pass });
//     // // .add({ id: "00-03", email: email, pass:pass });
    
//     // request.onsuccess = function(event) {
//     //     console.log("added");
//     //     lastInsertedId++;
//     // //    alert("Kenny has been added to your database.");
//     // };
    
//     // request.onerror = function(event) {
//     //     console.log("unable to add");
//     // //    alert("Unable to add data\r\nKenny is aready exist in your database! ");
//     // }
//  }
  
//  function indexDbRemove() {
//     var request = db.transaction(["user"], "readwrite")
//     .objectStore("user")
//     .delete("00-03");
    
//     request.onsuccess = function(event) {
//        alert("Kenny's entry has been removed from your database.");
//     };
//  }

 //--------------------INDEX DB MANAGEMENT-----------------------//

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