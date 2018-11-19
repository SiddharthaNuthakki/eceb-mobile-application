// Initialize your app
var myApp = new Framework7({
    modalTitle: 'ECEB',
    pushState: true,
    material: true,
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    domCahce: true,
});

//Modals/Alert/Confirm
myApp.onPageInit('babieslist', function (page) {
    $$('.confirm-ok-cancel').on('click', function () {
        myApp.confirm('Are you sure?',
            function () {
                myApp.alert('You clicked Ok button');
                window.location.href = "Baby1.html"
            },
            function () {
                myApp.alert('You clicked Cancel button');
            }
        );
    });
});

$$('.confirm-title-ok-cancel').on('click', function () {
    myApp.confirm('Are you sure?', 'Custom Title',
        function () {
            myApp.alert('You clicked Ok button');
        },
        function () {
            myApp.alert('You clicked Cancel button');
        }
    );
});

//Model/Action sheet
//- With callbacks on click
myApp.onPageInit('babyphase2', function (page) {
    $$('#BabyPhase2Button').on('click', function () {
        showalert();
    });
});

function showalert() {
    var buttons1 = [
        {
            text: 'Normal',
            bg: 'green',
            onClick: function () {
                myApp.alert('Normal clicked');
                location.href = "Normalcondition.html"
            }
        },
    ];
    var buttons2 = [
        {
            text: 'Problem',
            label: true,
            bg: 'yellow'
        },
        {
            text: 'Abnormal temperature',
            onClick: function () {
                myApp.alert('Abnormal temperature clicked');
                location.href = "ProblemAbnTemp.html"
            }
        },
        {
            text: 'Under 2000g',
            onClick: function () {
                myApp.alert('Under 2000g clicked');
                location.href = "ProblemUnderWt.html"
            }
        },
        {
            text: 'Poor feeding',
            onClick: function () {
                myApp.alert('Poor feeding clicked');
                location.href = "ProblemPoorFeeding.html"
            }
        }
    ];
    var buttons3 = [
        {
            text: 'Danger Sign',
            bg: 'red',
            label: true
        },
        {
            text: 'Fast breathing, chest indrawing etc.',
            onClick: function () {
                myApp.alert('Danger sign clicked');
                location.href = "DangerSign.html"
            }
        },
        {
            text: '<1500g or Severe Jaundice',
            onClick: function () {
                myApp.alert('<1500g or Severe Jaundice clicked');
                var SevereJaundiceOr1500g = true;
                var Seekadvancedcare = true;
                var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
                var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
                var babyno = babydata[currentbabyno].child_no;

                if (window.localStorage.getItem('severejaundicelist') === null) {
                    var severejaundice = [];
                    var severejaundiceList = window.localStorage;
                    severejaundice.push({
                        child_no: babyno,
                        severejaundice: SevereJaundiceOr1500g,
                        seekadvancedcare: Seekadvancedcare
                    });
                }
                else {
                    var severejaundiceList = window.localStorage;
                    var severejaundice = JSON.parse(window.localStorage.getItem('severejaundicelist'));
                    var matches = $.grep(severejaundice, function(obj) {
                        return obj.child_no == babyno;
                    });
                    if (matches.length) {
                        alert('Duplicate childno, item not added');
                    } else {
                        severejaundice.push({
                            child_no: babyno,
                            severejaundice: SevereJaundiceOr1500g,
                            seekadvancedcare: Seekadvancedcare
                        });
                    }
                }
                severejaundiceList.setItem('severejaundicelist', JSON.stringify(severejaundice));
            }
        },
    ];
    var buttons4 = [
        {
            text: 'Cancel',
            color: 'red',
            onClick: function () {
                myApp.alert('Cancel clicked');
            }
        },
    ];
    var groups = [buttons1, buttons2, buttons3, buttons4];
    myApp.actions(groups);
}

// Callbacks to run specific code for specific pages, for example for IndividualLogin page:
myApp.onPageInit('indivlogin', function (page) {
    // run createContentPage func after link was clicked
    $$('#indiv-Submit').on('click', function () {
        login();
    });
});

