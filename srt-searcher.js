/**
 * Created by junghyun on 2016. 8. 24..
 * reference: https://github.com/bazh/subtitles-parser/blob/master/index.js
 */

var fs = require('fs');
var recursive = require('recursive-readdir');
/**
 * Search text in srt files in dirPath
 * @param {string} dirPath
 * @param {string} textToSearch
 */

exports.searchText = function(dirPath, textToSearch, callback){

    recursive(dirPath, function(err, files){
        var srtFiles = files.filter(function(value){
            return (value.slice(-4) === '.srt')
        });
        var matchedInfo = [];

        var itemsProcessed = 0;

        srtFiles.forEach(function(srtFile, index, array){
            fs.readFile(srtFile, function(err, srtData){
                itemsProcessed+=1;
                var matchedGroup = {};
                var stringData=srtData.toString();
                stringData = stringData.trim();
                stringData = stringData.replace(/\r/g, '');

                var checkExistReg = new RegExp(textToSearch, "i");
                // if (checkExistReg.test(stringData) === true){
                //     console.log(srtFile);
                // }
                var textToSearchReg = new RegExp(textToSearch,"gi");
                var matchedText;
                while((matchedText = textToSearchReg.exec(stringData)) != null){
                    if (typeof matchedGroup.fileName === "undefined"){
                        matchedGroup.fileName = srtFile;
                        matchedGroup.subtitles = [];
                    }
                    var loc = matchedText.index;
                    var groupStart = stringData.slice(0,loc+1).lastIndexOf('\n\n');
                    if (groupStart === -1){
                        groupStart=0;
                    }else{
                        groupStart+=2;
                    }
                    var groupEnd = stringData.slice(loc).indexOf('\n\n');
                    if (groupEnd === -1){
                        groupEnd=stringData.length-1;
                    }
                    var subscript = stringData.slice(groupStart, loc+groupEnd);
                    // console.log(subscript);
                    var subscriptRe = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g;
                    var splittedSubscript = subscript.split(subscriptRe);
                    splittedSubscript.shift();

                    matchedGroup.subtitles.push({'id':splittedSubscript[0].trim(), 'startTime':splittedSubscript[1].trim(),
                        'endTime':splittedSubscript[2].trim(), 'text':splittedSubscript[3].trim()});
                    // console.log(splittedSubscript[1].trim());
                    // console.log(splittedSubscript[3].trim());
                    // console.log();
                }
                if ('fileName' in matchedGroup){
                    matchedInfo.push(matchedGroup);
                }
                if (itemsProcessed === array.length){
                    callback(matchedInfo);
                }

            });
        });
    });

};