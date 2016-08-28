/**
 * Created by junghyun on 2016. 8. 28..
 */

var srtSearcher = require('./srt-searcher');

function showMatchedItems(matchedItems){
    var resultbox = document.getElementById("resultbox");
    resultbox.innerHTML = "";
    matchedItems.forEach(function(matchedItem){
        // resultbox.innerHTML += "<p>" + matchedItem.fileName + "</p>";
        var fileNameNode = document.createElement("p");
        fileNameNode.appendChild(document.createTextNode(matchedItem.fileName));
        resultbox.appendChild(fileNameNode);
        matchedItem.subtitles.forEach(function(subtitle){
            var startTimeEle = document.createElement("button");
            // startTimeEle.setAttribute("href","#");
            startTimeEle.textContent = subtitle.startTime;
            // startTimeEle.addEventListener("click", function(){
            //     console.log("clicked");
            //     // playVideoAtSepecificTime(matchedItem.fileName, subtitle.startTime);
            // });
            startTimeEle.onclick = function(event){
                console.log("open", matchedItem.fileName, subtitle.startTime);
                playVideoAtSepecificTime(matchedItem.fileName, subtitle.startTime);
                event.target.blur();
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

function playVideoAtSepecificTime(fileName, startTime){
    var index = fileName.lastIndexOf(".");
    var videoName = fileName.slice(0,index) + ".webm";

    var startTimeInSec = timeS(startTime);

    var vid = document.getElementById("myVideo");
    var sourceEle = vid.getElementsByTagName("source")[0];
    var oldSrc = sourceEle.getAttribute("src");

    if (oldSrc !== videoName){
        if(vid.paused !== true){
            vid.pause();
        }
        sourceEle.setAttribute("src",videoName);
        vid.load();
    }

    vid.currentTime = startTimeInSec;
    vid.play();
}

function handleSearchBtnClick(){
    var searchText = document.getElementById("search-text").value;
    srtSearcher.searchText("/Users/junghyun/Movies", searchText, showMatchedItems);
}

onload = function(){
    var searchButton = document.getElementById("search-btn");
    searchButton.addEventListener("click", handleSearchBtnClick);
    document.body.addEventListener("keydown", function(event){
        if (event.keyCode == 32){
            var vid = document.getElementById("myVideo");
            if (vid.paused === true){
                vid.play();
            }else{
                vid.pause();
            }
            event.preventDefault();
        }
    });

    var searchbox = document.getElementById("search-text");
    searchbox.addEventListener("keydown", function(event){
        if (event.keyCode == 13){
            var searchButton = document.getElementById("search-btn");
            handleSearchBtnClick();
        }
    })

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
