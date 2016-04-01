/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var sims = {};

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
        this.onDeviceReady();
    },
    bindEvents: function () {
        $(document).on('deviceready', this.onDeviceReady);
        $(window).load(this.onDeviceReady);

        $(window).keydown(function (e) {

        });

        $(window).keyup(function (e) {

        });

        $(window).resize(function (e) {
            for (var i = 0; i < sims.length; i++) {
                sims[i].canvasResize();
                sims[i].render();
            }
        });

        $('.range-container input[type=range]').each(
                function (index, element) {
                    $(element).change(function () {
                        $("#" + $(this).data("react").toString()).val(parseInt($(this).val()));
                    });
                }
        );

        $('.range-container input[type=number]').each(
                function (index, element) {
                    $(element).change(function () {
                        $("#" + $(this).data("react").toString()).val(parseInt($(this).val()));
                    });
                }
        );
    },
    onDeviceReady: function () {
        $('.range-container input[type=range]').each(function (index, element) {

            $("#" + $(element).data("react").toString()).val(parseInt($(element).val()));
        });

        //Start stuff
        canvas = $("#main_canvas")[0];

        sims["main_canvas"] = new Sim(canvas);
        //sims["main_canvas"].start();

        $(".sim-run-btn").each(
                function (index, ele) {
                    var sim_id = $(ele).data("canvas").toString();

                    $(ele).click(function () {
                        sims[sim_id].play();
                    });
                });

        $(".sim-pause-btn").each(
                function (index, ele) {
                    var sim_id = $(ele).data("canvas").toString();

                    $(ele).click(function () {
                        sims[sim_id].pause();
                    });
                });

        $(".sim-stop-btn").each(
                function (index, ele) {
                    var sim_id = $(ele).data("canvas").toString();

                    $(ele).click(function () {
                        sims[sim_id].reset();
                    });
                });
    }
};

//Functions for drawing
function Sim(_canvas, _args) {
    var self = this;

    this.canvas = _canvas;
    this.ctx = _canvas.getContext("2d");

    this.started = false;
    this.paused = false;

    this.particleArray = [];
    
    //this.bandDiagram = new Band(0, 1, 0, this.ctx, 0);
    
    this.paricleMap = {}; //"x,y,z":[Particle,Particle]

    if (_args != null) {
        //whatever args to throw here
    }

    this.start = function () {
        self.reset();

        /*
         //Just cool animation, with speed and acceleration for particles
         for(var n=-10;n<=10;n++){
         self.particleArray.push(new Particle(Math.abs(n)%2,self.ctx.canvas.width/2+n*10,10,self.ctx,{speed:{x:0.2*n,y:0,z:0},acc:{x:0,y:0.0981,z:0}}));
         }
         //*/

        //*
        //Testing collisions
        self.particleArray.push(new Particle(1, self.ctx.canvas.width / 2, 10, self.ctx,
                {
                    speed: {x: 0, y: 1, z: 0},
                    acc: {x: 0, y: 0, z: 0}
                }
        ));

        self.particleArray.push(new Particle(0, self.ctx.canvas.width / 2, self.ctx.canvas.height - 10, self.ctx,
                {
                    speed: {x: 0, y: -1, z: 0},
                    acc: {x: 0, y: 0, z: 0}
                }
        ));
        //*/

        self.tick();

        self.started = true;
    };

    this.render = function () {
        if (self.paused || !self.started)
            return;

        self.ctx.clear();

        var pars = self.particleArray;
        //Render particles
        for (var i = 0; i < self.particleArray.length; i++) {

            pars[i].draw();
        }
        
        //self.bandDiagram.draw();
    };

    this.tick = function () {
        if (self.paused || !self.started)
            return;

        self.render();

        var pars = self.particleArray;
        var parm = self.particleMap; //set var parm as self.particleMap because self.particleMap cannot be properly modified via loop for some reason
        parm = {}; //reset all coords

        for (var i = 0; i < self.particleArray.length; i++) {
            //Check for out of bounds
            if (pars[i].x < 0 || pars[i].x > self.ctx.canvas.width || pars[i].y < 0 || pars[i].y > self.ctx.canvas.height) {
                pars[i].destroy();
                pars.splice(i, 1);
                i--;
                continue;
            }

            //Check for e- & hole collisions by adding to x,y,z map (more efficient)
            var coord = pars[i].x + "_" + pars[i].y + "_" + pars[i].z;

            if (parm[coord] == null) {
                parm[coord] = {"holes": [], "electrons": []};
            }

            //Separate into holes and electrons
            if (pars[i].type) {
                parm[coord]["electrons"].push({"particle": pars[i], "index": i});
            } else {
                parm[coord]["holes"].push({"particle": pars[i], "index": i});
            }

            //Move particle
            pars[i].x += pars[i].speed.x;
            pars[i].y += pars[i].speed.y;
            pars[i].z += pars[i].speed.z;

            //Accelerate particle
            pars[i].speed.x += pars[i].acc.x;
            pars[i].speed.y += pars[i].acc.y;
            pars[i].speed.z += pars[i].acc.z;
        }

        //console.log(parm);

        //Loop through particleMap to check for collisions
        for (var coord in parm) {
            if (!parm.hasOwnProperty(coord))
                continue;

            if (parm[coord]["holes"].length >= 1 && parm[coord]["electrons"].length >= 1) { //Collision detected
                console.log("Oh no! A collision at " + coord.toString());

                var parHoles = parm[coord]["holes"];
                var parEle = parm[coord]["electrons"];

                //if excess holes/electrons colliding, excess holes/electrons still pass
                for (var j = Math.min(parHoles.length, parEle.length) - 1; j >= 0; j--) {
                    //loop from back to allow for proper splicing

                    parHoles[j]["particle"].destroy();
                    pars.splice(parHoles[j]["index"], 1); //Remove from particleArray

                    parEle[j]["particle"].destroy();
                    pars.splice(parEle[j]["index"], 1); //Remove from particleArray
                }
                //TODO: Make only those with similar speeds/energies annihilate each other
            }
        }

        //self.paused = true;

        /*
         for(var i in self.particleArray){
         var pars = self.particleArray;
         
         if(pars.hasOwnProperty(i)) continue;
         
         if(pars[i].destroyed) delete pars[i];
         }
         //*/

        if (!self.paused)
            requestAnimFrame(self.tick);
    };

    this.canvasResize = function (_width, _height) {
        if (_width == null)
            _width = window.innerWidth;
        if (_height == null)
            _height = 400;

        this.ctx.canvas.width = _width;
        this.ctx.canvas.height = _height;
    }

    this.play = function () {
        if (!self.started)
            self.start();
        self.paused = false;
        self.tick();
    }

    this.pause = function () {
        self.paused = true;
    }

    this.reset = function () {
        self.paused = false;
        self.started = false;

        self.ctx.clear();
        self.canvasResize();

        self.particleArray = [];

        //Reset things
        for (var i = 0; i < self.particleArray.length; i++) {
            var pars = self.particleArray;
            pars[i].destroy();
        }

        self.particleArray = [];
    }
}

