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
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var sims = {};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.onDeviceReady();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener('onload', this.onDeviceReady, false);
        
        window.addEventListener("keydown", function (e) {
            
        }, false);

        window.addEventListener("keyup", function (e) {
            
        }, false);
        
        window.addEventListener("resize", function(e){
            for(var i=0;i<sims.length;i++){
                sims[i].canvasResize();
                sims[i].render();
            }
        },false);
        
        $('.range-container input[type=range]').each(
            function(index, element){                
                element.addEventListener("input",function(){
                    document.getElementById($(this).data("react").toString()).value = parseInt($(this).val());
                });
            }
        );
        
        $('.range-container input[type=number]').each(
            function(index, element){                
                element.addEventListener("input",function(){
                    document.getElementById($(this).data("react").toString()).value = parseInt($(this).val());
                });
            }
        );
	},
    
    onDeviceReady: function() {
        $('.range-container input[type=range]').each( function(index, element){document.getElementById(element.getAttribute("data-react").toString()).value = parseInt(element.value);});
                 
        //Start stuff
        canvas = document.getElementById("main_canvas");

        sims["main_canvas"] = new Sim(canvas);
        //sims["main_canvas"].start();
        
        $(".sim-run-btn").each(
            function(index, ele){                
                var sim_id = $(ele).data("canvas").toString();
                
                ele.addEventListener("click",function(){
                    sims[sim_id].play();
                },false);
        });
        
        $(".sim-pause-btn").each(
            function(index, ele){                
                var sim_id = $(ele).data("canvas").toString();
                
                ele.addEventListener("click",function(){
                    sims[sim_id].pause();
                },false);
        });
        
        $(".sim-stop-btn").each(
            function(index, ele){                
                var sim_id = $(ele).data("canvas").toString();
                
                ele.addEventListener("click",function(){
                    sims[sim_id].reset();
                },false);
        });
    }
};

//Functions for drawing
function Sim(_canvas,_args){
    var self = this;
    
    this.canvas = _canvas;
    this.ctx = _canvas.getContext("2d");
    
    this.started = false;
    this.paused = false;
    
    this.particleArray = [];
    
    if(_args!=null){
        //whatever args to throw here    
    }
    
    this.start = function(){
        this.reset();
        
        var n=10; 
        while(n--){
            self.particleArray.push(new Particle(1,10+n*10,10,self.ctx,{speed:{x:0.1*n,y:0,z:0},acc:{x:0,y:0.0981,z:0}}));
        }
        
        self.canvasResize();
        self.tick();    
        
        self.started = true;
    };
    
    this.render = function(){
        if(self.paused) return;
        
        self.ctx.clear();
        
        //Render particles
        for(var i=0;i<self.particleArray.length;i++){
            var pars = self.particleArray;
            pars[i].draw();
        }
    };
    
    this.tick = function(){
        if(self.paused) return;
        
        self.render();
        
        for(var i=0;i<self.particleArray.length;i++){
            var pars = self.particleArray;
            pars[i].x += pars[i].speed.x;
            pars[i].y += pars[i].speed.y;
            pars[i].z += pars[i].speed.z;
            
            pars[i].speed.x += pars[i].acc.x;
            pars[i].speed.y += pars[i].acc.y;
            pars[i].speed.z += pars[i].acc.z;
            
            if(pars[i].x<0 || pars[i].x>self.ctx.canvas.width || pars[i].y<0 || pars[i].y>self.ctx.canvas.height){
                pars[i].destroy();
                pars.splice(i, 1);
                i--;
            }
        }
        /*
        for(var i in self.particleArray){
            var pars = self.particleArray;     
            
            if(pars.hasOwnProperty(i)) continue;
              
            if(pars[i].destroyed) delete pars[i];
        }
        //*/
         
        if(!this.paused) requestAnimFrame(self.tick);
    };
    
    this.canvasResize = function(_width,_height){
        if(_width==null) _width = window.innerWidth;
        if(_height==null) _height = 400;
        
        this.ctx.canvas.width  = _width;
        this.ctx.canvas.height = _height;
    }
    
    this.play = function(){
        if(!self.started) self.start();
        self.paused = false;   
        self.tick();
    }
    
    this.pause = function(){
        self.paused = true;
    }
    
    this.reset = function(){
        this.ctx.clear();
        
        self.particleArray = [];
        
        //Reset things
        for(var i=0;i<self.particleArray.length;i++){
            var pars = self.particleArray;
            pars[i].destroy();
        }
        
        self.started = false;
        self.paused = false;

        self.particleArray = [];
    }
}

function Particle(_type,_x,_y,_ctx,_args){
    /* Obstacles
     * 0: Hole
     * 1: Electron
    //*/
    
    var self = this;
    
    this.type = _type;
    this.x = _x;
    this.y = _y ;
    this.z = 0;
    this.args = _args;
    this.ctx = _ctx;
    
    this.radius = 3;
    
    this.speed = {x:0,y:0,z:0};
    this.acc = {x:0,y:0,z:0};
    
    if(_args!=null){
        if(_args["speed"]!=null){
            this.speed = _args["speed"];   
        }
        
        if(_args["acc"]!=null){
            this.acc = _args["acc"];   
        }
        
        if(_args["speed"]!=null){
            this.speed = _args["speed"];   
        }
    }
    
    this.destroyed = false;
    
    this.draw = function(_args){
        var ctxx = self.ctx;
        
        if(_args!=null){
                
        }
        
        ctxx.beginPath();
        ctxx.arc(self.x,self.y,self.radius,0,2*Math.PI);
        if(self.type==1){ //must fill circle, thus draw successive arcs
            for(var r=1;r<self.radius;r++){
               ctxx.arc(self.x,self.y,r,0,2*Math.PI);
            }
        }
        ctxx.stroke();
    }
    
    this.destroy = function(){
        self.destroyed = true;
        //self.img.parentElement.removeChild(self.img);
    }
}


/*----------PROTOTYPES/FUNCTIONS---------*/
Array.prototype.removeItem = function(item){
    var ind = this.indexOf(item);
    if(ind!=-1) this.splice(ind,1);
}

Image.prototype.resize = function(w,h){
    var r = this.width/this.height;
    if(w==-1){
        this.height = h;
        this.width = h*r;
    }
    else if(h==-1){
        this.width = w;
        this.height = w/r;
    }
    else{
        this.width = w;
        this.height = h;
    }
}

String.prototype.replaceAll = function(find,rep){
    return this.split(find).join(rep);
}

CanvasRenderingContext2D.prototype.clear = function(_startx,_starty,_endx,_endy){
    if(_startx==null) _startx = 0;
    if(_starty==null) _starty = 0;
    if(_endx==null) _endx = canvas.width;
    if(_endy==null) _endy = canvas.height;
    
    this.clearRect(_startx, _starty, _endx, _endy);
}

function rand(lw,hg){
    var randNo = Math.floor(Math.random()*(1+hg-lw))+lw;
	return randNo;
}

/*---------INTERNAL APPLICATION-----------*/
    
$(document).ready(function() {
    app.initialize();
});

//Navbar
(function($){
    $(function(){
        $('.button-collapse').sideNav();

    }); // end of document ready
})(jQuery); // end of jQuery name space
