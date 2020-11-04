// let rootUrl="http://10.190.14.14:1700/IntellCareLite/";
// let rootUrl="http://203.99.60.222:1700/IntellCareLite/";//{live}
let rootUrl="https://203.99.60.222:1701/IntellCareLite/";//{live}
//objects//
const inp_username = document.getElementById('inp_uname');
const inp_password = document.getElementById('inp_pass');
const btn_addToHome = document.getElementById('btn_addToHome');
const container = document.getElementById('container');
const messageInd = document.getElementById('messageIndicator');
const notification1 = document.getElementById('notification-1');
const preLoader = document.getElementById('loader');
//--//
let lastInsertedId=0;
var db;
var request;
let befInstalPrompt;
// let isStandalone = false;
// let isIOS = false;
//--objects--//



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
    
    // btn_addToHome.addEventListener('click',addToHome);
    // btn_addToHome.addEventListener('click',addToHome);
    // btn_login.addEventListener('click',addToHome());
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
    if (checkIfIOS()) 
    {
        console.log("showing modal ios");

        document.getElementById('btn_iosModal').click();
        
    }
    else{
        console.log("showing modal");
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
    if (checkIsStandAlone()) 
    {
        btn_addToHome.style.visibility = "hidden";
    }
    else{
        btn_addToHome.style.visibility = "visible";

    }
}

function checkIsStandAlone() 
{
    let isStandalone = false;
    if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        console.log('standalone');      
        isStandalone = true;
    }
    else{
        console.log('browser tab');
        isStandalone = false;
    }

    
    return isStandalone;
}


//--add to home