function Band(_type, _energyLevel, _gradient, _ctx, _args) {
    /* Band Types
     * 0: valence band top
     * 1: conduction band top
     //*/
    var self = this;
    
    this.type = _type;
    this.gradient = _gradient;
    this.energyLevel = _energyLevel;
    this.ctx = _ctx;
    
    this.draw = function(_args)
    {
        var ctxx = self.ctx;
        ctxx.moveTo(0, 200);
        ctxx.lineTo(1000,200);
        ctxx.stroke();
    }
}

function Particle(_type, _x, _y, _ctx, _args) {
    /* Obstacles
     * 0: Hole
     * 1: Electron
     //*/

    var self = this;

    this.type = _type;
    this.x = _x;
    this.y = _y;
    this.z = 0;
    this.args = _args;
    this.ctx = _ctx;

    this.radius = 3;

    this.speed = {x: 0, y: 0, z: 0};
    this.acc = {x: 0, y: 0, z: 0};

    if (_args != null) {
        if (_args["speed"] != null) {
            this.speed = _args["speed"];
        }

        if (_args["acc"] != null) {
            this.acc = _args["acc"];
        }

        if (_args["speed"] != null) {
            this.speed = _args["speed"];
        }
    }

    this.destroyed = false;

    this.draw = function (_args) {
        var ctxx = self.ctx;

        if (_args != null) {

        }

        ctxx.beginPath();
        ctxx.arc(self.x, self.y, self.radius, 0, 2 * Math.PI);
        if (self.type == 1) { //must fill circle, thus draw successive arcs
            for (var r = 1; r < self.radius; r++) {
                ctxx.arc(self.x, self.y, r, 0, 2 * Math.PI);
            }
        }
        ctxx.stroke();
    }

    this.destroy = function () {
        self.destroyed = true;
        //self.img.parentElement.removeChild(self.img);
    }
}


/*----------PROTOTYPES/FUNCTIONS---------*/
Array.prototype.removeItem = function (item) {
    var ind = this.indexOf(item);
    if (ind != -1)
        this.splice(ind, 1);
}

Image.prototype.resize = function (w, h) {
    var r = this.width / this.height;
    if (w == -1) {
        this.height = h;
        this.width = h * r;
    } else if (h == -1) {
        this.width = w;
        this.height = w / r;
    } else {
        this.width = w;
        this.height = h;
    }
}

String.prototype.replaceAll = function (find, rep) {
    return this.split(find).join(rep);
}

CanvasRenderingContext2D.prototype.clear = function (_startx, _starty, _endx, _endy) {
    if (_startx == null)
        _startx = 0;
    if (_starty == null)
        _starty = 0;
    if (_endx == null)
        _endx = canvas.width;
    if (_endy == null)
        _endy = canvas.height;

    this.clearRect(_startx, _starty, _endx, _endy);
}

function rand(lw, hg) {
    var randNo = Math.floor(Math.random() * (1 + hg - lw)) + lw;
    return randNo;
}

/*---------INTERNAL APPLICATION-----------*/

$(document).ready(function () {
    app.initialize();
});

//Navbar
(function ($) {
    $(function () {
        $('.button-collapse').sideNav();

    }); // end of document ready
})(jQuery); // end of jQuery name space
