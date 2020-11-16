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
// var vitals_selected;
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

async function fetchVitals(container2)
{
    try {


        // showMessage("processing. please wait.");
        // showLoader(true);

        const url=rootUrl+"viewVitals";
        console.log("complete url=> "+url);

        let personId=window.sessionStorage.getItem("personId");
        let actionId="5";

        //dummyy input
        const bulkArrAct = JSON.parse(`{
            "detail": "Data Returnd",
            "status": "Ok 200",
            "object": null,
            "data": [
                {
                    "vitalId": 43308,
                    "vitalDate": 1604499063908,
                    "pulse": "77",
                    "bpSystolic": "55",
                    "bpDistolic": "45",
                    "tmprature": "75",
                    "respirationRate": "52",
                    "height": "65",
                    "weight": "75",
                    "spo2": "20",
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": "10",
                    "painScale": null,
                    "remarks": "Testing remarks",
                    "bmi": null,
                    "personId": null
                },
                {
                    "vitalId": 43307,
                    "vitalDate": 1604433389296,
                    "pulse": "77",
                    "bpSystolic": "55",
                    "bpDistolic": "45",
                    "tmprature": "75",
                    "respirationRate": "52",
                    "height": "65",
                    "weight": "75",
                    "spo2": "20",
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": "10",
                    "painScale": null,
                    "remarks": "Testing remarks",
                    "bmi": null,
                    "personId": null
                },
                {
                    "vitalId": 43306,
                    "vitalDate": 1604432801457,
                    "pulse": "77",
                    "bpSystolic": "55",
                    "bpDistolic": "45",
                    "tmprature": "75",
                    "respirationRate": "52",
                    "height": "65",
                    "weight": "75",
                    "spo2": "20",
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": "10",
                    "painScale": null,
                    "remarks": "Testing remarks",
                    "bmi": null,
                    "personId": null
                },
                {
                    "vitalId": 43305,
                    "vitalDate": 1604430472220,
                    "pulse": "77",
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": null,
                    "respirationRate": null,
                    "height": null,
                    "weight": null,
                    "spo2": null,
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": null,
                    "painScale": null,
                    "remarks": null,
                    "bmi": null,
                    "personId": null
                },
                {
                    "vitalId": 43287,
                    "vitalDate": 1603214472998,
                    "pulse": "60",
                    "bpSystolic": "80",
                    "bpDistolic": "120",
                    "tmprature": "40",
                    "respirationRate": "110",
                    "height": "8",
                    "weight": "40",
                    "spo2": "1",
                    "bloodSugarR": "5",
                    "blooSugarF": "55",
                    "gir": "5",
                    "painScale": "1",
                    "remarks": "5",
                    "bmi": "6250",
                    "personId": null
                },
                {
                    "vitalId": 40904,
                    "vitalDate": 1544131493267,
                    "pulse": null,
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": null,
                    "respirationRate": null,
                    "height": null,
                    "weight": null,
                    "spo2": null,
                    "bloodSugarR": null,
                    "blooSugarF": "40",
                    "gir": null,
                    "painScale": null,
                    "remarks": null,
                    "bmi": "0",
                    "personId": null
                },
                {
                    "vitalId": 40903,
                    "vitalDate": 1544131493266,
                    "pulse": null,
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": null,
                    "respirationRate": "60",
                    "height": null,
                    "weight": "2",
                    "spo2": "98",
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": null,
                    "painScale": null,
                    "remarks": null,
                    "bmi": "0",
                    "personId": null
                },
                {
                    "vitalId": 40902,
                    "vitalDate": 1544131493264,
                    "pulse": "34",
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": "40",
                    "respirationRate": null,
                    "height": null,
                    "weight": null,
                    "spo2": null,
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": null,
                    "painScale": null,
                    "remarks": null,
                    "bmi": "0",
                    "personId": null
                },
                {
                    "vitalId": 40901,
                    "vitalDate": 1544131493255,
                    "pulse": null,
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": null,
                    "respirationRate": null,
                    "height": null,
                    "weight": null,
                    "spo2": null,
                    "bloodSugarR": "40",
                    "blooSugarF": null,
                    "gir": null,
                    "painScale": null,
                    "remarks": null,
                    "bmi": "0",
                    "personId": null
                },
                {
                    "vitalId": 40900,
                    "vitalDate": 1544131088840,
                    "pulse": null,
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": null,
                    "respirationRate": null,
                    "height": null,
                    "weight": "3",
                    "spo2": null,
                    "bloodSugarR": "40",
                    "blooSugarF": null,
                    "gir": null,
                    "painScale": "6",
                    "remarks": null,
                    "bmi": "0",
                    "personId": null
                },
                {
                    "vitalId": 40677,
                    "vitalDate": 1541600804409,
                    "pulse": "40",
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": null,
                    "respirationRate": null,
                    "height": null,
                    "weight": null,
                    "spo2": null,
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": null,
                    "painScale": null,
                    "remarks": null,
                    "bmi": "0",
                    "personId": null
                },
                {
                    "vitalId": 40675,
                    "vitalDate": 1541533313754,
                    "pulse": "40",
                    "bpSystolic": null,
                    "bpDistolic": null,
                    "tmprature": null,
                    "respirationRate": null,
                    "height": null,
                    "weight": null,
                    "spo2": null,
                    "bloodSugarR": null,
                    "blooSugarF": null,
                    "gir": null,
                    "painScale": null,
                    "remarks": null,
                    "bmi": "0",
                    "personId": null
                }
            ]
        }`);
        // console.log("data=>");
        // console.log(bulkArrAct.data);

        saveVitalsToOffline(bulkArrAct.data);
        // container2.innerHTML = bulkArrAct.data.map(mapVitals).join('\n\n');

        
        
        //--dummy input

        //   //post
        var response = await fetch(url, 
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
        });

        if (!response.ok) {
            console.log("unsuccessfull");
            fetchOfflineVitals(container2);
        }
        else{
            console.log("successfull");
            // console.log("--------------response.json()----------------------");
            // console.log(response.json());
            response.json()
            .then(data => {                
                console.log("--------------data after response.json()----------------------");
                // console.log(data);
                saveVitalsToOffline(data);
                container2.innerHTML = data.data.map(mapVitals).join('\n\n');
            });
            
        }
        
    } catch (error) 
    {
        console.log("error => "+error.message);  
        fetchOfflineVitals(container2);        
    }

}

async function fetchMedications(container2)
{
    try {


        // showMessage("processing. please wait.");
        // showLoader(true);

        const url=rootUrl+"viewMedications";
        console.log("complete url=> "+url);

        let personId=window.sessionStorage.getItem("personId");
        let actionId="7";

        //dummyy input
        const bulkArrAct = JSON.parse(`{
            "detail": "Data Returnd",
            "status": "Ok 200",
            "object": null,
            "data": [
                {
                    "medicationId": "1001",
                    "medicine": "Panadol Cf (Beecham) Tablets",
                    "treatmentDate": 1543849938966,
                    "doctor": "Interactive Group",
                    "diagnosis": "Cholera due to Vibrio cholerae 01, biovar eltor",
                    "dosage": "1",
                    "frequency": null,
                    "route": null,
                    "startDate": 1543813200000,
                    "endDate": 1543813200000,
                    "remarks": null
                }
            ]
        }`);
        // console.log("data=>");
        // console.log(bulkArrAct.data);
        saveMedicationsToOffline(bulkArrAct.data);
        // container2.innerHTML = bulkArrAct.data.map(mapVitals).join('\n\n');

        
        
        //--dummy input

        //   //post
        var response = await fetch(url, 
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
        });

        if (!response.ok) {
            console.log("unsuccessfull");
            fetchOfflineMedications(container2);
        }
        else{
            console.log("successfull");
            // console.log("--------------response.json()----------------------");
            // console.log(response.json());
            response.json()
            .then(data => {                
                console.log("--------------data after response.json()----------------------");
                // console.log(data);
                saveMedicationsToOffline(data);
                mapMedications(result, container2);
                // container2.innerHTML = data.data.map(mapMedications).join('\n\n');
            });
            
        }
        
    } catch (error) 
    {
        console.log("error => "+error.message);  
        fetchOfflineMedications(container2);        
    }

}


async function fetchDemographics()
{
    try {


        // showMessage("processing. please wait.");
        // showLoader(true);

        const url=rootUrl+"viewDemographics";
        console.log("complete url=> "+url);

        let personId=window.sessionStorage.getItem("personId");
        let actionId="8";

        //   //post
        var response = await fetch(url, 
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
        });

        if (!response.ok) {
            console.log("unsuccessfull");
            fetchOfflineDemographics();
        }
        else{
            console.log("successfull");
            // console.log("--------------response.json()----------------------");
            // console.log(response.json());
            response.json()
            .then(data => {                
                console.log("--------------data after response.json()----------------------");
                console.log(data);
                // container2.innerHTML = data.data.map(mapVitals).join('\n\n');
                populateDemographicsData(data.object);
            });
            
        }
        
    } catch (error) 
    {
        console.log("error => "+error.message);  
        fetchOfflineDemographics();        
    }

}
async function fetchDemographicsForUpdate()
{
    try {


        // showMessage("processing. please wait.");
        // showLoader(true);

        const url=rootUrl+"viewDemographics";
        console.log("complete url=> "+url);

        let personId=window.sessionStorage.getItem("personId");
        let actionId="8";

        //   //post
        var response = await fetch(url, 
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
        });

        if (!response.ok) {
            console.log("unsuccessfull");
            fetchOfflineDemographics();
        }
        else{
            console.log("successfull");
            // console.log("--------------response.json()----------------------");
            // console.log(response.json());
            response.json()
            .then(data => {                
                console.log("--------------data after response.json()----------------------");
                console.log(data);
                // container2.innerHTML = data.data.map(mapVitals).join('\n\n');
                populateDemographicsData(data.object);
            });
            
        }
        
    } catch (error) 
    {
        console.log("error => "+error.message);  
        fetchOfflineDemographics();        
    }

}

