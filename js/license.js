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
    var qbtn = document.getElementById(id+"btnq");
    var lpage = document.getElementById(id+"page");
    var hpage = document.getElementById(hpageid);
    var frame = window.frames[id+"text"];
    var dY = 1;
    var t0 = 0;
    var timer;

    lbtn.onclick = function() {
        var delay = 0;
        /* display the license page, hide its parent */
        hpage.style.display="none";
        lpage.style.display="block";

        /* start the autoscroll interval */
        timer = setInterval(function() {
            /* get the actual interval, in case performance slows us down */
            var t1 = (new Date()).getTime();
            var dT = (t0 == 0)?20:(t1-t0);
            t0 = t1;
            var old = frame.scrollY;
            frame.scrollTo(0, frame.scrollY + ((dT/20)*dY));

            /* if the frame has hit the limit, delay and swing */
            /* the other way */
            if((frame.scrollY == old)&&(delay++ > ((100*dT)/20)))
            {
                delay = 0;
                if(frame.scrollY > 0)
                {
                    dY = -20;
                }
                else
                {
                    dY = 1;
                }
            }
        }, 20);
    };

    qbtn.onclick = function() {
        hpage.style.display="block";
        lpage.style.display="none";
        clearInterval(timer);
    };
}

