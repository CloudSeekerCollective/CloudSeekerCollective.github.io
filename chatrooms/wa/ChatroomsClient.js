var localAccount = "-1";
var localAccountName = "Anonymous";
var localChannel = "1";
var firstTimeLoad = false;
var h;
var host;
var httphost;
var socket;
var vsocket;
var vchannel;
var chatroomsSatelliteEnabled = true;
var audio = new Audio('notification.m4a');
var chatroomName;
var msgcontent;
var strings;
var channels_;
var now = new Date(Date.now());
var now_new = now.toLocaleString();
var attachment1 = "";
var overallMessageAmount = 1;
var allowMessageLoading;
var contentId;
var globalRetries = 0;
var retries = 0;
var mbv = "msgBox";
var messageToBeEdited;
var emotes = [{
    "happ": "/assets/emotes/happ.png"
}];
var pingsocket;
var areMessagesSaved = false;
var isTimedOut = false;
var tokenRevealed = false;
var micmuted = true;
var audioInput = null;
var vcWasSet = false;
var global_vc_data = null;
var shouldReconnect = true;
var WU;
var WUname;
var channels;
var tempServer;
var pasteInfo;
var birthdayEasterEggTriggered = false;
var whispers;
var localCachedAccount;
var extUrl;
//var sendEveryP5Sec;
var isDone = false;
var hasVcBeenTriggered = false;
var get_args;
var potentialJoinTriggered = false;
var vcState;
var publicDisconnectReason;
var isSecure;
var funny_title_thing;
var things_count = 0;
var isAdmin = false;
var emotesListSort = 0;

window.HTMLElement.prototype.scrollIntoView = function() {};

function messageAutoscroll(force){
    $('.messageSpace').animate({
        scrollTop: overallMessageAmount * 100000
    }, 'fast');
    return;

    let container = $(".messageSpace");
    let lastMessage = $(".message").length - 1;
    let scrollTo = $(".message")[lastMessage];
    $(container).scroll(function() {
        if($(container).scrollTop() + $(container).height() > $(container)[0].scrollHeight - 10 || force == undefined) {
            //alert("near bottom!");
             container.scrollTop(
                 scrollTo.offsetTop + container.scrollTop()
             );
             $(container).off("scroll");
        }
    });
}

function emptyEnvironment() {
    localAccount = "-1";
    localAccountName = "Anonymous";
    localChannel = "1";
    firstTimeLoad = false;
    chatroomName = "";
    strings = "";
    channels_ = "";
    msgcontent = "";
    attachment1 = "";
    globalRetries = 1;
    retries = 0;
    allowMessageLoading = false;
    contentId = 0;
    mbv = "msgBox";
    emotes = [{
        "happ": "/assets/emotes/happ.png"
    }];
    areMessagesSaved = false;
    isTimedOut = false;
    tokenRevealed = false;
    micmuted = true;
    audioInput = null;
    vcWasSet = false;
    global_vc_data = null;
    shouldReconnect = true;
    WU = "";
    tempServer = "";
    whispers = "";
}

function xload(){
    isDone = false;
    $("#xloader").css("display", "block");
    let stop = setInterval(function(){
        if(isDone)
            $("#xloader").css("display", "none");
    }, 500);
}

