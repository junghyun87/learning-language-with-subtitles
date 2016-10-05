/**
 * Created by junghyun on 2016. 8. 28..
 * reference : subtitle - https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
 */



var srtSearcher = require('./srt-searcher');
// var vtt = require('srt-to-vtt');
var filereader = require('filereader-stream');

var MYAPP = {bookmarkedTimePoint:0, searchDirectory:"", videoPath:""};


const {remote} = require('electron');
const {Menu} = remote;

// define template
const template = [
    {
        label: 'Srt-Searcher',
        submenu: [
            {
                label: '단축키',
                click: function() {
                    alert("z: -7, x: -5, c: -3, v: -1\n" +
                        "n: +5, m: +10, ,: +15\n" +
                        "space: 일시정지\n" +
                        "g: 북마크로 이동\n" +
                        "b: 북마크\n" +
                        "s: 자막 켜기/끄기");
                },
                accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function showSubtitles(videoPath){
    console.log("showSubtitles called");
    var index = videoPath.lastIndexOf(".");
    var fileNameOnly = videoPath.slice(0,index);
    var videoName =  fileNameOnly + ".webm";
    var subtitleName = fileNameOnly + ".vtt";

    var vid = document.getElementById("myVideo");
    var sourceEle = vid.getElementsByTagName("source")[0];
    sourceEle.setAttribute("src",videoName);

    var trackEle = vid.getElementsByTagName("track")[0]
    trackEle.setAttribute("src",subtitleName);

    vid.addEventListener("loadstart", function(){
        console.log("loadstart called");
        var resultbox = document.getElementById("resultbox");
        // var parentEle = resultbox.parentNode;
        // parentEle.removeChild(resultbox);
        while(resultbox.firstChild){
            resultbox.removeChild(resultbox.firstChild);
        }
    });

    vid.addEventListener("loadedmetadata", function(){
        console.log("loadedmetadata called");
        var textTrack = vid.textTracks[0];
        textTrack.mode="hidden";
        textTrack.oncuechange = function(e){
            var cue = this.activeCues[0];
            if (cue){
                var oldCue = document.getElementsByClassName("selected")[0];
                if (oldCue){
                    oldCue.className = "subtitle";
                }
                var activeP = document.getElementById('cue-'+cue.id);
                activeP.className = "subtitle selected";
            }
        };

        // var newResultbox = document.createElement('div');
        // newResultbox.id = "resultbox";
        var resultbox = document.getElementById("resultbox");

        var sequence = Promise.resolve();
        [].forEach.call(textTrack.cues, function( cue ) {
            sequence = sequence.then(function(){
                var cueId = cue.id;
                var subtitleNode = document.createElement("p");
                subtitleNode.id = 'cue-'+cueId;
                subtitleNode.className = 'subtitle';
                subtitleNode.appendChild(document.createTextNode(cue.text));
                resultbox.appendChild(subtitleNode);
            });
        });

        vid.play();
    });

    // vid.load();
}

onload = function(){

    document.getElementById('search-directory-button').addEventListener('click', _ => {
       document.getElementById('search-directory-input').click();
    });

    var searchDirectoryInput = document.getElementById("search-directory-input");

    var searchDirectoryDisplay = document.getElementById("search-directory-display");

    searchDirectoryInput.addEventListener("change", function(){
        var videoPath = this.files[0].path;
        searchDirectoryDisplay.value = this.files[0].path;
        searchDirectoryDisplay.setAttribute("title",this.files[0].path);

        showSubtitles(videoPath);
    });

    // var searchButton = document.getElementById("search-btn");
    // searchButton.addEventListener("click", handleSearchBtnClick);


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

    // var searchbox = document.getElementById("search-text");
    // searchbox.setAttribute("tabindex",2);
    // searchbox.focus();
    // searchbox.addEventListener("keydown", function(event){
    //     if (event.keyCode == 13){
    //         var searchButton = document.getElementById("search-btn");
    //         handleSearchBtnClick();
    //     }
    // });

}




// function timeS(val) {
//     var regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/;
//     var parts = regex.exec(val);
//
//     if (parts === null) {
//         return 0;
//     }
//
//     for (var i = 1; i < 5; i++) {
//         parts[i] = parseInt(parts[i], 10);
//         if (isNaN(parts[i])) parts[i] = 0;
//     }
//
//     // hours + minutes + seconds
//     return parts[1] * 3600 + parts[2] * 60 + parts[3];
// }
