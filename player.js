/**
 * Created by junghyun on 2016. 8. 28..
 * reference : subtitle - https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
 */

//http://www.w3schools.com/tags/av_event_loadeddata.asp
//http://stackoverflow.com/questions/635706/how-to-scroll-to-an-element-inside-a-div

var filereader = require('filereader-stream');

var MYAPP = {bookmarkedTimePoint:0, searchDirectory:"", videoPath:""};


const {remote} = require('electron');
const {Menu} = remote;

// // define template
// const template = [
//     {
//         label: 'Srt-Searcher',
//         submenu: [
//             {
//                 label: '단축키',
//                 click: function() {
//                     alert("z: -7, x: -5, c: -3, v: -1\n" +
//                         "n: +5, m: +10, ,: +15\n" +
//                         "space: 일시정지\n" +
//                         "g: 북마크로 이동\n" +
//                         "b: 북마크\n" +
//                         "s: 자막 켜기/끄기");
//                 },
//                 accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'
//             }
//         ]
//     }
// ];
//
// const menu = Menu.buildFromTemplate(template);
// Menu.setApplicationMenu(menu);

function showSubtitles(videoPath){
    console.log("showSubtitles called");
    var index = videoPath.lastIndexOf(".");
    var fileNameOnly = videoPath.slice(0,index);
    var videoName =  fileNameOnly + ".webm";
    var subtitleName = fileNameOnly + ".vtt";

    //이전 비디오 element는 지우고 새로운 비디오 element 생성
    var oldVidEle = document.getElementsByTagName('video')[0];
    oldVidEle.parentNode.removeChild(oldVidEle);

    var vidEle = document.createElement('video');
    vidEle.id = "myVideo";
    vidEle.controls = true;

    var sourceEle = document.createElement("source");
    sourceEle.type = "video/webm";
    sourceEle.src = videoName;
    vidEle.appendChild(sourceEle);

    var trackEle = document.createElement("track");
    trackEle.label = "English";
    trackEle.kind = "subtitles";
    trackEle.srclang = "en";
    trackEle.src = subtitleName;
    //default로 지정해야 수동으로 subtitle을 켜지 않아도 trackEle에 대한 load 이벤트가 호출됨
    trackEle.default = true;
    vidEle.appendChild(trackEle);

    //load를 호출해야 play가 됨
    vidEle.load();

    trackEle.addEventListener("load", function(){
        console.log("track load called");

        var resultbox = document.getElementById("resultbox");
        while(resultbox.firstChild){
            resultbox.removeChild(resultbox.firstChild);
        }

        var textTrack = this.track;
        textTrack.mode = 'hidden';
        var resultbox = document.getElementById("resultbox");

        //큐를 순서대로 출력하기 위해 Promise 사용
        var sequence = Promise.resolve();
        [].forEach.call(textTrack.cues, function( cue ) {
            sequence = sequence.then(function(){
                var cueId = cue.id;
                var subtitleNode = document.createElement("p");
                subtitleNode.id = 'cue-'+cueId;
                subtitleNode.className = 'subtitle';
                // subtitleNode.setAttribute("data-starttime", cue.startTime);
                subtitleNode.appendChild(document.createTextNode(cue.text));
                subtitleNode.addEventListener('click', function(){
                    vidEle.currentTime = cue.startTime;
                    MYAPP.bookmarkedTimePoint = vidEle.currentTime;
                    vidEle.focus();
                });

                resultbox.appendChild(subtitleNode);
            });
        });

        //재생이 될 때 현재 자막을 강조하고 자동 스크롤링
        textTrack.oncuechange = function(e){
            var cue = this.activeCues[0];
            if (cue){
                MYAPP.bookmarkedTimePoint = cue.startTime;
                var oldCue = document.getElementsByClassName("selected")[0];
                if (oldCue){
                    oldCue.className = "subtitle";
                }
                var activeP = document.getElementById('cue-'+cue.id);
                activeP.className = "subtitle selected";
                //scrollTop은 scroll 속성을 가진 해당 엘리먼트의 위치를 0으로한 포지셔닝
                //offsetTop은 static 이외의 position을 가진 부모 element의 위치를 0으로한 포지셔닝
                if (activeP.previousElementSibling){
                    resultbox.scrollTop = activeP.previousElementSibling.offsetTop - resultbox.offsetTop;
                } else {
                    resultbox.scrollTop = activeP.offsetTop - resultbox.offsetTop;
                }


            }
        };
    });

    //비디오 이벤트 호출 순서는 http://www.w3schools.com/tags/av_event_loadeddata.asp를 참고
    vidEle.addEventListener("loadeddata", function(event){
        console.log("loadeddata called");
        vidEle.play();
    });


    var videopartEle = document.getElementById("video-part");
    videopartEle.appendChild(vidEle);
}

onload = function(){

    document.getElementById('search-directory-button').addEventListener('click', _ => {
       document.getElementById('search-directory-input').click();
    });

    var searchDirectoryInput = document.getElementById("search-directory-input");
    var searchDirectoryDisplay = document.getElementById("search-directory-display");
    var videoPart = document.getElementById("video-part");
    var subtitleshowed = false;
    var showSubtitleBtn = document.getElementById("btn_show_subtitles");

    searchDirectoryInput.addEventListener("change", function(){
        var videoPath = this.files[0].path;
        searchDirectoryDisplay.value = this.files[0].path;
        searchDirectoryDisplay.setAttribute("title",this.files[0].path);

        showSubtitles(videoPath);

        videoPart.focus();
    });

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
        } else if (event.keyCode === 72){
            //push h
            showSubtitleBtn.click();
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


    //h를 누르면 가려진 자막을 볼 수 있음
    showSubtitleBtn.addEventListener('click', function(){

       var subtitles = document.getElementsByClassName("subtitle");
       var color = subtitleshowed?'white':'black';
        subtitleshowed = !subtitleshowed;
        for (var i=0;i<subtitles.length;i++){
           subtitles[i].style.color=color;
       }
    });


};