function login() {
    var id = document.getElementById("user").value;
    var pass = document.getElementById("pass").value;

    $$.ajax({
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        cache: false,
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(id + ":" + pass));
        },
        url: 'https://play.dhis2.org/2.27/api/27/me',

        success: function (response) {
            console.log(response);
            window.localStorage.setItem("UserProfile", JSON.stringify(response));
            window.localStorage.setItem("loginDetails", JSON.stringify(id+" "+pass));
            alert("Login Sucessful");
            location.href = "BabiesList.html";
            //alert(JSON.parse(response[3]));
        },
        error: function (xhr, status) {
            console.log("error: " + status);
            alert("Login Failed");
        }

    });

}


function logout() {
    console.log("in logout");
    window.localStorage.removeItem("loginDetails");
    location.href="index.html";
}
// Callbacks to run specific code for specific pages, for example for About page:
//myApp.onPageInit('addbaby', function (page) {
//    // run createContentPage func after link was clicked
//    $$('#Createbaby-Button').on('click', function () {
//        generateBaby();
//    });
//});

/*function generateBaby() {
    var child = document.getElementById("Child No.").value;
    var bed = document.getElementById("Bed No.").value;
    var gen = document.getElementById("Gender").value;
    var mothname = document.getElementById("Mother Name").value;
    var bday = document.getElementById("Birth Date time").value;
    alert(child+':'+bed+','+gen+','+mothname+','+bday);
}*/

// //confirm function
// myApp.confirm(text, [title, callbackOk, callbackCancel]) {
//     $$('.confirm-title-ok').on('click', function () {
//         myApp.confirm('Are you sure?', 'Custom Title', function () {
//             myApp.alert('You clicked Ok button');
//         });
//     });
//
// }

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

// Generate dynamic page
var dynamicPageIndex = 0;

function createContentPage() {
    mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
    return;
}


function backaddbaby() {
    location.href = "AddBaby.html";
}