//OS Handling//
function checkIfIOS() 
{
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    let ifIOS = false;

    if (macosPlatforms.indexOf(platform) !== -1) {
        ifIOS = true;
        console.log('Mac OS');
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        ifIOS = true;
        console.log('iOS');
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        ifIOS = false;
        console.log('Windows');
    } else if (/Android/.test(userAgent)) {
        ifIOS = false;
        console.log('Android');
    } else if (!os && /Linux/.test(platform)) {
        ifIOS = false;
        console.log('Linux');
    }

    return ifIOS;
}
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
            // if (userName=="interactive@ppl.com" && password=="987") 
            // {
            //     showLoader(false);
            //     // showMessage("Login successfull");

                // window.sessionStorage.setItem("userName",userName);
                // window.sessionStorage.setItem("password",password);

                // window.location.replace("page1.html");
            // } 
            // else 
            // {
            //     showLoader(false);
            //     showMessage("incorrect username or password");
            // }
            //--dummy login

            showMessage("processing. please wait.");
            showLoader(true);

            const url=rootUrl+"login";
            console.log("complete url=> "+url);

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
                            userName:userName,
                            password:password
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
                            throw new Error(response.status);
                        })
                        .then(({message}) => {
                            // Got valid JSON with error response, use it
                            throw new Error(message || response.status);
                        });
                }
                // Successful response, parse the JSON and return the data
                console.log(response.json());

                handleLoginResponse(response);
            });

                //   console.log("response 3:: "+promise.json());
            
        } catch (error) 
        {
            showLoader(false);
            // console.log("error=> "+error);
            // console.log("error=> "+error.name);
            // console.log("error=> "+error.message);
            // console.log("error=> "+error.stack);
            showMessage("Error in data fetching => "+error.value);
            // loginOffline(userName, password);
            // fetchOfflineActivities();
            // indexDbReadAll();

            //dummy login

            let response = {"person":{"personId":38995,"name":"Interactive Group","mrNo":"01-18-0042756","gender":"Male","age":"48 year(s)  1  month(s) 28 day(s) ( Adult)","number":null,"bloodGroup":"A-","firstName":null,"middleName":null,"lastname":null,"dob":null,"maritalStatus":null,"cnic":null,"email":null,"streetAddress":null,"district":null,"province":null,"city":null,"country":null,"base64EncodedPicture":"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"},"activities":[{"id":5,"name":"My Vitals","actions":[{"id":6,"activityId":5,"name":"Previous Vitals","contents":null},{"id":5,"activityId":5,"name":"View Vitals","contents":null}]},{"id":6,"name":"Medication","actions":[{"id":7,"activityId":6,"name":"Previous Medication","contents":null}]},{"id":7,"name":"Demographics","actions":[{"id":8,"activityId":7,"name":"View Demographics","contents":null},{"id":9,"activityId":7,"name":"Update Demographics","contents":null}]},{"id":4,"name":"Appointment Booking","actions":[{"id":10,"activityId":4,"name":"View Appointment","contents":null},{"id":4,"activityId":4,"name":"Appointment Acknowledge","contents":null}]},{"id":8,"name":"Patient Attachments","actions":[{"id":11,"activityId":8,"name":"View Attachments","contents":null}]}]};
            handleLoginResponse(response);
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

function handleLoginResponse(response)
{
    console.log("handleLoginResponse---------start-----------");
    // console.log("response=> "+(response));

    
//db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
        {person: "personId, name, mrNo, gender, age, number, bloodGroup, firstName, middleName, lastname, dob, maritalStatus, cnic, email, streetAddress, district, province, city, country, base64EncodedPicture",
        activities: "id, name, actions"
        }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
//--//

//db put//

    db.person.bulkPut(JSON.parse("["+ JSON.stringify(response.person) +"]"))
    .then(function(lastKey){

        window.sessionStorage.setItem("personId",response.person.personId);
        window.sessionStorage.setItem("name",response.person.name);
        window.sessionStorage.setItem("mrNo",response.person.mrNo);

        // window.location.replace("page1.html");
        // window.replace();
    })
    .catch(Dexie.bulkError, function(e) 
    {
        console.error("unable to login");
        showMessage("incorrect username or password");
        // alert ("person Ooops: " + error);
    });

////////////activities////////////////////////////////
    db.activities.bulkPut(response.activities)
    .then(function(lastKey){
        console.log("activities inserted");

        // window.sessionStorage.setItem("personId",response.person.personId);
        // window.sessionStorage.setItem("name",response.person.name);
        // window.sessionStorage.setItem("mrNo",response.person.mrNo);

        window.location.replace("page1.html");
        // window.replace();
    })
    .catch(Dexie.bulkError, function(e) 
    {
        console.error("unable to insert activities");
        // showMessage("incorrect username or password");
        // alert ("person Ooops: " + error);
    });




    console.log("handleLoginResponse---------end-----------");
}

//mapping
function mapActivities(activities)
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
            activities.actions.map(mapAction).join("\n\n");
            
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
function mapAction(actions)
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

//--//
function populateDrawerData()
{
    
    try {
        // let person = fetchPersonDetails();


        console.log("opening db");
        let dbname = "icalite_index";
        let dbversion=1;    
        db = new Dexie(dbname);
        db.version(dbversion).stores({person: "personId"});
        db.open().catch (function (err) {
            console.error('Failed to open db: ' + (err.stack || err));
        });

        console.log("fetching data from db");
        db.person.get(parseInt(window.sessionStorage.getItem("personId")), function(firstPerson)
        {
            console.log("fetching finished");

            try {
                let imageSrc = firstPerson.base64EncodedPicture;
                let name = firstPerson.name,
                 gender = firstPerson.gender,
                  number = firstPerson.number,
                   age = firstPerson.age,
                    bloodgrp = firstPerson.bloodGroup;
        
                const imgv_avt = document.getElementById('img_avt');
                const drawer_name = document.getElementById('drawer_name');
                const drawer_gender = document.getElementById('drawer_gender');
                const drawer_number = document.getElementById('drawer_number');
                const drawer_age = document.getElementById('drawer_age');
                const drawer_bloodgrp = document.getElementById('drawer_bloodgrp');

                //--//

                imgv_avt.src = "data:img/png;base64, "+imageSrc;

                drawer_name.innerHTML = name;
                drawer_gender.innerHTML = gender;
                drawer_number.innerHTML = number;
                drawer_age.innerHTML = age;
                drawer_bloodgrp.innerHTML = bloodgrp;
                
            } catch (error)
            {
                console.log("No data found");
            }


            // console.log(JSON.stringify(firstPerson));
            
        })
        .catch(error => {
            console.error(error.stack || error);
            console.log("fetching finished");
        });
        

        

        // let imageSrc = person.base64EncodedPicture;
        // let imageSrc = person;
        // console.log("source => "+imageSrc);

        // const imgv_avt = document.getElementById('img_avt');
        // imgv_avt.src = "data:img/png;base64, "+person.base64EncodedPicture;

    } catch (error) {
        console.log("image loading error:: "+error);
        console.log("image loading error:: "+error.message);
    }

    


}
//-----data handling


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

function fetchOfflineActivities(container2)
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

    container2.innerHTML = bulkArrAct.activities.map(mapActivities).join('\n\n');

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

async function fetchPersonDetails()
{
    // if (userName == "interactive@ppl.com" && password=="987") 
    // {

        // db.person.where({name: "Dr. INTERACTIVE Group", personId: "38995"}).first(friend => {

    
        
    // } else {
        
    //     console.log("no user found");
    //     showMessage("No User Found");

    // }
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
        dummy: 'id',
        person: 'personId',
        activities: 'id',
        actions: 'id'
    });

    //dummy
    const bulkArr=[
                    {
                        id: "0011",
                        name: "Interactive Group"
                    }
                ];
    db.dummy.bulkPut(bulkArr)
    .catch(Dexie.bulkError, function(error) {
        // alert ("dummy Ooops: " + error);
        console.log("dummy Ooops: " + error);
    });


    //Persons
    // const bulkArr=[
    //                 {
    //                     personId: "38995",
    //                     name: "Interactive Group", 
    //                     mrNo:"01-18-0042756", 
    //                     gender:"Male", 
    //                     age:"48 year(s)  1  month(s) 18 day(s) ( Adult)", 
    //                     number:"null", 
    //                     bloodGroup:"A-"
    //                 }
    //             ];
    // db.person.bulkPut(bulkArr)
    // .catch(Dexie.bulkError, function(error) {
    //     alert ("person Ooops: " + error);
    // });

    //Activities
    // const bulkArrAct=[
    //     {id: "5", name: "MY VITALS"},
    //     {id: "7", name: "Demographics"},
    //     {id: "6", name: "MEDICATION"},
    //     {id: "4", name: "APPOINTMENT BOOKING"}
    // ];
    // db.activities.bulkPut(bulkArrAct)
    // .catch(Dexie.bulkError, function(error) {
    // alert ("actvities Ooops: " + error);
    // });


    //actions
    // const bulkArrAction=[
    //     {
    //         id: "5",
    //         activityId: "5", 
    //         name:"View Vitals", 
    //         contents:"null"
    //     },
    //     {
    //         id: "6",
    //         activityId: "5", 
    //         name:"PREVIOUS VITALS", 
    //         contents:"null"
    //     },
    //     {
    //         id: "8",
    //         activityId: "7", 
    //         name:"View Demographics", 
    //         contents:"null"
    //     },
    //     {
    //         id: "9",
    //         activityId: "7", 
    //         name:"Update Demographics", 
    //         contents:"null"
    //     },
    //     {
    //         id: "7",
    //         activityId: "6", 
    //         name:"PREVIOUS MEDICATION", 
    //         contents:"null"
    //     },
    //     {
    //         id: "4",
    //         activityId: "4", 
    //         name:"APPOINTMENT_ACKNOWLEDGE", 
    //         contents:"null"
    //     },
    //     {
    //         id: "10",
    //         activityId: "4", 
    //         name:"VIEW APPOINTMENT", 
    //         contents:"null"
    //     },
    // ];
    // db.actions.bulkPut(bulkArrAction)
    // .catch(Dexie.bulkError, function(error) {
    // alert ("action Ooops: " + error);
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

