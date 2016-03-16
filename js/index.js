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

var canvas, ctx;

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
        var sim1 = new Sim(canvas);
    }
};

//Functions for drawing
function Sim(_canvas,_args){
    this.canvas = _canvas;
    this.ctx = _canvas.getContext("2d");
    
    if(_args!=null){
        //whatever args to throw here    
    }
    
    this.start = function(){
        
    };
    
    this.render = function(){
        //Render particles
        
        
    };
    
    this.tick = function(){
        
    };
}

var particle = function(_type,_x,_y,_ctx,_args){
    /* Obstacles
     * 0: Hole
     * 1: Electron
    //*/
    
    var self = this;
    
    this.type = _type;
    this.x = _x;
    this.y = _y;
    this.args = _args;
    this.ctx = _ctx;
    
    this.radius = 2;
    
    this.speed = {x:0,y:0,z:0};
    this.acc = {x:0,y:0,z:0};
    
    this.destroyed = false;
    
    this.draw = function(){
        var ctxx = self.ctx;
        
        ctxx.beginPath();
        ctxx.arc(self.x,self.y,);
        context.fillStyle = '#8ED6FF';
        context.fill();
        context.lineWidth = myRectangle.borderWidth;
        context.strokeStyle = 'black';
        context.stroke();    
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
    
    context.clearRect(_startx, _starty, _endx, _endy);
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