function superAvoidInjection(str) {
    return str.toString().replace(/(?!\w|\s)./g, '')
        .replace(/\s+/g, ' ')
        .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

function avoidInjection(str) {
    return str.toString().replace(/(?![\[\w?!.,/\]]|\s)./g, '')
        .replace(/\s+/g, ' ')
        .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2')
        .replace("[newline]", "<br>");
}

function linker(str) {
    //if(str.toString().startsWith("https://twitter.com/") || str.toString().startsWith("https://x.com/")){
      //  return "<div class=\"card\" style=\"width: 18rem;\"><div class=\"card-body\"><h5 class=\"card-title\">Chief Jelly on X</h5><p class=\"card-text\">hello</p><a href=\"#\" class=\"btn btn-primary\">View post</a></div></div>";
    //}
    var finalstring = str;
    if(str.toString().includes("https://")){
        for(let x = 0; x < (str.match(/https/g) || []).length; x++){
            finalstring = finalstring.toString().replace(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, "<a href='#' onclick='extLink(\"$1\")'>$1</a>");
        }
    }
    return finalstring;
}

function closeEverythingElse(inFavourOf) {
    if($(".modal-open:not(#"+ inFavourOf +")").length > 0) {
        $("*.modal.show:not(#"+ inFavourOf +")").modal("hide");
        //> .modal-open:not(#"+ inFavourOf +")
    }
}

function getEmotes(emotesData, sortBy){
    emotes = emotesData;
    $(".emotesListElement").html("");
    for(let x = 0; x < emotes.length; x++){
        let emoteName = Object.keys(emotes[x])[0];
        if(sortBy == 0)
            $(".emotesListElement").html($(".emotesListElement")[0].innerHTML + "<img style='margin-bottom: 5px;' class='rounded' src='"+ emotes[x][emoteName] +"' width='48' height='48' title=':"+ emoteName +":'> ");
        else
            $(".emotesListElement").html($(".emotesListElement")[0].innerHTML + "<img style='margin-bottom: 5px;' src='"+ emotes[x][emoteName] +"' width='20' height='20'> :"+ emoteName +":<br>");
    }
}

function updateConfiguration() {
            xload();
            if(localStorage.getItem("css") != "")
                $("#css").html(localStorage.getItem("css"));
                $(".cssbox").html(localStorage.getItem("css"));
            if(localStorage.getItem("si_joinmsg") == "true") {
                $("#joinmsg").attr("checked", true);
            }
            else if(localStorage.getItem("si_joinmsg") != "true" || localStorage.getItem("si_joinmsg") != "false"){
                localStorage.setItem("si_joinmsg", true);
                $("#joinmsg").attr("checked", true);
            }

            if(localStorage.getItem("si_attachments") == "true") {
                $("#show_attch").attr("checked", true);
                $("#attachment_button").css("display", "inline-block");
            }
            else if(localStorage.getItem("si_attachments") != "true" || localStorage.getItem("si_attachments") != "false"){
                localStorage.setItem("si_attachments", true);
                $("#show_attch").attr("checked", true);
            }
            else if(localStorage.getItem("si_attachments") == "false"){
                $("#attachment_button").css("display", "none");
            }
            if(localStorage.getItem("si_clearchat") == "true") {
                $("#show_clear").attr("checked", true);
                $("#clear_button").css("display", "inline-block");
            }
            else if(localStorage.getItem("si_clearchat") != "true" || localStorage.getItem("si_clearchat") != "false"){
                localStorage.setItem("si_clearchat", false);
                $("#show_clear").attr("checked", false);
            }
            else if(localStorage.getItem("si_clearchat") == "false"){
                $("#clear_button").css("display", "none");
            }
            if(localStorage.getItem("si_slashcomms") == "true") {
                $("#show_slash").attr("checked", true);
                $("#slash_button").css("display", "inline-block");
            }
            else if(localStorage.getItem("si_slashcomms") != "true" || localStorage.getItem("si_slashcomms") != "false"){
                localStorage.setItem("si_slashcomms", false);
                $("#show_slash").attr("checked", false);
            }
            else if(localStorage.getItem("si_slashcomms") == "false"){
                $("#slash_button").css("display", "none");
            }
            if(localStorage.getItem("si_emoteslist") == "true") {
                $("#show_emotes").attr("checked", true);
                $("#emotes_button").css("display", "inline-block");
            }
            else if(localStorage.getItem("si_emoteslist") != "true" || localStorage.getItem("si_emoteslist") != "false"){
                localStorage.setItem("si_emoteslist", true);
                $("#show_emotes").attr("checked", true);
            }
            else if(localStorage.getItem("si_emoteslist") == "false"){
                $("#emotes_button").css("display", "none");
            }

            if(localStorage.getItem("si_push_notis") == "true") {
                $("#pushes").attr("checked", true);
            }

            if(localStorage.getItem("si_push_wisp") == "true") {
                $("#pushes_wisp").attr("checked", true);
            }
            else if(localStorage.getItem("si_push_wisp") != "true" || localStorage.getItem("si_push_wisp") != "false"){
                localStorage.setItem("si_push_wisp", true);
                $("#pushes_wisp").attr("checked", true);
            }

            if(localStorage.getItem("si_push_pings") == "true") {
                $("#pushes_pings").attr("checked", true);
            }
            else if(localStorage.getItem("si_push_pings") != "true" || localStorage.getItem("si_push_pings") != "false"){
                localStorage.setItem("si_push_pings", true);
                $("#pushes_pings").attr("checked", true);
            }

            if(localStorage.getItem("si_push_presence") == "true") {
                $("#pushes_presence").attr("checked", true);
            }
            else if(localStorage.getItem("si_push_presence") != "true" || localStorage.getItem("si_push_presence") != "false"){
                localStorage.setItem("si_push_presence", false);
                $("#pushes_presence").attr("checked", false);
            }
            isDone = true;
}

function checkForSatellite() {
    xload();
    try{
    if(get_args.get("intent") == "join" && get_args.get("url") != undefined && !potentialJoinTriggered){
        $("#loadingResourcesModal").modal("hide");
        $("#join-this-chatroom").html("Join " + get_args.get("url").toString() + "?");
        $('#potentialJoinModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#potentialJoinModal").modal("show");
        potentialJoinTriggered = true;
        if(localStorage.getItem("server") != undefined && +localStorage.getItem("authentication") != undefined){
            $("#pjoin_warning").html("It also looks like you're already logged into a Chatroom! Keep in mind that by joining this Chatroom, you will be logged out of this one and will need to find your credentials to get back in.");
            $("#pjoin_confirm").on("click", function(){localStorage.removeItem("server"); localStorage.removeItem("token");});
        }
        return;
    }

    if(localStorage.getItem("server") != undefined && localStorage.getItem("authentication") != undefined) {
        clearInterval(funny_title_thing);
        let lport;
        let lsecure;
        if(localStorage.getItem("port") != undefined)
            lport = localStorage.getItem("port")
        else
            lport = "7778"

        if(localStorage.getItem("secure") != undefined && localStorage.getItem("secure") == "true"){
            lsecure = "wss";
            isSecure = true;
        }
        else{
            lsecure = "ws";
            isSecure = false;
        }
        token = localStorage.getItem("token");
        host = lsecure + '://' + localStorage.getItem("server") + ':' + lport + '/?auth=' + localStorage.getItem("token");
        vhost = lsecure + '://' + localStorage.getItem("server") + ':7788/?auth=' + localStorage.getItem("token");
        httphost = 'https://' + localStorage.getItem("server");
        vbLog("[ChatroomsSatellite][Debug] " + host);
        socket = new WebSocket(host);
        var timerId = 0;

        function keepAlive() {
            var timeout = 10000;
            if(socket.readyState == socket.OPEN) {
                //socket.send('');  
            }
            timerId = setTimeout(keepAlive, timeout);
        }

        function cancelKeepAlive() {
            if(timerId) {
                clearTimeout(timerId);
            }
        }

        socket.onopen = function() {
            xload();
            updateConfiguration();

            console.log("[ChatroomsSatellite] Connected.");
            $(".channels").html("");
            $(".vchannels").html("");
            $("#whispers").html("");
            //beginStringery();
            loadDMs();
            accountInfo();
            addChannels();
            getOnlineUsers();
            getVCOnlineUsers();
            //startRecordingVoice();
            shouldReconnect = true;
            sockSend('{"type":"properties", "authentication":"' + token + '"}');
            $("#gifts_button").css("display", "none");
            if(localStorage.getItem("202309_cloudseeker_xyz_seen") == undefined) {
                $("#whispersV2Modal").modal("show");
            }
    //        $.get(httphost + "/serverproperties.json", function(data, status) {
                var checkForContentUpgrade = setInterval(function() {
                    xload();
                    getOnlineUsers();
                    getVCOnlineUsers();
                    sockSend('{"type":"properties", "authentication":"' + token + '"}');
                }, 30000);
      //      });
            keepAlive();
        };

        socket.onclose = function(event) {
            publicDisconnectReason = event.wasClean;
            closeEverythingElse("loadingResourcesModal");
            $('#loadingResourcesModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            //$("#loadingResourcesModal").modal("show");
            nowDoTheOpposite();
            if(event.wasClean) {
                console.log('[ChatroomsSatellite] Successfully disconnected');
                $("#loadmodal").html(strings.satellite_permadisconnect_positive);
                $("#loadmodal_content").html("<button class='btn btn-primary' onclick='checkForSatellite(); disabled=true;'>" + strings.satellite_rejoin_positive + "</button>");
                //addMessage("System", strings.satellite_permadisconnect_positive + " <a href='#' onclick='retryConnection();'>Click here to reconnect</a>", 0, 0, true, now_new, true, false, true);
            } else {
                retries++;
                console.error('[ChatroomsSatellite] Disconnected!');
                $("#loadmodal").html(strings.satellite_already_connecting);
                //addMessage("System", "<span style='color:#ff4d4d;'>"+ strings.satellite_permadisconnect +"</span>", 0, 0, true, now_new, true, false, true);
                if(retries != 5) {
                    if(shouldReconnect) {
                        retryConnection();
                    } else {
                        //$("#loadmodal").html(strings.satellite_permadisconnect_positive);
                        $("#loadmodal_content").html("");
                    }
                } else {
                    //nowDoTheOpposite2();
                    if(shouldReconnect) {
                        $("#loadmodal").html((globalRetries + 2) + strings.satellite_rejoin_attempts);
                        $("#loadmodal_content").html("<img src='checkmark.png' width='32' height='32'><br><br> <button class='btn btn-primary' onclick='checkForSatellite(); retries = 1; disabled=true; innerHTML=`<div class=\"spinner-border\"></div>`'>" + strings.satellite_rejoin_autorecon + "</button>");
                    } else {
                        $("#loadmodal").html(strings.satellite_permadisconnect_positive);
                        $("#loadmodal_content").html("<button class='btn btn-danger' onclick='localStorage.removeItem(\"server\"); localStorage.removeItem(\"token\"); location.reload();'>" + strings.option_logout + "</button><br>");
                        emptyEnvironment();
                    }
                    //addMessage("System", globalRetries + " failed attempts to reconnect. <a href='#' onclick='retryConnection(); retries = 0;'>Continue?</a>", 0, 0, true, now_new, true, false, true);
                }
            }
            console.warn('[ChatroomsSatellite] DISCONNECTED! Code: ' + event.code + ' Reason: ' + event.reason);
            cancelKeepAlive();
        };

        socket.onmessage = function(event) {
            vbLog("[ChatroomsSatellite] Data received: " + event.data);
            if(event.data != "Welcome to the Chatrooms Experience!") {
                let obj = JSON.parse(event.data);
                let dateObjF = new Date(obj.time * 1000);
                let dateObj = dateObjF.toLocaleString();
                if(obj.status != undefined && obj.status == "fail" && obj.action == undefined) {
                    console.log("[ChatroomsSatellite] Uh oh spaghettio!");
                    shouldReconnect = false;
                    let waitalittlemore = setTimeout(function(){$("#loadmodal").html(strings.satellite_permadisconnect);}, 500);
                    switch(obj.error) {
                        case "localhost_lock_enabled":
                            addMessage("System", "<span style='color:#ff4d4d;'>This chatroom is currently locked! (localhost_lock_enabled)</span>", 0, 0, true, dateObj, true, true);
                            $("#actual_disconnect_reason").html("This chatroom is currently locked!");
                            break;
                        case "account_temporarily_restricted":
                            addMessage("System", "<span style='color:#ff4d4d;'>Your account has been temporarily restricted, wait for an admin to allow you to enter! (account_temporarily_restricted)</span>", 0, 0, true, dateObj, true, true);
                            $("#actual_disconnect_reason").html("Your account has been temporarily restricted, wait for an admin to allow you to enter!");
                            break;
                        case "no_authentication_provided":
                            addMessage("System", "<span style='color:#ff4d4d;'>The account you're connecting with doesn't exist anymore! (no_authentication_provided)</span>", 0, 0, true, dateObj, true, true);
                            $("#actual_disconnect_reason").html("The account you're connecting with doesn't exist anymore!");
                            break;
                        case "user_already_online":
                            addMessage("System", "<span style='color:#ff4d4d;'>You're already online on another device! (user_already_online)</span>", 0, 0, true, dateObj, true, true);
                            $("#actual_disconnect_reason").html("You're already online on another device!");
                            break;
                        case "or_you_will_get_clapped":
                            addMessage("System", "<span style='color:#ff4d4d;'>You have been banned from this chatroom! (or_you_will_get_clapped)</span>", 0, 0, true, dateObj, true, true);
                            $("#actual_disconnect_reason").html("You have been banned from this chatroom!");
                            break;
                        case "email_not_set":
                            addMessage("System", "<span style='color:#ff4d4d;'>You need to verify your email to continue to this Chatroom! You can do that <a href='/chatrooms/login/2fa/index.php'>here</a> (email_not_set)</span>", 0, 0, true, dateObj, true, true);
                            $("#actual_disconnect_reason").html("You need to verify your email to continue to this Chatroom! You can do that <a href='/chatrooms/login/2fa/index.php'>here</a>");
                            break;
                        default:
                            addMessage("System", "<span style='color:#ff4d4d;'>Critical error while connecting! I don't know what happened.</span>", 0, 0, true, dateObj, true, true);
                            console.log("Something really crazy happened, we couldn't tell why the client got disconnected");
                            break;
                    }
                }
                if(obj.action == "message") {
                    console.log("[ChatroomsSatellite] Message with message intent has been recieved");
                    let isTheAuthor = false;
                    if(obj.uid == localAccount) {
                        isTheAuthor = true;
                    }
                    if(obj.channel == localChannel) {
                        if(obj.attachment1 != "") {
			    obj.attachment1 = httphost + obj.attachment1;
                            overallMessageAmount++;
                            var filetype = obj.attachment1.substring(obj.attachment1.length - 4, obj.attachment1.length);
                            switch(filetype) {
                                case ".png":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-png'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case ".jpg":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-jpg'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case "jpeg":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-jpg'></i><br><a href='#' onclick=';'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case ".gif":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-gif'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case ".mp4":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-mp4'></i><br> <video width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='video/mp4'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case "webm":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-mp4'></i><br> <video width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='video/webm'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case ".ogg":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-mp3'></i><br> <audio width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case "webp":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-png'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case ".mp3":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-mp3'></i><br> <audio width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                case ".wav":
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-wav'></i><br> <audio width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='audio/wav'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                                default:
                                    addMessage(obj.user, obj.msg + " <i class='bi bi-filetype-jpg'></i><br><a href='" + obj.attachment1 + "' download>Download attachment " + obj.attachment1 + "</a>", 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid, true);
                                    break;
                            }
                        } else {
                            addMessage(obj.user, obj.msg, 0, obj.uid, true, dateObj, false, true, isTheAuthor, obj.msgid);
                        }
                        if(!document.hasFocus()) {
                            //audio.play();
                        }
                        messageAutoscroll();
                    } else {
                        if(!document.hasFocus() && localStorage.getItem("si_pings") == "true") {
                            audio.play();
                        }
                        if(obj.msg.includes("@" + localAccountName) && localStorage.getItem("si_pushes_pings") == "true") {
                            audio.play();
                            htoaster(obj.user, "pinged you in #" + channels[obj.channel] + ": " + obj.msg);
                            if(localStorage.getItem("si_push_notis") == "true"){
                                let noti = new Notification(obj.user + " pinged you in #"+ channels[obj.channel] +":", {body: obj.msg, icon: "https://cloudseeker.xyz/chatrooms/wa/WatermarkSatelliteEnabled.png"});
                            }
                        }
                    }
                } else if(obj.action == "delete") {
                    console.log("[ChatroomsSatellite] Message with delete intent has been recieved");
                    $("#message-" + obj.msgid).html("<i>[Message deleted]</i>");
                } else if(obj.action == "edit") {
                    console.log("[ChatroomsSatellite] Message with edit intent has been recieved");
                    let content = obj.msg;
                    for(let i = 0; i < (Object.keys(emotes).length); i++) {
                        let lol = Object.keys(emotes[i])[0];
                        content = content.replace(":" + Object.keys(emotes[i])[0] + ":", "<img src='" + emotes[i][lol] + "' width='32' height='32'>");
                        if(i == (Object.keys(emotes).length)) {
                            //startAdding(author, content, type, authorId, force, timestamp, isSystemMessage, isAuthor, messageId)
                        }
                    }
                    $("#message-" + obj.msgid).html(content);
                } else if(obj.action == "join") {
                    console.log("[ChatroomsSatellite] Message with join intent has been recieved");
                    if(!localChannel.startsWith("x") && localStorage.getItem("si_joinmsg") == true)
                        addMessage(obj.user, "<i>" + strings.satellite_join_intent + "</i>", 0, obj.uid, true, dateObj, false, true, false, obj.msgid);
                    $('.messageSpace').animate({
                        scrollTop: overallMessageAmount * 100000
                    }, 'fast');
                    getOnlineUsers();
                    if(localStorage.getItem("si_push_presence") == "true"){
                        let noti = new Notification(obj.user, {body: strings.satellite_join_intent, icon: "https://cloudseeker.xyz/chatrooms/wa/WatermarkSatelliteEnabled.png"});
                    }
                } else if(obj.action == "leave") {
                    console.log("[ChatroomsSatellite] Message with leave intent has been recieved");
                    if(!localChannel.startsWith("x") && localStorage.getItem("si_joinmsg") == true)
                        addMessage(obj.user, "<i>" + strings.satellite_leave_intent + "</i>", 0, obj.uid, true, dateObj, false, true, false, obj.msgid);
                    $('.messageSpace').animate({
                        scrollTop: overallMessageAmount * 100000
                    }, 'fast');
                    getOnlineUsers();
                } else if(obj.action == "editprofile") {
                    console.log("[ChatroomsSatellite] Message with editprofile intent has been recieved");
                    //$("#meModal").modal("hide");
                    $("#pfpPreloader").html("");
                    $("#usrPreloader").html("");
                    $("#sttsPreloader").html("");
                    $('.messageSpace').animate({
                        scrollTop: overallMessageAmount * 100000
                    }, 'fast');
                    toaster("Saved!");
                } else if(obj.action == "channel") {
                    channels[obj.id] = obj.name;
                    $(".channels").html(document.getElementsByClassName("channels")[0].innerHTML + "<button id='channel_" + obj.id + "' class='server emerg activatedServer' onclick='localChannel = " + obj.id + "; getOlderMessages(); addMessage(\"System\", strings.channels_switch + \"#" + obj.name + "\", 0, 0, true, now_new, true); xload();'><span class='channel-dot'><i class='bi bi-hash' title='Text'></i>•</span> <span class='channel-name'>" + obj.name + "</span></button><br>\n");
                } else if(obj.action == "vchannel") {
                    $(".vchannels").html(document.getElementsByClassName("vchannels")[0].innerHTML + "<button id='vchannel_" + obj.id + "' class='server emerg activatedServer vc' onclick='vchannel = " + obj.id + "; checkForVSatellite();'><span class='channel-dot'><i class='bi bi-mic' title='Voice'></i>•</span> " + obj.name + "</button><br>\n");
                } else if(obj.action == "onlineuser") {
                    let pfp;
                    if(obj.picture == "") {
                        console.log("[ChatroomsClient] User has no profile picture.");
                        pfp = "account.png";
                        $(".onlineList").html(document.getElementsByClassName("onlineList")[0].innerHTML + "<a href='#' onclick='userInfo(" + obj.id + ", \"" + obj.username + "\")'><img class='rounded' src='"+ pfp +"' width='26' height='26'> " + obj.username.replace(localAccountName, "<b>" + localAccountName + "</b>") + "</a><br><span style='font-size:16px;'>\""+ emoteify(obj.profilestatus, 14) +"\"</span><br>\n");
                    } else {
                        $.ajax({url:obj.picture, error: function(xhr, status, error){
                            console.log("[ChatroomsClient] Could not load profile picture!");
                            pfp = "account.png";
                            $(".onlineList").html(document.getElementsByClassName("onlineList")[0].innerHTML + "<a href='#' onclick='userInfo(" + obj.id + ", \"" + obj.username + "\")'><img class='rounded' src='"+ pfp +"' width='26' height='26'> " + obj.username.replace(localAccountName, "<b>" + localAccountName + "</b>") + "</a><br><span style='font-size:16px;'>\""+ emoteify(obj.profilestatus, 14) +"\"</span><br>\n");
                        }, success: function(result, status, xhr){
                            pfp = obj.picture;
                            $(".onlineList").html(document.getElementsByClassName("onlineList")[0].innerHTML + "<a href='#' onclick='userInfo(" + obj.id + ", \"" + obj.username + "\")'><img class='rounded' src='"+ pfp +"' width='26' height='26'> " + obj.username.replace(localAccountName, "<b>" + localAccountName + "</b>") + "</a><br><span style='font-size:16px;'>\""+ emoteify(obj.profilestatus, 14) +"\"</span><br>\n");
                        }});
                    }
                } else if(obj.action == "whisper") {
                    console.log("[ChatroomsSatellite] Message with whisper intent has been recieved");
                    let isTheAuthor = false;
                    if(obj.uid == localAccount) {
                        isTheAuthor = true;
                    }
                        if(obj.attachment1 != "") {
			    obj.attachment1 = httphost + obj.attachment1;
                            overallMessageAmount++;
                            var filetype = obj.attachment1.substring(obj.attachment1.length - 4, obj.attachment1.length);
                            switch(filetype) {
                                case ".png":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-png'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case ".jpg":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-jpg'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case "jpeg":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-jpg'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case ".gif":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-gif'></i><br><a href='#' onclick='setAttachmentPreview(\""+ obj.attachment1 +"\");;'><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case ".mp4":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-mp4'></i><br> <video width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='video/mp4'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case "webm":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-mp4'></i><br> <video width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='video/webm'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case ".ogg":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-mp3'></i><br> <audio width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case "webp":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-png'></i><br><img width='40%' height='40%' src='" + obj.attachment1 + "' class='rounded'></a>", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case ".mp3":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-mp3'></i><br> <audio width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                case ".wav":
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-wav'></i><br> <audio width='40%' height='40%' controls><source src='" + obj.attachment1 + "' type='audio/wav'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                                default:
                                    addWhisper(obj.user, obj.msg + " <i class='bi bi-filetype-raw'></i><br><a href='" + obj.attachment1 + "' download>Download attachment " + obj.attachment1 + "</a>", 0, obj.uid, true, isTheAuthor, obj.recipient, true);
                                    break;
                            }
                        } else {
                            addWhisper(obj.user, linker(obj.msg), 0, obj.uid, true, isTheAuthor, obj.recipient);
                        }
                        if(!document.hasFocus() && localStorage.getItem("si_push_wisp") == "true") {
                            if(localStorage.getItem("si_pings") == "true")
                                audio.play();
                            if(localStorage.getItem("si_push_notis") == "true"){
                                let noti = new Notification(obj.user + " whispers to you:", {body: obj.msg, icon: "https://cloudseeker.xyz/chatrooms/wa/WatermarkSatelliteEnabled.png"});
                            }
                        }
                    //addWhisper(obj.user, obj.msg, 0, obj.uid, true, isTheAuthor, obj.recipient);
                    $('.messageSpace').animate({
                        scrollTop: overallMessageAmount * 100000
                    }, 'fast');
                } else if(obj.action == "user") {
                    isDone = true;
                    console.log(obj.status);
                    let udateObjF = new Date(obj.creationDate * 1000);
                    let udateObj = udateObjF.toLocaleString();
                    if(obj.xstatus == "success") {
                        console.log("[ChatroomsClient] got response");
                        $("#accountInfoUsername_O").html(obj.username);
                        $("#accountInfoCreationDate_O").html(strings.modal_user_info_createdon + udateObj);
                        $("#accountInfoLastLoginDate_O").html( /*strings.modal_user_info_lastseen + obj.lastLoginDate*/ "");
                        if(obj.profilestatus == "") {
                            $("#accountInfoPStatus_0").html("Nothing is on their mind.");
                        } else {
                            $("#accountInfoPStatus_0").html(emoteify(obj.profilestatus, 20));
                        }
                        if(obj.warning == "User doesnt exist.") {
                            console.log("[ChatroomsClient] fake");
                            $("#accountInfoUnexistent_O").css("display", "block");
                        }
                        if(obj.status == "BANNED") {
                            console.log("[ChatroomsClient] banned user");
                            $("#accountInfoBanned_O").css("display", "block");
                        }
                        if(obj.status == "RESERVED") {
                            console.log("[ChatroomsClient] reserved?? o ma gad");
                            $("#accountInfoReserved_O").css("display", "block");
                        }
                        if(obj.status == "STAGING") {
                            console.log("[ChatroomsClient] reserved?? o ma gad");
                            $("#accountInfoStaging_O").css("display", "block");
                        }

                        if(obj.picture == "") {
                            console.log("[ChatroomsClient] User has no profile picture.");
                            $("#other_pfp").attr("src", "account.png");
                        } else {
                            $.ajax({url:obj.picture, error: function(xhr, status, error){
                                console.log("[ChatroomsClient] Could not load profile picture!");
                                $("#accountInfoFailedToLoadAll_O").css("display", "block");
                                $("#other_pfp").attr("src", "account.png");
                            }, success: function(result, status, xhr){
                                $("#other_pfp").attr("src", obj.picture);
                            }});
                        }
                        //$("#starWhisperButton").css("display", "none");
                        $("#whisperButton").attr("disabled", false);
                        $("#whisperButton").css("display", 'inline');
                        $("#whisperButton").html("Whisper");
                        WU = obj.id;
                        WUname = obj.username;
                        vbLog(WU);
                    } else if(obj.xstatus == "xfail") {
                        $("#accountInfoUnexistent_O").css("display", "block");
                        $("#accountInfoUsername_O").html("???");
                        $("#accountInfoCreationDate_O").html(strings.modal_user_info_createdon + "???");
                        $("#accountInfoLastLoginDate_O").html( /*strings.modal_user_info_lastseen + obj.lastLoginDate*/ "");
                    } else {
                        $("#accountInfoSystemError_O").css("display", "block");
                        console.error("FUCK");
                    }
                } else if(obj.action == "account") {
                    isDone = true;
                    vbLog(obj.status);
                    if(obj.status == "success" || "ok") {
                        vbLog(obj);
                        let udateObjF = new Date(obj.creationDate * 1000);
                        let udateObj = udateObjF.toLocaleString();
                        localCachedAccount = obj;
                        console.log("[ChatroomsClient] got response");
                        localAccountName = obj.username;
                        localAccount = obj.id;
                        if(obj.roles[0] == "admin"){
                            isAdmin = true;
                            $("#banButton")[0].disabled = false;
                        }
                        else{
                            isAdmin = false;
                            $("#banButton")[0].disabled = true;
                        }
                        $("#client_username").html(localAccountName);
                        $.ajax({url:localCachedAccount.picture, error:function(xhr, status, error){
                            console.log("[ChatroomsClient] Could not load profile picture!");
                            $("#accountInfoFailedToLoadAll_1").css("display", "block");
                            $("#client_username_warning").html('<i title="There is a problem with your account that needs your action" class="bi bi-person-fill-exclamation"></i>');
                            $("#miniPfp").attr("src", "account.png");
                            $("#accountInfoPicture_1").attr("src", "account.png");
                        }, success: function(result, status, xhr){
                                $("#miniPfp").attr("src", localCachedAccount.picture);
                                $("#accountInfoPicture_1").attr("src", localCachedAccount.picture);
                        }});  
                        $("#accountInfoUsername_1").attr("value", obj.username);
                        $("#accountInfoCreationDate_1").html(strings.modal_user_info_createdon + udateObj);
                        $("#accountInfoLastLoginDate_1").html( /*strings.modal_user_info_lastseen + obj.lastLoginDate*/ "");
                        if(obj.profilestatus == "") {
                            //$("#accountInfoPStatus_1").val("Nothing is on their mind.");
                        } else {
                            $("#accountInfoPStatus_1").val(obj.profilestatus);
                            $("#statusPreview").html(emoteify(obj.profilestatus, 20));
                        }
                        if(obj.warning == "User doesnt exist.") {
                            console.log("[ChatroomsClient] fake");
                            $("#accountInfoUnexistent_1").css("display", "block");
                        }
                        if(obj.status == "BANNED") {
                            console.log("[ChatroomsClient] banned user");
                            $("#accountInfoBanned_1").css("display", "block");
                        }
                        if(obj.status == "RESERVED") {
                            console.log("[ChatroomsClient] reserved?? o ma gad");
                            $("#accountInfoReserved_1").css("display", "block");
                        }
                        if(obj.status == "STAGING") {
                            console.log("[ChatroomsClient] reserved?? o ma gad");
                            $("#accountInfoStaging_1").css("display", "block");
                        }
                        $("#accountInfoLoading_1").css("display", 'none');
                        $("#whisperButton").attr("disabled", false);
                        $("#whisperButton").html("Whisper");
                        WU = obj.id;
                    } else {
                        $("#accountInfoSystemError_O").css("display", "block");
                        console.error("FUCK");
                    }
                } else if(obj.action == "properties") {
                    let data = obj;
                    if(obj.server_name == "" && obj.welcome_message == "") {
                        contentId = contentId;
                        socket.close();
                        var waitabit = setTimeout(function() {
                            $("#loadmodal").html("Out of sync!");
                            $("#loadmodal_content").html("This Chatroom is not correctly configured! Please contact the Chatroom owner to fix this issue. <button class='btn btn-primary' onclick='checkForSatellite();'>" + strings.satellite_rejoin_positive + "</button>");
                            $("title").html("Chatrooms");
                        }, 100);
                        return;
                    }
                    let resm = setTimeout(function(){$("#loadingResourcesModal").modal("hide"); isDone = true;}, 500);
                    //$("#loadingResourcesModal").modal("hide");
                    $("#satVer").html(avoidInjection(data.satellite_version));
                    $("#welcomeMessage").html(avoidInjection(data.welcome_message));
                    allowMessageLoading = data.load_all_history_if_any;
                    if(contentId != undefined && data.content_id != contentId) {
                        vbLog(contentId);
                        $('#protocolUpgradeModal').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $("#protocolUpgradeModal").modal("show");
                   } else {
                        if(contentId == undefined) {
                            if(allowMessageLoading == "1") {
                                getOlderMessages();
                            }
                            Notification.requestPermission().then(function(admit){if(admit.toString == "granted"){localStorage.setItem("si_push_notis", true); $("#pushes").attr("checked", true);}else{localStorage.setItem("si_push_notis", false);} console.log("[ChatroomsClient] Notification admit: " + admit);});
                            if(true){
                                $("external_intents").checked = true;
                                switch(get_args.get("intent")){
                                    case "news":
                                        $("#whispersV2Modal").modal("show");
                                        break;
                                    case "settings":
                                        $("#settingsModal").modal("show");
                                        break;
                                    case "account":
                                        viewAccountInfo(token,localAccount);
                                        break;
                                }
                                //window.location.search = "";
                            }
                            contentId = data.content_id;
                            addMessage("System", avoidInjection(data.welcome_message), 0, 0, true, now_new, true, false, true);
                            if(!isSecure){
                                addMessage("System", "<span style='color: #e6cf00;'>WARNING: You are not connecting securely! Attackers can view everything you recieve and send.</span>", 0, 0, true, now_new, true, false, true);
                            }
                        }
                    }
                    chatroomName = avoidInjection(data.server_name);
                    $("title").html(avoidInjection(data.server_name) + " / Chatrooms");
                    $("#info_chatroomName").html(strings.modal_info_roomname + avoidInjection(data.server_name));
                    $("#info_chatroomNameTitle").html(strings.modal_info + avoidInjection(data.server_name));
                    $("#info_contentId").html(strings.modal_info_packages + avoidInjection(data.content_id));
                    areMessagesSaved = Boolean(data.save_messages);
                    if(data.allow_anonymous == "") {
                        $("#info_anonymousAllowed").html(strings.modal_info_allowanon + strings.common_no);
                    } else {
                        $("#info_anonymousAllowed").html(/*strings.modal_info_allowanon + strings.common_yes*/"");
                    }
                    vbLog(data);

                    if(avoidInjection(data.chatrooms_distro) != "vanilla") {
                        addMessage("System", "<span style='color: #e6cf00;'>" + strings.protocol_custom_warning + "</span>", 0, 0, true, now_new, true, false, true);
                    }
                    getEmotes(data.emotes, emotesListSort);
                    if(data.localhost_lock == "") {
                        $("#info_chatroomLocked").html(strings.modal_info_padlock + strings.common_no);
                    } else {
                        $("#info_chatroomLocked").html(/*strings.modal_info_padlock + strings.common_yes*/"");
                    }
                    if(data.save_messages == "") {
                        $("#info_chatroomSaves").html(strings.modal_info_roomsave + strings.common_no);
                    } else {
                        $("#info_chatroomSaves").html(strings.modal_info_roomsave + strings.common_yes);
                    }
                    if(data.require_email == "1") {
                        $("#info_chatroomEmail").html(strings.modal_info_emailver + strings.common_email);
                    } else {
                        $("#info_chatroomEmail").html(strings.modal_info_emailver + strings.common_none);
                    }
                    $("#info_welcomeMessage").html(strings.modal_info_motd + avoidInjection(data.welcome_message));
                    shouldReconnect = true;
                    const d = new Date();
                    if(d.getMonth() == 2 && d.getDate() == 24) {
                        birthdayEasterEggTriggered = true;
                        if(localAccount == "2" && localStorage.getItem("server") == "cloudseeker.xyz")
                            addMessage("System", "Happy Birthday!", 0, 0, true, now_new, true);
                        else
                            addMessage("System", "Happy Birthday to GeofTheCake!", 0, 0, true, now_new, true);
                    } else if(d.getMonth() == 0 && d.getDate() == 28) {
                        birthdayEasterEggTriggered = true;
                        if(localAccount == "1" && localStorage.getItem("server") == "cloudseeker.xyz")
                            addMessage("System", "Happy Birthday PTJ!", 0, 0, true, now_new, true);
                        else
                            addMessage("System", "Happy Birthday to Popular Toppling Jelly!", 0, 0, true, now_new, true);
                    }
                } else if(obj.action == "older_messages") {
                    isDone = true;
                    let msgamount = Object.keys(obj.messages).length;
                    for(let i = (Object.keys(obj.messages).length - 1); i < msgamount; i--) {
                        overallMessageAmount++;
                        let isLast = false;
                        let isTheAuthor = false;
                        let dateObjF = new Date(obj.messages[i].date * 1000);
                        let dateObj = dateObjF.toLocaleString();
                        let data = obj.messages;
                        //messageAutoscroll(true);
                        vbLog("[ChatroomsClient] Added message with id " + data.id + " and name " + data.name);
                        if(i == (msgamount - 1)) {
                            console.log("Last message!");
                            isLast = true;
                            if(allowMessageLoading == "1") {
                                let waitabit_32948732 = setTimeout(messageAutoscroll, 100);
                            }
                        }
                        if(data[i].author == localAccount) {
                            isTheAuthor = true;
                        }
                        data[i].content = linker(data[i].content);
                        if(data[i].attachment1 != "") {
			    data[i].attachment1 = httphost + data[i].attachment1;
                            var filetype = data[i].attachment1.substring(data[i].attachment1.length - 4, data[i].attachment1.length);
                            switch(filetype) {
                                case ".png":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-png'></i><br><a href='#' onclick='setAttachmentPreview(\""+ data[i].attachment1 +"\");;'><img width='40%' height='40%' src='" + data[i].attachment1 + "'></a>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case ".jpg":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-jpg'></i><br><a href='#' onclick='setAttachmentPreview(\""+ data[i].attachment1 +"\");;'><img width='40%' height='40%' src='" + data[i].attachment1 + "'></a>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case "jpeg":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-jpg'></i><br><a href='#' onclick='setAttachmentPreview(\""+ data[i].attachment1 +"\");;'><img width='40%' height='40%' src='" + data[i].attachment1 + "'></a>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case ".gif":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-jpg'></i><br><a href='#' onclick='setAttachmentPreview(\""+ data[i].attachment1 +"\");;'><img width='40%' height='40%' src='" + data[i].attachment1 + "'></a>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case ".mp4":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-mp4'></i><br> <video width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='video/mp4'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case "webm":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-mp4'></i><br> <video width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='video/webm'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case ".ogg":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-mp3'></i><br> <audio width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</audio> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case "webp":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-png'></i><br><a href='#' onclick='setAttachmentPreview(\""+ data[i].attachment1 +"\");;'><img width='40%' height='40%' src='" + data[i].attachment1 + "'></a>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case ".mp3":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-mp3'></i><br> <audio width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</audio> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                case ".wav":
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-wav'></i><br> <audio width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='audio/wav'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                                default:
                                    addMessage(data[i].username, data[i].content + " <i class='bi bi-filetype-raw'></i><br><a href='" + data[i].attachment1 + "' download>Download attachment " + data[i].attachment1 + "</a>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                                    break;
                            }
                        } else {
                            addMessage(data[i].username, data[i].content, 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id, true);
                        }
                        //if(i == msgamount){                        }
                    }
                    $('.messageSpace').animate({
                        scrollTop: overallMessageAmount * 100000
                    }, 'fast');
                } else {
                    console.log("[ChatroomsSatellite] Who even knows what happened.");
                }
            } else {
                beginStringery();
            }
        };

        socket.onerror = function(error) {
            console.log(error);
            //addMessage("System", "<span style='color:#ff4d4d;'>" + strings.satellite_error + "</span>" /* + error.message */ , 0, 0, true);
            toaster(strings.satellite_error);
            cancelKeepAlive();
        };


        /*else{
        	console.warn("ChatroomsSatellite is disabled, proceeding to use HTTP Chatrooms protocol...");
        }*/
    } else {
        isDone = true;
        clearInterval(funny_title_thing);
        beginStringery();
        console.warn('[ChatroomsSatellite] The user is NOT logged in!');
        let resm = setTimeout(function() {
            funny_title_thing = setInterval(function(){
                const things = ['Welcome to Chatrooms,', 'a free, lightweight,', 'easy to use and', 'open source chat app', 'made by CloudSeeker.']
                $("title").html(things[things_count]);
                if(things_count == 4){things_count = 0;}else{things_count++;}
            }, 1500);
            $('#loginModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            $("#loadingResourcesModal").modal("hide");
            $("#loginModal").modal("show");
            getSuggested();
        }, 1000);
    }
    }catch(e){
        catchError(e);
    }
}

function setAttachmentPreview(preview){
    $("#attachmentPreview")[0].src = preview;
    $("#apOGImage").on("click", function(){extLink(preview)});
    $("#apModal").modal("show");
}

function catchError(e){
    shouldReconnect = false;
    socket.close();
    let waitabit = setTimeout(function(){$("#loadmodal_content").html("Something went wrong behind the scenes! Try again later, or report an issue by clicking the button below.")}, 100);
    if(localStorage.getItem("si_beta_verbose_logging") == "true"){
        vbLog(e);
        $("#actual_disconnect_reason").html("<hr>Satellite Disconnect Reason: 1000 (Clean)<br>" + e);
    }
    else{
        $("#actual_disconnect_reason").html("<hr><button class='btn btn-primary' onclick='toaster(\""+ e +"\")'>Reveal Technical Details</button>");
    }
    emptyEnvironment();
}

// htoaster generates a toast message with a header, and toaster without
function htoaster(author, content) {
    $(".toast-container").html('<div id="toaster-x" class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">\n<div class="toast-header"><strong class="me-auto">' + author + '</strong><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div>\n<div class="d-flex">\n<div class="toast-body">\n' + content + '</div>\n</div>\n</div>');
    let toastLiveExample = $("#toaster-x");
    bootstrap.Toast.getOrCreateInstance(toastLiveExample).show();
}

function toaster(content) {
    $(".toast-container").html('<div id="toaster-x" class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">\n<div class="d-flex">\n<div class="toast-body">\n' + content + '</div>\n<button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>\n</div>\n</div>');
    let toastLiveExample = $("#toaster-x");
    bootstrap.Toast.getOrCreateInstance(toastLiveExample).show();
}

function addToDMList(username, id){
    if(localStorage.getItem("dms") != undefined) {
        let dms = localStorage.getItem("dms");

        for(let x = 0; x < whispers.length; x++){
        	vbLog("This server has open DMs!");
        	if(whispers[x].server == localStorage.getItem("server") && whispers[x].port == localStorage.getItem("port"))
        	{
        		let y = 0;
        		vbLog("Add DM button for this user");
        		$("#whispers").html($("#whispers")[0].innerHTML + "<button id='dm_0' class='server emerg activatedServer' onclick='initiateWhisper(\""+ whispers[x][y].dms.id +"\", true); addMessage(&quot;System&quot;, &quot;You are now whispering to " + whispers[x][y].dms.username + "&quot;, 0, 0, true, now_new, true);'><span class='channel-dot'><i class='bi bi-chat'></i> •</span> " + objdms[x][y].dms.username + "</button>");
        	}
                else{
                    whispers[whispers.length + 1] = [{"server": localStorage.getItem("server"), "port": localStorage.getItem("port"), "dms": {"id": id, "username": username}}];
                    localStorage.setItem("dms", JSON.stringify(whispers));
                    console.log(whispers);
                }
        }
    }
    else{
        whispers[0] = [{"server": localStorage.getItem("server"), "port": localStorage.getItem("port"), "dms": {"id": id, "username": username}}];
        localStorage.setItem("dms", JSON.stringify(whispers));
        console.log(whispers);
    }
}

function removeFromDMList(id){
    if(localStorage.getItem("dms") != undefined) {
        let dms = localStorage.getItem("dms");

        for(let x = 0; x < whispers.length; x++){
        	vbLog("This server has open DMs!" + x);
        	if(whispers[x][0].server == localStorage.getItem("server") && whispers[x][0].port == localStorage.getItem("port") && whispers[x][0].dms.id == id)
        	{
                    whispers.splice(x, 1);
                    localStorage.setItem("dms", JSON.stringify(whispers));
                    console.log(whispers);
                }
        }
    }
    else{
        console.log("[ChatroomsClient] There are no whispers to remove!");
    }
}

function loadDMs() {
    $("#whispers").html("");
    try{
    if(localStorage.getItem("dms") != undefined) {
    if(localStorage.getItem("dms") != "[]"){
        let dms = localStorage.getItem("dms");

        let objdms = JSON.parse(dms);
        whispers = objdms;

        vbLog(objdms[0][0].dms.length);

        for(let x = 0; x < (objdms.length); x++){
        	vbLog("This server has open DMs! " + x);
                vbLog("DM Array Length: " + objdms.length);
		if(objdms[x] == null){
			vbLog("Invalid user found!");
                }
        	else{
			if(objdms[x][0].server == localStorage.getItem("server") && objdms[x][0].port == localStorage.getItem("port"))
        		{
        			let y = 0;
        			vbLog("Add DM button for this user");
                        	$("#whispers").html($("#whispers")[0].innerHTML + "<button id='dm_0' class='server emerg activatedServer' onclick='initiateWhisper(\""+ objdms[x][y].dms.id +"\", true); addMessage(&quot;System&quot;, &quot;You are now whispering to " + objdms[x][y].dms.username + "&quot;, 0, 0, true, now_new, true); messageAutoscroll();'><span class='channel-dot'><i class='bi bi-chat-left-text-fill' title='Whisper'></i> •</span> " + objdms[x][y].dms.username + "</button>");
        		}
		}
        }
    }
    }
    else{
        whispers = [];
    }
    }catch(e){
        catchError(e);
    }
}

function initiateWhisper(id, shouldAdd) {
    xload();
    if(id != localAccount){
        localChannel = "w:" + id;
        vbLog(localChannel);
        vbLog(id);
    } else {
        toaster("You can't whisper to yourself, silly!");
    }
    isDone = true;
}

function vcButtonControl(should) {
    $("*.vc").prop("disabled", should);
}

function extLink(link) {
    closeEverythingElse();
    $("#extLinkStuff")[0].value = link
    extUrl = link;
    $("#extModal").modal("show");
}

function checkForVSatellite() {
    $("#vs_status").html("<span class='text-warning'>VS Connecting</span>");
    vsocket = new WebSocket(vhost);
    var timerId = 0;
    xload();
    function keepAlive() {
        var timeout = 10000;
        if(socket.readyState == socket.OPEN) {
            //socket.send('');  
        }
        timerId = setTimeout(keepAlive, timeout);
    }

    function cancelKeepAlive() {
        if(timerId) {
            clearTimeout(timerId);
        }
    }

    vsocket.onopen = function() {
        vcButtonControl(true);
        console.log("[ChatroomsVSatellite] Connected.");
        isDone = true;
        htoaster("Keep In Mind!", "Chatrooms Voice is still in early betas, so there might be frequent issues!");
        $("#vs_status").html("<span class='text-success'>Connected!</span> <button class='btn text-danger' onclick='vsocket.close()' aria-label='Disconnect from Voice'><i class=\"bi bi-telephone-x-fill\"></i></button>");
        getVCOnlineUsers();
    };

    vsocket.onclose = function(event) {
        isDone = true;
        vcButtonControl(false);
        if(event.wasClean) {
            console.log('[ChatroomsVSatellite] ' + strings.satellite_permadisconnect_positive);
            $("#vs_status").html("");
        } else {
            console.error('[ChatroomsVSatellite] ' + strings.satellite_permadisconnect);
            $("#vs_status").html("<span class='text-danger'>Disconnected!</span>");
        }
        console.warn('[ChatroomsVSatellite] DISCONNECTED! Code: ' + event.code + ' Reason: ' + event.reason);
        cancelKeepAlive();
        getVCOnlineUsers();
        /*navigator.getUserMedia({
            audio: false
        }, doNothing(), doNothing());*/
        //mediaRecorder.getAudioTracks().forEach(function(track) {
          //  track.enabled = false;
        //});
        //mediaRecorder.stop();
        //clearInterval(sendEveryP5Sec);
    };

    vsocket.onmessage = function(event) {
        vbLog("[ChatroomsVSatellite] Data received: " + event.data);
        if(event.data != "Welcome to the Chatrooms Experience!") {
            let obj = JSON.parse(event.data);
            let dateObjF = new Date(obj.time * 1000);
            let dateObj = dateObjF.toLocaleString();
            if(obj.status != undefined && obj.status == "fail") {
                console.log("[ChatroomsVSatellite] Uh oh spaghettio!");
                switch(obj.error) {
                    case "localhost_lock_enabled":
                        addMessage("System", "<span style='color:#ff4d4d;'>This chatroom is currently locked! (localhost_lock_enabled)</span>", 0, 0, true, dateObj, true, true);
                        $("#actual_disconnect_reason").html("This chatroom is currently locked!");
                        break;
                    case "account_temporarily_restricted":
                        addMessage("System", "<span style='color:#ff4d4d;'>Your account has been temporarily restricted, wait for an admin to allow you to enter! (account_temporarily_restricted)</span>", 0, 0, true, dateObj, true, true);
                        $("#actual_disconnect_reason").html("Your account has been temporarily restricted, wait for an admin to allow you to enter!");
                        break;
                    case "no_authentication_provided":
                        addMessage("System", "<span style='color:#ff4d4d;'>The account you're connecting with doesn't exist anymore! (no_authentication_provided)</span>", 0, 0, true, dateObj, true, true);
                        $("#actual_disconnect_reason").html("The account you're connecting with doesn't exist anymore!");
                        break;
                    case "user_already_online":
                        addMessage("System", "<span style='color:#ff4d4d;'>You're already online on another device! (user_already_online)</span>", 0, 0, true, dateObj, true, true);
                        $("#actual_disconnect_reason").html("You're already online on another device!");
                        break;
                    case "or_you_will_get_clapped":
                        addMessage("System", "<span style='color:#ff4d4d;'>You have been banned from this chatroom! (or_you_will_get_clapped)</span>", 0, 0, true, dateObj, true, true);
                        $("#actual_disconnect_reason").html("You have been banned from this chatroom!");
                        break;
                    case "email_not_set":
                        addMessage("System", "<span style='color:#ff4d4d;'>You need to verify your email to continue to this Chatroom! You can do that <a href='/chatrooms/login/2fa/index.php'>here</a> (email_not_set)</span>", 0, 0, true, dateObj, true, true);
                        $("#actual_disconnect_reason").html("You need to verify your email to continue to this Chatroom! You can do that <a href='/chatrooms/login/2fa/index.php'>here</a>");
                        break;
                    default:
                        addMessage("System", "<span style='color:#ff4d4d;'>Critical error while connecting! I don't know what happened.</span>", 0, 0, true, dateObj, true, true);
                        console.log("Something really crazy happened, we couldn't tell why the client got disconnected");
                        break;
                }
            }
            if(obj.action == "vmessage") {
                vbLog("[ChatroomsVSatellite] Message with vmessage intent has been recieved");
                if(obj.channel == vchannel) {
                    var snd = new Audio("data:audio/webm;base64," + obj.msg);
                    snd.play();
                }
            } else if(obj.action == "join") {
                console.log("[ChatroomsSatellite] Message with join intent has been recieved");
                addMessage(obj.user, "<i>has joined the voice chat you're in!</i>", 0, obj.uid, true, dateObj, false, true, false, obj.msgid);
                $('.messageSpace').animate({
                    scrollTop: overallMessageAmount * 100000
                }, 'fast');
                getVCOnlineList();
            } else if(obj.action == "leave") {
                console.log("[ChatroomsSatellite] Message with leave intent has been recieved");
                addMessage(obj.user, "<i>has left the voice chat.</i>", 0, obj.uid, true, dateObj, false, true, false, obj.msgid);
                $('.messageSpace').animate({
                    scrollTop: overallMessageAmount * 100000
                }, 'fast');
                getVCOnlineList();
            } else if(obj.action == "onlineuser") {
                    let pfp;
                    if(obj.picture == "") {
                        console.log("[ChatroomsClient] User has no profile picture.");
                        pfp = "account.png";
                        $(".vcOnlineList").html(document.getElementsByClassName("vcOnlineList")[0].innerHTML + "<a href='#' onclick='userInfo(" + obj.id + ", \"" + obj.username + "\")'><img class='rounded' src='"+ pfp +"' width='26' height='26'> " + obj.username.replace(localAccountName, "<b>" + localAccountName + "</b>") + "</a><br><span style='font-size:16px;'>\""+ emoteify(obj.profilestatus, 14) +"\"</span><br>\n");
                    } else {
                        $.ajax({url:obj.picture, error: function(xhr, status, error){
                            console.log("[ChatroomsClient] Could not load profile picture!");
                            pfp = "account.png";
                            $(".vcOnlineList").html(document.getElementsByClassName("vcOnlineList")[0].innerHTML + "<a href='#' onclick='userInfo(" + obj.id + ", \"" + obj.username + "\")'><img class='rounded' src='"+ pfp +"' width='26' height='26'> " + obj.username.replace(localAccountName, "<b>" + localAccountName + "</b>") + "</a><br><span style='font-size:16px;'>\""+ emoteify(obj.profilestatus, 14) +"\"</span><br>\n");
                        }, success: function(result, status, xhr){
                            pfp = obj.picture;
                            $(".vcOnlineList").html(document.getElementsByClassName("vcOnlineList")[0].innerHTML + "<a href='#' onclick='userInfo(" + obj.id + ", \"" + obj.username + "\")'><img class='rounded' src='"+ pfp +"' width='26' height='26'> " + obj.username.replace(localAccountName, "<b>" + localAccountName + "</b>") + "</a><br><span style='font-size:16px;'>\""+ emoteify(obj.profilestatus, 14) +"\"</span><br>\n");
                        }});
                    }
           } else {
                console.log("[ChatroomsVSatellite] Who even knows what happened.");
            }
        } else {
            //beginStringery();
        }
    };

    vsocket.onerror = function(error) {
        console.log(error);
        vcButtonControl(false);
        //addMessage("System", "<span style='color:#ff4d4d;'>"+ strings.satellite_error +"</span>"/* + error.message */, 0, 0, true);
        toaster(strings.satellite_error);
        cancelKeepAlive();
    };


    /*else{
    	console.warn("ChatroomsSatellite is disabled, proceeding to use HTTP Chatrooms protocol...");
    }*/
}

function processLogin(server, username, password, port, secure) {
    xload();
    if(username == "System"){
        isDone = true;
        $("#loginError").html("<div class='alert alert-info'>Are you about 273% sure that this account belongs to you?</div>");
    }
    else{
        pingsocket.send('{"type":"login", "username":"'+ username +'", "password":"'+ password +'"}');
    }
    /*$.post("https://" + server + "/api/chatrooms/remote-login/", {
        "Luser": username,
        "Lpass": password
    }, function(data, status) {
        isDone = true;
        console.log("[ChatroomsClient] Login successful! Now logged in as " + username);
        if(data.error != undefined) {
            $("#loginError").html("<div style='color:red;'>Incorrect login credentials (INCORRECT_CREDENTIALS)</span>");
        } else {
            //
        }
    });*/
}

function doesThatServerExist(server, port, secure) {
    xload();
    $.ajax({url: "https://" + server + "/api/chatrooms/ping/", success: function(result, xhr, status) {
        let data = result;
        //if(status == "success") {
            // has a media server, proceed
            if(port != undefined || port != "")
                if(secure != undefined || secure != "")
                    //var pingsocket = new WebSocket("wss://" + server + ":" + port + "/?ping=ping");
                    if(secure == "false")
                        pingsocket = new WebSocket("ws://" + server + ":" + port + "/?auth=Anonymous");
                    else
                        pingsocket = new WebSocket("wss://" + server + ":" + port + "/?auth=Anonymous");
            else
                if(secure != undefined || secure != "")
                    //var pingsocket = new WebSocket("wss://" + server + ":7778/?ping=ping");
                    if(secure == "false")
                        pingsocket = new WebSocket("ws://" + server + ":7778/?auth=Anonymous");
                    else
                        pingsocket = new WebSocket("wss://" + server + ":7778/?auth=Anonymous");
            var timerId = 0;

            function keepAlive() {
                var timeout = 10000;
                if(socket.readyState == socket.OPEN) {

                }
                timerId = setTimeout(keepAlive, timeout);
            }

            function cancelKeepAlive() {
                if(timerId) {
                    clearTimeout(timerId);
                }
            }

            pingsocket.onopen = function(event){
                console.log("[ChatroomsSatellite] Test connection successful!");
                $("#loginModal").modal("hide");
                $('#loginModalPhase2').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $("#loginModalPhase2").modal("show");
                if(port != undefined)
                    tempServer = server + ":" + port;
                else
                    tempServer = server + ":7778";
            }

            pingsocket.onmessage = function(event) {
                isDone = true;
                let obj = JSON.parse(event.data);
                if(obj.token != undefined) {
                     localStorage.setItem("server", server);
                     localStorage.setItem("token", obj.token);
                     // also for legacy functions icba to fix
                     localStorage.setItem("authentication", obj.token);
                     if(port != undefined || port != "")
                         localStorage.setItem("port", port);
                     else
                         localStorage.setItem("port", "7778");
                         if(secure != undefined || secure != "")
                             localStorage.setItem("secure", secure);
                     checkForSatellite();
                     $("#loginModal").modal("hide");
                     $("#loginModalPhase2").modal("hide");
                     $("#potentialJoinModal").modal("hide");
                     pingsocket.close();
                     cancelKeepAlive();
                } else if(obj.status == "fail") {
                    $("#ConfirmLoginBTN").html("Log In");
                    $("#loginError").html("<div class='alert alert-danger'>Wrong username or password!</div>");
                }
            }

            pingsocket.onerror = function(error) {
                $("#loginError").html("<div class='alert alert-danger'>This Chatroom is currently not available.</div>");
                $("#check_external_server").html("Check");
                toaster(strings.satellite_error);
                console.log(error);
                cancelKeepAlive();
            };
        //} else {
          //  $("#loginError").html("<div class='alert alert-danger'>This Chatroom is not configured properly! Please contact the owner to fix this issue.</div>");
        //}
    }, error: function(xhr, status, error){
        $("#loginError").html("<div class='alert alert-danger'>This Chatroom's media server is not available!</div>");
        $("#check_external_server").html("Check");
        toaster(strings.satellite_error);
    }});
}

function silentOptIn(beta, preference) {
    let h0;

    if(preference) {
        h0 = "in";
    } else {
        h0 = "out";
    }

    localStorage.setItem("si_" + beta, preference);
    //toaster("Successfully opted "+ h0 +" for " + beta + ". You might need to restart the app for changes to apply properly");
}

function optIn(beta, preference) {
    let h0;

    if(preference) {
        h0 = "in";
    } else {
        h0 = "out";
    }

    localStorage.setItem("si_beta_" + beta, preference);
    toaster("Successfully opted " + h0 + " for " + beta + ". You might need to restart the app for changes to apply properly");
}

function startRecordingVoice() {
    var alreadyStarted = false;

    console.log("[ChatroomsV] Requesting microphone...");
    const stopButton = document.getElementById('stop_record');
    const unmuteButton = document.getElementById('mute_button');
    if(!hasVcBeenTriggered) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        const acceptAudio = function(stream) {
            const options = {
                mimeType: 'audio/webm'
            };
            var recordedChunks = [];
            mediaRecorder = new MediaRecorder(stream, options);
            console.log(mediaRecorder);
            navigator.mediaDevices.getUserMedia({
                audio: true
            });
            mediaRecorder.stream.getAudioTracks().forEach(function(track) {
                track.enabled = true;
            });
            mediaRecorder.start(1000);
            vcState = true;
            $("#mute_button").css("display", "none");
            $("#stop_record").css("display", "block");
            mediaRecorder.addEventListener('dataavailable', function(e) {
                if(e.data.size > 0) {
                    recordedChunks.push(e.data);
                    var reader = new FileReader();
                    vcblob = new Blob(recordedChunks);
                    reader.readAsBinaryString(vcblob);
                    reader.onloadend = (event) => {
                        //console.log(URL.createObjectURL(vcblob));
                        //console.log(reader.result);
                        vsend(reader.result);
                        recordedChunks = [];
                    }
                }
            });

            mediaRecorder.addEventListener('stop', function() {
                //downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
                //downloadLink.download = 'acetest.wav';
                vbLog(recordedChunks);
                //recordedChunks = [];
                //vbLog(URL.createObjectURL(new Blob(recordedChunks)));
                var global_vc_data = recordedChunks;
                //clearInterval(sendEveryP5Sec);
            });

            unmuteButton.addEventListener('click', function() {
                console.log(mediaRecorder);
                if(!hasVcBeenTriggered){
                    navigator.mediaDevices.getUserMedia({
                        audio: true
                    }).then(acceptAudio);
                }
                mediaRecorder.stream.getAudioTracks().forEach(function(track) {
                    track.enabled = true;
                });
                //mediaRecorder.start();
                $("#mute_button").css("display", "none");
                $("#stop_record").css("display", "block");
                vcState = true;
                //mediaRecorder.();
                //var sendEveryP5Sec = setInterval(function() {
                  //  if(mediaRecorder.state == "recording"){
                  //      mediaRecorder.stop();
                    //    vsend(recordedChunks);
                      //  recordedChunks = [];
                        //mediaRecorder.start();
                  //  }
                //}, 1000);
            });

            stopButton.addEventListener('click', function() {
                //mediaRecorder.stop();
                //mediaRecorder.stream.getAudioTracks().forEach(function(track) {
                  //  track.stop();
                //});
                //mediaRecorder.start();
                $("#stop_record").css("display", "none");
                $("#mute_button").css("display", "block");

                //mediaRecorder.stream.getAudioTracks().forEach(function(track) {
                  //  track.enabled = false;
                //});
                vcState = false;
                //mediaRecorder.stop();
                //clearInterval(sendEveryP5Sec);
		// gonna do it twice cuz this thing is stupid asf
		//clearInterval(sendEveryP5Sec);
            });

            var sendEveryP5Sec = setInterval(function() {
                if(vcState == true){
                    //mediaRecorder = new MediaRecorder(stream, options);
                    //console.log(mediaRecorder);
                    //mediaRecorder.start();
                    //if(vsocket != undefined || vsocket.readyState == 1)
                    //vsend(recordedChunks);
                    //recordedChunks = [];
                    // keep in mind: requestData
                    //mediaRecorder.requestData();
                    mediaRecorder.stop();
                    mediaRecorder.start(1000);
                }
                else{
                    vbLog("[ChatroomsClient] Voice is muted!");
                }
            }, 1000);
            hasVcBeenTriggered = true;

        };

        if(!alreadyStarted) {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(acceptAudio);
            //mediaRecorder.stream.getAudioTracks().forEach(function(track) {
              //  track.enabled = true;
            //});
        } else {
            alreadyStarted = true;
        }
    }
}

function vsend(buffer) {
    var vsend = buffer;

    vsocket.send('{"type":"message", "authentication":"' + token + '", "message":"' + btoa(buffer) + '", "channel":"' + vchannel + '"}');
}

function retryConnection() {
    console.log("[ChatroomsSatellite] Retrying...");
    $("#loadmodal_content").html("<div class='spinner-border'></div>");
    globalRetries++;
    let rc = 5;
    let rct = setInterval(function() {
        if(rc != 0) {
            //addMessage("System", "Retrying in " + rc +  "...", 0, 0, true, now_new, true, false, true);
            //$("#disconnect_reason").html("Retrying in " + rc + "...");
            //$('.messageSpace').animate({scrollTop:overallMessageAmount*100000}, 'fast');
            rc--;
        } else {
            clearInterval(rct);
            $("#disconnect_reason").html("");
            $("#loadmodal").html(strings.satellite_already_connecting);
            //addMessage("System", "Connecting to Chatrooms...", 0, 0, true, now_new, true, false, true);
            //$('.messageSpace').animate({scrollTop:overallMessageAmount*100000}, 'fast');
            //socket = new WebSocket(host);
            checkForSatellite();
        }
    }, 1000);
}

function sockSend(stringer) {
    socket.send(stringer);
}

function getOlderMessages() {
    if(firstTimeLoad) {
        clearChat();
        overallMessageAmount = 0;
    } else {
        firstTimeLoad = true;
    }
    sockSend('{"type":"older_messages","authentication":"' + token + '","channel":"' + localChannel + '"}');
    /*$.post(httphost + "/api/chatrooms/messages/get_new/", {"authentication": token, "channel": localChannel}, function(data,status){
		vbLog(Object.keys(data).length);
		let msgamount = Object.keys(data).length;
		for (let i = (Object.keys(data).length - 1); i < msgamount; i--) {
			overallMessageAmount++;
  			let isLast = false;
			let isTheAuthor = false;
			let dateObjF = new Date(data[i].date * 1000);
	  		let dateObj = dateObjF.toLocaleString();
			vbLog("[ChatroomsClient] Added message with id "+ data[i].id +" and name "+ data[i].name);
			if(i == msgamount){
				isLast = true;
			}
			if(data[i].author == localAccount){
				isTheAuthor = true;
			}
			if(data[i].attachment1 != ""){
			var filetype = data[i].attachment1.substring(data[i].attachment1.length-4, data[i].attachment1.length);
			switch(filetype){
				case ".png":
					addMessage(data[i].username, data[i].content + "<br><img width='40%' height='40%' src='" + data[i].attachment1 + "'>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case ".jpg":
					addMessage(data[i].username, data[i].content + "<br><img width='40%' height='40%' src='" + data[i].attachment1 + "'>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case "jpeg":
					addMessage(data[i].username, data[i].content + "<br><img width='40%' height='40%' src='" + data[i].attachment1 + "'>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case ".gif":
					addMessage(data[i].username, data[i].content + "<br><img width='40%' height='40%' src='" + data[i].attachment1 + "'>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case ".mp4":
					addMessage(data[i].username, data[i].content + "<br> <video width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='video/mp4'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case "webm":
					addMessage(data[i].username, data[i].content + "<br> <video width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='video/webm'>UPDATE YOUR BROWSER TO VIEW THIS VIDEO</video> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case ".ogg":
					addMessage(data[i].username, data[i].content + "<br> <audio width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</audio> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case "webp":
					addMessage(data[i].username, data[i].content + "<br><img width='40%' height='40%' src='" + data[i].attachment1 + "'>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case ".mp3":
					addMessage(data[i].username, data[i].content + "<br> <audio width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='audio/ogg'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</audio> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				case ".wav":
					addMessage(data[i].username, data[i].content + "<br> <audio width='40%' height='40%' controls><source src='" + data[i].attachment1 + "' type='audio/wav'>UPDATE YOUR BROWSER LISTEN TO THIS AUDIO</video> ", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
				default:
					addMessage(data[i].username, data[i].content + "<br><a href='"+ data[i].attachment1 +"' download>Download attachment "+ data[i].attachment1 +"</a>", 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
				break;
			}
			}else{
				addMessage(data[i].username, data[i].content, 0, data[i].author, true, dateObj, false, isLast, isTheAuthor, data[i].id);
			}
		}
		$('.messageSpace').animate({scrollTop:overallMessageAmount*100000}, 'fast');
	});*/
}
//var emoteList = [{"name":"copium", "image":"/assets/emotes/copium.png"}], [{"name":"heheheha", "image":"/assets/emotes/heheheha.gif"}];
/*var getMessageSequence = setInterval(function(){
	time++;
	$.post("/api/chatrooms/messages/get/", {"authentication": token, "time": time}, function(data, status){
		if(data.status == "authfail"){
			clearInterval(getMessageSequence); 
			addMessage("System", "<span style='color:red;'>There was an authentication failure, and you could not be connected to Chatrooms.</span>", 0, "0", true);
			return;
		}

		if(data.status != "nothingNew"){
			for(let index = 0; index < data.messages.length; ++index){
				const h = data.messages[index]; 
				addMessage(h.user, h.msg, 0, h.uid, true);
			}
		}
		
	});
}, 1000);*/
function nowDoTheOpposite() {
    //$("#loadingResourcesModal").modal("show");
    let resm = setTimeout(function() {
        $("#loadingResourcesModal").modal("show");
    }, 500);
}

function nowDoTheOpposite2() {
    //$("#loadingResourcesModal").modal("show");
    let resm = setTimeout(function() {
        $("#loadingResourcesModal").modal("hide");
    }, 500);
}

function beginStringery() {
    // BEGIN STRINGERY SETUP
    console.log("[Stringery] BEGIN STRINGERY SETUP");
    $("#si_attention").html(strings.common_attention);
    $("#consentAcceptButton").html(strings.common_agreement);
    $("#aboutrooms_t").html(strings.modal_about);
    $("#aboutrooms_o").html(strings.common_ok);
    $("#odw").html(strings.modal_about_slogan);
    $("#quote_p1").html(strings.modal_about_quote);
    $("#quote_p2").html(strings.modal_about_quoteauthor);
    $("#infom_ok").html(strings.common_ok);
    $("#localemodal").html(strings.modal_language);
    $("#thememodal_2").html(strings.modal_theme);
    $("#thememodal_d").html(strings.modal_theme_d);
    $("#sthememodal_d").html(strings.modal_theme_d);
    $("#lightmode").html(strings.modal_theme_light);
    $("#inbetweenmode").html(strings.modal_theme_inbetween);
    $("#bdarkmode").html(strings.modal_theme_dark);
    $("#neonmode").html(strings.modal_theme_s1);
    $("#woodmode").html(strings.modal_theme_s2);
    $("#purplemode").html(strings.modal_theme_s3);
    $("#halloweenlightmode").html(strings.modal_theme_s4);
    $("#christmasdarkmode").html(strings.modal_theme_s5);
    $("#attach_t").html(strings.option_attach);
    $("#closeattach_b").html(strings.common_close);
    $("#acceptattach_b").html(strings.common_accept);
    $("#notis_t").html(strings.option_notifications);
    $("#notis_volume").html(strings.option_notifications_volume);
    $("#notis_volume_d").html(strings.option_notifications_volume_d);
    $("#notis_pings").html(strings.modal_notis_pings);
    $("#notis_pings_d").html(strings.modal_notis_pings_desc);
    $("#customcss_t").html(strings.option_custom_css);
    $("#customcss_tp").html(strings.option_custom_css);
    $("#customcss_d").html(strings.modal_css_d);
    $("#acceptcss_b").html(strings.common_accept);
    $("#closecss_b").html(strings.common_cancel_alt);
    $("#emoteslist").html(strings.common_emoteslist);
    $("#emotes_ok").html(strings.common_ok);
    $("#logout_t").html(strings.modal_logout);
    $("#logout_d").html(strings.modal_logout_d);
    $("#logout_accept").html(strings.modal_logout_accept);
    $("#logout_cancel").html(strings.common_cancel);
    $("#twitter_1").html("<img src='twitter.png' width='20' height='16'> " + strings.option_twitter_1);
    $("#twitter_2").html("<img src='twitter.png' width='20' height='16'> " + strings.option_twitter_2);
    $("#gdisc_button").html(strings.modal_disconnect);
    $("#disconnect_t").html(strings.modal_disconnect);
    $("#disconnect_d").html(strings.modal_disconnect_d);
    $("#gdisc_accept").html(strings.modal_disconnect_accept);
    $("#gdisc_cancel").html(strings.common_cancel);
    $("#rules_t").html(strings.option_view_rules);
    $("#rules_ok").html(strings.common_ok);
    $("#userinfo_t").html(strings.modal_user_info);
    $("#userinfo_ok").html(strings.common_ok);
    $("#customcss_button").html(strings.option_custom_css);
    $("#lgout_l_button").html(strings.option_logout);
    // the amount of copium to keep the 5 letter streak :skull:
    $("#theme_button").html(strings.option_switch_theme);
    $("#multi_button").html(strings.option_switch_room);
    $("#rules_button").html(strings.option_view_rules);
    $("#infos_button").html(strings.option_view_info);
    //$("#about_button").html(strings.option_about);
    $("#lgout_button").html(strings.option_logout);
    $("#notis_button").html(strings.option_notifications);
    // too bad it has to end :(
    $("#nca_text").html(strings.channels_none_available);
    $("#emotes_button").html(strings.common_emoteslist);
    $("#locale_button").html(strings.modal_language);
    $("#send_button").html(strings.common_sendcomposed);
    document.getElementById("msgBox").placeholder = strings.common_messagebox;
    document.getElementById("editMsgBox").placeholder = strings.common_editbox;
    $("#changelog").html(strings.option_latest);
    $("#locale_t").html(strings.modal_language);
    $("#m_channels_b").html(strings.channels);
    $("#channels_m").html(strings.channels);
    $("#m_options_b").html(strings.mobile_options);
    $("#options_m").html(strings.mobile_options);
    $("#protocolupgrade_t").html(strings.protocol_upgrade);
    $("#protocolupgrade_d").html(strings.protocol_upgrade_server);
    $("#protocolupgrade_b").html(strings.common_accept);
    $("#init_auth").html(strings.protocol_initial_authentication);
    $("#init_dom").html(strings.protocol_initial_domain);
    $("#init_user").html(strings.protocol_initial_username);
    $("#init_pass").html(strings.protocol_initial_password);
}
document.addEventListener("paste", function(event) {
    pasteInfo = event;

    let cb = event.clipboardData.items;
    let items = [].slice.call(cb).filter(function(item) {
        return item.type.indexOf('image') != -1;
    });
    if(items.length == 0) {
        return;
    }

    let item = items[0];
    let blob = item.getAsFile();
    let formData = new FormData();
    let fd = formData.append('CHATROOMS_UPLOAD', blob, 'unknown.png');
    console.log(formData);
    $.ajax({
        type: 'post',
        url: httphost + '/api/chatrooms/userstore/',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(result, status, xhr) {
            if(result.status == "success") {
                attachment1 = result.file_path;
                $("#files_attached").html("Files attached: <a href='" + result.file_path + "'>" + result.file_path + "</a> <a href='#' onclick='removeAttachments();' style='color: #ff4d4d !important;'>Remove</a>");
            } else {
                $("#attachmentModal").modal("hide");
                switch(result.error) {
                    case "FILE_TYPE_DISALLOWED":
                        addMessage("System", "<span style='color:#ff4d4d;'>File type must be JP(E)G, PNG or GIF! (FILE_TYPE_DISALLOWED)</span>", 0, 0, true, now_new, true);
                        break;
                    case "FILE_TYPE_DISALLOWED_BYPASS":
                        addMessage("System", "<span style='color:#ff4d4d;'>File type must be JP(E)G, PNG or GIF! (FILE_TYPE_DISALLOWED_BYPASS)</span>", 0, 0, true, now_new, true);
                        break;
                    case "CRAZY_HAMBURGER":
                        addMessage("System", "<span style='color:#ff4d4d;'>Something crazy went wrong behind the scenes! Try again, maybe it'll work this time? (CRAZY_HAMBURGER)</span>", 0, 0, true, now_new, true);
                        break;
                    case "FILE_OVER_LIMITS":
                        addMessage("System", "<span style='color:#ff4d4d;'>Your file must be 25mb in size or lower (FILE_OVER_LIMITS)</span>", 0, 0, true, now_new, true);
                        break;
                    case "INTERNAL_FILESYSTEM_ERROR":
                        addMessage("System", "<span style='color:#ff4d4d;'>Your file could not be uploaded. It is a problem with the server the Chatroom is hosted on; please contact the server owner (INTERNAL_FILESYSTEM_ERROR)</span>", 0, 0, true, now_new, true);
                        break;
                    default:
                        addMessage("System", "<span style='color:#ff4d4d;'>Something crazy went wrong behind the scenes! Try again, maybe it'll work this time?</span>", 0, 0, true, now_new, true);
                        break;
                }
            }
        },
        xhrFields: {
            onprogress: function(progress) {
                var percentage = Math.floor((progress.total / progress.totalSize) * 100);
                console.log('progress', percentage);
                if(percentage === 100) {
                    console.log('DONE!');
                }
            }
        },
    });
});
document.addEventListener("DOMContentLoaded", function() {
    //localStorage.setItem("locale","en_us");
    if(platform == "m") $(".settings").load("welcome.html");
    else $(".settings").load("welcome.html");
    console.log("[ChatroomsClient] Ready!");

    if(localStorage.getItem("locale") == undefined) {
        localStorage.setItem("locale", "en_us");
        $.get("en_us.json", function(data, status) {
            $("#loadmodal").html("Preparing for first time launch...");
            strings = data;
            console.log("[ChatroomsClient] Locale settings weren't set, defaulting to en_us!");
            let firstTimeLoad = setTimeout(function(){
                closeEverythingElse();
                window.document.dispatchEvent(new Event("DOMContentLoaded", {
                    bubbles: true,
                    cancelable: true
                }));
            }, 1000);
        });
    } else {
        get_args = new URLSearchParams(window.location.search);
        $.get(""+ localStorage.getItem("locale") +".json", function(data, status) {
            $("#msgBox").val("");
            strings = data;
            addMessage("System", strings.satellite_already_connecting, 0, 0, true, now_new, true);
            const d = new Date();
            if(d.getMonth() == 11 && d.getDate() == 25) {
                addMessage("Jolly System", "Merry Christmas!", 0, 0, true, now_new, true);
            } else if(d.getMonth() == 0 && d.getDate() == 7) {
                addMessage("Jolly System", "Merry Christmas!", 0, 0, true, now_new, true);
            }

            $("body").keyup(function(e) {
                if(localStorage.getItem("si_beta_hotkeys_beta") == "true") {
                    $("#hotkeys_beta").attr("checked", true);
                }

                if(localStorage.getItem("si_beta_verbose_logging") == "true") {
                    $("#verbose_logging").attr("checked", true);
                }

                if(localStorage.getItem("si_beta_keycard") == "true") {
                    $("#keycard").attr("checked", true);
                    $("#keycard_button").attr("style", "display: block;");
                }


                if(e.keyCode == 13 && $(".modal-open").length == 0) {
                    if(mbv == "editMsgBox") {
                        editMessage(document.getElementById(mbv).value, messageToBeEdited);
                        $("#send_message").attr("style", "");
                        $("#edit_message").attr("style", "display: none;");
                        mbv = "msgBox";
                        console.log("[ChatroomsClient][ReturnHotkey] Editing message");
                    } else if(mbv == "msgBox") {
                        console.log("[ChatroomsClient][ReturnHotkey] Sending message");
                        sendMessage(document.getElementById(mbv).value);
                    } else {
                        vbLog("[ChatroomsClient][ReturnHotkey] Nothing needs to be done.");
                    }
                } else {
                    vbLog(localStorage.getItem("si_beta_hotkeys_beta"));

                    if(localStorage.getItem("si_beta_verbose_logging") == "true") {
                        $("#verbose_logging").attr("checked", true);
                    }
                    if(localStorage.getItem("si_beta_hotkeys_beta") == "true") {
                        $("#hotkeys_beta").attr("checked", true);

                        if(e.keyCode == 85 && e.shiftKey) {
                            $("#meModal").modal("show");
                            viewAccountInfo(token, localAccountName);
                        } else if(e.keyCode == 191 && e.ctrlKey) {
                            $("#aboutModal").modal("show");
                        } else if(e.keyCode == 82 && e.shiftKey) {
                            $("#rulesModal").modal("show");
                        } else if(e.keyCode == 76) {
                            if(e.shiftKey && e.ctrlKey)
                                $("#logoutModal").modal("show");
                            else if(e.shiftKey)
                                $("#gdisconnectModal").modal("show");
                            else if(e.keyCode == 107 && e.shiftKey)
                                $("#attachmentModal").modal("show");
                        }
                    }
                }
            });
            if(localStorage.getItem("consented_to_policies_v4") != null){
                console.log("[KeycardServices] User has consented to policies. No need to show modal.");
                checkForSatellite();
            }
            else{
                let stupidThing = setTimeout(function(){
                    $("#loadingResourcesModal").modal("hide");
                    $("#consentModal").modal("show");
                    $("#consentAcceptButton").off("click");
                    $("#consentAcceptButton").on("click", function(){
                        localStorage.setItem("consented_to_policies_v4",true);
                        checkForSatellite();
                    });
                }, 500);
            }
        });
    }
});

function getOnlineUsers() {
    $(".onlineList").html('');
    sockSend('{"type":"onlineusers","authentication":"' + token + '"}');
}


function getVCOnlineUsers() {
    if(vsocket){
        $(".vcOnlineList").html('');
        vsocket.send('{"type":"onlineusers","authentication":"' + token + '"}');
    } else if (vsocket && vsocket.readyState != 1){
        $(".vcOnlineList").html('Join a voice channel to view who is talking.');
    } else {
        $(".vcOnlineList").html('Join a voice channel to view who is talking.');
    }
}

function getOnlineUsersLegacy() {
    // this doesnt work, use getOnlineUsers() instead
    $("#onlineUsers").html("");
    $.get(httphost + "/api/chatrooms/online/", function(data, status) {
        userBox = $("#onlineUsers")[0].innerHTML;
        users_ = data;
        //console.log(data.online_users[1]);
        console.log(Object.keys(data.online_users).length);
        let useramount = Object.keys(data.online_users).length;
        for(let i = 0; i < useramount; i++) {
            console.log(data.online_users[i].name);
            $("#onlineUsers").html(document.getElementById("onlineUsers").innerHTML + "<p><img src='/assets/online.png' width='24' height='24'>" + data.online_users[i].name + "</p>");
            console.log("Added online user with id " + data.online_users[i].id + " and name " + data.online_users[i].name);
        }
    });
}

function getSuggested() {
    $("#suggestedServers").html('<div class="spinner-border"></div>');
    if(localStorage.getItem("si_beta_keycard_staging") != "true")
        var suggestionUrl = "https://cloudseeker.xyz/chatrooms/wa/suggested.json";
    else
        var suggestionUrl = "https://cloudseeker.xyz/chatrooms/wa/suggested-staging.json";
    $.ajax({url: suggestionUrl, success: function(result, xhr, status) {
        roomBox = $("#suggestedServers")[0].innerHTML;
        let data = result;
        rooms = data;
        console.log(Object.keys(data).length);
        let roomamount = Object.keys(data).length;
        $("#suggestedServers").html('');
        for(let i = 0; i < roomamount; i++) {
            let reg_link = "";
            if(data[i].create_account != ""){
                reg_link = "<button class='btn btn-primary' onclick='$(\"#loginModal\").modal(\"hide\"); $(\"#extModal\").modal({backdrop: \"static\", keyboard: false}); extLink(\""+ data[i].create_account +"\"); $(\"#denyext_b\").on(\"click\", function(){$(\"#loginModal\").modal(\"show\"); $(\"#denyext_b\").off(\"click\");}); $(\"#acceptext_b\").on(\"click\", function(){$(\"#loginModal\").modal(\"show\"); $(\"#acceptext_b\").off(\"click\");})'>Register for this Chatroom</button>";
            }
            if(data[i].type == "chatroom") {
                switch(data[i].verified_type){
                    case 0:
                        $("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div><div class="card"><div class="card-body"><h4>' + data[i].server_name + '</h4>' + data[i].server_motd +'<hr><div class="d-grid gap-2"><button class="btn btn btn-success" onclick=\'doesThatServerExist("' + data[i].server + '",7778,true); innerHTML="Hang tight...";\'>Join</button>'+ reg_link +'</div></div></div></div>');
                        console.log("Added server with id " + data[i].server + " and name " + data[i].server_name);
                    break;1
                    case 1:
                        $("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div><div class="card"><div class="card-body"><h4>' + data[i].server_name + ' <i class="bi bi-check-circle-fill text-primary" data-bs-toggle="tooltip" title="This Chatroom is verified because it\'s confirmed to be authentic."></i></h4>' + data[i].server_motd +'<hr><div class="d-grid gap-2"><button class="btn btn btn-success" onclick=\'doesThatServerExist("' + data[i].server + '",7778,true); innerHTML="Hang tight...";\'>Join</button>'+ reg_link +'</div></div></div></div>');
                        //$("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div class="card"><div class="card-header">' + data[i].server_name + ' <i class="bi bi-check-circle-fill text-primary" data-bs-toggle="tooltip" title="This Chatroom is verified because it\'s confirmed to be authentic."></i></div><div class="card-body">' + data[i].server_motd + reg_link +'</div><div class="card-footer d-grid"><button class="btn btn-success" onclick=\'doesThatServerExist("' + data[i].server + '",7778,true); innerHTML="Hang tight...";\'>Join</button></div></div><br>');
                        console.log("Added VERIFIED server with id " + data[i].server + " and name " + data[i].server_name);
                    break;
                    case 2:
                        $("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div><div class="card"><div class="card-body"><h4>' + data[i].server_name + ' <i class="bi bi-check-circle-fill" data-bs-toggle="tooltip" title="This Chatroom is verified because it\'s owned by CloudSeeker."></i></h4>' + data[i].server_motd +'<hr><div class="d-grid gap-2"><button class="btn btn btn-success" onclick=\'doesThatServerExist("' + data[i].server + '",7778,true); innerHTML="Hang tight...";\'>Join</button>'+ reg_link +'</div></div></div></div>');
                        //$("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div class="card"><div class="card-header">' + data[i].server_name + ' <i class="bi bi-check-circle-fill" data-bs-toggle="tooltip" title="This Chatroom is verified because it\'s owned by CloudSeeker."></i></div><div class="card-body">' + data[i].server_motd + reg_link +'</div><div class="card-footer d-grid"><button class="btn btn-success" onclick=\'doesThatServerExist("' + data[i].server + '",7778,true); innerHTML="Hang tight...";\'>Join</button></div></div><br>');
                        console.log("Added VERIFIED server with id " + data[i].server + " and name " + data[i].server_name);
                    break;
                    case 3:
                        $("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div class="card"><div class="card-header">' + data[i].server_name + ' <i class="bi bi-gem" data-bs-toggle="tooltip" title="KeycardVerified"></i></div><div class="card-body">' + data[i].server_motd + reg_link +'</div><div class="card-footer d-grid"><button class="btn btn-success" onclick=\'doesThatServerExist("' + data[i].server + '",7778,true); innerHTML="Hang tight...";\'>Join</button></div></div><br>');
                        console.log("Added VERIFIED server with id " + data[i].server + " and name " + data[i].server_name);
                    break;
                }
            } else if(data[i].type == "sponsored") {
                $("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div><div class="card"><div class="card-body"><h4>' + data[i].server_name + ' <span class="badge rounded-pill text-bg-warning">SPONSORED</span></h4>' + data[i].server_motd +'<hr><div class="d-grid gap-2"><button class="btn btn-primary" onclick=\'window.open("' + data[i].server + '");\'>Check it out</button></div></div></div></div>');
                //$("#suggestedServers").html(document.getElementById("suggestedServers").innerHTML + '<div class="card"><div class="card-header">' + data[i].server_name + ' <span class="badge rounded-pill text-bg-warning">SPONSORED</span></div><div class="card-body">' + data[i].server_motd + '</div><div class="card-footer d-grid"><button class="btn btn-primary" onclick=\'window.open("' + data[i].server + '");\'>Check it out</button></div></div><br>');
                console.log("Added VERIFIED server with id " + data[i].server + " and name " + data[i].server_name);
            }
        }
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    }, error: function(xhr, status, error){
        toaster(strings.satellite_error);
        $("#suggestedServers").html("<div class='alert alert-danger'>"+ strings.satellite_error +"</div>");
    }});
}

function vbLog(message) {
    if(localStorage.getItem("si_beta_verbose_logging") == "true")
        console.log(message);
}
// RECOMMENDED: use this to add channels by querying the satellite to do so, and unlike the legacy API also adds voice channels to the list
function addChannels() {
    channels = [];
    sockSend('{"type":"channel","authentication":"' + token + '"}');
    sockSend('{"type":"vchannel","authentication":"' + token + '"}');
}
// add channels using legacy APIs | DO NOT USE THIS - it no longer works
function addChannelsLegacy() {
    chnlBox = document.getElementsByClassName("serverList")[0].innerHTML;
    $.post(httphost + "/api/chatrooms/channels/", {
        "authentication": token
    }, function(data, status) {
        channels_ = data;
        let channelamount = Object.keys(data).length + 1;
        $(".serverList").html("");
        for(let i = 1; i < channelamount; i++) {
            //if(data.hasOwnProperty(channels)){
            $(".serverList").html(document.getElementsByClassName("serverList")[0].innerHTML + "<button id='channel_" + data[i].id + "' class='server emerg activatedServer' onclick='localChannel = " + data[i].id + "; getOlderMessages(); addMessage(\"System\", strings.channels_switch + \"#" + data[i].name + "\", 0, 0, true, now_new, true)'>#" + data[i].name + "</button><br>\n");
            console.log("[ChatroomsClient] Added channels with id " + data[i].id + " and name " + data[i].name);
            //}
        }
    });
}

function initiateEdit(messageId) {
    $("#send_message").attr("style", "display: none;");
    $("#edit_message").attr("style", "");
    //$("editMsgBox").value = content;
    messageToBeEdited = messageId;
    mbv = "editMsgBox";
}
function emoteify(content, size){
    for(let i = 0; i < (Object.keys(emotes).length); i++) {
        let lol = Object.keys(emotes[i])[0];
        content = content.replace(":" + Object.keys(emotes[i])[0] + ":", "<img src='" + emotes[i][lol] + "' width='" + size + "' height='" + size + "'>");
    }
    return content;
}
function addMessage(author, ocontent, type, authorId, force, timestamp, isSystemMessage, shouldScrollToBottom, isAuthor, messageId, ignoreAutolink) {
    let once = false;
    //let original_content = content;
    actualMsgBox = document.getElementById("msgBox").value;
    msgBox = document.getElementsByClassName("messageSpace")[0].innerHTML;
    // youll see why im doing this later on
    let content = ocontent;
    if(ignoreAutolink == false || ignoreAutolink == undefined){
        content = linker(content);
	vbLog("autolink: " + ignoreAutolink);
    }
    else{
	// lol
	content = content;
    }
    for(let i = 0; i < (Object.keys(emotes).length); i++) {
        let lol = Object.keys(emotes[i])[0];
        content = content.replace(":" + Object.keys(emotes[i])[0] + ":", "<img src='" + emotes[i][lol] + "' width='32' height='32'>");
        if(i == (Object.keys(emotes).length)) {
            startAdding(author, content, type, authorId, force, timestamp, isSystemMessage, isAuthor, messageId)
        }
    }
    if(actualMsgBox.length == 0 && force == false) {
        $(".messageSpace").html(msgBox + "<div class='message systemMessage systemError'><a href='#' class='author' onclick='userInfo(\"0\", \"System\");'>[System]</a>&nbsp;<span class='messageContent'>You cannot send empty messages.</span></div>\n");
    } else {
        if(isSystemMessage == undefined || !isSystemMessage) {
            let isSpoofed = "";
            // mother i have failed to implement this correctly and i am too lazy to revert all changes. do nothing either way
            if(shouldScrollToBottom != undefined || shouldScrollToBottom) {
                doNothing();
            } else {
                doNothing();
            }

            if(messageId == undefined) {
                isSpoofed = "<span title='This message might have been spoofed or sent on an older version of Chatrooms'>Warning</span> "
            }

            if(areMessagesSaved) {
                if(isAuthor == undefined || isAuthor /*&& messageId != undefined*/ ) {
                    $(".messageSpace").html(msgBox + "<div class='message systemMessage'>" + isSpoofed + "<a href='#' class='author' onclick='userInfo(" + authorId + ", \"" + author + "\");'>[" + author + "]</a>&nbsp;<span class='messageContent' id='message-" + messageId + "'>" + content + "</span>&nbsp;<small style='font-size: 12px; color: darkgray;'>" + timestamp + "</small> <a href='#' data-bs-toggle='dropdown' aria-expanded='false'><i class=\"bi bi-three-dots\"></i></a><ul class='dropdown-menu'><li><a class='dropdown-item' onclick='initiateEdit(\"" + messageId + "\",)' href='#'>Edit</a></li><li><a class='dropdown-item' href='#' onclick='deleteMessage(\"" + messageId + "\");'>Delete</a></li><li><a class='dropdown-item' onclick='navigator.clipboard.writeText(\""+ ocontent +"\"); toaster(\"Copied message content to clipboard!\");' href='#'>Copy Message Content</a></li><li><hr class='dropdown-divider'></hr><li><a class='dropdown-item' onclick='navigator.clipboard.writeText(\""+ messageId +"\"); toaster(\"Copied message ID to clipboard!\");' href='#'>Copy Message ID</a></li></ul></div>\n");
                } else {
                    $(".messageSpace").html(msgBox + "<div class='message systemMessage'><a href='#' class='author' onclick='userInfo(" + authorId + ", \"" + author + "\");'>[" + author + "]</a>&nbsp;<span class='messageContent' id='message-" + messageId + "'>" + content + "</span>&nbsp;<small style='font-size: 12px; color: darkgray;'>" + timestamp + "</small> <a href='#' data-bs-toggle='dropdown' aria-expanded='false'><i class=\"bi bi-three-dots\"></i></a><ul class='dropdown-menu'><li><a class='dropdown-item' onclick='navigator.clipboard.writeText(\""+ ocontent +"\"); toaster(\"Copied message content to clipboard!\");' href='#'>Copy Message Content</a></li><li><hr class='dropdown-divider'></hr><li><a class='dropdown-item' onclick='navigator.clipboard.writeText(\""+ messageId +"\"); toaster(\"Copied message ID to clipboard!\");' href='#'>Copy Message ID</a></li></ul></div>\n");
                }
            } else {
                $(".messageSpace").html(msgBox + "<div class='message systemMessage'><a href='#' class='author' onclick='userInfo(" + authorId + ", \"" + author + "\");'>[" + author + "]</a>&nbsp;<span class='messageContent'>" + content + "</span>&nbsp;<small style='font-size: 12px; color: darkgray;'>" + timestamp + "</small></div>\n");
            }
        } else {
            $(".messageSpace").html(msgBox + "<div class='message systemMessage'><span title='This is a system message. Only you can see this. It will disappear if you switch channels.'>🛰️</span> <a href='#' class='author' onclick='userInfo(" + authorId + ", \"" + author + "\");'>[" + author + "]</a>&nbsp;<span class='messageContent'>" + content + "</span>&nbsp;<small style='font-size: 12px; color: darkgray;'>" + timestamp + "</small></div>\n");
        }
    }
}

function addWhisper(author, ocontent, type, authorId, force, isAuthor, recipient) {
    let once = false;
    actualMsgBox = document.getElementById("msgBox").value;
    msgBox = document.getElementsByClassName("messageSpace")[0].innerHTML;
    // youll see why im doing this later on
    let content = ocontent;
    for(let i = 0; i < (Object.keys(emotes).length); i++) {
        let lol = Object.keys(emotes[i])[0];
        content = content.replace(":" + Object.keys(emotes[i])[0] + ":", "<img src='" + emotes[i][lol] + "' width='32' height='32'>");
        if(i == (Object.keys(emotes).length)) {
            startAdding(author, content, type, authorId, force, timestamp, isSystemMessage, isAuthor, messageId)
        }
    }
    if(actualMsgBox.length == 0 && force == false) {
        $(".messageSpace").html(msgBox + "<div class='message systemMessage systemError'><a href='#' class='author' onclick='userInfo(\"0\", \"System\");'>[System]</a>&nbsp;<span class='messageContent'>You cannot send empty messages.</span></div>\n");
    } else {
        // use this later: <a href='#' class='author' onclick='userInfo(" + authorId + ", \"" + author + "\");'>
        $(".messageSpace").html(msgBox + "<div class='message systemMessage whisper' style='opacity: 0.5;'>" + author + ": <span class='messageContent'>" + content + "</span></div>\n");
    }
}

function startAdding(author, content, type, authorId, force, timestamp, isSystemMessage, isAuthor, messageId) {
    let once = false;
    actualMsgBox = document.getElementById("msgBox").value;
    msgBox = document.getElementsByClassName("messageSpace")[0].innerHTML;

}

function userInfo(uid, pfUsername) {
    xload();
    $("#accountInfoLoading_O").css("display", 'none');
    console.log("[ChatroomsClient] Opening user info modal for user id " + uid);
    $("#accountInfoUsername_O").html('<span class="placeholder col-4"></span>');
    $("#accountInfoPStatus_0").html('<span class="placeholder col-4"></span>');
    $("#accountInfoCreationDate_O").html('<span class="placeholder col-4"></span>');
    $("#accountInfoLastLoginDate_O").html('<span class="placeholder col-4"></span>');
    $("#other_pfp").attr("src", "account.png");
    $("#whisperButton").css("display", "none");
    $("#otherUserModal").modal("show");
    $("#accountInfoSystemError_O").css("display", "none");
    $("#accountInfoUnexistent_O").css("display", "none");
    $("#accountInfoBanned_O").css("display", "none");
    //$("#accountInfoUsername_O").html(pfUsername);
    $("#accountInfoReserved_O").css("display", "none");
    $("#accountInfoAnon_O").css("display", "none");
    $("#accountInfoClientSide_O").css("display", "none");
    $("#accountInfoStaging_O").css("display", "none");
    $("#accountInfoFailedToLoadAll_O").css("display", "none");
    if(pfUsername == "System") {
        isDone = true;
        console.log("[ChatroomsClient] system user");
        WU = 0;
        $("#accountInfoUsername_O").html('System');
        $("#accountInfoClientSide_O").css("display", "block");
        $("#accountInfoPStatus_0").html("You should also refer to me as Mr Chatrooms.");
        $("#accountInfoCreationDate_O").html('Account created on: Even though my age cannot be calculated, scientists have estimated it to be May 15th, 2022');
        $("#accountInfoLastLoginDate_O").html('Last seen: Now');
        $("#accountInfoLoading_O").html('')
    } else if(pfUsername == "Anonymous") {
        isDone = true;
        console.log("[ChatroomsClient] anon user");
        $("#accountInfoAnon_O").css("display", "block");
    } else {
        $("#accountInfoClientSide_O").css("display", "none");
        sockSend('{"type":"user","authentication":"' + token + '","id":"' + uid + '"}');
    }
}

function userInfoByScreenName(uid) {
    xload();
    $("#accountInfoLoading_O").css("display", 'none');
    console.log("[ChatroomsClient] Opening user info modal for user id " + uid);
    $("#accountInfoUsername_O").html('<span class="placeholder col-4"></span>');
    $("#accountInfoPStatus_0").html('<span class="placeholder col-4"></span>');
    $("#accountInfoCreationDate_O").html('<span class="placeholder col-4"></span>');
    $("#accountInfoLastLoginDate_O").html('<span class="placeholder col-4"></span>');
    $("#other_pfp").attr("src", "account.png");
    $("#whisperButton").css("display", "none");
    $("#otherUserModal").modal("show");
    $("#accountInfoSystemError_O").css("display", "none");
    $("#accountInfoUnexistent_O").css("display", "none");
    $("#accountInfoBanned_O").css("display", "none");
    //$("#accountInfoUsername_O").html(pfUsername);
    $("#accountInfoReserved_O").css("display", "none");
    $("#accountInfoAnon_O").css("display", "none");
    $("#accountInfoClientSide_O").css("display", "none");
    $("#accountInfoStaging_O").css("display", "none");
    $("#accountInfoFailedToLoadAll_O").css("display", "none");
    if(uid == "System") {
        isDone = true;
        console.log("[ChatroomsClient] system user");
        WU = 0;
        $("#accountInfoUsername_O").html('System');
        $("#accountInfoClientSide_O").css("display", "block");
        $("#accountInfoPStatus_0").html("You should also refer to me as Mr Chatrooms.");
        $("#accountInfoCreationDate_O").html('Account created on: Even though my age cannot be calculated, scientists have estimated it to be May 15th, 2022');
        $("#accountInfoLastLoginDate_O").html('Last seen: Now');
        $("#accountInfoLoading_O").html('')
    } else if(uid == "Anonymous") {
        isDone = true;
        console.log("[ChatroomsClient] anon user");
        $("#accountInfoAnon_O").css("display", "block");
    } else {
        $("#accountInfoClientSide_O").css("display", "none");
        sockSend('{"type":"user:by_screen_name","authentication":"' + token + '","username":"' + uid + '"}');
    }
}

function viewAccountInfo(token, pfUsername) {
    xload();
    console.log("[ChatroomsClient] Opening user info modal for user id " + localAccount);
    $("#meModal").modal("show");
    $("#accountInfoSystemError_1").css("display", "none");
    $("#accountInfoUpdateError_1").css("display", "none");
    $("#accountInfoUnexistent_1").css("display", "none");
    $("#accountInfoBanned_1").css("display", "none");
    $("#accountInfoUsername_1").html(pfUsername);
    $("#accountInfoReserved_1").css("display", "none");
    $("#accountInfoAnon_1").css("display", "none");
    $("#accountInfoClientSide_1").css("display", "none");
    $("#accountInfoStaging_1").css("display", "none");
    $("#accountInfoFailedToLoadAll_1").css("display", "none");
    if(pfUsername == "System") {
        console.log("[ChatroomsClient] system user");
        $("#accountInfoClientSide_1").css("display", "block");
    } else if(pfUsername == "Anonymous") {
        isDone = true;
        console.log("[ChatroomsClient] anon user");
        $("#accountInfoAnon_1").css("display", "block");
    } else {
        isDone = true;
        $("#accountInfoClientSide_1").css("display", "none");
        sockSend('{"type":"account","authentication":"' + token + '"}');
    }
}
// this ones for loading the stuff quickly
function accountInfo() {
    console.log("[ChatroomsClient] Requesting account information");
    sockSend('{"type":"account","authentication":"' + token + '"}');
    // conclusion: nothing changed
    // why was it still using the API???
    /*$.post(httphost + "/api/chatrooms/account/", {
        "authentication": token,
        "token": token
    }, function(data, status) {
        if(status == "success") {
            console.log("[ChatroomsClient] got response");
            localAccountName = data.username;
            localAccount = data.id;
            $("#client_username").html(localAccountName);
            //$("#client_username").attr("onclick", "");
            if(data.picture == "") {
                $("#miniPfp").attr("src", "account.png");
            } else {
                $("#miniPfp").attr("src", data.picture);
            }

            if(data.warning == "User doesnt exist.") {
                console.log("fake");
                localAccountName = "Unknown User";
            }
        } else {
            console.error("[ChatroomsClient] FUCK");
        }
    });*/
}

function removeAttachments() {
    $("#files_attached").html("");
    attachment1 = "";
}

function uploadAttachment() {
    $("#attachment").disabled = true;
    $.ajax({
        type: 'post',
        url: httphost + '/api/chatrooms/userstore/',
        data: new FormData($("#attachmentForm")[0]),
        cache: false,
        contentType: false,
        processData: false,
        error: function(xhr, status, error){
            toaster("I was unable to upload your attachment!");
            $("#attachment").disabled = false;
        },
        success: function(result, status, xhr) {
            if(result.status == "success") {
                $("#attachmentModal").modal("hide");
                attachment1 = result.file_path;
                $("#files_attached").html("Files attached: <a href='" + result.file_path + "'>" + result.file_path + "</a> <a href='#' onclick='removeAttachments();' style='color: #ff4d4d !important;'>Remove</a>");
            } else {
                $("#attachmentModal").modal("hide");
                switch(result.error) {
                    case "FILE_TYPE_DISALLOWED":
                        addMessage("System", "<span style='color:#ff4d4d;'>File type must be JP(E)G, PNG or GIF! (FILE_TYPE_DISALLOWED)</span>", 0, 0, true, now_new, true);
                        break;
                    case "FILE_TYPE_DISALLOWED_BYPASS":
                        addMessage("System", "<span style='color:#ff4d4d;'>File type must be JP(E)G, PNG or GIF! (FILE_TYPE_DISALLOWED_BYPASS)</span>", 0, 0, true, now_new, true);
                        break;
                    case "CRAZY_HAMBURGER":
                        addMessage("System", "<span style='color:#ff4d4d;'>Something crazy went wrong behind the scenes! Try again, maybe it'll work this time? (CRAZY_HAMBURGER)</span>", 0, 0, true, now_new, true);
                        break;
                    case "FILE_OVER_LIMITS":
                        addMessage("System", "<span style='color:#ff4d4d;'>Your file must be 25mb in size or lower (FILE_OVER_LIMITS)</span>", 0, 0, true, now_new, true);
                        break;
                    case "INTERNAL_FILESYSTEM_ERROR":
                        addMessage("System", "<span style='color:#ff4d4d;'>Your file could not be uploaded. It is a problem with the server the Chatroom is hosted on; please contact the server owner (INTERNAL_FILESYSTEM_ERROR)</span>", 0, 0, true, now_new, true);
                        break;
                    default:
                        addMessage("System", "<span style='color:#ff4d4d;'>Something crazy went wrong behind the scenes! Try again, maybe it'll work this time?</span>", 0, 0, true, now_new, true);
                        break;
                }
                messageAutoscroll();
            }
        },
        xhrFields: {
            // add listener to XMLHTTPRequest object directly for progress (jquery doesn't have this yet)
            onprogress: function(progress) {
                // calculate upload progress
                var percentage = Math.floor((progress.total / progress.totalSize) * 100);
                // log upload progress to console
                console.log('progress', percentage);
                if(percentage === 100) {
                    console.log('DONE!');
                }
            }
        },
    });
}

function changeUsername() {
    $("#usrPreloader").html('<div class="spinner-border"></div>');
    sockSend('{"type":"editprofile:username","authentication":"' + token + '","username":"' + $("#accountInfoUsername_1")[0].value + '"}');
}

function changeStatus() {
    $("#sttsPreloader").html('<div class="spinner-border"></div>');
    sockSend('{"type":"editprofile:status","authentication":"' + token + '","status":"' + $("#accountInfoPStatus_1")[0].value + '"}');
}

function changePresence() {
    var pres;
    $("#presPreloader").html('<div class="spinner-border"></div>');
    for(let x = 0; x > $("[name='presence']").length; x++){
        if($("[name='presence']")[x].checked){
            switch(x){
                case 0:
                    pres = "online";
                break;
                case 1:
                    pres = "idle";
                break;
                case 2:
                    pres = "dnd";
                break;
                case 3:
                    pres = "cloaked";
                break;
                default:
                    pres = "online";
                break;
            }
        }
    }
    sockSend('{"type":"editprofile:presence","authentication":"' + token + '","presence":"' + pres + '"}');
}

function uploadProfilePicture() {
    $("#pfpPreloader").html('<div class="spinner-border"></div>');
    $("#pfpAttachment").disabled = true;
    $.ajax({
        type: 'post',
        url: httphost + '/api/chatrooms/userstore/',
        data: new FormData($("#pfpForm")[0]),
        cache: false,
        contentType: false,
        processData: false,
        error: function(xhr, status, error){
            $("#accountInfoUpdateError_1").css("display", "block");
            $("#pfpPreloader").html('');
            toaster("I was unable to update your account!");
        },
        success: function(result, status, xhr) {
            if(result.status == "success") {
                let pfpAttachment1 = result.file_path;
                sockSend('{"type":"editprofile:picture","authentication":"' + token + '","pfp":"' + httphost + result.file_path + '"}');
            } else {
                $("#accountModal").modal("hide");
                switch(result.error) {
                    case "FILE_TYPE_DISALLOWED":
                        addMessage("System", "<span style='color:#ff4d4d;'>File type must be JP(E)G, PNG or GIF! (FILE_TYPE_DISALLOWED)</span>", 0, 0, true, now_new, true);
                        break;
                    case "FILE_TYPE_DISALLOWED_BYPASS":
                        addMessage("System", "<span style='color:#ff4d4d;'>File type must be JP(E)G, PNG or GIF! (FILE_TYPE_DISALLOWED_BYPASS)</span>", 0, 0, true, now_new, true);
                        break;
                    case "CRAZY_HAMBURGER":
                        addMessage("System", "<span style='color:#ff4d4d;'>Something crazy went wrong behind the scenes! Try again, maybe it'll work this time? (CRAZY_HAMBURGER)</span>", 0, 0, true, now_new, true);
                        break;
                    case "FILE_OVER_LIMITS":
                        addMessage("System", "<span style='color:#ff4d4d;'>Your file must be 25mb in size or lower (FILE_OVER_LIMITS)</span>", 0, 0, true, now_new, true);
                        break;
                    case "INTERNAL_FILESYSTEM_ERROR":
                        addMessage("System", "<span style='color:#ff4d4d;'>Your file could not be uploaded. It is a problem with the server the Chatroom is hosted on; please contact the server owner (INTERNAL_FILESYSTEM_ERROR)</span>", 0, 0, true, now_new, true);
                        break;
                    default:
                        addMessage("System", "<span style='color:#ff4d4d;'>Something crazy went wrong behind the scenes! Try again, maybe it'll work this time?</span>", 0, 0, true, now_new, true);
                        break;
                }
                messageAutoscroll();
            }
        },
        xhrFields: {
            onprogress: function(progress) {
                var percentage = Math.floor((progress.total / progress.totalSize) * 100);
                console.log('progress', percentage);
                if(percentage === 100) {
                    console.log('DONE!');
                }
            }
        },
    });
}

function sendMessage(content) {
    if(localChannel.toString() == "x:rules"){
        toaster("You are not allowed to write to this channel!");
        $("#msgBox").val("");
        return;
    }

    if(isTimedOut) {
        addMessage("System", "Wait a few seconds before you can chat again!", 0, "0", true, now_new, true);
        messageAutoscroll();
        return;
    }
    // im using if(true) here because this was locked behind an experiment before
    if(true) {
        if(content == 'flal gus aliv gam') {
            $("#msgBox").val("");
            addMessage("System", "Check your mailbox!", 0, "0", true, now_new, true);
            $('.messageSpace').animate({
                scrollTop: overallMessageAmount * 100000
            }, 'fast');
            var bozo = setTimeout(function() {
                    addMessage("System", "Still not checking your mailbox?", 0, "0", true, now_new, true);
                    $('.messageSpace').animate({
                        scrollTop: overallMessageAmount * 100000
                    }, 'fast');
                },
                10000);
        } else if(content.startsWith('/whisper') || content.startsWith('/w')) {
            args = content.split(" ");
            $("#msgBox").val("");
            sockSend('{"type":"whisper", "authentication": "' + token + '", "recipient":"' + args[1] + '", "message":"' + content.replace(args[0] + " " + args[1] + " ", "") + '", "attachment": "' + attachment1 + '"}');
        } else if(content.startsWith('/ban')) {
            args = content.split(" ");
            $("#msgBox").val("");
            sockSend('{"type":"administrative:ban_by_screen_name", "authentication": "' + token + '", "username":"' + content.replace(args[0] + " ", "") + '"}');
        } else if(content.startsWith('/clear')) {
            $("#msgBox").val("");
            clearChat();
        } else if(content.startsWith('/disconnect') || content.startsWith('/leave')) {
            $("#msgBox").val("");
            socket.close();
        } else if(content.startsWith('/account') && localStorage.getItem("si_beta_inspect_command") == "true") {
            $("#msgBox").val("");
            addMessage("System", strings.protocol_initial_username + ": " + avoidInjection(localAccountName), 0, 0, true, now_new, true, false, true);
            //"; Account ID: " + avoidInjection(localAccount)
            addMessage("System", "Account ID: " + avoidInjection(localAccount), 0, 0, true, now_new, true, false, true);
            addMessage("System", "Token: **************************" + avoidInjection(token.substring(token.length - 6, token.length)), 0, 0, true, now_new, true, false, true);
            messageAutoscroll();
        } else if(content.startsWith('/inspect') && localStorage.getItem("si_beta_inspect_command") == "true") {
            args = content.split(" ");
            $("#msgBox").val("");
            addMessage("System", eval(superAvoidInjection(args[1])).toString(), 0, 0, true, now_new, true, false, true);
            messageAutoscroll();
        } else {
            $("#msgBox").val("");
            msgcontent = content;
            for(let i = 1; i < content.replace(/[^"]/g, "").length; i++) {
                msgcontent = msgcontent.replace('"', '\\"');
            }
            if(localChannel.toString().startsWith("w:") != true) {
                sockSend('{"type":"message","authentication":"' + token + '", "message":"' + msgcontent + '", "channel":"' + localChannel + '", "attachment1": "' + attachment1 + '"}');
            } else {
                sockSend('{"type":"whisper", "authentication": "' + token + '", "recipient":"' + localChannel.substring(2) + '", "message":"' + msgcontent + '", "attachment": "' + attachment1 + '"}');
            }
            isTimedOut = true;
            let untimeout = setTimeout(function() {
                isTimedOut = false;
            }, 500);
            attachment1 = "";
            $("#files_attached").html("");
        }
    } else {
        $("#msgBox").val("");
        msgcontent = content;
        for(let i = 1; i < content.replace(/[^"]/g, "").length; i++) {
            msgcontent = msgcontent.replace('"', '\\"');
        }
        isTimedOut = true;
        let untimeout = setTimeout(function() {
            isTimedOut = false;
        }, 500);
        attachment1 = "";
        $("#files_attached").html("");
        /*$.post("/api/chatrooms/messages/send/", 
        	{
        		"authentication":token,
        		"message":content,
        		"channel":localChannel
        	},
        	function(data, status){
        		if(status == "success" && data.status == "success"){
        			//addMessage(data.user, data.msg, 0, data.uid, true);
        			console.log("MessageSend success");
        		}
        		else if(status == "success" && data.status == "authfail"){
        			addMessage("System", "<span style='color:red;'>There was an authentication failure, and your message was not sent.</span>", 0, "0", true);
        		}
        	}		
        );*/
    }
}

function editMessage(content, id) {
    if(content == 'flal gus aliv gam') {
        addMessage("System", "Check your mailbox!", 0, "0", true, now_new, true);
        var bozo = setTimeout(function() {
                addMessage("System", "Still not checking your mailbox?", 0, "0", true, now_new, true);
            },
            10000);
    } else {
        $("#editMsgBox").val("");
        msgcontent = content;
        for(let i = 1; i < content.replace(/[^"]/g, "").length; i++) {
            msgcontent = msgcontent.replace('"', '\\"');
        }
        sockSend('{"type":"edit","authentication":"' + token + '", "message":"' + msgcontent + '", "msgid":"' + id + '"}');
        attachment1 = "";
        $("#files_attached").html("");
    }
}

function deleteMessage(id) {
    sockSend('{"type":"delete","authentication":"' + token + '", "msgid":"' + id + '"}');
}

function clearChat() {
    $(".messageSpace").html("");
}

function doNothing() {
    // literally do nothing
}
