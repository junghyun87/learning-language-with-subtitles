/**
 * Created by junghyun on 2016. 8. 28..
 * reference : subtitle - https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
 */

var srtSearcher = require('./srt-searcher');
// var vtt = require('srt-to-vtt');
var filereader = require('filereader-stream');

var MYAPP = {bookmarkedTimePoint:0, searchDirectory:"/Users/junghyun/Movies/modernfamily_s1"};


function showMatchedItems(matchedItems){
    var resultbox = document.getElementById("resultbox");
    resultbox.innerHTML = "";
    matchedItems.forEach(function(matchedItem){
        var fileNameNode = document.createElement("p");
        fileNameNode.className = "fileName";
        var index_fileNameShort = matchedItem.fileName.lastIndexOf("/");
        var fileNameShort = matchedItem.fileName.slice(index_fileNameShort+1);
        fileNameNode.appendChild(document.createTextNode(fileNameShort));
        resultbox.appendChild(fileNameNode);
        matchedItem.subtitles.forEach(function(subtitle){
            // var startTimeEle = document.createElement("button");
            // startTimeEle.textContent = subtitle.startTime;
            var startTimeInSec = timeS(subtitle.startTime);
            // startTimeEle.onclick = function(event){
            //     console.log("open", matchedItem.fileName, subtitle.startTime);
            //     playVideoAtSepecificTime(matchedItem.fileName, startTimeInSec);
            //     var videoPart = document.getElementById("video-part");
            //     videoPart.focus();
            // };
            // resultbox.appendChild(startTimeEle);

            var subtitleNode = document.createElement("p");
            // subtitleNode.className = 'subtitle unselected';
            subtitleNode.className = 'subtitle';
            subtitleNode.appendChild(document.createTextNode(subtitle.text));

            subtitleNode.onclick = function(event){
                var selectedEle = document.getElementById('selected');
                if (selectedEle){
                    selectedEle.removeAttribute("id");
                }
                event.target.id = 'selected';
                console.log("open", matchedItem.fileName, subtitle.startTime);
                playVideoAtSepecificTime(matchedItem.fileName, startTimeInSec);
                var videoPart = document.getElementById("video-part");
                videoPart.focus();
            };

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
        vid.textTracks[0].mode='hidden';
        vid.load();
    }

    vid.currentTime = startTimeInSec;
    MYAPP.bookmarkedTimePoint = startTimeInSec;
    vid.play();
}

function handleSearchBtnClick(){
    var searchText = document.getElementById("search-text").value;
    srtSearcher.searchText(MYAPP.searchDirectory, searchText, showMatchedItems);
    var resultBox = document.getElementById("resultbox");
    resultBox.scrollTop = 0;
}

onload = function(){

    document.getElementById('search-directory-button').addEventListener('click', _ => {
       document.getElementById('search-directory-input').click();
    });

    var searchDirectoryInput = document.getElementById("search-directory-input");
    var searchDirectoryDisplay = document.getElementById("search-directory-display");
    searchDirectoryDisplay.value = MYAPP.searchDirectory;
    searchDirectoryInput.addEventListener("change", function(){
        MYAPP.searchDirectory = this.files[0].path;
        searchDirectoryDisplay.value = this.files[0].path;
    });

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
        } else if (event.keyCode === 71){
            //push g
            vid.currentTime = MYAPP.bookmarkedTimePoint;
        } else if (event.keyCode === 66){
            //push b
            MYAPP.bookmarkedTimePoint = vid.currentTime;
        } else if (event.keyCode === 83){
            //push s
            if (vid.textTracks[0].mode === 'hidden'){
                vid.textTracks[0].mode = "showing";
            }else{
                vid.textTracks[0].mode = "hidden";
            }
        }

        else {
            if (vid.currentTime){
                var backSec = 0;
                if (event.keyCode === 90){
                    //push z
                    backSec = -7;
                }else if (event.keyCode === 88){
                    //push x
                    backSec = -5;
                }else if (event.keyCode === 67){
                    //push c
                    backSec = -3;
                }else if (event.keyCode === 86){
                    //push v
                    backSec = -1;
                }else if (event.keyCode === 78){
                    //push n
                    backSec = 5;
                }else if (event.keyCode === 77){
                    //push m
                    backSec = 10;
                }else if (event.keyCode === 188){
                    //push ,
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