async function fetchAppointments(container2)
{
    console.log("ftch appointments=> starting");

    try {


        // showMessage("processing. please wait.");
        // showLoader(true);

        const url=rootUrl+"viewAppointments";
        console.log("complete url=> "+url);

        let personId=window.sessionStorage.getItem("personId");
        let actionId="10";

        ////dummy data
        const bulkArrAct = JSON.parse(`{
            "detail": "Data Returnd",
            "status": "Ok 200",
            "object": null,
            "data": [
                {
                    "appointmentId": 182347,
                    "personId": null,
                    "appointmentDate": 1617024840000,
                    "doctorname": "Interactive Group",
                    "speciality": "Skin",
                    "specialityId": null,
                    "type": "First Visit",
                    "doctorShift": null,
                    "slotDuration": null,
                    "remarks": null,
                    "complaint": "Fever",
                    "doctorId": null,
                    "priorityId": null,
                    "status": "Scheduled"
                },
                {
                    "appointmentId": 182346,
                    "personId": null,
                    "appointmentDate": 1617057240000,
                    "doctorname": "Interactive Group",
                    "speciality": "Skin",
                    "specialityId": null,
                    "type": "First Visit",
                    "doctorShift": null,
                    "slotDuration": null,
                    "remarks": null,
                    "complaint": "Fever",
                    "doctorId": null,
                    "priorityId": null,
                    "status": "Scheduled"
                },
                {
                    "appointmentId": 182345,
                    "personId": null,
                    "appointmentDate": 1617057240000,
                    "doctorname": "Interactive Group",
                    "speciality": "Skin",
                    "specialityId": null,
                    "type": "First Visit",
                    "doctorShift": null,
                    "slotDuration": null,
                    "remarks": null,
                    "complaint": "Fever",
                    "doctorId": null,
                    "priorityId": null,
                    "status": "Scheduled"
                },
                {
                    "appointmentId": 182344,
                    "personId": null,
                    "appointmentDate": null,
                    "doctorname": "Interactive Group",
                    "speciality": "Skin",
                    "specialityId": null,
                    "type": "First Visit",
                    "doctorShift": null,
                    "slotDuration": null,
                    "remarks": null,
                    "complaint": "Fever",
                    "doctorId": null,
                    "priorityId": null,
                    "status": "Scheduled"
                }
            ]
        }`);
        saveAppointmentsToOffline(bulkArrAct.data);
        //--dummy data--//

        //   //post
        var response = await fetch(url, 
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
        });

        if (!response.ok) {
            console.log("unsuccessfull");
            fetchOfflineAppointments(container2);
        }
        else{
            console.log("successfull");
            // console.log("--------------response.json()----------------------");
            // console.log(response.json());
            response.json()
            .then(data => {                
                // console.log("--------------data after response.json()----------------------");
                // console.log(data);
                saveAppointmentsToOffline(data);
                container2.innerHTML = data.data.map(mapAppointments).join('\n\n');
            });
            
        }
        
    } catch (error) 
    {
        console.log("error => "+error.message);  
        fetchOfflineAppointments(container2)      
    }

}
async function fetchReports(container2)
{
    console.log("ftch reports=> starting");

    try {


        // showMessage("processing. please wait.");
        // showLoader(true);

        const url=rootUrl+"viewAttachments";
        console.log("complete url=> "+url);

        let personId=window.sessionStorage.getItem("personId");
        let actionId="11";

        //   //post
        var response = await fetch(url, 
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
        });

        if (!response.ok) {
            console.log("unsuccessfull");
            fetchOfflineReports(container2);
        }
        else{
            console.log("successfull");
            // console.log("--------------response.json()----------------------");
            // console.log(response.json());
            response.json()
            .then(data => {                
                // console.log("--------------data after response.json()----------------------");
                // console.log(data);
                container2.innerHTML = data.data.map(mapReports).join('\n\n');
            });
            
        }
        
    } catch (error) 
    {
        console.log("error => "+error.message);  
        fetchOfflineReports(container2)      
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

        window.location.replace("dash_patient.html");
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
// console.log("");
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
                    <a href="#" onclick="goToVitalNew()">
                        <i class="fab font-13 fa fa-user color-blue2-dark"></i>
                        <span>${actions.name}</span>
                        <i class="fa fa-angle-right"></i>
                    </a>
                </div>
            </div>`;
    }
    else if (actions.id == "7") //medication
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToMedicationView()">
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
    else if (actions.id == "11") 
    {
        return `<div class="collapse" id="collapse-${actions.activityId}">
                <div class="list-group list-custom-small pl-3">
                    <a href="#" onclick="goToReportsView()">
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

function mapVitals(vitals)
{

    let vitalDate = new Date(vitals.vitalDate);

    let
    // day = vitalDate.getDay(),
     dd = vitalDate.getDate(),
     mm = vitalDate.getMonth(), 
     yy = vitalDate.getFullYear(), 
     hh = vitalDate.getHours(),
    min = vitalDate.getMinutes(), 
    sec = vitalDate.getSeconds(),
    meridian="AM";

    // var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if(hh<12)
    {
        meridian = "PM";
    }
    else{
        meridian = "AM";   
    }

    let date = dd+"-"+months[mm]+"-"+yy,
    time = hh+":"+min+":"+sec+" "+meridian;

    
    
    // console.log(vitals);
    
    let dataRow = `<tr>
                        <td class="color-green1-dark">`+date+`</td>
                        <td class="color-green1-dark">`+time+`</td>
                        <td><i onclick='setSelectedVitalDetails(${vitals.vitalId})' title="view details" class="fa fa-arrow-right rotate-45 color-green1-dark"></a></td>
                    </tr>`;   
    
    
    

    return dataRow;
}







// (function() {
//     'use strict';
//     var tabs = [
        // {paneId: 'tab1', title_medi: '1', content_medi: '<div class="row mb-3 mt-4"> <h5 class="col-4 text-left font-15">Medicene : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">Panadol CF Tablets</h5> <h5 class="col-4 text-left font-15">Treatment Date : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">13-Oct-2020</h5> <h5 class="col-4 text-left font-15">Doctor : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">Dr. Farhan</h5> <h5 class="col-4 text-left font-15">Diagnosis : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">Paratyphoid fever C</h5> <h5 class="col-4 text-left font-15">Dosage : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">2+2+2+2 - Tablet</h5> <h5 class="col-4 text-left font-15">Frequency : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">^ Hourly</h5> <h5 class="col-4 text-left font-15">Route : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">Oral</h5> <h5 class="col-4 text-left font-15">Start Date : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">05-May-2020</h5> <h5 class="col-4 text-left font-15">End Date : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">08-May-2020</h5> <h5 class="col-4 text-left font-15">Doctor Remarks : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">Recommended Bed Rest 8 Days Take Leave From Office Work From Home </h5> </div>', active_tab: true, disabled: false},
//         {paneId: 'tab2', title_medi: '2', content_medi: 'Index 2 Content', active_tab: false, disabled: false}
    
//   ],
//   lastTabId = 11;
//   $(activate);
//   function activate() {
//     $('.tabs-inside-here').scrollingTabs({
//       tabs: tabs, // required,
//       propPaneId: 'paneId', // optional - pass in default value for demo purposes
//       propTitle: 'title_medi', // optional - pass in default value for demo purposes
//       propActive: 'active_tab', // optional - pass in default value for demo purposes
//       propDisabled: 'disabled', // optional - pass in default value for demo purposes
//       propContent: 'content_medi', // optional - pass in default value for demo purposes
//       scrollToTabEdge: false, // optional - pass in default value for demo purposes
//       disableScrollArrowsOnFullyScrolled: false // optional- pass in default value for demo purposes
//     });
//   }
// }());














function mapMedications(medication, container2)
{
    // console.log("mapping medications");
    // console.log(medication);
    // console.log("00=> ");
    // console.log("lenght=> "+medication.length);

    var tabs=[];
    for (let i = 0; i < medication.length; i++) 
    {
        // const element = array[i];
        // console.log(i+"=> ");
        // console.log(medication[i]);

        var obj = medication[i];

        let treatmentDate = new Date(obj.treatmentDate);
        let sDate = new Date(obj.startDate);
        let eDate = new Date(obj.endDate);

        tabs.push({paneId: (i+1), title_medi: '1', content_medi: '<div class="row mb-3 mt-4"> <h5 class="col-4 text-left font-15">Medicene : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+obj.medicine+'</h5> <h5 class="col-4 text-left font-15">Treatment Date : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+treatmentDate.toDateString()+'</h5> <h5 class="col-4 text-left font-15">Doctor : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+obj.doctor+'</h5> <h5 class="col-4 text-left font-15">Diagnosis : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+obj.diagnosis+'</h5> <h5 class="col-4 text-left font-15">Dosage : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+obj.dosage+'</h5> <h5 class="col-4 text-left font-15">Frequency : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+obj.frequency+'</h5> <h5 class="col-4 text-left font-15">Route : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+obj.route+'</h5> <h5 class="col-4 text-left font-15">Start Date : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+sDate.toDateString()+'</h5> <h5 class="col-4 text-left font-15">End Date : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+eDate.toDateString()+'</h5> <h5 class="col-4 text-left font-15">Doctor Remarks : </h5> <h5 class="col-8 text-right font-14 opacity-60 font-400">'+obj.remarks+' </h5> </div>', active_tab: true, disabled: false});


        
    }

    // console.log(tabs);
    // console.log(tabs[0]);
    // console.log(tabs[0].content_medi);



    container2.innerHTML = tabs[0].content_medi;
    
    
    
    // scrollingTabs({
    //     tabs: tabs, // required,
    //     propPaneId: 'paneId', // optional - pass in default value for demo purposes
    //     propTitle: 'title_medi', // optional - pass in default value for demo purposes
    //     propActive: 'active_tab', // optional - pass in default value for demo purposes
    //     propDisabled: 'disabled', // optional - pass in default value for demo purposes
    //     propContent: 'content_medi', // optional - pass in default value for demo purposes
    //     scrollToTabEdge: false, // optional - pass in default value for demo purposes
    //     disableScrollArrowsOnFullyScrolled: false // optional- pass in default value for demo purposes
    // });






    // let vitalDate = new Date(vitals.vitalDate);

    // let
    // // day = vitalDate.getDay(),
    //  dd = vitalDate.getDate(),
    //  mm = vitalDate.getMonth(), 
    //  yy = vitalDate.getFullYear(), 
    //  hh = vitalDate.getHours(),
    // min = vitalDate.getMinutes(), 
    // sec = vitalDate.getSeconds(),
    // meridian="AM";

    // // var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // if(hh<12)
    // {
    //     meridian = "PM";
    // }
    // else{
    //     meridian = "AM";   
    // }

    // let date = dd+"-"+months[mm]+"-"+yy,
    // time = hh+":"+min+":"+sec+" "+meridian;

    
    
    // // console.log(vitals);
    
    // let dataRow = `<tr>
    //                     <td class="color-green1-dark">`+date+`</td>
    //                     <td class="color-green1-dark">`+time+`</td>
    //                     <td><i onclick='setSelectedVitalDetails(${vitals.vitalId})' title="view details" class="fa fa-arrow-right rotate-45 color-green1-dark"></a></td>
    //                 </tr>`;   
    
    
    

    // return dataRow;
}
function mapAppointments(appointments)
{

    let appointmentDate = new Date(appointments.appointmentDate);
    let date, time;

    if(appointments.appointmentDate == "" || appointments.appointmentDate==null)
    {
        // date = "~";
        return `<tr>
                        <th scope="row">${appointments.doctorname}</th>
                        <td class="color-green1-dark">~</td>
                        <td><i onclick='setSelectedAppointmentDetails(${appointments.appointmentId})' title="view details" class="fa fa-arrow-right rotate-45 color-green1-dark"></i></td>
                    </tr>`;   
    }
    else{

        let
    //  day = vitalDate.getDay(),
        dd = appointmentDate.getDate(),
        mm = appointmentDate.getMonth(), 
        yy = appointmentDate.getFullYear(), 
        hh = appointmentDate.getHours(),
        min = appointmentDate.getMinutes(), 
        sec = appointmentDate.getSeconds(),
        meridian="AM";

        // var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if(hh<12)
        {
            meridian = "PM";
        }
        else{
            meridian = "AM";   
        }

        date = dd+"-"+months[mm]+"-"+yy;
        time = hh+":"+min+":"+sec+" "+meridian;

        return `<tr>
                    <th scope="row">${appointments.doctorname}</th>
                    <td class="color-green1-dark">`+date+`, `+time+`</td>
                    <td><i onclick='setSelectedAppointmentDetails(${appointments.appointmentId})' title="view details" class="fa fa-arrow-right rotate-45 color-green1-dark"></i></td>
                </tr>`;   

        // date = date.toDateString();
    }

    
    

    
}

function mapReports(reports)
{

    let date = new Date(reports.insertDate);
    let name = reports.displayName;
    let type = reports.mimeType;
    let fileStr = reports.encodedFile;

    

    let dataRow = `<tr>
                <td class="color-green1-dark">${reports.mimeType}</td>
                <td class="color-green1-dark">${reports.displayName}</td>
                <td class="color-green1-dark">${reports.mimeType}</td>
                <td class="color-green1-dark">`+date.toDateString()+`</td>
                <td><i onclick="viewReport('`+name+`','`+type+`', '`+fileStr+`')" class="fa fa-eye color-green1-dark"></i></td>
            </tr>`;   
    
    
    

    return dataRow;
}

function populateDemographicsData(demograph)
{
    console.log("populating demo data");
    console.log(demograph);

    let demogrp_name = document.getElementById("demogrp_name");
    let demogrp_gender = document.getElementById("demogrp_gender");
    let demogrp_dob = document.getElementById("demogrp_dob");
    let demogrp_maritalstat = document.getElementById("demogrp_maritalstat");
    let demogrp_bloodgrp = document.getElementById("demogrp_bloodgrp");
    let demogrp_cnic = document.getElementById("demogrp_cnic");
    let demogrp_email = document.getElementById("demogrp_email");
    let demogrp_phone = document.getElementById("demogrp_phone");
    let demogrp_address = document.getElementById("demogrp_address");
    

    demogrp_name.innerHTML = demograph.firstName+" "+demograph.lastname;
    demogrp_gender.innerHTML = demograph.gender;
    demogrp_dob.innerHTML = demograph.dob;
    demogrp_maritalstat.innerHTML = demograph.maritalStatus;
    demogrp_bloodgrp.innerHTML = demograph.bloodGroup;
    demogrp_cnic.innerHTML = demograph.cnic;
    demogrp_email.innerHTML = demograph.email;
    demogrp_phone.innerHTML = demograph.number;
    demogrp_address.innerHTML = demograph.streetAddress;
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
                            "name": "Add Vitals",
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
                    "name": "My Medication",
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
                    "name": "My Demographics",
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
                    "name": "My Appointments",
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
                            "name": "Add Appointment",
                            "contents": null
                        }
                    ]
                },
                {
                    "id": 8,
                    "name": "My Reports",
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

    
}

async function fetchOfflineVitals(container2)
{

    // const bulkArrAct = JSON.parse();

    //db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                vitals: "vitalId"
            }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//

    await db.vitals.toArray()
    .then(function (result) {
        // console.log("result => ");
        // console.log(result);
        container2.innerHTML = result.map(mapVitals).join('\n\n');

        // alert("view result");
    })
    .catch(function(error)
    {
        console.log("error in offline vital fetch");

        // alert("view result");
        // alert("user not found");
    });
    // console.log("get response =>");
    // console.log(resp);
    

    // container2.innerHTML = bulkArrAct.data.map(mapVitals).join('\n\n');

    
}
async function fetchOfflineMedications(container2)
{

    // const bulkArrAct = JSON.parse();

    //db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                medications: "medicationId"
            }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//

    await db.medications.toArray()
    .then(function (result) {
        // console.log("result => ");
        // console.log(result);
        mapMedications(result, container2);
        // container2.innerHTML = result.map(mapMedications).join('\n\n');

        // alert("view result");
    })
    .catch(function(error)
    {
        console.log("error in offline medication fetch");

        // alert("view result");
        // alert("user not found");
    });
    // console.log("get response =>");
    // console.log(resp);
    

    // container2.innerHTML = bulkArrAct.data.map(mapVitals).join('\n\n');

    
}

async function fetchOfflineVitalsWhere()
{


    // vitalId = window.sessionStorage.getItem("vitalId");
    let vitalId = parseInt(window.sessionStorage.getItem("vitalId"));
    // console.log("fetchOfflineVitalsWhere; vitalId => "+vitalId);

    //db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                vitals: "vitalId"
            }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//

    await db.vitals.where({vitalId:vitalId})
    .first(vitals => {
        // console.log("result where => ");
        // console.log(vitals);

        populateVitalDetails(vitals);

    })
    .catch(function (error) {
        console.log("error in offline vital fetch");
    });





    // await db.vitals.toArray()
    // .then(function (result) {
        
        // console.log("result[0] => ");
        // console.log(result[0]);
    //     populateVitalDetails(result[0]);
    //     // return result[0];
    //     // container2.innerHTML = result.map(mapVitals).join('\n\n');

    //     // alert("view result");
    // })
    // .catch(function(error)
    // {
    //     console.log("error in offline vital fetch");
    //     // return null;
    //     // alert("view result");
    //     // alert("user not found");
    // });
    // console.log("get response =>");
    // console.log(resp);
    

    // container2.innerHTML = bulkArrAct.data.map(mapVitals).join('\n\n');

    
}

function fetchOfflineDemographics()
{

    const bulkArrAct = JSON.parse(`{
        "detail": "Data Returnd",
        "status": "Ok 200",
        "object": {
            "personId": 38995,
            "name": null,
            "mrNo": null,
            "gender": "Male",
            "age": null,
            "number": null,
            "bloodGroup": "A-",
            "firstName": "Interactive",
            "middleName": null,
            "lastname": "Group",
            "dob": 84513600000,
            "maritalStatus": "Marride",
            "cnic": "00000-0010000-0",
            "email": null,
            "streetAddress": "HOUSE NO. 278-A, TAPALI STREET",
            "district": "Karachi West",
            "province": "Sindh",
            "city": "Karachi West",
            "country": "Pakistan",
            "base64EncodedPicture": null,
            "designation": null,
            "speciality": null,
            "qualification": null,
            "languages": null,
            "experiance": null,
            "hospital": null
        },
        "data": null
    }`);
    populateDemographicsData(bulkArrAct.object);
    // container2.innerHTML = bulkArrAct.data.map(mapDemographics).join('\n\n');

    
}


async function fetchOfflineAppointments(container2)
{

    // const bulkArrAct = JSON.parse();

    //db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                appointments: "appointmentId"
            }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//

    await db.appointments.toArray()
    .then(function (result) {
        // console.log("result => ");
        // console.log(result);
        container2.innerHTML = result.map(mapAppointments).join('\n\n');

        // alert("view result");
    })
    .catch(function(error)
    {
        console.log("error in offline vital fetch");

        // alert("view result");
        // alert("user not found");
    });
    // console.log("get response =>");
    // console.log(resp);
    

    // container2.innerHTML = bulkArrAct.data.map(mapVitals).join('\n\n');

    
}

async function fetchOfflineAppointmentsWhere()
{
    appointmentId = parseInt(window.sessionStorage.getItem('appointmentId'));

    console.log("fetch offline appointment => ");
    console.log(appointmentId);
    // const bulkArrAct = JSON.parse();

    //db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                appointments: "appointmentId"
            }
        );
    await db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//


    await db.appointments.where({appointmentId:appointmentId})
    .first(appointments => {
        // console.log("result where => ");
        // console.log(appointments);

        populateAppointmentDetails(appointments);

    })
    .catch(function (error) {
        console.log("error in offline appointments fetch");
    });





    // await db.appointments.where('appointmentId').equals(appointmentId)
    // .then(function(result){
    //     console.log("result where => ");
    //     console.log(result);

    //     populateAppointmentDetails(result);

    // })
    // .catch(function (error) {
    //     console.log("error in offline appointment fetch");
    // });

    
}