/////////////////////////////////VIEW HANDLING//////////////////////////////
function initializeView()
{
    var sPath = window.location.pathname;
    //var sPage = sPath.substring(sPath.lastIndexOf('\\') + 1);
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    // alert(sPage);

    // console.log("spage => "+sPage);
    if(sPage == "")
    {
        // alert("getting vitals");

        // fetchVitals();
        console.log("index activity");

        const btn_login = document.getElementById('btn_login');
        btn_login.addEventListener('click',validateLogin);
        // const container2 = document.getElementById('container2');
        // fetchOfflineActivities(container2);

    }
    else {

        populateDrawerData();

        if(sPage == "page1.html")
        {
            // alert("getting vitals");
    
            // fetchVitals();
            console.log("fetching offline activities");
    
            const container2 = document.getElementById('container2');
            const btn_back = document.getElementById('btn_back');
    
            fetchOfflineActivities(container2);
    
            //--//
            btn_back.style.visibility = "hidden";
    
            // populateDrawerData();
            // btn_back.addEve
    
        }
        else if(sPage == "list_vitals.html")
        {
            // alert("getting vitals");
    
            fetchVitals();
    
            // const btn_back = document.getElementById('btn_back');
    
            // //--//
            // btn_back.addEventListener("click", function()
            // {
    
            //     console.log("back to list");
            //     // window.location.href="page1.html";
            // });
            
    
    
        }
        else if(sPage == "view_demographics.html")
        {
            alert("getting demograp");
        }

    }
    
    
    
    // else{
    //     try {
    //         console.log("index activity");

    //         const btn_login = document.getElementById('btn_login');
    //         btn_login.addEventListener('click',validateLogin);
    //     } catch (error) {
    //         console.log("error in view loading");
    //     }
    // }

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
//-------------------------------VIEW HANDLING----------------------------//





document.addEventListener('DOMContentLoaded', initialize);