var value1 = 0;
var value2 = 100;
var value3 = 200;
function addBaby() {
    var childno = document.getElementById("childNo").value;
    var bedno = document.getElementById("bedNo").value;
    var gender = document.getElementById("Gender").value;
    var mothername = document.getElementById("motherName").value;
    var birthdate = document.getElementById("birthDateTime").value;
    var birthdatetime = new Date(birthdate);
    var TimeinSeconds = birthdatetime.getTime();

    if (window.localStorage.getItem('babieslist') === null) {
        var babies = [];
        var babyList = window.localStorage;
        babies.push({
            child_no: childno,
            bed_no: bedno,
            gender: gender,
            mother_name: mothername,
            birthDateTime: birthdatetime,
            timeinseconds: TimeinSeconds
        });
    }
    else {
        var babyList = window.localStorage;
        var babies = JSON.parse(window.localStorage.getItem('babieslist'));
        var matches = $.grep(babies, function(obj) {
            return obj.child_no == childno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            babies.push({
                child_no: childno,
                bed_no: bedno,
                gender: gender,
                mother_name: mothername,
                birthDateTime: birthdatetime,
                timeinseconds: TimeinSeconds
            });
        }
    }
    babyList.setItem('babieslist', JSON.stringify(babies));
    location.href = "BabiesList.html";
}


function backbabieslist() {
    location.href = "BabiesList.html";
}


function babyDetails() {
    var skintoskin = document.getElementById("skinToSkin").checked;
    var breathing = document.getElementById("Breathing").checked;
    var breastfeeding = document.getElementById("breastFeeding").checked;
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babydata[currentbabyno].child_no;

    if (window.localStorage.getItem('babydetails') === null) {
        var babiesdetails = [];
        var babydetailsList = window.localStorage;
        babiesdetails.push({
            child_no: babyno,
            skin_skin: skintoskin,
            breath: breathing,
            breast_feeding: breastfeeding
        });
    } else {
        var babydetailsList = window.localStorage;
        var babiesdetails = JSON.parse(window.localStorage.getItem('babydetails'));
        var matches = $.grep(babiesdetails, function(obj) {
            return obj.child_no == babyno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            babiesdetails.push({
                child_no: babyno,
                skin_skin: skintoskin,
                breath: breathing,
                breast_feeding: breastfeeding
            });
        }
    }
    babydetailsList.setItem('babydetails', JSON.stringify(babiesdetails));
    location.href = "BPhase2.html";
}

function backbabyphase1() {
    location.href = "BPhase1.html";
}


function babyDetails1() {
    var eyecare = document.getElementById("Eyecare").checked;
    var cordcare = document.getElementById("Cordcare").checked;
    var vitamink = document.getElementById("VitaminK").checked;
    var examine = document.getElementById("exam").value;
    var temperature = document.getElementById("temperature").value;
    var weight = document.getElementById("weight").value;
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babydata[currentbabyno].child_no;


    if (window.localStorage.getItem('babydetails1') === null) {
        var babiesdetails1 = [];
        var babydetailsList1 = window.localStorage;
        babiesdetails1.push({
            child_no: babyno,
            eye_care: eyecare,
            cord_care: cordcare,
            vitamin_k: vitamink,
            examination: examine,
            temp: temperature,
            weight: weight
        });
    } else {
        var babydetailsList1 = window.localStorage;
        var babiesdetails1 = JSON.parse(window.localStorage.getItem('babydetails1'));
        var matches = $.grep(babiesdetails1, function(obj) {
            return obj.child_no == babyno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            babiesdetails1.push({
                child_no: babyno,
                eye_care: eyecare,
                cord_care: cordcare,
                vitamin_k: vitamink,
                examination: examine,
                temp: temperature,
                weight: weight
            });
        }
    }
    babydetailsList1.setItem('babydetails1', JSON.stringify(babiesdetails1));
    showalert();
}

function backbabyphase2() {
    location.href = "BPhase2.html";
}


function normal() {
    var normtemp = document.getElementById("NormalTemp").checked;
    var breastfeed = document.getElementById("Breastfeeding").checked;
    var advicebrstfeed = document.getElementById("AdviceOnBreastFeeding").checked;
    var immunize = document.getElementById("Immunize").checked;
    var discharge = document.getElementById("BabyForDischarge").checked;
    var homecare = document.getElementById("HomeCare").checked;
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babydata[currentbabyno].child_no;


    if (window.localStorage.getItem('normaldetails') === null) {
        var normaldetails = [];
        var normaldetailsList = window.localStorage;
        normaldetails.push({
            child_no: babyno,
            norm_temp: normtemp,
            breast_feed: breastfeed,
            advice_breastfeed: advicebrstfeed,
            immune: immunize,
            discharge: discharge,
            homecare: homecare
        });
    } else {
        var normaldetailsList = window.localStorage;
        var normaldetails = JSON.parse(window.localStorage.getItem('normaldetails'));
        var matches = $.grep(normaldetails, function(obj) {
            return obj.child_no == babyno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            normaldetails.push({
                child_no: babyno,
                norm_temp: normtemp,
                breast_feed: breastfeed,
                advice_breastfeed: advicebrstfeed,
                immune: immunize,
                discharge: discharge,
                homecare: homecare
            });
        }
    }
    normaldetailsList.setItem('normaldetails', JSON.stringify(normaldetails));
    location.href = "submit.html";
}

// function disablecontinuedsupport() {
//     if (document.getElementById("NormalTemperature").checked === true) {
//         $('.continuedsupport').attr('disabled', true);
//         document.getElementById("ContinuedThermalSupport").checked = false;
//         document.getElementById("ContinuedSupport").checked = false;
//     } else {
//         $('.continuedsupport').attr('disabled', false);
//     }
// };
//
// function disablenormal() {
//     if (document.getElementById("ContinuedThermalSupport").checked === true) {
//         $('.normal').attr('disabled', true);
//         document.getElementById("NormalTemp").checked = false;
//         document.getElementById("Breastfeeding").checked = false;
//         document.getElementById("AdviceOnBreastFeeding").checked = false;
//         document.getElementById("Immunize").checked = false;
//         document.getElementById("BabyForDischarge").checked = false;
//         document.getElementById("HomeCare").checked = false;
//     } else {
//         $('.normal').attr('disabled', false);
//     }
// };

function abnormal() {
    var abnormaltemperature = true;
    var thermalcare = document.getElementById("ThermalCare").checked;
    var normal = document.getElementById("NormalTemperature").checked;
    var normtemp = document.getElementById("NormalTemp").checked;
    var breastfeed = document.getElementById("Breastfeeding").checked;
    var advicebrstfeed = document.getElementById("AdviceOnBreastFeeding").checked;
    var immunize = document.getElementById("Immunize").checked;
    var discharge = document.getElementById("BabyForDischarge").checked;
    var homecare = document.getElementById("HomeCare").checked;
    var continuedthermalsupport = document.getElementById("ContinuedThermalSupport").checked;
    var continuedsupport = document.getElementById("ContinuedSupport").checked;
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babydata[currentbabyno].child_no;


    if (window.localStorage.getItem('abnormaldetails') === null) {
        var abnormaldetails = [];
        var abnormaldetailsList = window.localStorage;
        abnormaldetails.push({
            child_no: babyno,
            abnormaltemperature: abnormaltemperature,
            thermalcare: thermalcare,
            normal: normal,
            norm_temp: normtemp,
            breast_feed: breastfeed,
            advice_breastfeed: advicebrstfeed,
            immune: immunize,
            discharge: discharge,
            homecare: homecare,
            continuedthermalsupport: continuedthermalsupport,
            continuedsupport: continuedsupport
        });
    } else {
        var abnormaldetailsList = window.localStorage;
        var abnormaldetails = JSON.parse(window.localStorage.getItem('abnormaldetails'));
        var matches = $.grep(abnormaldetails, function(obj) {
            return obj.child_no == babyno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            abnormaldetails.push({
                child_no: babyno,
                abnormaltemperature: abnormaltemperature,
                thermalcare: thermalcare,
                normal: normal,
                norm_temp: normtemp,
                breast_feed: breastfeed,
                advice_breastfeed: advicebrstfeed,
                immune: immunize,
                discharge: discharge,
                homecare: homecare,
                continuedthermalsupport: continuedthermalsupport,
                continuedsupport: continuedsupport
            });
        }
    }
    abnormaldetailsList.setItem('abnormaldetails', JSON.stringify(abnormaldetails));
}


function underwt() {
    var skintoskin = document.getElementById("ThermalCare").checked;
    var continuedsupport = document.getElementById("ContinuedSupport").checked;
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babydata[currentbabyno].child_no;


    if (window.localStorage.getItem('underwtdetails') === null) {
        var underwtdetails = [];
        var underwtdetailsList = window.localStorage;
        underwtdetails.push({
            child_no: babyno,
            skin_skin: skintoskin,
            continuedsupport: continuedsupport
        });
    } else {
        var underwtdetailsList = window.localStorage;
        var underwtdetails = JSON.parse(window.localStorage.getItem('underwtdetails'));
        var matches = $.grep(underwtdetails, function(obj) {
            return obj.child_no == babyno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            underwtdetails.push({
                child_no: babyno,
                skin_skin: skintoskin,
                continuedsupport: continuedsupport
            });
        }
    }
    underwtdetailsList.setItem('underwtdetails', JSON.stringify(underwtdetails));
}


function poorfeeding() {
    var breastmilk = document.getElementById("BreastMilk").checked;
    var feeding = document.getElementById("AlternateFeedingMethod").checked;
    var continuedsupport = document.getElementById("ContinuedSupport").checked;
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babydata[currentbabyno].child_no;

    if (window.localStorage.getItem('poorfeedingdetails') === null) {
        var poorfeedingdetails = [];
        var poorfeedingdetailsList = window.localStorage;
        poorfeedingdetails.push({
            child_no: babyno,
            breastmilk: breastmilk,
            feeding: feeding,
            continuedsupport: continuedsupport
        });
    } else {
        var poorfeedingdetailsList = window.localStorage;
        var poorfeedingdetails = JSON.parse(window.localStorage.getItem('poorfeedingdetails'));
        var matches = $.grep(poorfeedingdetails, function(obj) {
            return obj.child_no == babyno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            poorfeedingdetails.push({
                child_no: babyno,
                breastmilk: breastmilk,
                feeding: feeding,
                continuedsupport: continuedsupport
            });
        }
    }
    poorfeedingdetailsList.setItem('poorfeedingdetails', JSON.stringify(poorfeedingdetails));
}


function dangersign() {
    var valuesss = $('#dangersign').val();
    var antibiotics = document.getElementById("Antibiotics").checked;
    var advancedcare = document.getElementById("seekAdvancedCare").checked;
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babydata = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babydata[currentbabyno].child_no;

    if (window.localStorage.getItem('dangersigndetails') === null) {
        var dangersigndetails = [];
        var dangersigndetailsList = window.localStorage;
        dangersigndetails.push({
            child_no: babyno,
            DangerSigns: valuesss,
            antibiotics: antibiotics,
            advancedcare: advancedcare
        });
    } else {
        var dangersigndetailsList = window.localStorage;
        var dangersigndetails = JSON.parse(window.localStorage.getItem('dangersigndetails'));
        var matches = $.grep(dangersigndetails, function(obj) {
            return obj.child_no == babyno;
        });
        if (matches.length) {
            alert('Duplicate childno, item not added');
        } else {
            dangersigndetails.push({
                child_no: babyno,
                DangerSigns: valuesss,
                antibiotics: antibiotics,
                advancedcare: advancedcare
            });
        }
    }
    dangersigndetailsList.setItem('dangersigndetails', JSON.stringify(dangersigndetails));
}


function babyTimer() {
    var x = setInterval(function () {
        var list = JSON.parse(window.localStorage.getItem('babieslist'));
        for (i = 0; i < list.length; i++) {
            var birthDate = list[i].timeinseconds;

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the birth date
            var distance = now - birthDate;
            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            var Time1 = hours + "h " + minutes + "m " + seconds + "s " + "Minutes after birth";
            // console.log(minutes + "  " + i + "th baby");
            // cordova.plugins.notification.local.getScheduled(function (nots) {
            //     console.log("NOTS>>>>>>>>>>>"+nots);
            // });

            if (distance > 120000 && distance < 125000) {
                // cordova.plugins.notification.local.hasPermission(function (granted) {
                //     console.log('GRANTED ====> ' + granted);
                // });
                value1 ++;
                cordova.plugins.notification.local.schedule([{
                    id: value1,
                    text: ('End of Phase1 for childno: ' + list[i].child_no),
                    trigger: { in: 0, unit: 'second' }
                }]);

            } else if (distance > 180000 && distance < 185000) {
                value2 ++;
                cordova.plugins.notification.local.schedule([{
                    id: value2,
                    text: ('End of Phase2 for childno: ' + list[i].child_no),
                    trigger: { in: 1, unit: 'second' }
                }]);
            } else if (distance > 240000 && distance < 245000) {
                value3 ++;
                cordova.plugins.notification.local.schedule([{
                    id: value3,
                    text: ('End of Phase3 for childno: ' + list[i].child_no),
                    trigger: { in: 1, unit: 'second' }
                }]);
            }
        }
    }, 5000);
}


function submit() {
    alert('hi');
    var currentbabyno = parseInt(window.localStorage.getItem('cookie'));
    var babies = JSON.parse(window.localStorage.getItem('babieslist'));
    var babyno = babies[currentbabyno].child_no;
    final = [];
    var matches = $.grep(babies, function(obj) {
        return obj.child_no == babyno;
    });
    console.log(matches);
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            bed_no: matches[0].bed_no,
            gender: matches[0].gender,
            mother_name: matches[0].mother_name,
            birthDateTime: matches[0].birthDateTime,
            timeinseconds: matches[0].timeinseconds
        });
    } else {

    }

    var babiesdetails = JSON.parse(window.localStorage.getItem('babydetails'));
    var matches = $.grep(babiesdetails, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            skin_skin: matches[0].skin_skin,
            breath: matches[0].breath,
            breast_feeding: matches[0].breast_feeding
        });
    } else {

    }

    var babiesdetails1 = JSON.parse(window.localStorage.getItem('babydetails1'));
    var matches = $.grep(babiesdetails1, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            eye_care: matches[0].eye_care,
            cord_care: matches[0].cord_care,
            vitamin_k: matches[0].vitamin_k,
            examination: matches[0].examination,
            temp: matches[0].temp,
            weight: matches[0].weight
        });
    } else {

    }

    var normaldetails = JSON.parse(window.localStorage.getItem('normaldetails'));
    var matches = $.grep(normaldetails, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            norm_temp: matches[0].norm_temp,
            breast_feed: matches[0].breast_feed,
            advice_breastfeed: matches[0].advice_breastfeed,
            immune: matches[0].immune,
            discharge: matches[0].discharge,
            homecare: matches[0].homecare
        });
    } else {

    }

    var abnormaldetails = JSON.parse(window.localStorage.getItem('abnormaldetails'));
    var matches = $.grep(abnormaldetails, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            abnormaltemperature: matches[0].abnormaltemperature,
            thermalcare: matches[0].thermalcare,
            normal: matches[0].normal,
            norm_temp: matches[0].norm_temp,
            breast_feed: matches[0].breast_feed,
            advice_breastfeed: matches[0].advice_breastfeed,
            immune: matches[0].immune,
            discharge: matches[0].discharge,
            homecare: matches[0].homecare,
            continuedthermalsupport: matches[0].continuedthermalsupport,
            continuedsupport: matches[0].continuedsupport
        });
    } else {

    }

    var underwtdetails = JSON.parse(window.localStorage.getItem('underwtdetails'));
    var matches = $.grep(underwtdetails, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            skin_skin: matches[0].skin_skin,
            continuedsupport: matches[0].continuedsupport
        });
    } else {

    }

    var poorfeedingdetails = JSON.parse(window.localStorage.getItem('poorfeedingdetails'));
    var matches = $.grep(poorfeedingdetails, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            breastmilk: matches[0].breastmilk,
            feeding: matches[0].feeding,
            continuedsupport: matches[0].continuedsupport
        });
    } else {

    }

    var dangersigndetails = JSON.parse(window.localStorage.getItem('dangersigndetails'));
    var matches = $.grep(dangersigndetails, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            DangerSigns: matches[0].DangerSigns,
            antibiotics: matches[0].antibiotics,
            advancedcare: matches[0].advancedcare
        });
    } else {

    }

    var severejaundice = JSON.parse(window.localStorage.getItem('severejaundicelist'));
    var matches = $.grep(severejaundice, function(obj) {
        return obj.child_no == babyno;
    });
    if (matches.length) {
        final.push({
            child_no: matches[0].child_no,
            severejaundice: matches[0].severejaundice,
            seekadvancedcare: matches[0].seekadvancedcare
        });
    } else {

    }
    window.localStorage.setItem('final', JSON.stringify(final));

}


//var all = [babies, babiesdetails, babiesdetails1, normaldetails, abnormaldetails, underwtdetails, poorfeedingdetails, dangersigndetails];

//console.log(final);
//alert(babyno);

// for (i=0; i<all.length; i++) {
//     var single = all[i];
//     for(j=0; j<single.length; j++) {
//         var matches = $.grep(single, function (obj) {
//             return obj.child_no == babyno;
//             console.log(matches);
//         });
//     }
//     if (matches.length) {
//         console.log("hi");
//         console.log(single);
//         // var bedno = document.getElementById("bedNo").value;
//         // var gender = document.getElementById("Gender").value;
//         // var mothername = document.getElementById("motherName").value;
//         // var birthdate = document.getElementById("birthDateTime").value;
//     } else {
//         continue;
//     }
// }