function fetchOfflineReports(container2)
{

    const bulkArrAct = JSON.parse(`{
        "detail": "Data Returnd",
        "status": "Ok 200",
        "object": null,
        "data": [
            {
                "attchmentId": 288371,
                "mimeType": "jpg",
                "displayName": null,
                "insertDate": 1603463632763,
                "fileName": "index-1603431232794",
                "encodedFile": "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"
            },
            {
                "attchmentId": 288340,
                "mimeType": "docx",
                "displayName": "Patient Chart",
                "insertDate": 1603214476453,
                "fileName": "Birt%20Patient%20Chart1603182074970",
                "encodedFile": "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"
            },
            {
                "attchmentId": 288280,
                "mimeType": "pdf",
                "displayName": "External Referrals",
                "insertDate": 1602259547769,
                "fileName": "Birt%20External%20Referral%20Report1602227147605",
                "encodedFile": "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"
            },
            {
                "attchmentId": 288279,
                "mimeType": "docx",
                "displayName": "Patient Chart",
                "insertDate": 1602259547768,
                "fileName": "Birt%20Patient%20Chart1602227146860",
                "encodedFile": "UEsDBBQACAgIALdgSVEAAAAAAAAAAAAAAAARAAAAZG9jUHJvcHMvY29yZS54bWxlz01Ow0AMBeCrjGbfOGGBUJSkO9Ys4ADGY9KB+ZPtIrg9Q4u6YednW5/0luNXTu6TRWMtq5+G0TsuVEMs++pfnh8PD96pYQmYauHVf7P647ZQm6kKP0ltLBZZXXeKztRWfzJrM4DSiTPq0D9KP75VyWg9yg4N6QN3hrtxvIfMhgEN4Rc8tJvo/8hAN7KdJV2AQMCJMxdTmIYJ/LYEmkkYrQpcgkVL7K5zYCWJzXrH60LPr+9M1gP8a7L9AFBLBwgBSfn6vAAAABQBAABQSwMEFAAICAgAt2BJUQAAAAAAAAAAAAAAAA8AAAB3b3JkL3N0eWxlcy54bWx9Uk1v2zAM/SuG7qncHYY2qFsEHYL2sKBYE+zMSHQsTB+eqNTNfv1oK06Xjy4Xk3yPj4+M7h7enS3eMJIJvhLXV6Uo0Kugjd9UYrWcT25EQQm8Bhs8VmKHJB7u77oppZ1FKrjd07SrRJNSO5WSVIMO6Cq06BmrQ3SQOI0b2YWo2xgUErG6s/JLWX6VDowXvaAO6hvWsLWJ+jS+xH26z4bPPPhERTcFUsZUYmkce1hgV/wIDrxgBIHSjAxcBJuZp8ttis7Lsh9pwW8YfwNbCfST1evxkD/N5HHRl9ZGszLEyeusb5R7z/J0k/aQZdbJ2sNZWS7tWr62aiCCShj7CQP0rCvxxFi0xv8a7ubB4WjwA5H/XG07wv3dLWZMBRviCJT8q+sT38O8c08J1qzBqc62+dUcuVv2+KL/3+2Zv1wuBkq2sTUv0YRo0m7k3N5mhNCZJ6M1+kz0jeH4Z4N+RaiH2u/58LyGOK1t3paDZ69ZjR9lKQ629TuIkfiI1n6HzA7t51SLdcrodXlzAV+HlIL7vD+aTfMfAXlsRh6W+Dj+GNH9X1BLBwicRI4+owEAAKoDAABQSwMEFAAICAgAt2BJUQAAAAAAAAAAAAAAABEAAAB3b3JkL3NldHRpbmdzLnhtbEWOQU4EIRBFr0Jq74AujOkMM4kLL6AeoAJlNxGqCIWN4+ml3bj8ef/9/PP1u2SzU9Mk7OH+5MAQB4mJVw/vby93T2C0I0fMwuThRgrXy3ksSr3Pkpo5wLoMD1vvdbFWw0YF9SSVeLIPaQX7jG21Q1qsTQKpTrVk++Dcoy2YGI7JH5FixlKpBeI+3zgH9gAxac14e8bwuTb54vi6YaU/tCca09kxe6gtcT8M+3/v8gtQSwcI4HCPm68AAADiAAAAUEsDBBQACAgIALdgSVEAAAAAAAAAAAAAAAAQAAAAbWVkaWEvaW1hZ2UxLlBORwFQC6/0iVBORw0KGgoAAAANSUhEUgAAAG4AAABzCAYAAAB5Eze+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAArlSURBVHhe7Z1NbE3PG8fnj6AVFSSqbUJuJCLS2JWwKCsaCyJCakMjQipCIkRDuiGosGBDIxK1UYmIlEhIaLDgip0r4mWhFuolFanQIujvfOf33P6P+5s558x5mTNz2k/ypDO35+Xe+9x5ZuaZ55nzvyEHNop1jKG/o1iGtMU9ffqUHT58mFVWVrKJEyey8ePHs0mTJrGKigpWXl7OJkyYwP+OGzeOjR07ls5i/P9Fvnz5QiXGfv/+zX79+sXLAwMDrL+/n/3584d9+/Zt+LifP3+ywcFBXv/+/Ts/DuBYMGXKFDZt2jT+F/eZM2cOmzlzJsvlcqympoa/vxEDFCeiq6sLCrVKli5dOtTW1jZUKBToU2SXTCnOLbW1tUMdHR30abKH1FR+/PiRXblyhZstmDOYK7zW29vL7t+/T0eZD0zqzZs32eLFi+mVbBBqVAlFPnnyhG3dupX3hao4Jo3V19ez+fPn8/4J/VRZWdlffSX6RPR379+/Z69fv2YPHz5kt2/fZs+ePaMj1Ghvb2fbtm2jWgaA4sLy4sWLv8yTl8B0PXjwYOjr1690djjQf+3bt094Dz/p7Oykq9hPJMUBp9UIv6RSaW1tpTPiAT+AXbt2Ce/lJfl8nq5gN5HncQsWLKCSNxiuxwmG/idPnuT9lwobNmzgpt52Iitu6tSpVPIGc68kWLFiBXNMNtX8QX955swZqtlLZMW5J9xeBD0uDHPnzmVO/0k1f/bu3Wt9q4usOHhUguAeMSYBhvvOoIVq/ly/fp1KdhJZcUHdTEm2uCLOYIVK/nR1dVHJTiIrLmhLGjMm8q18qaqqYs3NzVTz5tKlS1aby+S/TUKXA7ihoYFK/vT19VHJPrSZyqB9YVTmzZtHJX/glbGVyIrTYQJVUJkvYlnJVrR961i/04GKSTbtR6eCve88BnT1u0kQWXFYHbcVrEzYirYWp2twEnSIX1dXN7JbnGm8ffuWSt6oTBtMJHOKe/78OZW8Wb9+PZXsJLLidI0Wg9Ld3U0lObW1tVxsJlMtDv3bqVOnqCbn2LFjVLKXTCkuiMcf8S4rV66kmr1kRnFobbt376aanLNnz1LJbjKjuAMHDrB3795RTUxHRwdfdM0CmVDchQsXfPu21tZWtmnTJqrZj/WKg9KampqoJgZKO3jwINWygdWKa2lp8VUaAmGzpjRgpeJu3brFqqurPYf1WA3P5/PZil52YY3iPn36xK5du8YWLlzI3VVeAxGYxlevXrFFixbRKxmEAmNDg7BuXMZPent76Yx/QSRyX1/ff0LSi68jvP3GjRtDx48fH1q1apXwmqWCaOmenh66UrZJTXHNzc3C41QFSsV7iJqTYBupmcqgXvxS4GNE/KTTGnmwD8LsGhsbrV6iCQUpMDRhWxzMYUVFhfBYkeBYmM9R/iW1Fjd9+nSeYxcUJFgePXqUaqOkOqqcPXu2Usw/XFYIZDWdly9f8lEvRsLwoboFWb1v3rzxdc/5Qi0vNGFNpRvkaovOkYnJJlMl6TIKRigOYCgvOk8kuVzOyFEkMm5F71cmUTBGcSDofA3S1NREZ5kBfkii9ykSDLSqqqrozHAY5Tm5ePFi4JA50/q7/fv3U0nM6dOnWaFQYB8+fOA7V0AiQQoMTZwtDsDzITpfJiZsRgMPj+i9QWDWHWXRkfFhnK8SI02VvG7HvPLRWlpg5Ii8chFwFjx+/JjNmDGDXokP4xQHkNfd1tZGNW+Q071lyxaq6WfHjh1/7Vnm5s6dO3y+mgjU8kITt6l0gwGI6FoiaW9vp7P04bVtVtJTFqMVh5Fa0H1UIDr3MEG/JXoPEHwnSWOkqSwCx/HVq1ep5s+aNWu09XeyfHO8Dqd34pACQ5NkiyuispMf5oJJI/P01NXV0RHJY4XigIoryZkz0Vnxg88huick6mdUwRrFAfyiRdcWSVL9ncy7A6ugE22KiyOkwOvXLhKs+cUJRq6i+8DPqpvIigvq2Y8rFiSt/g7De9E9dPZrbqxTHNi5c6fwHiKJa34nM9NpBSdZqTiAjUtF9xFJ1P4OkWai6+ru19xYqziZ6RIJllDC9ndwYouuiVafJkZPwL1A1g3Cy4OAMIHNmzdTTQ3ReVh6OnLkCNVSghQYmqAtLinfXWNjo/B+IlGd38lW5U0InbBecaphfkH7O5mJxOc1gcimEo9SSRMsm6is3y1fvpyvoXkBfyfW+UqBD9KUHLvIigu6kRmem5MU2B0WiR5BwNrZ2rVrqSbm0KFDfJ3PDbJ/zp07RzUDoJYXGjzLBpfxEx1LLvX19cJ7iwRDfBGySC0TQiTcRFZcUOcvvpCkwZRDdG+ZiN6T6DiZktMksqlE1FIQPn/+TKXkQLyKMymmmj9Lliz5q7/bvn07lf4P+rU9e/ZQzSBIgaHBo79wGT/RORpTSeEq+jOdAc5//ofRatyO6riIpDiVIFB8mbpQDXlAP40wutLXdZj3sERSHCa0pR/WS3R28CouMZGY2K+58X0MmTuGwzEbfANq7FCHuVOYSGLEZGAuNWvWLD7ELm5UmkRiInLGV69eTbXgYA6n0lemAlefAJgJOGdVvBJRBPfC0kncyRyqKcsm92tupIpTWbCMU5II11aZ3yGc3AZiWR1wfqXc7EHgOXdL8XUcE4QknsGjYtIvX75MJbOR9nHo25DqO3ny5OH9lIubiqKOLxji3kxb1k+5+0n4Novur+LfHz9+DM/zktqbBMqTxfiX0tnZqSc2MgKhnpFqK9irMuiDeXt6eviE3lSsXUgNg8pi6saNG6lkJiOmxSFpvrKykmrBQDJi0Kdj6WbEKG7ZsmXs3r17VAtOoVAwcuPtEWEqT5w4EUppIGysSuKgxWUZWQiCyDcpkzQilf3IvOJEioA3RcVBDtGZexeETCtO9IB3tLSiW020lCMTuOTidsdFIbOKk+2EULpCoeLLTDsI1k0mFSfL6hHlEaiazDTDzt1kUnGiVXm8JkPFZEJMWD3InOJkOWx+qw4qGUCInk6bTClONvRHi/IDJhMDENH5Ikk7ojkzisMXL4ozQfhgUDDkLz3fS9LKjQOZUZzM1KkimkLIJK1sVJAJxckGF2EmzbKWK5O0goqsV5xsh58obipVk6kzeq2I9YoTbV8B70hUZLlxIkFas26sVpwsrjOuFqDiiFYZBMWBtYqTBbzG6cmXTS9kojPy2VrFiXZdcDuQ4yJoGhlEpyPaSsXJhuxJLb2obEWlK0fCOsXJvP5J9jGqeQg6HNFWKQ7OXdEXBUnaRMk2qZFJ0u/HKsXJcvGC+CLjQCWUPc59xERYozjZL17ngyNUTSZ2FkwKKxTn5cnQubknUM0JTGrtznjFoa8QfSGQtJZWVExmUhbBeMXJtnxK0zOvajKT6IONVpyXWUrDsetGxZeJZMm4R5nGKs4rDsSEAFUoQiVbN+5wByMV52WKkvj1hsXrYUgiiXPtzjjFwVEr+tBFMSU8rohoWclL4hpQpZqt8+jRI76Dw8DAAH9uaHd3N3/6kwwkJt69e5dqZoBNTKurq6kWDGdgxRoaGlhNTQ3P6MWmqdhITgmuvpRQ2VcZAhNqImhFoverIqqkmmZVVlZGJX+cAQn/ZZoI9rCENdBJqqaypaWF5fP54Y1q3IocHBzkif4wo/39/fxJ+yY/XR+mft26dfyzgPLy8uGNDUo/F3B/tlwux86fP89fD8qISt7PEiMqeT9LjCrOUkYVZyWM/QN8yzHxH7ySngAAAABJRU5ErkJgglBLBwiJ5frCVQsAAFALAABQSwMEFAAICAgAt2BJUQAAAAAAAAAAAAAAABEAAABtZWRpYS9pbWFnZTIuSlBFR+VYWVRTWRa9j5CEIYAIIigSMCiUhSCDCmIgOIBQaoJglWgxVVRQFEQUZEyQqaSAKIhjgKDNoKWFqIzKoCCgFiQaIChhsEASQEAgg0RI+mlV91q9+qe71/vr8z7uyrrJuzv7nrv3OVfRoxgEizxc3V0BBD8B8AMUcoDfud1lm7H3IWpwaNixsKAjhyKM3UOplsbfW1uuswaKXpAM0Gi0CloFh8XicKqqqjgNHBwa/0VAaBUVNazalxdo4NT+q5/+GYpm6AYAEBr6GuCvgJRQymgMVkVVTR0CKOgf8W+Ti4AShEIpKaPQaGVleCYengPK2ujFJtYuGB3PQOzKcF2bxAuFKoQt5U+W7Hn10dT2p5NnVdX0luobLFu12sz8mzV26zdstHfYtHXbdle3He4eXt57v/9hn89+6sFDh4OCjxyNOHU6MupMdExSckpq2s/n0rNzLuZeunzl6rUbN/9WVFxSeuv2/QcPKyqrqmtqnzY1P2tpbXv+4jW3s6ub1/Pm7bs/hobfjwiEo2PTM7MisUT6aU6mDUNWUlZGKWO/QIaUor78H21ltIk1ZrGLJzYwXGelTaKK7pYLheVPVAm2ez4u+enkKzU9U7t3q6a/oP4K+j/DfPZ/Av1PzP+ErGgE2irQfigGBcHotSGUNqR4C3AoCP6A0gbO4LMlXQ2YA5bS/8MA/Ta++BKVbq5UdHeMn81aQrgwSYxnVABfpNdyaPfwWbYra0OpkBi/oAAlHoDJbz20aJ+mIDB7YGhK6BglBV2VF4oybDP/JpE3ZAIyCQ10AQVCYkieMCCiQcD6rmdcHc0tZYEL8e6iBXMl6SXLlaonvN17WQQuw99TAcZZuMzUjsCR3wY1w3sYnvL4TLCv9nFIsfaz8zVDK9zhL9DE7HuYDyZd4Px7+nA6yEaIHQPTXxbxBcG6kGfYYM5wh22rceKcAmSZo76ZKKkw3V79a5TfScegFRpg3RGuzWWCvkB5hsauN1fqKrairnve5fD9pK2cZlUE/B/cP+CZ8zJfnv+UbsmBEKJQf/+jFWMNTRlyBzswW/Sr67INjuX5MYYKYNVNJ5TXBuPbchKZOAVQVQAUSdVi6dH2szsSisjYj2xd6Cb1iGTvqvrZ0xKJAiwDdQhB0ojad/GBIQxt8cAuW7yZyQ9MKIfhxZs3h94pwEMvaoAH85ZQP8poQNBPX34krruh9uKKm7P+8grgEmVee0U/UYDiF/iPfqJgd9sbIkYUjOrJYXtUHThM/H3pzeemt+SLzwiqaIJ0wHY35R5c4+oy0SNbRGMXslRFPfvd42afZshNJUZNdtDd9Xei8HERY/Z2oMfiRpWDJ/vWMAd9G6ETuImCdSjdObW6dW4JGdX7uV8BuCV3gc2kSqF38PVVDZfLqjZT5zXAEbPc2MUtHzbSHWe0xFJdyFVnbXK9nzqGiKWFyxMeQq8oSBGlss/MdDB2mmQQw9yzTjN5wm/HCoa0gU3uoJukb+vUeXH5HLYvzH+WHzVGpNtm+AflHGwcPN1aUqoATp3QaVFfU/yjUK82bNKcaH6atKz73sMdymkRmgJm0D1isFI7QrpBWOdyyR5Vw8I9al567sqB8N0eSbwBo/qL0IoU6fz9y2Uk8owzh6McJUkgT90YDDrviPf8JHcTgQf6vh74gjQ/26lxEfEZ8HlQ+XnNcTPTmXgsdz6Wg65FSlZR1x5Xh5zbsLHtdnhSL18BCoqA6ceKpF8JQQRjBcjhyB9CCSPsiR2rfw7sUXL7zZXmLCAZdEg1N6fy3Yod5qeZFExfZnklQ0N6ZfhzLAX9Fjm9V1tauWUw1M/wlFQCU4TBHVVONHtxm4kPCwsUsTTLT4BeriG12BwKRs5grOFzf80hfccjr5JqqZQ9MzoJ/aZCIBSOktRJulbHUhr5j+1Hpz7Q4LN31zjkzFPr5wvYeyx1O4QsJuMJROXgroG2XT5R518mf3DzFOPfcfvpFvwDrXHXz2c23dQapnVsB4ff9q2/Hr1HEEqbKgifgB3FaFB9daHpfYaZPTZFLFOAfOf9YMCgkY2tZqERIgfz6A7VYgvD6xnY4JDtX/2kvuAdyXChq/Zt+yyuhb+AjYvNGkgNhrIPP3+SMqPCNkorfsedl7DUMd6dwHX5KvniTXgqn0b264RuHjq41pVsGVNADpRHs9Q7ESKPgiXGTIQ7Z2sCE9JEzsCXtdXVjly90DFCULNmlEXAXpgJHNt9PVamqa+ZwTZUlQvjzZVSknfMTFyuchlzo8p1Ic6qx+Hlpyn6MINE4jRJByFkKN/uVRatgIJZ4/dy89ALvJU0llrjLMhiSoGvB//X6NEJZiShUO4/zFG6wxkw11mUVScL4mFLnPIeUdC2D/mJYY18awbv4zhsNaRLwqyDqJHQknmibT99NWKpb1uxPCjPZUuC/zuxFM6gC5NQbli0JPjNEtLJBOmnBcdIOWvZsrjd6a89Ttzt0KJ976AAZg1HQUbP1ojZxl7XGCpBpk1auvbYHt5Ix4h4lMFCcGcxdrzXB9hp+i69nbQzeH8F+MEvGLXfQW87Ls2Ygzm0kHb16kr8xvDxSSIsYN10W43fuaVJOb18GUqkAGIO5n0uq8Iv+vC4kJj2iYOYRLkGJEUsApPBSvYj7glDmNYiYDPyJvSHkBOxRoNwAt2gW6+8tGvDriwnr85Ip6H5z/gAdL7ku3MgzRg1k9hZ4CVfAVgapSxvp0CKaeAstTh2SMZBpyMETrWRXQQiIvjrRYlQT00jltH8WQFkKWDDvl5ybiSTGcTtOUsUooqxdpDfv6I2+av8K+H20PKDlcQIGaGNu94Syy9nwKXr4xny5XH2DEtFkGIFXRuY0npcp8UzamCPk3QLyQ+d3uBDjJJnc4TRf9At4vNHXtXvnIkpM15w+5QOhCv7daOv9A2sMIdECCUX7/S576wbdaGrpVXXwSkH38bp0bPOecCWnGpww+Si3vOOmM8BYsMYCtrhRvwmSluCF1eWJI8XKnW1s2o8N6MuGXw7rgA8sVgmBp1Vblnr7hvem1ogTo8jdzbBNMmwq73Jt01n0vIENGQ0MTVfiiKv8zFP7IhamGqtERkVFNSBoO9wlVojbi8iieXCAQG8j4TqR7Htt6r0iVgHZ0EFCHu7LeAcRYwqaBYgmGbwgHs5jneUXvi40CptgIWjg25zV8mORS5o5d1zGhieJq1wdaSg9Ey35u71GoP5liG0ckhtc9GVQc2HEHvX6bVDH34xjkQxmhWAqQZORUX4bHh+0q1wXIxVgLJ00J+1PXerSZsdVBAfKIibhpGWKYAf3fKAK6dlSccfzuSwOIqyCDGxcpbQbewiLDs3B4jx/mWjpCWha/ufN5fjc8pFEicWXFDF/s6gJE8+vZ+xoFUqYam93Zns6NaTISegxO0gFMk+4mt3g0s9lBdVOCQ2aqGv6X+jnlhzJpw70KMAW0kG3VV+uwOYcXkOcry8aoaF8d330ALnczDhykR+ay9cclV81c3IsXhi2twIYr3gP9xQeWd5X2uWATkcBrPFHKVyzu4N0Vu+07kQX8ItxXyI+mZlNP2d248SGQfjnUrcdr7A4hdpxDyJ5v9+bhC1+7VeVQbBsIATq3UUPEC69aJ0Btpur3FOY2om08S1jBa69d35TswOct/nRponnwa3rHZ7JN9WzJQsd5/qdWJJnP1gLXUK8TEJsziUtMA/FUZ+KZLBlXHu+QqDzTV/8WeFVDXh00z903jy5jF/WOXcngFCGjtMXgdcin8M819VW0YuUYADcxT08pR4p+OvPuobJhDdBmMSdMGB0amTxVsiBZOCGrHTgGAMKg86djwnxDC/vumr2PchdVsC7ZnkTXyb+WzH6Cgs220+ZtysbgPy7lZhLI2ZDrLc95rqNLXs9pAZDQnjGzzAm/z1dWnfdmaUlYvkqXR8EFQJ7y0MCuZtnKRXiuw1FSrv2uR3t0gMAvY9itcJSwb0iYPddv1sZk9fVjjXDtwpbOkGST0cDLEjd54yLX8uT5unbQJ1QaHHb77d7T4s0wok6QkRwmRwFlcONOHm/vf6n/tK1907XuetzSjjwZ4yDoqcmBKh6dbsx5WOsYxA2GVkwL+8XkeD0cTgwcI25qxNWuYNEOun0SCiqmOW/V6TnoKqJNN4Myzlay0HyP0mHZsuPMEvhM0Eo/a0zE4QQk4MlVWLv1zElESX5IbZQAOsD/FuVTOyU4CXbE8yNa50eAbcEQNF7fNtP76RII1P+8mRCRuM1QiEFv2003drm33HprOb8EKaTARF9lLcly4+f2eToBBu7y9CVyH1U5vLHlUPCWPk+izNS8jdQ6KWemaf+dEm+1avUd3slIw6zVIrnn9R/+OYfkyWilTEfk9a1Mu/fnguemun0ZAMP/uabpdVsKRt1uQ4S9JCmrexFrHUIyu/ORoVFBEjauUg2jFjai3S96a6TJAMP0gmAuaAXVDnQTx1SkjTJul1v1CvGFA1j82qdhqCk4e09NgE+sYFZg6P26tEt0Qwib4qvN72NU3GsLd1V4aE5NWYSp3y0r5Y7loOouv8Xw5YxZu/A1BLBwjpYSNTUA0AAN4aAABQSwMEFAAICAgAt2BJUQAAAAAAAAAAAAAAABEAAABtZWRpYS9pbWFnZTMuSlBFR52SezjUaRvHf2Nmcj6MGURprigS7WwOWZlyta2mWE0iEzKztB2kSIg0h00odmVTEsIbadraWDlGTA6NZTdynAhjZsqEMX4TzYw5/d6x13v45/3jfd/v8/x3389zfT/3/YXeQtOAmd++A/sAGAwG/Kw9APQO2AvAdXRWr1YI7UXqIZEIBNJAV3eNnpGBkZGhgaGhsYm5mbEJysTQ0MzSDIXGWFhYGJlarbXErDXHWGBWP4HBtW8QSH0kUh9jbGiM+Z8FvQRQegABIMBhdoAOCgZHwaAuAAsAMCTsLwH/EExH63GNrp6+gaG2od4M0IHB4ToI+KprbZWmrQMIFNJ84/Y9a9CBkbp28RjXKzfv69l/XdNucXgA3OQWdSFN38DSaq21zWYHxy1OW909dnh+5bVz7ze++wj7D/gFBR8JIR0NDTv+/YmTp05Hn0lITLqYnHIp9Wp6Rua161nZebdu598puFtYVF7xoPIh89Evj5/V1tU3NDY9b+7o7HrF7v69p3dwaHhklPN2bJzHF7z/MCP8ODsn+bS0/Fkqk68oVrlgABz2T/1HLpSWSweBgCN0V7lgOsmrDSgEcuP2NeZ7AnUj49F2rlf0MF/fvF/Trm/vdhi0iLowYGC5yZ23WbKK9hfZfweW9n+R/Qvs31zjgBEcpl0eHAX4AOqDm+wU2TMvzglew3n9meKkftTcRUVIcSwLP8TSeHNmzlBsU94R5Mm8XcSu1NeDYdGpVKJHV9sPDBFXQLnBqCMsWPNx4/Zs00dzB6VhyFqWlJxd/SmcKeMqxRDAfXT715SVzEij9T4vaIaSWo1BZNU8yW0WAoyWuwYTF5s8ngZ6TjQqo00niHJbKpNfnYM1w8e5NbQIIuKCLkLAHVPqxzJZBzWfTRut9pevm6bI/fDBRRkT3sut22Us9Q7GtN+n+LtNvNN9v/YXvVTH4NmdxqZ1Z1K6eRHcTLpNdOoE0TUmZJEVmFgsHPOcgIA2Z2w7q47YBQHXPtmfnvIatcthfMgY6R7/jiGHc4aTRxsU+fekBfFxaXysw/cQQG9zlTAzYlW2fP9JB8EDnLJAo2AgqRwToc+xhAqSYPe7n1Jo73tvOOqCKlcIsFKhxawfIAAM0qsWb0uMyxrdPrvofCm66ugXkRDQMJBElCNpH8rnLW3EJeceRXMCyaETjoVGYMPyTVoICxYcW13JOt4//schuSlfL9H24lw4F+D6Kz9ShJq+ZO08ejTdssG2QfRuAq6P+Vr0BFvVZOxLqm1NU0xZL1SGlucnVzAnT5Q35z6TkZlCXRVmSBBcxMxKZGWmUjUR+dkOlY/TGZ+fsRS342S71VSPCG43ztIzp81VLjiWF8GfD3mOYin1lGgIWP9Nlfnzk/TQG120GFTf6dM2m7uzPFpsXQeoPeIPYxqhMklKyaQ6n5heMOf4DUHAcDiz314tYwhSVzqlqZ8eyEu+X5QNTp0rW+RMUozp+nMUVN2Bz86X5aJtkXEOOA/PlWpV0koBSh1jnX0DbULnvcR8edQFsbRVO0RPJyFWoSvhwCTFL1EpQ51x8eZnR1yCqDj1ssa9+sCI+3wO9nDzb80Rt8J7wUblZxIEXK/O6CQ9udq1RBBkKaYi0ztnjnoNPQX3y/fQeRpTqRNXdKQ12nxXQuA3EBDSmHBWm4S5fDoEEGU/p/fze0HpESaCXgIB7Ts07sdShnitwitJzhnFR8BfiM/wf/rvKs6d1OZZ9wJtxwBlE72jbecGuLrCvfBk8e81wy6xZ8WNqZd2X2AIZn2TCMfF561LQIlwAlz3vshbWdkEAbnVHjIIYB3itFJj1Hc1drOrSTlumT9NSwga5AYVXfYv9rZKOZHBZfyuzc5OPot3T+PMGPCU+GgMS5k/y2enJWYFLy+0oSWYKbTEpOxJuGopzGdC84lhS3sHMgXsilO8MSZY9SAvuiCglVfo2doCAaJ8iVDlxnrlo3AkbyLKROR6d5+rPjZ4rwRpK7advPVZmdi7M2oRAmicvpnn30rypMOnetwWmpK9n97qnpMXkUdvt/Us/ykj0s7LzHuXAs4rJ7mLLRx9CYV/hHnF/cACPx8b3hRwB1xUli20nueEkRZQSaa3NTYSo2hVbNHF7qqdgmnsq6wvSmcEPAjIelDSpuyPUs7PfInHhazNPfdjoSyUZevXYH70rLG1EyNlCVtKLNFAgGSQU84ULUqCq1W3GGjG9PM5ovwUNpu7HKAiQkCasHow2IW+Dr/bgbm43qjsak2/Y1er8babpSfR6FpNU6vFso8oUukl7+0WjBY/ljd2hLVllEc3JAfVjWdUlL+oKvX7m2q9dpeYkHvXnma2j0pjJnyCO+wGcgsqjWUxPO54sUDYnTsmo5QqBrmEERUqyeGcB1Gk3d8+CHiIpkIAQ5mrSqqRrc0GOztLCTglLaBKFaKuaDNXOYBtJdjrD9PWlSQHDoQHXUY0EZuz3HuWyhf2rgzRbahISXU77noeNYQF9pWAZe1TlgO4qvpdjkTJrr4n6me89Q8hwFtsF082ZzVSckjsMrAQl/nCFgL0E96pc5UxSifNyHsISNAG93kY2U47jQyVv+RkzqWKmDBCRn2Ag9TeeCR/tFScd38ud2kUD+JzF37dGDRtJVqSmPK7O3Ll/jNy0kP5IAMdEM+IqZoju7bUlHi2iNS91GLUfI0ks+CxHM1nilrBGL5p11exJ0C+P9+WEdQ2TL1LEuKMcM5qCPjsjaYlkLWu0tJV34KlP56o+NhMSl9utevBF1/2jtg+sJEotourcmZz6w8+kWAjaJRXZBhoej2JkBV5eZKwb6ksital/Ex9Y6o1p4TziNYfyfih8EOgtJY536xl2zIZ3aifoBcvu5VK8q1L5Qgg4CojlruB6vlmaD9YfU2F5S1stC1xSVRv6dwg9UpmK5RBUl/5VUmLYCczGx+/obA8xWvI8s5vofhkUr/WcZnYFwLuD1jbNlHZN7Yeu5375OKa8uyt/Yec3Y4OiKi+lcfGzoS8mZqVOX3oiTtfLLhJPEleDgzep3DTBjcHC35b4nisKILEq6oqwuRpE/BWpnxfDwE/+HD95Iv8OFGnxJ631Vue+3Vj2mufD+JxhfXxOBWDofHytUifZXN2E91evjks9A/qHUkvtvSYECmtPMQME0YUBGSXoe94LatN+jo6iCv0YRz/LQtEJKduecTEjE1/B9bN/XFnv9JzmqBC13ZQTJLWBZDYVgcE2y64CffGbQp3iYpbvMRgTy1SojoN3rFvlrvEP144EjiY7UwPpmdl3j/40zZEaHm2UwkBGvs7UEsHCDPr5BCkCQAAWwoAAFBLAwQUAAgICAC3YElRAAAAAAAAAAAAAAAACwAAAF9yZWxzLy5yZWxzpZDPasMwDIdfxejeOO1hjFG3lzLobYzsAYStJGaxZWTtT99+ZmxsgR4GO+on6eOT9sf3tJhXkho5O9h2PRjKnkPMk4On4X5zC6Yq5oALZ3JwoQrHw/6RFtS2UudYqmmMXB3MquXO2upnSlg7LpRbZ2RJqK2UyRb0zziR3fX9jZXfDFgzzTk4kHPYghkuhf7HtokUAypaz0KbIm1bNLZLzIAykToI7B9aXD8nukYGe11o93chHsfo6cT+JVHWa17riR+bN5Zgw1f8bWNXPz98AFBLBwisd4Vc0AAAALoBAABQSwMEFAAICAgAt2BJUQAAAAAAAAAAAAAAABMAAABbQ29udGVudF9UeXBlc10ueG1stZTLbsIwEEV/xfK2SgxdVFVFYNHHsmVBP8ByJonb+CHPQOHvOyaUBaJBlcoymbn3nCRWZout68UGEtrgKzktJ1KAN6G2vq3k++qluJcCSfta98FDJXeAcjGfrXYRUHDWYyU7ovigFJoOnMYyRPA8aUJymvgytSpq86lbULeTyZ0ywRN4Kih3yPnsCRq97kk8b/n24JGgRykeh8XMqqSOsbdGE8/VxtcnlOJAKDm538HORrzhBanOEvLkd8Ah98YvJtkaxFInetWOt1QdzDKFiPwYCcrxmhHPnC4iF0EiC0fTc8SvkOqMXTuG/J0YmsYaOOZzG3MNIPI3dn15nDht/UUPpF0P+P8WQ+9lPBBx4BoCh+aRMxN9e8K0Lp/qbZEnY9od6BrS9P+th+IR548I56X3gzHnJgS6ivNQ/OOs9r+S+TdQSwcIR2HVEEMBAACJBAAAUEsDBBQACAgIALdgSVEAAAAAAAAAAAAAAAAcAAAAd29yZC9fcmVscy9kb2N1bWVudC54bWwucmVsc7WTzU7DMBCEX8XyHTspUCFUtxd+1AMIoSLOVrxJLGJvZBuUvD2rFNRUlIhDOO7a/mY0I682nWvYB4Ro0Suei4wz8AUa6yvFX3Z3Z1ecxaS90Q16ULyHyDfr1TM0OtGTWNs2MmL4qHidUnstZSxqcDoKbMHTSYnB6URjqGSrizddgVxk2VKGMYMfM9nWKB625pKzXd/CX9hYlraAGyzeHfh0QkLWoA0EIupQQSLmMOeCQFye1l/MqR8hJco1Hhx8b6YsLOe0UCKmcQT7eTKC8zn1raP6D/JCSAfG6v0+F0+P97/ZyGdtIvUNjHsY5qkULv4xBcTuFYMh6o8wvu48oCHp24668nrwKI9+4PoTUEsHCIRCHHUNAQAAyAMAAFBLAwQUAAgICAC3YElRAAAAAAAAAAAAAAAAEQAAAHdvcmQvZG9jdW1lbnQueG1s7V3rc9q6Ev9XND5f2rlNsAHzuoeepEn6mNummYRz++XMZIQtQK1s+UqCQP/6q4dtILFDQqEkQekULEva1WNXv9VaXv78axoRMEGMYxp3He/QdQCKAxrieNh1/u69P2g5gAsYh5DQGHWdGeLOX2//vOmENBhHKBZAEoh5ZyLzRkIknUqFByMUQX5IExTLzAFlERQyyYaVCLIf4+QgoFECBe5jgsWsUnXdhpOSoV1nzOJOSuIgwgGjnA6EqtKhgwEOUPqV1WAP4WuqnKZN1hwrDBHZBhrzEU54Ri1al5rMHGVEJvd1YhKRrNxN8hBuIYM3cjYiYhjdUBYmjAaIc3n31GTmFD33AQOoSOQ1HtKEZZ5ZSyKI45xMfHf+c96Hknc6aJrUvCNyLJQs9Wk4M9/0hxKRKwGZADcdHHYdKZA3nRhGkv71dVbg2nMqixXO4jAvrjNEn6RfFyy9+KTL3KQUxSyRFMMpzMtfiRlBMmcCSdfpwT5BHxgO8+yvUkkITLIC50im88xvhrLneXW/mPpn2dKsruudzZv5Gc7oWOR1BniK5kzfyTGSumm6KgSNMhJqHghSrPjPrtPQFwkMUNq7gBIqFcPVf4paZZlcZXloVEfV5VB+n1CSMfEaftrOWxlVt1mc4bmtkhperYxUvaxG05+3PGuhME1mF8wMUWA+054EK+ZBsbhKYJzxaJjbky+IDfOpZ4gr8UvnIEjHLE19gWxpMkrEiaCBuEfYaFKeyfBwVFq3stCGyTHBw7wrfcgRwTEyRGL6jc1lVapeXtmMVKI/zLWSGylNsrCqLwfPSS8vx0Qm4VjQtLauUNG1K2bsK/MZyebFfH9EaTdGhgqawkA4WYNqNfcwF8usjp3KX57K70FWTrXa1E/ehUZX+jjEt8jIJpqK41vris7Ti0i+ZuVLiaz0nsaCyxzIA4zlYokjxME5ugGXNIKx6iqCXBxzDAszR8cxL64W8Lu3NUv+c75gZHdO+J17uSibNqcgkfc6Jdaf1zS3KulAVPKRZHZwbg+OFDkF9hnOJFK5EJsg5+2FNKOUIXiKBMSEd7R0mnqrl4t7l3GFPwU6t0+KrFk/QpMfLJcnkOA+w8vyuHAzlcOFO0r+suTOlfLl9bNUv75cgnN6eI9alSqQttP2UoE2qytPeg3fkJ48iz6W6ojrHXitA9etV5t+Yw1N0RsXCzUWavYbak6/vlsLZ9Tu3uKMxZmXjzP+wRVKDrx2s7qWPVa3KGNRZt9R5lgIFIcoBKdQoIpS4fVAp+nvuzI90s1ngejlAFH74OtJ76DqVt03wKt23Lp1u1mUsii1ebf2OVwTn6zzzWLRXmDRF3YITuX/T+e9s8vjk96n/56BD4yOE+uIs+BjwWetLdIQWUecxRyLOWUKUm+BGYLsFX8NgAdAJPs2Uok6COFMXbwCx+GYiNfWTWcxyGLQWg+DUAKZUEecrXvOuucsPD1qS4RCHEBifXIWkiwkbQ6SzqKE0BlC9kCc3R9ZALpPUzAMhiyRnbM+OAs2FmzWAZsP6pACs244CzMWZkr3OZAg62GzCGMRZh2EOaExHxMBY1E5pYGgzDrarKPNAtBjAOiR5w6s283ilMWp9d1ua56F86uFHoXbQRxqNoiDRTCLYOudnNvfPdWvRLCxZvU2AgJV8ghcRSG9vMKQXtWykF5prK9kYWmYwBjzUTlav7wQYJWHBu2qNkoCarV8d+2AWpro3ihDkcxWC2W2Viaz1V2GoSubrd8tgouSNl8Rtr5ya0G/2/2HWJUL0rl2mL1FWi8LH8wVDqRhMunwEUyQ4gWUvF9P1RBcC4WZAZUDwPFPpEC04bpv9KcDqBw70XVUEdqR9s8AMRODU8UOFQ5IoBh1neiofuQT+eF5R23z4U/lFAwwIUhyGqh4pIz+MNe6JToJcASHCKou6qbJXEi4rPid4pgrpZK0sTDaMumo8JZjArm+Buh/cdfBA6AGRIXUjEEiNYB8lslvOBQj4Ka1TEk+jsCRC7yC2678d+Qt3U4YDcFRVRavFtyvAT08hqFmtqqQia1X1CDZpILKjRLOzfs5a5qttIwLVhEoa5XnZiS0SC2PvJpyKQxoKthYRaClP/QEDxkM1btXeiLVPaFEJqBxjAJh5JvJK0WQdggNfoCJotF1UIhlUcgTmctUdFdV1bDN5TUX3kXBxZ6r5NLQ/mNRmlPRuVHj06nWDqt+Iv490p3tVL3DpkyqxvW10hs1T5eFP9J1Ic+ValyWpfS/LE8r+K1M1Qkt8CEUEDCNOexTWHPk9Uiqlk7VF7tuVk+tvIu7imK0qxWiXbMM7WrPyUIrgYffho5Fdtj99nK9cDZaZbNRf1azUfd2Ohteo+EXmsuNpu+uHX9WEbWPZGwEUhuB9Pf4p6fSroshAZfaqISkA9ZwoGmNf8ZaG0iLKVtgf1Vn+SjMyRIE2cJuR2/KZFIZ5HL11X8v7vHQS3j0s1JtMm0BPSlgHZCdRlA/igD+BXoMQf32zxvwlQ2lAfHT5PwdY9EBx0MI/jOCOql/PkLMwEfKEywK33r43Q/un5TwPN5D6hf/6EG9zOTzn5PJ12hWd+qe0vzvsezS2h8RlGTvDOCKePVlnXuhpt9tfZ5j0HzltPahtQ93fJKbQM6H9EZCXATBVQAJ2lyU+j3TeHtSYT1IbxRDul8G6Y3nBen+jiHd3yak+xbSLaRvG9J/DYN8i0EWg7bxmP2RkmhPijSLgb5RBvTN5wT0uz5a0ir5fcEV9zd45smeWV46ErIosEtbsSLVaC2oRo8GZzMEzqYw6pSpRvqIU9MbkPBkBNUqnl71dKf6aIhz/cgLqxMfrIem4i3onQBnzgj8MwAn4B8C5BqoqswLLhMo4YbicM5ro55NawxZ/8b6z78y+d6YU8Muftte/C7RgMFAPVHZ9uq3wGm+/FW3svzt3tC0EhrkNpQ9emwPuT/yjY8+GlCWHW+GA4HYHKfuWi9P6el4tsFaBN783raAV5oB1xcyFVx/ltN9LXH4+hxBtgTDe/lS29XFxw7w5N9Ki2RrHoun8saBfcNg1z9Jbxf9+/xVrWJ/VXOFWfpM/FX+bs+aaP6rHkwx8+6EWsSNgKOptNed3IRtu4fz5q33DKtsHOwzLOu2sW6bXQVYx3AYU475Bv02/t4dRnmcF6a97IXxGtU37VrpIYz2hlwwGZttu59t7JD92mb1EGOUYR4BHE8omSgCVIykfYCmCaHqlUoOoBTnAYNDdZabvwHJuE9wADgcIDEDUjhwgCGRBL6PGQrBqwtGJ1jVhOT1DnZvdpP1PDdZD7Fk255/6D7QYN37fVm7eF/WWoFV9hzBJvzEv7bZ2i9Hst1s2c3W099spb/IA6R5E6BQmjoda9xY48Z6kDdgqXhusanSLo3o5j4rW6Xe2K2tovg/0XBadmnabXhFjgJhyI60qapf6UZxgOY9QQM4JsKZBwlKvV0DSsVihTw/e/NoePUzi2nYNiIwUo/UWzV9wpkyFaFp3l5V4Yt2Wcnh7jo1ozNm4vKkmqc8oUc+T5n250nTOpNMqaeCoXgPBhyJ90xRTuAQpeOVDUZF8Q1n+iKkwVg5Pt7+H1BLBwgjmG6gfgoAAOqgAABQSwMEFAAICAgAt2BJUQAAAAAAAAAAAAAAABsAAAB3b3JkL19yZWxzL2hlYWRlcjEueG1sLnJlbHO9kk1LAzEQhv9KmLvJdgsi0rQXq1QQRFo8D8nsbnCTCUlatv/eiB4sLeJFj/P1vM9hFqvJj+JAKTsOGmayAUHBsHWh17Db3l/dgMgFg8WRA2k4UobVcvFCI5Z6kgcXs6iMkDUMpcRbpbIZyGOWHCnUScfJY6ll6lVE84Y9qbZprlX6zoBTpthYDWljZyC2x0i/YXPXOUN3bPaeQrkQoZyv2RWIqaeiQUrlyTr87Lfy8Xn9AOqyR/tvHvMfPeZ/6ME8vXKylXqu87X0xLZmr6dCKeD4IalOPmH5DlBLBwgFsp0x2gAAAFACAABQSwMEFAAICAgAt2BJUQAAAAAAAAAAAAAAABAAAAB3b3JkL2hlYWRlcjEueG1s7VlbU9s4FP4rGvdlH0gsG0IS07RQep2BNlva6WNHsZVYRbZcSbnx6/foYieAQ+kOs9MdCDOxjo7ORefySTHPX64KjhZUKibKURB1cYBomYqMlbNR8PXL284gQEqTMiNclHQUrKkKXr54vkzyTCKQLVWygOlc6yoJQ5XmtCCqKypaAnMqZEE0kHIWFkRezqtOKoqKaDZhnOl1GGN8GHg1YhTMZZl4FZ2CpVIoMdVGJBHTKUupf9QS8j52nchrkc4LWmprMZSUgw+iVDmrVK2t+LfagJnXShZ3bWJR8HrdsrqPtUySJSSi4M7QUsiskiKlSsHsa8dsNEb4HgE0KhqJ+7hw3WbtSUFY2agpb+e/sd0F2z5oVtVmIxALU0Z6wv1jLP3gG1oa36LoAEM1wtS6AgvZigShX3EmxCUwFoSPAhy9wRsGWYu5bmSmbEUzwwyvW3gnWWaGM3ieCl6rchab5fUq7cSkF5fvKZvluhE6OGhk6iWp+66pOzcUblaqTPuHo1lWGxniPo7i3sBtNBPpmEj9afJji3pHOKdyXUucCmhqNCYz6Ndtoa8l+zmnzu62nnDLLgxORamhwA1VgUqAh+wzxBpHg3gIbtRTr+mUzLm+zRlvTRklVq8PTynGUoip88HPVSwFY4tE0lQjlo2C7ysMn+8qwgeRQaA1h5BVQjHTtwmZKMHnmh5xOtUJPtJ0pTuEs1mZmJkjAJsZKzuOWzW0FpUllyzTedIb9rpxD8jcJjTpDYZdcBgmrjqszOgq6URHhRIdu7xTUZlCSJII/LLTtTedXEh2BQEjvOOQZUGTCiJ/fRXkQ7O0dc1tAwESCSRUQIenlEM+pyYIUlzSzIxNqKaMcyQTEyz5IYuMhGbahImuwOhcAk4qdgU03gN9RFUQ21FA9BklSsNyySAmo6CzH/cP+9M9/wxQ7XELC9IjuADcBXkpNNHUDn23SVJQW2wRTpaSVIiUKcRmBYmDnQaeXHvS5N8l3BaCq4DQlooh65JsKjFsGqTaKqYFKZnK66oXZbBVVqFf2oIxH8rMNeUOhLkwBVdr/UImnBo0aNifIJmcVPWCjxTohtm0O+71Hgi/LPMVoCYc1IaaCK1FUaswyMypMaWuRsGhHVQkpX53PmXYfjbw1qi7HzjG+3HPuXKDcXCI2xlxvIMRDePfgdn889xVNUl10Fjt4e49cdd6fjsPi3MqZ02OJYVbjtQ+2KkPjqfOibwW9R11Y+DmjqoS1W6m9HttZYdbPixODMrVXk+IopyVrusAWL/JTVHCqXvjfKkaJK7hVuWkosbWNubqfj9AqYAIOPiIo0OM9+y3ARlVAYr0e2ZYSTqlssYzCwVwuctHQXF8cNzj8BVFx0P31VtBhRrMcgh2E80ciVgB0GCB3LoGXMIVCP4QrPSHQMG0azaAQLiozDlRdozoT4AsNkUmIOZyVKIK+oefAfnNACzCXsqtVPMCHWMUtUxj+DuOrk3DHShDxzEsj1vm95ENjzNojf1qkavuNofApRbhwx2W+3dbtjoHfg1Gv1Kwy6sI1yo8bG9H3qQcigGOYDk3PyPEpU3wTJKMAXLbRJo5c+YAGJUlQL6rbwP+RqFIuEgv0cLogEbPmK7PK2nu6UbUmW3qtSne7cJlETal63Q/265mXzru3O/j7vap3+/2gTS+TWzTuy73oPnMo2bDhS7exTLtv4tn+/sG0+zB1ntGNNmc5DEcrUkOnWWp/e2d7z4oa+hrBcBBf78NcwwqX1SkAZP9R42LlR+/yqQVmrCM3RBpLh02kc0B3pyrwH8LtxUFHKJSxuDmwAqq0Ee6RJ9FQUqzA3P5OlGMtDLzk1K1i6Xq9rQ1qa6aIxHXM6fq1hzcB+CW0PjsZifX700wsZG8fZVye5ePOg5QNOZnb32/ggNQUbmgwQtUf8bkkpkXJmhM4UjjFODzjJkzK7Ml19q54eb281t3oMHD3IEeS29vkm/k4R4a+KELLplr4aWr8RO4PoHrE7j+aeBafy7mDL1llGfovVAV04Q/OLjuD5/A9Qlc/08JyJvXxSmnRG69+rHBB9L8/IbfZvbjDPw+Ig+w+fsDkChuQaL4v0PkRxGHeyDyh/MLdGpebU8ZzdBfn95fnFx0ogHGURJj3N9Db86BPnB01NtDfwM9rMlfwnbYvL59KLC5oTi0/8p88Q9QSwcI92Pk918GAAAJHQAAUEsDBBQACAgIALdgSVEAAAAAAAAAAAAAAAAQAAAAd29yZC9mb290ZXIxLnhtbO1WbU/bMBD+K1Y+Q5OywaCiIEoHTGK0gk7sq+O4jYffZDtpu18/O7ETWlqoJvYBaa2U2PfcPXfnu7Nyer5gFJRYaSJ4P+p2kghgjkRG+Kwf/Zhc7R9HQBvIM0gFx/1oiXV0fnY6702NAtaW615pxbkxshfHGuWYQd0REnMLToVi0NitmsUMqqdC7iPBJDQkJZSYZXyQJEeRpxH9qFC85yn2GUFKaDE1zqQnplOCsH8FC7WL39pkKFDBMDeVx1hhamMQXOdE6sDG/pbNgnkgKV9LomQ06M3lLt4yBee2EIzWjuZCZVIJhLW20mENNozdZIcDdBSNxS4hrPoMkTBIeEPDX9a/8d2xvv2hVVRtIvYsXBuZlPrXWPnFI5i72Lrdz4ntRitaSushW8Ao9hq3QjxZoIS0HyXdr0kLwKUoTGMzJQucOTB+7sE/w+4Gk1luAt3hl6NgEDRQ/Qy7V8OLW03pHp6jhJzoPPgQ3KtWaOxVN5zEN57Vzracw4NZUhxYJzCl+FqRrIFHdq4plEHhDtt9A4Y0kpOTw3c65Qoc2Nra62T90FPqQnPLmX1fChqY6wAa9aC1tUr5fUGtU7yAyESB5FOSdJId67YtYdRG7nbfYWWXCmME214FiqfmlRoJuR1UPqONcPwshvKCkhkPuaZQY0o4rkm4eFRtie2kbepCWa9/oaDnoq7t5SBT1SIlGVmjadoXCSpUAFHi/h6/Etxoi0CNCOlHl5CSVBGXDYbaXGgCV4T5Bderaki324pS/2464yhILvULmYTI3kdNe64PVB23+rA52AK667XSsU0hFdZYlTg6eygIuCKYZuBGaEkMpFW1a8twmcR198ftGP0fpvcepvcdnAlhWIM7PAf3gkG+2nwbQN+EGxDXjOvitaY8SF42ZSP7d4P1IXLcOnhj+ETchzAYY6MExQUDt4QRgzOwB9xUXkPtJ3MPTHCuCXXiPTC0ZmCIFQSDYmasYNwZdcBg9BMcJ/b35vjGzafB8/Zrc3Dtaycx8st6omFhhE9Ljt8gjquP+bM/UEsHCJY27ogLAwAACwwAAFBLAQIUABQACAgIALdgSVEBSfn6vAAAABQBAAARAAAAAAAAAAAAAAAAAAAAAABkb2NQcm9wcy9jb3JlLnhtbFBLAQIUABQACAgIALdgSVGcRI4+owEAAKoDAAAPAAAAAAAAAAAAAAAAAPsAAAB3b3JkL3N0eWxlcy54bWxQSwECFAAUAAgICAC3YElR4HCPm68AAADiAAAAEQAAAAAAAAAAAAAAAADbAgAAd29yZC9zZXR0aW5ncy54bWxQSwECFAAUAAgICAC3YElRieX6wlULAABQCwAAEAAAAAAAAAAAAAAAAADJAwAAbWVkaWEvaW1hZ2UxLlBOR1BLAQIUABQACAgIALdgSVHpYSNTUA0AAN4aAAARAAAAAAAAAAAAAAAAAFwPAABtZWRpYS9pbWFnZTIuSlBFR1BLAQIUABQACAgIALdgSVEz6+QQpAkAAFsKAAARAAAAAAAAAAAAAAAAAOscAABtZWRpYS9pbWFnZTMuSlBFR1BLAQIUABQACAgIALdgSVGsd4Vc0AAAALoBAAALAAAAAAAAAAAAAAAAAM4mAABfcmVscy8ucmVsc1BLAQIUABQACAgIALdgSVFHYdUQQwEAAIkEAAATAAAAAAAAAAAAAAAAANcnAABbQ29udGVudF9UeXBlc10ueG1sUEsBAhQAFAAICAgAt2BJUYRCHHUNAQAAyAMAABwAAAAAAAAAAAAAAAAAWykAAHdvcmQvX3JlbHMvZG9jdW1lbnQueG1sLnJlbHNQSwECFAAUAAgICAC3YElRI5huoH4KAADqoAAAEQAAAAAAAAAAAAAAAACyKgAAd29yZC9kb2N1bWVudC54bWxQSwECFAAUAAgICAC3YElRBbKdMdoAAABQAgAAGwAAAAAAAAAAAAAAAABvNQAAd29yZC9fcmVscy9oZWFkZXIxLnhtbC5yZWxzUEsBAhQAFAAICAgAt2BJUfdj5PdfBgAACR0AABAAAAAAAAAAAAAAAAAAkjYAAHdvcmQvaGVhZGVyMS54bWxQSwECFAAUAAgICAC3YElRljbuiAsDAAALDAAAEAAAAAAAAAAAAAAAAAAvPQAAd29yZC9mb290ZXIxLnhtbFBLBQYAAAAADQANAD8DAAB4QAAAAAA="
            },
            {
                "attchmentId": 287679,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587499460430,
                "fileName": "Birt%20Appointment%20Card1587469261243",
                "encodedFile": null
            },
            {
                "attchmentId": 287639,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587401457005,
                "fileName": "Birt%20Appointment%20Card1587371271999",
                "encodedFile": null
            },
            {
                "attchmentId": 287638,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587400964991,
                "fileName": "Birt%20Appointment%20Card1587370780344",
                "encodedFile": null
            },
            {
                "attchmentId": 287637,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587400664257,
                "fileName": "Birt%20Appointment%20Card1587370477606",
                "encodedFile": null
            },
            {
                "attchmentId": 287636,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587399720531,
                "fileName": "Birt%20Appointment%20Card1587369534836",
                "encodedFile": null
            },
            {
                "attchmentId": 287635,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587397657894,
                "fileName": "Birt%20Appointment%20Card1587367470754",
                "encodedFile": null
            },
            {
                "attchmentId": 287633,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587395086045,
                "fileName": "Birt%20Appointment%20Card1587364885060",
                "encodedFile": null
            },
            {
                "attchmentId": 287632,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587393991189,
                "fileName": "Birt%20Appointment%20Card1587363805552",
                "encodedFile": null
            },
            {
                "attchmentId": 287631,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587393611920,
                "fileName": "Birt%20Appointment%20Card1587363428068",
                "encodedFile": null
            },
            {
                "attchmentId": 287630,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587391233242,
                "fileName": "Birt%20Appointment%20Card1587361052571",
                "encodedFile": null
            },
            {
                "attchmentId": 287624,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587172740697,
                "fileName": "Birt%20Appointment%20Card1587142556372",
                "encodedFile": null
            },
            {
                "attchmentId": 287623,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587172133749,
                "fileName": "Birt%20Appointment%20Card1587141947349",
                "encodedFile": null
            },
            {
                "attchmentId": 287622,
                "mimeType": "pdf",
                "displayName": "Birt Appointment Card",
                "insertDate": 1587169812653,
                "fileName": "Birt%20Appointment%20Card1587139625508",
                "encodedFile": null
            },
            {
                "attchmentId": 282900,
                "mimeType": "pdf",
                "displayName": "Patient Chart",
                "insertDate": 1548261839893,
                "fileName": "Birt%20Patient%20Chart1548225839628",
                "encodedFile": "JVBERi0xLjUKJeLjz9MKMiAwIG9iago8PC9UeXBlL1hPYmplY3QvQ29sb3JTcGFjZS9EZXZpY2VSR0IvU3VidHlwZS9JbWFnZS9CaXRzUGVyQ29tcG9uZW50IDgvV2lkdGggMzc4L0xlbmd0aCA2ODc4L0hlaWdodCAzNDYvRmlsdGVyL0RDVERlY29kZT4+c3RyZWFtCv/Y/+AAEEpGSUYAAQABAGAAYAAA//4AH0xFQUQgVGVjaG5vbG9naWVzIEluYy4gVjEuMDEA/9sAhAAFBQUIBQgMBwcMDAkJCQwNDAwMDA0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NAQUICAoHCgwHBwwNDAoMDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/wAARCAFaAXoDAREAAhEBAxEB/9oADAMBAAIRAxEAPwD7LoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBrusSlmOAKAKlrerckqAVI5HuPX2PtQBdoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA5zUpZGk2ONqjoPX39/wCnSgCc3MdlEFgO52GS3+Pv6Dt39wDVtpGljDONpPb+v40AT0AFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAITtGT0FAGA11cXTEw5Cr2H9fUn0/SgC95YuIglwVEnboCPTj19R/wDroAyNhs5h5q7gDnHYj1H+fY0AWLq8a6YRxZC54x1J/wDrf/XPsAbsIdUAkOWA5IoAkoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAGSSLENznaBQBUW/gk+TOM8cggfn/AI4oAyntp7UkRbird15yO2cdDQAwadMylyMY5wTyf8++KALVpi9jMMnVOVbuM/5/L6UAX7OyW1GTy57+nsKALtABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAYWrsd6r/DjP45NADzpatGGjY7sZ56HP8AL9aAI7G6aB/Ik4GcDP8ACf8AA0AJLBdqzYJIfqVPB/DPFAGjY2n2VSW+83X29v8AGgC9QAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUANd1iUsxwBQBgS300zHychV5wBk49T1/woAeH/ALRTY2BKnKnoGHce3+fegBtpfNa/upQdo/Nf/rUAQXcoupgYgecD3J9f6fhQB044HNABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUANd1jBZjgDvQBmPcwXo8kkqf4SeOe3f+eKAM9JJNNkKkZB7dj6EH/PoaAJ9NhaSXzzwoz+JPYewzQBrTWsdx98c+o4NADYLKK3OVHPqeTQBaoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKADpQBzmoTO8mx/kVTwPb+97/ANOnrQAy7gihVGibJb+Xr7c8Y/wNAGknlXsSxuw3gDvyD/X3FAFGEy2Evl4LBj0Hf3H+frQB0VABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAIWCck4HvxQBl6nFIwDoTtXkgdj/e/z0/OgCGKRNQTypeJB91vX/Pcd+o9gDOMX2eTZMDgdcenqP8APtQBdfTdw327blPIB4P59PzxQBrWsLRIBIdzDuecZ7A9aALNABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAjMEGWOAO5oAy7xBeJmFtxTkqD198evpQBHYX3/LKXr0BP8j/Q0AR39n5P76LgZ5A7H1H4/kf0ALMYXUofn4deM+/r9D3FAFmztvsqbSck8n0H0/x70AW6ACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA5q8uGuJNjfIqnGD29z/AJ+lACTwtYOrI2cjIP8Ak9D+tAF+5s/tSCaIYdgCR65Gfz/nQBnO9w48htxHpjn88ZxQBt2NsbaPDfeY5Pt7UAXaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAKF7ZC4G5eHHT39j/Q0AYMagSBJ8qqnB9vb2H0oA6xcADb0xxjpigBaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAMf8AtJo5iki7U6e49/fP8unuAa4IIyOh6UALQBQvbIXA3Lw46e/sf6GgCa0ga3jCMcn9B7CgCzQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAIzBAWPQDJoAyE1Zd5DLhOxHUfUf4dPegCzcW8d8m5CNw6MP5H/ORQBm2t01m3lS525/759x7f8A6x7gCyahJLKPJzgHhfX6/wCeP1oA3xnAzwe4oAWgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAa7rGMsQo9TxQA2OZJfuMG+n+FAHP3VutrN8wzG3P0HfHuO34ZoAZJmycGF8gjPHoem4dP89qALBlTUAEYbJf4SOh9j3H9PXtQBo2VkLUZPLnqfT2H+eaAL1ABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAc9eu1xP5IOACFA7ZPf/PagCwsKaZmRzuYjCjGPr3P5/wCNADvNXUoihwsq8ge/t7HofSgChYRI8u2Xt0HqR2P+FAHQJbxxsXVQGP8Anj098UATUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADXdYlLMcAUAYqXss848ofL/d7Y7k/546c9wBdStyreentnHYjof5f5NACrNDfKBMQjr36Z9cHpz6du1AFM7TcgW/A3DGP1/Dr+FAHQJbojmQD5m6n/D0z3oAmoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDO1G2edQUJ+X+H19/r/AJHuAZVvefZo2RVAcn73+P07dv6gGhp8TorSSnCtzg9/Vjn/ACe/agCM2ENz88DbRnpjI/oRQBctbFLX5s7m9emPoKAL1ABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAY019Jbz4cYQdvUf3gfX/8AV15oA1o5FkUMhyDQBmX9h5mZIh83cevuPf8An9aAMw3M06iDk9vc+gP0/wD10AbllaC1Xnlm6+g9h/jQBdoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAEZgg3MQAO5oAjjmSX7jBselADLm2W5Xa3B7HuD/AJ6igDEilk02TY4+U9R2PuP8+x9gBZ72S4kAhyAD8oHUn1P+HQCgDaigVD5hUCRh82Ome+P60AWKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAJwM+lAHNz3DX0gQHYucAHj8T7/wD6hQA2WNtPlXacnGfT2II96AOmBzQBXubZbldrcHse4P8AnqKAIbOyW1GTy56n09h/nmgC9QAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAMkkWFS7HAFAGQdXweE+X68/yoAjnhS8Bmt/vD7y9D9cev8/rQBShT7Q+2R9rHoTzk+h54oAsfZ7m0b5M8nqvIP1H+IoA6CLeFHmY3d8dKAH0AFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADXdYlLMcAUAZmot5sAdDldwPHpgj+dADNPhhmiIZQWyc56+2D1HHpQBTmifTpQyH5T0/qD/n3oAtXNoLlRPAOWGSvr/wDX9fX69QDUt0eOMLIcsO/9PfHr3oAmoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAA8UAc1c3DXcgT7i5wAeMe7e/8qANPMFkogc53/e/HufQen5+9AGdLDLYP5kfKdj2x6N/nnqKAI7i7e82ptxg9Bzk/57UAb9pEYIlQ9QOfxOf60AWKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAMy+sfO/eR8P3H97/6/wDOgDKtAjSgT5/H17A+3+TxQB1GO1ADFiRDlVVT6gAUAPoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAGu6xKWY4A60Ac9NdS3j7IsgdgOPxP8AnAoAdHdzWTbJckeh6/UH/wCvigDejkWVQyHINAGffWHnfPHw/cev/wBegC5bRtDGFc7iP09vfFAE9ABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAY/9oAyNHMu1Dxg9R9fr+lAFW4t3snEsR+TsfT2PqD+tAF7zI9QhO7Csoz9D6j2oAraTIQ7R9iM/iMD9c0AbtABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUANd1iUsxwBQAyGZZ13oeP1HsaAKt7ZC4G5eHHT39j/AENAGda3Xk5gnHydOf4f/rfyoAZdWLQsDFlkfpjtnsfb0NAGtZWgtV55dup9PYf55oAu0AFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADXdYlLMcAUARMsd3HjhlPcdj/AEIoAwiJNNk9VP5MP6Efp9OoBux3KSJ5gOFHXPb60AZUhj1EkJ8si/dz/EB/X+X54ANO0ha3jCMcn9B7D2oAs0AFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADXdYwWY4A70AUNRhM0W5P4ecDoR/9bqPxoAxrfzUBkhP3fvAf1Hcfy/WgDRS9iu18qcbSe/bPqD2P1496AM+a1khbyxlg/3cdG9Py/T6UAbdlZC1GTy56n09h/nmgC9QAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUANZxGNzEADuaAKd/AbiL5Oq8gDof89v/r0AQaZcb18luq9Pp/8AW/lQBRuFfT5t0fAYHH49R+B6fhQAW+nvcqZCdufu57n1Pt/n6gGxZ2xtk2scnr7D2H+eaALdABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAVLu1+0rjcVI6en4igDIWSfTjtYZT07H6Ht/nIoAjklVJBPDxk5K+h7j6H2/SgDZnjW9hyvUjK+x9P6GgB9nAbaMIxyevsM9h/nrQBaoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAGu6xKWY4AoA52a7kupQI8jB+UD19T/AJwB+NAHRJuCjdjdjnHTNACsocbWAIPY0AY9zpX8UPH+yf6H/H86AL1nbm2j2k5J5PoPYUAW6ACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBGYIMsQAO54oAzL6I3agwsG29VBGPr9fr/wDrAKU+nPboJEOSvLY7e49h/wDX+gBfsb4TDY/Dj9f/AK/qPxFAGlQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAc7fO88/lDoCFA7ZPf9fyoASaxltP3iHOOpHBH/1v8mgDUsbz7SNrcOOvuPX/ABoAp3mnlW8yAd+g7H1Ht/L6dADXhDhAJCC2OcUASUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBj3V3NbTcj932HYjuc+v8AL+YBBfRiTF1DyDjOOoI6H+h/+vQBdttQSRcSkKw656H/AD6UAZkBC3Q8r7u44+h6/higDpaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAMXUZJ4XDKSqdsevfPv+mPxoAqm/Mq+XOoYeo4I9/TP5UAQ29ybZvl5Q9Qe4/of89KANI6fFcjzIW2g9sZA/DIx9KALdrYpandnc3r0x9BQBdoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAa6LIpVhkHtQBzs9u1g+QA0Z9RkH2Pv6H8RQBbWygu13wkoe464PuP/AK9AF2ztBaKRnJPX09sCgC5QAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADXRZFKsMg9qAK1rZra525JPc+nYf/AF6ALdABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB//ZCmVuZHN0cmVhbQplbmRvYmoKNCAwIG9iago8PC9UeXBlL1hPYmplY3QvQ29sb3JTcGFjZS9EZXZpY2VSR0IvU3VidHlwZS9JbWFnZS9CaXRzUGVyQ29tcG9uZW50IDgvV2lkdGggNzEvTGVuZ3RoIDI2NTEvSGVpZ2h0IDcxL0ZpbHRlci9EQ1REZWNvZGU+PnN0cmVhbQr/2P/gABBKRklGAAEBAQCQAJAA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amVjdDw8L2ltZzMgMTAgMCBSL2ltZzIgOSAwIFI+Pi9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXT4+L1N1YnR5cGUvRm9ybS9CQm94WzAgMCAyMy4yNSAyMS43NV0vTWF0cml4IFsxIDAgMCAxIDAgMF0vTGVuZ3RoIDM4L0Zvcm1UeXBlIDEvRmlsdGVyL0ZsYXRlRGVjb2RlPj5zdHJlYW0KeJwrVDAy1jMyVTAAQiNDPXMIKzlXQT8zN91YwSVfIZALAIo1B+YKZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L1R5cGUvWE9iamVjdC9SZXNvdXJjZXM8PC9YT2JqZWN0PDwvaW1nMCAyIDAgUj4+L1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldPj4vU3VidHlwZS9Gb3JtL0JCb3hbMCAwIDI4My41IDI1OS41XS9NYXRyaXggWzEgMCAwIDEgMCAwXS9MZW5ndGggMzcvRm9ybVR5cGUgMS9GaWx0ZXIvRmxhdGVEZWNvZGU+PnN0cmVhbQp4nCtUMLIw1jNVMABCI1NLKCs5V0E/MzfdQMElXyGQCwCLegfvCmVuZHN0cmVhbQplbmRvYmoKMyAwIG9iago8PC9UeXBlL1hPYmplY3QvUmVzb3VyY2VzPDwvWE9iamVjdDw8L2ltZzEgNCAwIFI+Pi9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXT4+L1N1YnR5cGUvRm9ybS9CQm94WzAgMCA3MC41IDU3Ljc1XS9NYXRyaXggWzEgMCAwIDEgMCAwXS9MZW5ndGggMzcvRm9ybVR5cGUgMS9GaWx0ZXIvRmxhdGVEZWNvZGU+PnN0cmVhbQp4nCtUMDfQM1UwAEJTcz1zCCs5V0E/MzfdUMElXyGQCwCECwe9CmVuZHN0cmVhbQplbmRvYmoKMzMgMCBvYmoKPDwvTmFtZXMgMzIgMCBSL1R5cGUvQ2F0YWxvZy9PdXRsaW5lcyAyNyAwIFIvUGFnZU1vZGUvVXNlT3V0bGluZXMvUGFnZXMgMTIgMCBSPj4KZW5kb2JqCjM0IDAgb2JqCjw8L0NyZWF0b3IoQklSVCBSZXBvcnQgRW5naW5lIC9vcHQvSUJNL1dlYlNwaGVyZS9BcHBTZXJ2ZXIvcHJvZmlsZXMvQXBwU3J2MDEvaW5zdGFsbGVkQXBwcy9zdGdlbnYxNE5vZGUwMUNlbGwvcHBsLmVhci9wcGwud2FyL1dFQi1JTkYvbGliL29yZy5lY2xpcHNlLmJpcnQucnVudGltZV80LjUuMC5qYXIuKS9Qcm9kdWNlcihpVGV4dCAyLjEuNyBieSAxVDNYVCkvTW9kRGF0ZShEOjIwMTkwMTIzMTE0MzU5KzA1JzAwJykvQ3JlYXRpb25EYXRlKEQ6MjAxOTAxMjMxMTQzNTkrMDUnMDAnKT4+CmVuZG9iagoxMyAwIG9iago8PC9UeXBlL09ialN0bS9OIDIzL0xlbmd0aCA2NzUvRmlyc3QgMTYwL0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCnicnVRtb5swEP4r97FIG/gVm6mK1CRLVW1rowRp3aIoosStWAmOgFTtv98ZWIso/bJP9j13fp7z+XwKCFABTGmgEjjhQEPgLAKqgEsJVAPXFGgEgihgBATnwCgIqYExEBrPcpCUABMgeQhMggwpsBCkRiuCkDJgGkKM5AQ0KjAFWmE0RBgVAiUEc2C4KswAtSgycrQFkXB+HlyW9nTENX45mtYIZutgbp6y1Kwup8E6iMukqI5JaYr0ZTIJlm5XO0oCq2BmixrNCnkbu6FZJg8mWJnKnsrUVEh+e3P3x6S1291z0E3k7T0D3u0wLbdz7KVN16aGTbCcLyCIzXMNwdUBCafdOuvWqy2K57ZcH5PUIHM/ayRaYGKILihWwoksGBaj0UDnD7PPkql93hCEZCR9LKEW1NfRdjKBjWrT+vUbilOeQyiIj9D2vYMJn456pIx8fNURj5JOZpSNSD+So2waExg/81FqUmk/HD0iBfOxTUY8IsLr6HEZLNG4g39QGsq7y+AjdC3D2oePszo3Z8ukzhw4s4djnmTYQl5wgbHzs90uvpntKN0RD7vv0sbWvZnjuXbdwEnD8o9T9TlLUyGYFQ892i9D3jdWbKCTa+Xge1LV7jc1jZKVr0YrOyZFZfgJf/CAm/W4MZmn7sotTfM1bk51nhWm6qR5K93dqZPunZkmlXGdjKoHU32e2nzf8jTg1yK1e7xt8DMrLooqe7XXp7vaRblQOsq0soek+E+qq/g2PmM+9ZX39t+r12J+y/ZV2w7b7tkSVNy81d+NRPT2H9qNxx7EPDcoW+DO2sdDUj7u3EH1DhSem6JDVHpuqA7R0HMzdogqz43cIao9N4GHaOS5gTxAMVsmhiD33LAegE4q7FVmbiocnbwbfvAXvrW10AplbmRzdHJlYW0KZW5kb2JqCjM1IDAgb2JqCjw8L1R5cGUvWFJlZi9XWzEgMiAyXS9Sb290IDMzIDAgUi9JbmRleFswIDM2XS9JRCBbPDQxOWI4MjMzNzQ0MjBiNWU5OWZkYThlNzUwN2IwOWM5PjxiYjI0NzhkNjI2ODQwM2IxMmFlZjhhMDk0M2Q3NzlhMz5dL0xlbmd0aCAxMTMvSW5mbyAzNCAwIFIvU2l6ZSAzNi9GaWx0ZXIvRmxhdGVEZWNvZGU+PnN0cmVhbQp4nCXNOxKCYBSD0VzEF4L4woaxhdJGBXtWZUvBCliFrSV7+73fkOJMisxEUgj2/Eqm3Hn9nHKQImU6wRlkj9GpPk7dOvd+nlzs3c3NIIIFxLCEFaxhA1tIYAcpZHCEHPZwgAKu1kx+2d5EQvgDODoNGAplbmRzdHJlYW0KZW5kb2JqCnN0YXJ0eHJlZgoxNTQzMAolJUVPRgo="
            },
            {
                "attchmentId": 282141,
                "mimeType": "docx",
                "displayName": "Patient Chart",
                "insertDate": 1544635714512,
                "fileName": "Birt%20Patient%20Chart1544599713322",
                "encodedFile": "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"
            },
            {
                "attchmentId": 282140,
                "mimeType": "pdf",
                "displayName": "External Referrals",
                "insertDate": 1544635714511,
                "fileName": "Birt%20External%20Referral%20Report1544599714344",
                "encodedFile": "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"
            },
            {
                "attchmentId": 281980,
                "mimeType": "pdf",
                "displayName": "Medication Prescription",
                "insertDate": 1543869552470,
                "fileName": "Internal%20Medication%20Referrals1543833552308",
                "encodedFile": "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"
            },
            {
                "attchmentId": 281979,
                "mimeType": "docx",
                "displayName": "Patient Chart",
                "insertDate": 1543869552470,
                "fileName": "Birt%20Patient%20Chart1543833552058",
                "encodedFile": "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"
            },
            {
                "attchmentId": 281922,
                "mimeType": "docx",
                "displayName": "Patient Chart",
                "insertDate": 1543591682152,
                "fileName": "Birt%20Patient%20Chart1543555681751",
                "encodedFile": "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"
            },
            {
                "attchmentId": 281454,
                "mimeType": "docx",
                "displayName": "Patient Chart",
                "insertDate": 1541600775061,
                "fileName": "Birt%20Patient%20Chart1541564773017",
                "encodedFile": "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"
            }
        ]
    }`);

    container2.innerHTML = bulkArrAct.data.map(mapReports).join('\n\n');

    
}

