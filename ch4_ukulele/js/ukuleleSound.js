var UkuleleSound = UkuleleSound || {

    ///////////////////////////////////////////////////
    //
    // 상수 정의 영역
    //
    ///////////////////////////////////////////////////

    SOUND_NAME_LIST : [
        "ukulele_1", "ukulele_2", "ukulele_3", "ukulele_4",
        "ukulele_1_2", "ukulele_1_3",
        "ukulele_2_1", "ukulele_2_3",
        "ukulele_3_2",
        "ukulele_4_2"
    ],

    SOUND_BASE_URL : "res/sound/",

    ///////////////////////////////////////////////////
    //
    // 변수 정의 및 초기화 영역
    //
    ///////////////////////////////////////////////////

    canIUseSound : false,
    loadSoundCount : 0,
    audioElementList : [],

    ///////////////////////////////////////////////////
    //
    // 함수 정의 영역
    //
    ///////////////////////////////////////////////////

    createAudioElement : function() {

        var newAudioElement = null,
            newAudioSource = null,
            checkAudioElement = document.createElement("audio"),
            audioFormat = this.checkAudioFormat(checkAudioElement);

        if(audioFormat == "") {
            return;
        }
        else {
            for(var i=0; i<UkuleleSound.SOUND_NAME_LIST.length; i++) {
                newAudioElement = document.createElement("audio");
                newAudioElement.addEventListener("canplaythrough", this.changeContext(this.audioLoadHandler, this), false);
                newAudioSource = document.createElement("source");
                newAudioSource.src = UkuleleSound.SOUND_BASE_URL + UkuleleSound.SOUND_NAME_LIST[i] + "." + audioFormat;
                newAudioElement.appendChild(newAudioSource);

                this.audioElementList.push(newAudioElement);
            }
        }
    },

    audioLoadHandler : function(event) {

        this.loadSoundCount++;

        if(this.loadSoundCount >= this.SOUND_NAME_LIST.length) {
            this.canIUseSound = true;
        }
    },

    playUkuleleSound : function(pathIndex) {

        this.audioElementList[pathIndex].pause();
        this.audioElementList[pathIndex].currentTime = 0;
        this.audioElementList[pathIndex].play();
    },

    checkAudioFormat : function(audio) {

        var audioFormat = "";

        if(audio.canPlayType("audio/mpeg") == "probably" || audio.canPlayType("audio/mpeg") == "maybe") {
            audioFormat = "mp3";
        }
        else if(audio.canPlayType("audio/ogg") == "probably" || audio.canPlayType("audio/ogg") == "maybe") {
            audioFormat = "ogg";
        }

        return audioFormat;
    },

    changeContext : function(func, context) {

        return function() {
            func.apply(context, arguments);
        }
    }
}