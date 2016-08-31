/**
 * Created by junghyun on 2016. 8. 28..
 * reference : subtitle - https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
 */

var srtSearcher = require('./srt-searcher');
var vtt = require('srt-to-vtt');
var filereader = require('filereader-stream');

var MYAPP = {lastSearchTimePoint:-1};


function showMatchedItems(matchedItems){
    var resultbox = document.getElementById("resultbox");
    resultbox.innerHTML = "";
    matchedItems.forEach(function(matchedItem){
        // resultbox.innerHTML += "<p>" + matchedItem.fileName + "</p>";
        var fileNameNode = document.createElement("p");
        var index_fileNameShort = matchedItem.fileName.lastIndexOf("/");
        var fileNameShort = matchedItem.fileName.slice(index_fileNameShort+1);
        fileNameNode.appendChild(document.createTextNode(fileNameShort));
        resultbox.appendChild(fileNameNode);
        matchedItem.subtitles.forEach(function(subtitle){
            var startTimeEle = document.createElement("button");
            // startTimeEle.setAttribute("href","#");
            startTimeEle.textContent = subtitle.startTime;
            var startTimeInSec = timeS(subtitle.startTime);
            // startTimeEle.addEventListener("click", function(){
            //     console.log("clicked");
            //     // playVideoAtSepecificTime(matchedItem.fileName, subtitle.startTime);
            // });
            startTimeEle.onclick = function(event){
                console.log("open", matchedItem.fileName, subtitle.startTime);
                playVideoAtSepecificTime(matchedItem.fileName, startTimeInSec);
                var videoPart = document.getElementById("video-part");
                videoPart.focus();
            };
            // resultbox.appendChild(document.createElement("p").appendChild(startTimeEle));
            resultbox.appendChild(startTimeEle);

            // resultbox.innerHTML += "<p>" + subtitle.text + "</p>";
            var subtitleNode = document.createElement("p");
            subtitleNode.appendChild(document.createTextNode(subtitle.text));
            resultbox.appendChild(subtitleNode);

        });
    });
}


function playVideoAtSepecificTime(fileName, startTimeInSec){

    var index = fileName.lastIndexOf(".");
    var fileNameOnly = fileName.slice(0,index);
    var videoName =  fileNameOnly + ".webm";
    var subtitleName = fileNameOnly + ".vtt";

    var vid = document.getElementById("myVideo");
    var sourceEle = vid.getElementsByTagName("source")[0];
    var oldSrc = sourceEle.getAttribute("src");

    // filereader(subtitleName).pipe(vtt()).pipe(function(onsubs){
    //     if (vid.querySelector('track')){
    //         vid.removeChild(vid.querySelector('track'));
    //     }
    //     var track = document.createElement('track');
    //     track.setAttribute('default', 'default');
    //     track.setAttribute('src','data:text/vtt;base64,'+ onsubs.toString('base64'));
    //     track.setAttribute('label','English');
    //     track.setAttribute('kind','subtitles');
    //     vid.appendChild(track);
    //
    //
    // });

    if (oldSrc !== videoName){
        if(vid.paused !== true){
            vid.pause();
        }
        sourceEle.setAttribute("src",videoName);

        if (vid.querySelector('track')){
            vid.removeChild(vid.querySelector('track'));
        }
        var track = document.createElement('track');
        track.setAttribute('default', 'default');
        track.setAttribute('src',subtitleName);
        track.setAttribute('label','English');
        track.setAttribute('kind','subtitles');
        vid.appendChild(track);

        vid.load();
    }

    vid.currentTime = startTimeInSec;
    MYAPP.lastSearchTimePoint = startTimeInSec;
    vid.play();
}

function handleSearchBtnClick(){
    var searchText = document.getElementById("search-text").value;
    srtSearcher.searchText("/Users/junghyun/Movies", searchText, showMatchedItems);
}

onload = function(){
    var searchButton = document.getElementById("search-btn");
    searchButton.addEventListener("click", handleSearchBtnClick);


    var videoPart = document.getElementById("video-part");
    videoPart.setAttribute("tabindex",1);
    videoPart.addEventListener("keydown", function(event){
        var vid = document.getElementById("myVideo");
        if (event.keyCode == 32){
            if (vid.paused === true){
                vid.play();
            }else{
                vid.pause();
            }
            event.preventDefault();
        } else if (event.keyCode === 66){
            //push b
            vid.currentTime = MYAPP.lastSearchTimePoint;
        } else {
            if (vid.currentTime){
                var backSec = 0;
                if (event.keyCode === 90){
                    backSec = -7;
                }else if (event.keyCode === 88){
                    backSec = -5;
                }else if (event.keyCode === 67){
                    backSec = -3;
                }else if (event.keyCode === 86){
                    backSec = -1;
                }else if (event.keyCode === 78){
                    backSec = 5;
                }else if (event.keyCode === 77){
                    backSec = 10;
                }else if (event.keyCode === 188){
                    backSec = 15;
                }
                vid.currentTime += backSec;
            }
        }


    });

    var searchbox = document.getElementById("search-text");
    searchbox.setAttribute("tabindex",2);
    searchbox.focus();
    searchbox.addEventListener("keydown", function(event){
        if (event.keyCode == 13){
            var searchButton = document.getElementById("search-btn");
            handleSearchBtnClick();
        }
    });

}




function timeS(val) {
    var regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/;
    var parts = regex.exec(val);

    if (parts === null) {
        return 0;
    }

    for (var i = 1; i < 5; i++) {
        parts[i] = parseInt(parts[i], 10);
        if (isNaN(parts[i])) parts[i] = 0;
    }

    // hours + minutes + seconds
    return parts[1] * 3600 + parts[2] * 60 + parts[3];
}