//vitals
async function saveVitalsToOffline(vitals)
{
    console.log("saveVitalsToOffline---------start-----------");
    // console.log("response=> ");
    // console.log(vitals);

    
//db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                vitals: "vitalId"
            }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//

// //db put//

    // console.log("final data => ");
    // console.log(JSON.parse("["+ JSON.stringify(vitals) +"]"));
    // console.log(vitals);

    // db.vitals.bulkPut(JSON.parse("["+ JSON.stringify(vitals) +"]"))
    await db.vitals.bulkPut(vitals)
    .then(function(lastKey){
        console.error("data saved to offline");
    })
    .catch(Dexie.bulkError, function(e) 
    {
        console.error("unable to add to offline");
        // showMessage("incorrect username or password");
        // alert ("person Ooops: " + error);
    });


    console.log("saveVitalsToOffline---------end-----------");
}
//medications
async function saveMedicationsToOffline(medications)
{
    console.log("saveMedicationToOffline---------start-----------");
    // console.log("response=> ");
    // console.log(medications);

    
//db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                medications: "medicationId"
            }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//

// //db put//

    // console.log("final data => ");
    // console.log(JSON.parse("["+ JSON.stringify(vitals) +"]"));
    // console.log(vitals);

    // db.vitals.bulkPut(JSON.parse("["+ JSON.stringify(vitals) +"]"))
    await db.medications.bulkPut(medications)
    .then(function(lastKey){
        console.error("data saved to offline");
    })
    .catch(Dexie.bulkError, function(e) 
    {
        console.error("unable to add to offline");
        // showMessage("incorrect username or password");
        // alert ("person Ooops: " + error);
    });


    console.log("saveMedicationToOffline---------end-----------");
}
//appointments
async function saveAppointmentsToOffline(appointments)
{
    console.log("saveAppointmentsToOffline---------start-----------");
    // console.log("response=> ");
    // console.log(vitals);

    
//db open
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores(
            {
                appointments: "appointmentId"
            }
        );
    db.open().catch (function (err) {
        console.error('Failed to open db: ' + (err.stack || err));
    });
// //--//

// //db put//

    
    await db.appointments.bulkPut(appointments)
    .then(function(lastKey){
        console.error("data saved to offline");
    })
    .catch(Dexie.bulkError, function(e) 
    {
        console.error("unable to add to offline");
        // showMessage("incorrect username or password");
        // alert ("person Ooops: " + error);
    });


    console.log("saveAppointmentsToOffline---------end-----------");
}

