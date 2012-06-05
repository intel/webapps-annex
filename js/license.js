/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function license_init(id, hpageid)
{
    var lbtn = document.getElementById(id+"btnl");
    var ubtn = document.getElementById(id+"btnu");
    var dbtn = document.getElementById(id+"btnd");
    var qbtn = document.getElementById(id+"btnq");
    var lpage = document.getElementById(id+"page");
    var ltext = document.getElementById(id+"text").contentWindow;
    var hpage = document.getElementById(hpageid);
    var frame = window.frames[id+"text"];
    var scroll_y = 0;
    var click_y = 0;
    var isdrag = false;

    ltext.ontouchstart = function(e) {};
    ltext.ontouchend = function(e) {};
    ltext.ontouchmove = function(e) {};

    ltext.onmousedown = function(e) {
        isdrag = true;
        click_y = e.y;
        scroll_y = frame.scrollY;
    };

    ltext.onmouseup = function(e) {
        isdrag = false;
    };

    ltext.onmousemove = function(e) {
        if(isdrag)
        {
            frame.scrollTo(0, scroll_y + click_y - e.y);
        }
    };

    lbtn.addEventListener('click', function() {
        hpage.style.visibility="hidden";
        lpage.style.display="block";
    });

    ubtn.onmousedown = function() {
        var val = frame.scrollY - 400
        frame.scrollTo(0, (val < 0)?0:val);
    };

    dbtn.onmousedown = function() {
        var val = frame.scrollY + 400
        frame.scrollTo(0, val);
    };

    qbtn.addEventListener('click', function() {
        hpage.style.visibility="visible";
        lpage.style.display="none";
    });
}
