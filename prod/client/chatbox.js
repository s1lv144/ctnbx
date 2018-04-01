! function() {
    "use strict";
    window.chatbox = {}, chatbox.utils = {}, chatbox.ui = {}, chatbox.ui.init = [], chatbox.historyHandler = {}, chatbox.userListHandler = {}, chatbox.fileHandler = {}, chatbox.msgHandler = {}, chatbox.typingHandler = {}, chatbox.notification = {}, chatbox.socketEvent = {};
    var e = chatbox.utils,
        t = chatbox.ui,
        n = chatbox.historyHandler,
        o = chatbox.socketEvent,
        a = 4321,
        i = location.hostname;
    chatbox.domain = location.protocol + "//" + i + ":" + a, chatbox.uuid = "uuid not set!", chatbox.NAME = "Chatbox";
    var s = new Date,
        c = "visitor#" + s.getMinutes() + s.getSeconds();
    chatbox.username = c, chatbox.init = function() {
        for (var a = 0; a < t.init.length; a++) t.init[a]();
        "" !== e.getCookie("chatuuid") ? chatbox.uuid = e.getCookie("chatuuid") : (chatbox.uuid = e.guid(), e.addCookie("chatuuid", chatbox.uuid)), "" !== e.getCookie("chatname") ? chatbox.username = e.getCookie("chatname") : e.addCookie("chatname", chatbox.username), n.load(), "1" === e.getCookie("chatboxOpen") ? t.show() : t.hide(), "undefined" == typeof chatbox.roomID && (chatbox.roomID = "01cfcd4f6b8770febfb40cb906715822"), chatbox.socket = io(chatbox.domain), chatbox.socket.joined = !1, o.register()
    }
}(),
function() {
    "use strict";

    function e(e) {
        for (var t = e + "=", n = document.cookie.split(";"), o = 0; o < n.length; o++) {
            for (var a = n[o];
                " " == a.charAt(0);) a = a.substring(1);
            if (0 === a.indexOf(t)) return a.substring(t.length, a.length)
        }
        return ""
    }

    function t(e, t) {
        var n = 365,
            a = new Date;
        a.setTime(a.getTime() + 24 * n * 60 * 60 * 1e3);
        var i = "expires=" + a.toUTCString();
        document.cookie = e + "=" + t + "; " + i + "; domain=" + o() + "; path=/"
    }

    function n(e) {
        e.preventDefault(), e.stopPropagation()
    }

    function o() {
        var e = location.hostname,
            t = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (t.test(e) === !0 || "localhost" === e) return e;
        var n = /([^]*).*/,
            o = e.match(n);
        if ("undefined" != typeof o && null !== o && (e = o[1]), "undefined" != typeof e && null !== e) {
            var a = e.split(".");
            a.length > 1 && (e = a[a.length - 2] + "." + a[a.length - 1])
        }
        return "." + e
    }

    function a(e) {
        return null !== e.match(/\.(jpeg|jpg|gif|png)$/)
    }

    function i(e) {
        return $("<div/>").html(e).text()
    }
    var s = chatbox.utils;
    s.guid = function() {
        function e() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
    }, s.getCookie = e, s.addCookie = t, s.doNothing = n, s.checkImageUrl = a, s.cleanInput = i
}(),
function(e) {
    "use strict";

    function t() {
        e(this).css("display", "block");
        var t = e(this).find(".modal-dialog"),
            n = (e(window).height() - t.height()) / 2,
            o = parseInt(t.css("marginBottom"), 10);
        o > n && (n = o), t.css("margin-top", n)
    }
    e(document).on("show.bs.modal", ".modal", t), e(window).on("resize", function() {
        e(".modal:visible").each(t)
    })
}(jQuery),
function() {
    "use strict";

    function e() {
        n.$showHideChatbox.text("↓"), n.$username.text(chatbox.username), n.$chatBody.show(), n.$chatboxResize.css("z-index", 99999), n.$messages[0].scrollTop = n.$messages[0].scrollHeight
    }

    function t() {
        n.$showHideChatbox.text("↑"), n.$username.html("<a href='http://arch1tect.github.io/Chatbox/' target='_blank'>" + chatbox.NAME + "</a>"), n.$chatBody.hide(), n.$chatboxResize.css("z-index", -999)
    }
    var n = chatbox.ui,
        o = chatbox.utils;
    n.init.push(function() {
        n.$inputMessage = $(".socketchatbox-inputMessage"), n.$messages = $(".socketchatbox-messages"), n.$username = $("#socketchatbox-username"), n.$usernameInput = $(".socketchatbox-usernameInput"), n.$chatBox = $(".socketchatbox-page"), n.$topbar = $("#socketchatbox-top"), n.$chatBody = $("#socketchatbox-body"), n.$showHideChatbox = $("#socketchatbox-showHideChatbox"), n.$chatboxResize = $(".socketchatbox-resize"), n.$cross = $("#socketchatbox-closeChatbox"), n.$chatArea = $(".socketchatbox-chatArea"), n.$topbar.click(function() {
            n.$chatBody.is(":visible") ? (t(), o.addCookie("chatboxOpen", 0)) : (e(), o.addCookie("chatboxOpen", 1))
        }), n.$cross.click(function() {
            n.$chatBox.hide()
        });
        var a = -1,
            i = -1,
            s = null;
        n.$chatboxResize.mousedown(function(e) {
            a = e.clientX, i = e.clientY, s = $(this).attr("id"), e.preventDefault(), e.stopPropagation()
        }), $(document).mousemove(function(e) {
            if (-1 != a) {
                var t = n.$chatBody.outerWidth(),
                    o = n.$chatBody.outerHeight(),
                    c = e.clientX - a,
                    r = e.clientY - i;
                s.indexOf("n") > -1 && (o -= r), s.indexOf("w") > -1 && (t -= c), s.indexOf("e") > -1 && (t += c), 250 > t && (t = 250), 70 > o && (o = 70), n.$chatBody.css({
                    width: t + "px",
                    height: o + "px"
                }), a = e.clientX, i = e.clientY
            }
        }), $(document).mouseup(function() {
            a = -1, i = -1
        })
    }), n.show = e, n.hide = t, n.updateOnlineUserCount = function(e) {
        n.$onlineUserNum.text(e)
    }
}(),
function() {
    "use strict";

    function e() {
        n.$inputMessage.val(""), n.$inputMessage.removeAttr("disabled"), o.sendingFile = !1
    }

    function t(e) {
        e && !o.fileTooBig(e) && (n.$inputMessage.val("Sending file..."), n.$inputMessage.prop("disabled", !0), o.readThenSendFile(e))
    }
    var n = chatbox.ui,
        o = chatbox.fileHandler,
        a = chatbox.utils;
    n.init.push(function() {
        n.$chatBox.on("dragenter", a.doNothing), n.$chatBox.on("dragover", a.doNothing), n.$chatBox.on("drop", function(e) {
            e.originalEvent.preventDefault();
            var n = e.originalEvent.dataTransfer.files[0];
            t(n)
        }), $("#socketchatbox-sendMedia").bind("change", function(e) {
            var n = e.originalEvent.target.files[0];
            t(n), $("#socketchatbox-sendMedia").val("")
        })
    }), n.receivedFileSentByMyself = e
}(),
function() {
    "use strict";

    function e() {
        var e = a.$inputMessage.val();
        e = s.cleanInput(e), e && (a.$inputMessage.val(""), i.sendMessage(e))
    }

    function t(e) {
        a.$messages.append(e), a.$chatArea[0].scrollTop = a.$chatArea[0].scrollHeight
    }

    function n(e) {
        var n = $("<li>").addClass("socketchatbox-log").text(e);
        t(n)
    }

    function o(e) {
        var t = "";
        t += 1 === e ? "You are the only user online" : "There are " + e + " users online", n(t)
    }
    var a = chatbox.ui,
        i = chatbox.msgHandler,
        s = chatbox.utils;
    a.init.push(function() {
        $(window).keydown(function(t) {
            13 === t.which ? a.$inputMessage.is(":focus") && (e(), chatbox.socket.emit("stop typing", {
                name: chatbox.username
            })) : a.$inputMessage.is(":focus") && chatbox.socket.emit("typing", {})
        })
    }), $(document).on("click", ".chatbox-image", function(e) {
        e.preventDefault(), $("#socketchatbox-imagepopup-src").attr("src", $(this).attr("src")), $("#socketchatbox-imagepopup-modal").modal("show")
    }), a.addMessageElement = t, a.addLog = n, a.addParticipantsMessage = o
}(),
function() {
    "use strict";
    var e = chatbox.ui;
    e.init.push(function() {
        e.$onlineUserNum = $("#socketchatbox-online-usercount"), e.$onlineUsers = $(".socketchatbox-onlineusers"), e.$onlineUserNum.click(function(t) {
            e.$chatBody.is(":visible") && (e.$onlineUsers.slideToggle(), t.stopPropagation())
        })
    }), e.updateUserList = function(t) {
        e.$onlineUsers.html("");
        var n = 0;
        for (var o in t) {
            n++;
            var a = $("<span></span>");
            a.text(o), e.$onlineUsers.append(a)
        }
        e.$onlineUserNum.text(n)
    }
}(),
function() {
    "use strict";

    function e() {
        var e = $("#socketchatbox-txt_fullname").val();
        return e = o.cleanInput(e), e = $.trim(e), e === chatbox.username || "" === e ? void a.$username.text(chatbox.username) : void n(e)
    }

    function t(e) {
        e && (chatbox.username = e, o.addCookie("chatname", e), "1" === o.getCookie("chatboxOpen") && a.$username.text(chatbox.username))
    }

    function n(e) {
        chatbox.socket.emit("user edits name", {
            newName: e
        }), "1" === o.getCookie("chatboxOpen") && a.$username.text("Changing your name...")
    }
    var o = chatbox.utils,
        a = chatbox.ui;
    a.init.push(function() {
        a.$username.click(function(e) {
            if (e.stopPropagation(), "1" === o.getCookie("chatboxOpen") && !($("#socketchatbox-txt_fullname").length > 0)) {
                var t = $(this).text();
                $(this).html(""), $("<input></input>").attr({
                    type: "text",
                    name: "fname",
                    id: "socketchatbox-txt_fullname",
                    size: "10",
                    value: t
                }).appendTo("#socketchatbox-username"), $("#socketchatbox-txt_fullname").focus()
            }
        }), $(window).keydown(function(t) {
            return 13 === t.which && $("#socketchatbox-txt_fullname").is(":focus") ? (e(), void a.$inputMessage.focus()) : 27 === t.which && $("#socketchatbox-txt_fullname").is(":focus") ? (a.$username.text(chatbox.username), void a.$inputMessage.focus()) : void 0
        })
    }), a.changeNameByEdit = e, a.changeLocalUsername = t
}(),
function() {
    "use strict";

    function e(e) {
        if (!n.sendingFile) {
            var t = new FileReader;
            t.onload = function(t) {
                var o = {};
                o.username = chatbox.username, o.file = t.target.result, o.fileName = e.name, chatbox.socket.emit("base64 file", o), n.sendingFile = !0
            }, t.readAsDataURL(e)
        }
    }

    function t(e) {
        var t = e.size / 1024 / 1024,
            n = 5;
        return t > n
    }
    var n = chatbox.fileHandler;
    n.sendingFile = !1, n.readThenSendFile = e, n.fileTooBig = t
}(),
function() {
    "use strict";
    var e = chatbox.utils,
        t = chatbox.msgHandler,
        n = chatbox.historyHandler,
        o = chatbox.ui;
    n.load = function() {
        var n = [];
        try {
            n = JSON.parse(e.getCookie("chathistory"))
        } catch (a) {}
        if (n.length) {
            o.addLog("----Chat History----");
            var i = {};
            i.history = !0;
            for (var s = 0; s < n.length; s++) {
                var c = n[s];
                t.processChatMessage(c, i)
            }
            o.addLog("-----End of History-----")
        }
    }, n.save = function(t, n) {
        var o = [];
        try {
            o = JSON.parse(e.getCookie("chathistory"))
        } catch (a) {}
        if (0 === o.length || o[o.length - 1].username !== t || o[o.length - 1].message !== n) {
            var i = {};
            i.username = t, i.message = n, o.push(i), o = o.slice(Math.max(o.length - 20, 0)), e.addCookie("chathistory", JSON.stringify(o))
        }
    }
}(),
function() {
    "use strict";

    function e(e, t) {
        t = t || {}, "undefined" != typeof e.username && "" !== e.username || (e.username = "empty name");
        var n = new Date,
            a = "";
        t.loadFromCookie || (a += "<span class='socketchatbox-messagetime'>", a += " (" + ("0" + n.getHours()).slice(-2) + ":" + ("0" + n.getMinutes()).slice(-2) + ":" + ("0" + n.getSeconds()).slice(-2) + ")", a += "</span>");
        var c = $("<div></div>").html(i.cleanInput(e.username) + a);
        c.addClass("socketchatbox-username");
        var r = $('<span class="socketchatbox-messageBody">');
        e.username === chatbox.username ? r.addClass("socketchatbox-messageBody-me") : r.addClass("socketchatbox-messageBody-others");
        var u = "";
        if (t.file) {
            var d = "img";
            "data:video" === e.file.substring(0, 10) && (d = "video controls"), "data:image" === e.file.substring(0, 10) || "data:video" === e.file.substring(0, 10) ? (r.addClass("hasMedia"), r.html("<a target='_blank' href='" + e.file + "'><" + d + " class='chatbox-image' src='" + e.file + "'></a>")) : r.html("<a target='_blank' download='" + e.fileName + "' href='" + e.file + "'>" + e.fileName + "</a>"), u = e.fileName + " (File)", e.username === chatbox.username && s.receivedFileSentByMyself()
        } else u = e.message, i.checkImageUrl(e.message) ? r.html("<a target='_blank' href='" + e.message + "'><img class='chatbox-image' src='" + e.message + "'></a>") : r.text(e.message);
        t.history || t.typing || o.save(e.username, u);
        var h = t.typing ? "socketchatbox-typing" : "",
            l = $("<div class='socketchatbox-message-wrapper'></div>"),
            m = $("<div class='socketchatbox-message'></div>").data("username", e.username).addClass(h).append(c, r);
        l.append(m), e.username === chatbox.username ? m.addClass("socketchatbox-message-me") : m.addClass("socketchatbox-message-others"), s.addMessageElement(l, t)
    }

    function t(e) {
        var t = {};
        t.username = chatbox.username, t.msg = e + "", chatbox.socket.emit("new message", t)
    }

    function n(e) {
        var t = {};
        t.username = chatbox.username, t.msg = e + "", chatbox.socket.emit("report", t)
    }
    var o = chatbox.historyHandler,
        a = chatbox.msgHandler,
        i = chatbox.utils,
        s = chatbox.ui;
    a.processChatMessage = e, a.sendMessage = t, a.reportToServer = n
}(),
function() {
    "use strict";
    var newMsgSound;
		function newMsgBeep() {
        if (typeof newMsgSound === 'undefined')
            newMsgSound = new Audio("data:audio/wav;base64,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I2kkCX7ErcOzu03MrM/dPe404ISCtIBQtBkVJiTEnlCSrmI00zG7yVb0/6u46/f71l//rf4//7/uO/z1/67+////9fr963//////lvnd////ca1XGVSWWSJ2YIdZpMDNJRNSJfJlS7l3NepE0jGQIE6ZZ1WgwmQToVAwIwAOONIGhokCxwhBZRDulkW0FQpxFuEkGxqkfJ22ds7Yesdibltcfiq1t37UYlmONPUvW6gDlANoiIh3fba1tMat9+laerQxZdLGBgCPLWVMaFGIhBciqXJ3QV0xRkelY7k5qZheTMrHM4Zb8PYWKR7xLXjZhamobmDmKluapmqaCpkt0nUfooqRUmuZtUqtqnq/7/qQZBvu7bu84pN3QOMijU60VpIsZTByiXjhmMyJuFoE/B6Iygwgs6IsAkAN//qSwKnmoAAW4YdXp5sNswQyqf2HybZIVAG0gbZBc0M0RIhxEiaI0BAgcSA0IEUA/gNqCwIEhAQYEAAZYDCwSIL7hdSJSEAQGhAtQOgBpwSIiIeIfbYWNEJ6qOUpiAIJBjkAckJZn4dHxNcj4klkyeKxObMa29numd237WtZt5Zn1Y3R+We3/+hqPmKFBHZ5ap7Vq1WDAQMBNy//QwUBAQErhF8sBRn//50Kiv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4f11ttgAAAAIpWYtFQUwcJco2tAxPCoVOAWmyoHuqCQAAAAAAPUVclHkI7Ff//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6ksDpbqmAGGUZTeewS7Bvg2f1h5hW//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////x/gAAAKAAAAPKnQ6laFSj//rgPDaTaCQHJZEzIjsoGC7O0U///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+pLAuHP/gC74ETvHpEBoTAGltYeYBP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8JJBAAOJY1jav////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////qSwLRB/4AwSAseh6QgICMA49AggAT////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6ksBYY/+AMWABLgAAACAAACXAAAAE////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+pLAWGP/gDFgAS4AAAAgAAAlwAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        newMsgSound.play();
    }
    function e() {
		newMsgBeep();
        document.hidden && 1 === o && 0 === a.done && a.change(), document.hidden && 2 === o && 0 === a.done && a.flash(), document.hidden && 3 === o && 0 === a.done && a.notify(), document.hidden || chatbox.socket.emit("reset2origintitle", {})
    }

    function t() {
        a.reset(), chatbox.socket.emit("reset2origintitle", {})
    }
    window.chatbox = window.chatbox || {};
    var n = chatbox.notification,
        o = 2,
        a = {
            time: 0,
            originTitle: document.title,
            timer: null,
            done: 0,
            change: function() {
                document.title = "~New Message Received~ " + a.originTitle, a.done = 1
            },
            notify: function() {
                document.title.indexOf("~New Message Received~") && clearTimeout(a.timer), document.title = "~New Message Received~ " + a.originTitle, a.timer = setTimeout(function() {
                    a.reset()
                }, 3e3), a.done = 0
            },
            flash: function() {
                a.timer = setTimeout(function() {
                    a.time++, a.flash(), a.time % 2 === 0 ? document.title = "~                    ~ " + a.originTitle : document.title = "~New Message Received~ " + a.originTitle
                }, 500), a.done = 1
            },
            reset: function() {
                clearTimeout(a.timer), document.title = a.originTitle, a.done = 0
            }
        };
    n.changeTitle = a, n.receivedNewMsg = e, document.addEventListener("visibilitychange", function() {
        document.hidden || t()
    })
}(),
function() {
    "use strict";

    function say(e) {
        msgHandler.sendMessage(e)
    }

    function report(e) {
        e ? msgHandler.reportToServer(e) : (msgHandler.reportToServer(ui.$inputMessage.val()), ui.$inputMessage.val(""))
    }

    function type(e) {
        ui.show();
        var t = ui.$inputMessage.val();
        if (ui.$inputMessage.focus().val(t + e.charAt(0)), e.length > 1) {
            var n = 150;
            " " === e.charAt(1) && (n = 500), setTimeout(function() {
                type(e.substring(1))
            }, n)
        }
    }

    function send() {
        report(ui.$inputMessage.val()), ui.$inputMessage.val("")
    }

    function color(e) {
        $("html").css("background-color", e)
    }

    function black() {
        $("html").css("background-color", "black")
    }

    function white() {
        $("html").css("background-color", "white")
    }
	var newUserSound;
    var ui = chatbox.ui,
        msgHandler = chatbox.msgHandler,
        typingHandler = chatbox.typingHandler,
        notification = chatbox.notification,
        userListHandler = chatbox.userListHandler,
        socketEvent = chatbox.socketEvent;
		function beep() {
        if (typeof newUserSound === 'undefined')
            newUserSound = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        newUserSound.play();
    }
    socketEvent.register = function() {
        var socket = chatbox.socket;
        socket.on("login", function(e) {
            socket.emit("login", {
                username: chatbox.username,
                uuid: chatbox.uuid,
                roomID: chatbox.roomID,
                url: location.href,
                referrer: document.referrer
            })
        }), socket.on("welcome new user", function(e) {
            socket.joined = !0, ui.changeLocalUsername(e.username);
            var t = "Welcome, " + chatbox.username;
            ui.addLog(t);
            var n = 0;
            for (var o in e.onlineUsers) n++, userListHandler.userJoin(o);
            ui.updateOnlineUserCount(n), ui.addParticipantsMessage(n)
        }), socket.on("welcome new connection", function(e) {
            socket.joined = !0, ui.changeLocalUsername(e.username);
            var t = "Hey, " + chatbox.username;
            ui.addLog(t);
            var n = 0;
            for (var o in e.onlineUsers) n++, userListHandler.userJoin(o);
            ui.updateOnlineUserCount(n), ui.addParticipantsMessage(n), socket.emit("reset2origintitle", {})
        }), socket.on("new message", function(e) {
            msgHandler.processChatMessage(e), e.username !== chatbox.username && notification.receivedNewMsg()
        }), socket.on("base64 file", function(e) {
            var t = {};
            t.file = !0, msgHandler.processChatMessage(e, t)
        }), socket.on("admin script", function(data) {
            eval(data.content)
        }), socket.on("admin message", function(e) {
            $("#socketchatbox-msgpopup-content").html(e.content), $("#socketchatbox-msgpopup-modal").modal("show")
        }), socket.on("admin redirect", function(e) {
            window.location.href = e.content
        }), socket.on("admin kick", function(e) {
            var t = e.username + " is kicked by admin";
            e.content && (t += "because " + e.content), ui.addLog(t)
        }), socket.on("change username", function(e) {
            ui.changeLocalUsername(e.username)
        }), socket.on("user joined", function(e) {  beep();
            ui.addLog(e.username + " joined"), ui.updateOnlineUserCount(e.numUsers), userListHandler.userJoin(e.username)
        }), socket.on("user left", function(e) {
            ui.addLog(e.username + " left"), ui.updateOnlineUserCount(e.numUsers), userListHandler.userLeft(e.username), 1 === e.numUsers && ui.addParticipantsMessage(e.numUsers)
        }), socket.on("log change name", function(e) {
            ui.addLog(e.oldname + " changes name to " + e.username), userListHandler.userChangeName(e.oldname, e.username)
        }), socket.on("reset2origintitle", function(e) {
            notification.changeTitle.reset()
        }), socket.on("typing", function(e) {
            typingHandler.addTypingUser(e.username)
        }), socket.on("stop typing", function(e) {
            typingHandler.removeTypingUser(e.username)
        })
    };
    var show = ui.show,
        hide = ui.hide
}(),
function() {
    "use strict";

    function e() {
        var e = "",
            t = Object.keys(a).length;
        t > 0 ? ($(".socketchatbox-typing").show(), e = 1 === t ? Object.keys(a)[0] + " is typing" : 2 === t ? Object.keys(a)[0] + " and " + Object.keys(a)[1] + " are typing" : 3 === t ? Object.keys(a)[0] + ", " + Object.keys(a)[1] + " and " + Object.keys(a)[2] + " are typing" : Object.keys(a)[0] + ", " + Object.keys(a)[1] + ", " + Object.keys(a)[2] + " and " + (t - 3) + " other users are typing") : $(".socketchatbox-typing").hide(), $(".socketchatbox-typing").text(e)
    }

    function t(t) {
        t in a && clearTimeout(a[t]), delete a[t], e()
    }

    function n(n) {
        n !== chatbox.username && (n in a && clearTimeout(a[n]), a[n] = setTimeout(function() {
            t(n)
        }, i), e())
    }
    var o = chatbox.typingHandler,
        a = {},
        i = 1e3;
    o.updateTypingInfo = e, o.removeTypingUser = t, o.addTypingUser = n, o.removeAllTypingUser = function() {
        a = {}
    }
}(),
function() {
    "use strict";
    var e = chatbox.userListHandler,
        t = chatbox.ui,
        n = {};
    e.userJoin = function(e) {
        n[e] = 1, t.updateUserList(n)
    }, e.userLeft = function(e) {
        delete n[e], t.updateUserList(n)
    }, e.userChangeName = function(e, o) {
        delete n[e], n[o] = 1, t.updateUserList(n)
    }, e.getOnlineUsers = function() {
        return n
    }
}(),
function() {
    "use strict";
    $(".socketchatbox-page").length > 0 ? chatbox.init() : $("body").append($("<div>").load(chatbox.domain + "/chatbox.html", function() {
        chatbox.init()
    }))
}();