//dexie initialization
function indexDbInit()
{
    let dbname = "icalite_index";
    let dbversion=1;

    db = new Dexie(dbname);
    db.version(dbversion).stores({
        dummy: 'id',
        person: 'personId',
        activities: 'id',
        actions: 'id',
        vitals: 'vitalId',
        appointments:'appointmentId',
        medications:'medicationId'
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

function checkSessionFromInside() 
{
    let personId = window.sessionStorage.getItem("personId");

    try {
        if (personId == null || personId == "") 
        {
            console.log("sess from inside => session not present");
            window.location.replace("index.html");
        }  
        else{
            console.log("sess from inside => session present");
        }
    } catch (error) {
        console.log("sess from inside => eerrr session not present");
        window.location.replace("index.html");
    }
      
}

function checkSessionOnLogin() 
{
    let personId = window.sessionStorage.getItem("personId");

    try {

        if (personId == null || personId == "") 
        {
            console.log("sess from login => session not present");
        }  
        else{
            console.log("sess from login => session present");
            window.location.replace("dash_patient.html");
        }
    } catch (error) {
        console.log("sess from login => error in checking");
    }
      
}

function initializeView()
{
    var sPath = window.location.pathname;
    //var sPage = sPath.substring(sPath.lastIndexOf('\\') + 1);
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    // alert(sPage);

    // console.log("spage => "+sPage);
    if(sPage == "" || sPage=="index.html")
    {
        checkSessionOnLogin();
        // alert("getting vitals");

        // fetchVitals();
        console.log("index activity");

        const btn_login = document.getElementById('btn_login');
        btn_login.addEventListener('click',validateLogin);
        // const container2 = document.getElementById('container2');
        // fetchOfflineActivities(container2);

    }
    else {
        checkSessionFromInside();
        populateDrawerData();

        if(sPage == "dash_patient.html")
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
        else if(sPage == "vitals_view.html")
        {
            // alert("getting vitals");
            const container2 = document.getElementById('container2');
            fetchVitals(container2);
    
            // const btn_back = document.getElementById('btn_back');
    
            // //--//
            // btn_back.addEventListener("click", function()
            // {
    
            //     console.log("back to list");
            //     // window.location.href="page1.html";
            // });
            
    
    
        }
        else if(sPage == "vitals_view_det.html")
        {            
            console.log("vital_dttm object");

            fetchOfflineVitalsWhere();
            // populateVitalDetails();


            // const vital_dttm = document.getElementById('vital_dttm');

            // console.log("vital_dttm value set");
            // var vitals = getSelectedVital();
            // vital_dttm.innerHTML = vitals.vitalDate;

            console.log("vital deails populating finished");
    
        }
        else if(sPage == "medi_view.html")
        {            
            console.log("medi view object");

            const container2 = document.getElementById('container2');
            fetchMedications(container2);


            // const vital_dttm = document.getElementById('vital_dttm');

            // console.log("vital_dttm value set");
            // var vitals = getSelectedVital();
            // vital_dttm.innerHTML = vitals.vitalDate;

            console.log("medication populating finished");
    
        }
        else if(sPage == "demogrp_view.html")
        {
            console.log("demographics view");

            // const demogrp_name = document.getElementById('demogrp_name');

            fetchDemographics();

            // alert("getting demograp");
        }
        else if(sPage == "demogrp_update.html")
        {
            console.log("demographics update");

            // const demogrp_name = document.getElementById('demogrp_name');

            fetchDemographicsForUpdate();

            // alert("getting demograp");
        }
        else if(sPage == "report_view.html")
        {
            // alert("getting demograp");
            console.log("reports view");
            const container2 = document.getElementById('container2');

            fetchReports(container2);

        }
        else if(sPage == "appnt_view.html")
        {
            console.log("appointments view");

            const container2 = document.getElementById('container2');

            fetchAppointments(container2);
        }
        else if(sPage == "appnt_view_det.html")
        {

            // console.log("appointments det view");
            // console.log("appointmentId_slctd => ");
            // console.log(appointmentId_slctd);


            fetchOfflineAppointmentsWhere();

            console.log("appointments deails populating finished");
        }
        else
        {
            console.log("incorrect page");
        }

    }

}

function goToAppointmentView()
{
    // console.log("going to next view");
    // window.location.href = "view_appointment.html";
    window.location.href = "appnt_view.html";
}

function goToAppointmentNew()
{
    // console.log("going to next view");
    window.location.href = "appnt_new.html";
}
function goToVitalNew()
{
    // console.log("going to next view");
    window.location.href = "vitals_add.html";
}
function goToVitalView()
{
    console.log("going to next view");
    window.location.href = "vitals_view.html";

    
}
function goToDemographView()
{
    // console.log("going to next view");
    window.location.href = "demogrp_view.html";
}
function goToDemographUpdate()
{
    // console.log("going to next view");
    window.location.href = "demogrp_update.html";
}
function goToMedicationView()
{
    // console.log("going to next view");
    window.location.href = "medi_view.html";
}
function goToReportsView()
{
    // console.log("going to next view");
    window.location.href = "report_view.html";
}

function viewReport(fileName, fileType, fileStr)
{
    // alert("Viewing report");
    console.log("viewing report");
    console.log("fileName => "+fileName);
    console.log("file type => "+fileType);

    if(fileType == "pdf")
    {
        // var base64 = "base64 content";
        console.log("opening file");




        // var dataURI = "data:application/pdf;base64, "+fileStr; // shortened

        // var base64Index = dataURI.indexOf(fileStr) + fileStr.length;
        // var base64 = dataURI.substring(base64Index);
        // var raw = window.atob(base64);
        // var rawLength = raw.length;
        // var array = new Uint8Array(new ArrayBuffer(rawLength));

        // for(var i = 0; i < rawLength; i++) {
        //     array[i] = raw.charCodeAt(i);
        // }
        // // return array;


        // // var pdfAsArray = convertDataURIToBinary(pdfAsDataUri);
        // PDFJS.getDocument(array);











        // window.open("data:application/pdf;base64, " + fileStr);



        // var objbuilder = '';
        // objbuilder += ('<object width="100%" height="100%"      data="data:application/pdf;base64,');
        // objbuilder += (fileStr);
        // objbuilder += ('" type="application/pdf" class="internal">');
        // objbuilder += ('<embed src="data:application/pdf;base64,');
        // objbuilder += (fileStr);
        // objbuilder += ('" type="application/pdf" />');
        // objbuilder += ('</object>');


        // var win = window.open("","_blank","titlebar=yes");
        // win.document.title = "My Title";
        // win.document.write('<html><body>');
        // win.document.write(objbuilder);
        // win.document.write('</body></html>');
        // layer = jQuery(win.document);





        let pdfWindow = window.open("");
        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf; headers=filename%3D"+fileName+"; base64, " + fileStr + "'></iframe>");
        // pdfWindow.document.write("<iframe width='100%' height='100%' ><object data='Docs/PDFS/PDFs_103170940341.pdf' type='application/pdf;base64, ;base64, " +fileStr+"' width='100%' height='100%'></object></iframe>");

        
        
        console.log("file opened");
        // console.log("incorrect format");
    }
    else if(fileType == "jpg")
    {

        var image = new Image();
        image.src = "data:image/jpg;base64," + fileStr;

        var w = window.open("");
        w.document.write(image.outerHTML);

    }
    else if(fileType == "docx")
    {
        let pdfWindow = window.open("");
        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/docx; headers=filename%3D"+fileName+"; base64, " + fileStr + "'></iframe>");
    }
    else{
        console.log("incorrect format");
    }

    // var base64 = "base64 content";
    // let pdfWindow = window.open("");
    // pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + base64 + "'></iframe>");
}


function setSelectedVitalDetails(vitalId)
{
    // vitalId_slctd = vitalId;

    window.sessionStorage.setItem("vitalId",vitalId);

    window.location.assign('vitals_view_det.html');
    
}


function populateVitalDetails(vital) 
{

    // console.log("vitalId_slctd => "+vital.vitalId);
    // var resp = await fetchOfflineVitalsWhere(vitalId_slctd);

    // console.log("populate response=>");
    // console.log(vital);

    


    try {

        const vital_dttm = document.getElementById("vital_dttm");
        const vital_pulse = document.getElementById("vital_pulse");
        const vital_bp = document.getElementById("vital_bp");
        const vital_temp = document.getElementById("vital_temp");
        const vital_resprate = document.getElementById("vital_resprate");
        const vital_height = document.getElementById("vital_height");
        const vital_weight = document.getElementById("vital_weight");
        const vital_spo2 = document.getElementById("vital_spo2");
        const vital_sugarr = document.getElementById("vital_sugarr");
        const vital_sugarf = document.getElementById("vital_sugarf");
        const vital_gir = document.getElementById("vital_gir");
        const vital_painscale = document.getElementById("vital_painscale");
        const vital_fallrisk = document.getElementById("vital_fallrisk");
        const vital_remarks = document.getElementById("vital_remarks");
        const vital_bmi = document.getElementById("vital_bmi");



        let vital_datetime = new Date(vital.vitalDate);

        // console.log("vital.vitalDate => "+vital.vitalDate);
        // console.log("vital_datetime => "+vital_datetime);

        if(vital.vitalDate == "" || vital.vitalDate==null)
        {
            vital_dttm.innerHTML = "~";
            // date = "~";
            // vital_date.innerHTML = "~";
            // vital_time.innerHTML = "~";
        }
        else{

            let
        //  day = vitalDate.getDay(),
            dd = vital_datetime.getDate(),
            mm = vital_datetime.getMonth(), 
            yy = vital_datetime.getFullYear(), 
            hh = vital_datetime.getHours(),
            min = vital_datetime.getMinutes(), 
            sec = vital_datetime.getSeconds(),
            meridian="AM";

            // var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            if(hh<12)
            {
                meridian = "PM";
            }
            else{
                meridian = "AM";   
            }

            let date = dd+"-"+months[mm]+"-"+yy,
            time = hh+":"+min+":"+sec+" "+meridian;


            // console.log("date=>"+date);
            // console.log("tmie=>"+time);
            vital_dttm.innerHTML = date+", "+time;
            // vital_date.innerHTML = date;
            // vital_time.innerHTML = time;
        }



        //pulse
        if(vital.pulse == "" || vital.pulse==null)
        {
            vital_pulse.innerHTML = "~";
        }
        else{
            vital_pulse.innerHTML = vital.pulse;
        }


        //bp
        if(vital.bpSystolic == "" || vital.bpSystolic==null)
        {
            if(vital.bpDistolic == "" || vital.bpDistolic==null)
            {
                vital_bp.innerHTML = "~";
            }
            else{
                vital_bp.innerHTML = "~/"+vital.bpDistolic;
            }
        }
        else{
            // vital_bp.innerHTML = vital.pulse;
            if(vital.bpDistolic == "" || vital.bpDistolic==null)
            {
                vital_bp.innerHTML = vital.bpSystolic+"/~";
            }
            else{
                vital_bp.innerHTML = vital.bpSystolic+"/"+vital.bpDistolic;
            }
        }

        //temp
        if(vital.tmprature == "" || vital.tmprature==null)
        {
            vital_temp.innerHTML = "~";
        }
        else{
            vital_temp.innerHTML = vital.tmprature;
        }

        //resp rate
        if(vital.respirationRate == "" || vital.respirationRate==null)
        {
            vital_resprate.innerHTML = "~";
        }
        else{
            vital_resprate.innerHTML = vital.respirationRate;
        }

        //height
        if(vital.height == "" || vital.height==null)
        {
            vital_height.innerHTML = "~";
        }
        else{
            vital_height.innerHTML = vital.height;
        }

        //weight
        if(vital.weight == "" || vital.weight==null)
        {
            vital_weight.innerHTML = "~";
        }
        else{
            vital_weight.innerHTML = vital.weight;
        }

        //spo2
        if(vital.spo2 == "" || vital.spo2==null)
        {
            vital_spo2.innerHTML = "~";
        }
        else{
            vital_spo2.innerHTML = vital.spo2;
        }

        //sugarr
        if(vital.bloodSugarR == "" || vital.bloodSugarR==null)
        {
            vital_sugarr.innerHTML = "~";
        }
        else{
            vital_sugarr.innerHTML = vital.bloodSugarR;
        }

        //sugarf
        if(vital.blooSugarF == "" || vital.blooSugarF==null)
        {
            vital_sugarf.innerHTML = "~";
        }
        else{
            vital_sugarf.innerHTML = vital.blooSugarF;
        }

        //gir
        if(vital.gir == "" || vital.gir==null)
        {
            vital_gir.innerHTML = "~";
        }
        else{
            vital_gir.innerHTML = vital.gir;
        }

        //painscale
        if(vital.painScale == "" || vital.painScale==null)
        {
            vital_painscale.innerHTML = "~";
        }
        else{
            vital_painscale.innerHTML = vital.painScale;
        }

        //fall risk
        if(vital.fallRisk == "" || vital.fallRisk==null)
        {
            vital_fallrisk.innerHTML = "~";
        }
        else{
            vital_fallrisk.innerHTML = vital.fallRisk;
        }

        //remarks
        if(vital.remarks == "" || vital.remarks==null)
        {
            vital_remarks.innerHTML = "~";
        }
        else{
            vital_remarks.innerHTML = vital.remarks;
        }

        //bmi
        if(vital.bmi == "" || vital.bmi==null)
        {
            vital_bmi.innerHTML = "~";
        }
        else{
            vital_bmi.innerHTML = vital.bmi;
        }



    } catch (error) {
        console.log(error);
        alert("unable to populate data");
    }

}

//appointments

function setSelectedAppointmentDetails(appointmentId)
{
    window.sessionStorage.setItem("appointmentId", appointmentId);

    // console.log("setSelectedAppointmentDetails");
    // console.log("appointment id => "+appointmentId);    
    // appointmentId_slctd = appointmentId;
    // console.log("appointmentId_slctd => "+appointmentId_slctd);
    // alert("check values");
    window.location.assign('appnt_view_det.html');
    
}
function populateAppointmentDetails(appointments) 
{


    // console.log("populate response=>");
    // console.log(appointment);

    try {
        
        const appnt_date = document.getElementById("appnt_date");
        const appnt_name = document.getElementById("appnt_name");
        const appnt_specialty = document.getElementById("appnt_specialty");
        const appnt_type = document.getElementById("appnt_type");
        const appnt_shift = document.getElementById("appnt_shift");
        const appnt_time = document.getElementById("appnt_time");
        const appnt_slottime = document.getElementById("appnt_slottime");
        const appnt_remarks = document.getElementById("appnt_remarks");



        let appointmentDate = new Date(appointments.appointmentDate);

        if(appointments.appointmentDate == "" || appointments.appointmentDate==null)
        {
            // date = "~";
            appnt_date.innerHTML = "~";
            appnt_time.innerHTML = "~";
        }
        else{

            let
        //  day = vitalDate.getDay(),
            dd = appointmentDate.getDate(),
            mm = appointmentDate.getMonth(), 
            yy = appointmentDate.getFullYear(), 
            hh = appointmentDate.getHours(),
            min = appointmentDate.getMinutes(), 
            sec = appointmentDate.getSeconds(),
            meridian="AM";

            // var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            if(hh<12)
            {
                meridian = "PM";
            }
            else{
                meridian = "AM";   
            }

            let date = dd+"-"+months[mm]+"-"+yy,
            time = hh+":"+min+":"+sec+" "+meridian;


            appnt_date.innerHTML = date;
            appnt_time.innerHTML = time;
        }

        
        appnt_name.innerHTML = appointments.doctorname;
        appnt_specialty.innerHTML = appointments.speciality;
        appnt_type.innerHTML = appointments.type;
        appnt_shift.innerHTML = appointments.doctorShift;
        appnt_slottime.innerHTML = appointments.slotDuration;
        appnt_remarks.innerHTML = appointments.remarks;



    } catch (error) {
        console.log(error);
        alert("unable to populate data");

        appnt_date.innerHTML = "~";
        appnt_time.innerHTML = "~";
        appnt_name.innerHTML = "~";
        appnt_specialty.innerHTML =  "~";
        appnt_type.innerHTML =  "~";
        appnt_shift.innerHTML =  "~";
        appnt_slottime.innerHTML =  "~";
        appnt_remarks.innerHTML =  "~";
    }

}
//--appointment--//





// function setSelectedVital(vitals)
// {
//     vitals_selected = vitals;
// }

// function getSelectedVital()
// {
//     return vitals_selected;
// }
//-------------------------------VIEW HANDLING----------------------------//





document.addEventListener('DOMContentLoaded', initialize);