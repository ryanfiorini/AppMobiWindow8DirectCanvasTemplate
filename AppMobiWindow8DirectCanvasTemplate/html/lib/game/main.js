ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'plugins.dc.dc'
)

.defines(function(){

MyGame = ig.Game.extend({
    framerateNow: 0,
    accumulatedTime: 0,
    accumulatedFrames: 0,	
	lastFPSDisplay: 0,
	muted: false,
	paused: false,
	backdrop: new ig.Image( 'media/Bkgrd_DC.jpg' ),
	foreground: new ig.Image( 'media/grass_sm.png' ),
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	clearColor: '#000',
	bgAudio: new Audio().canPlayType('audio/mpeg')?'sounds/bgAudio.mp3':'sounds/bgAudio.ogg',
	bounceSound: new Audio().canPlayType('audio/mpeg')?'sounds/bounce.mp3':'sounds/bounce.ogg',
	
	makeBird: function() {
		this.spawnEntity(EntityPlayer,(ig.system.width/2),(ig.system.height/2));
	}, 
	
	init: function() {
		
		console.log('in init');
		
		//avoid first play stutter
		AppMobi.context.loadPolySound(this.bounceSound, 5);
		AppMobi.context.startBackgroundSound(this.bgAudio, true);
		
		//dynamically create the collision map based on the screen size
		var tileSize = 32;
		var mapWidth = Math.round(ig.system.width/tileSize)+2;
		var mapHeight = Math.round(ig.system.height/tileSize)+2;
		
		var data = [];
		for(var i=0;i<mapHeight;i++) {
			var row = [];
			for(var j=0;j<mapWidth;j++) {
				(j==0||j==mapWidth-1||i==0||i==mapHeight-1)?
					row[j] = 1:
					row[j] = 0;
			}
			data[i] = row;
		}
		
		this.collisionMap = new ig.CollisionMap(tileSize, data);
		this.makeBird();
		
	},
	
	update: function() {		
			
		this.screen.x = 32;
		this.screen.y = 32;
		
		if(ig.input.pressed('add')){
			//add entity
			this.makeBird();
			
			//reset fps stats and update entity counter
			this.resetFPS();
			var q = ig.game.getEntitiesByType( EntityPlayer ).length; 
			AppMobi.webview.execute("document.getElementById('counter').innerHTML="+q+";");
		}
		
		if(ig.input.pressed('remove'))
		{
			var i = ig.game.getEntitiesByType( EntityPlayer ).length; 
			if(i>1){ig.game.getEntitiesByType( EntityPlayer )[i-1].kill();}

			//reset fps stats and update entity counter
			this.resetFPS();
			var q = ig.game.getEntitiesByType( EntityPlayer ).length; 
			AppMobi.webview.execute("document.getElementById('counter').innerHTML="+q+";");
		}
		// Update all entities and BackgroundMaps
		this.parent();
	},
	
	resetFPS: function() {
		this.framerateNow = (new Date()).getTime();
		this.lastFPSDisplay = (new Date()).getTime();
		this.accumulatedTime = 0;
		this.accumulatedFrames = 0;
	},

	draw: function() {
		var debug = false;

		// Draw all entities and BackgroundMaps
		if( this.clearColor ) {
			try{
				ig.system.clear( this.clearColor );
			} catch(e) {
				console.log(e.message);
			}
		}
		
		ig.system.context.drawImage( this.backdrop.data, 0, 0 );//this.backdrop.draw();
		
		for( var i = 0; i < this.entities.length; i++ ) {
			var ent = this.entities[i];
			ent.draw();
			if(debug) {
				var ctx = ig.system.context;
				ctx.strokeStyle = '#FF69B4';
				ctx.strokeRect((ent.pos.x- ig.game.screen.x)*ig.system.scale, (ent.pos.y- ig.game.screen.y)*ig.system.scale, ent.size.x*ig.system.scale, ent.size.y*ig.system.scale);
			}
		}
		
		//draw with semi-transparent
		var gAlpha = ig.system.context.globalAlpha;
		ig.system.context.globalAlpha = .80;
		ig.system.context.drawImage( this.foreground.data, 0, (ig.system.height*ig.system.scale)-(this.foreground.height*ig.system.scale) );//this.foreground.drawAtBottom();
		ig.system.context.globalAlpha = gAlpha;
		
		//draw the collision map
		if(debug){
			var tiles = ig.game.collisionMap.data, tileSize = ig.game.collisionMap.tilesize;
			var ctx = ig.system.context;
			for(var y = 0;y<tiles.length;y++) {
				for(var x = 0;x<tiles[0].length;x++) {
					if(tiles[y][x]){
						ctx.fillStyle = '#FF69B4';
						var 
							xx = (x*tileSize-ig.game.screen.x)*ig.system.scale,
							yy = (y*tileSize-ig.game.screen.y)*ig.system.scale,
							size = tileSize*ig.system.scale;
						ctx.fillRect(xx, yy, size, size);
					}
				}
			}
		}
		
		if (ig.system && ig.game && AppMobi && !AppMobi.isnative){
			ig.system.context.font = '40px Courier';
			ig.system.context.fillStyle = 'white';
			var text = 'a: Add, r: Remove, m: Mute, p: Pause';
			var metrics = ig.system.context.measureText(text);
			var width = metrics.width;
			ig.system.context.fillText(text,(ig.system.width/2)-(width/2),25);			
		}
						
		//do any fps init
		if(this.framerateNow==0) this.framerateNow = (new Date()).getTime();
		if(this.lastFPSDisplay==0) this.lastFPSDisplay = (new Date()).getTime();
		
        //emit fps
		var now = (new Date()).getTime();
		var delta = now - this.framerateNow;
		this.accumulatedTime+= delta;
		this.accumulatedFrames++;
		this.framerateNow = now;
		
		var displayDelta = now - this.lastFPSDisplay;
		if(displayDelta>=1000) {
			var fps = Math.floor(this.accumulatedFrames/(this.accumulatedTime/1000));
			AppMobi.webview.execute("document.getElementById('fps').innerHTML="+fps);
			this.lastFPSDisplay = now;
		}
		
	},
	
	pause: function() {
		if(!ig.system.running){
			setTimeout(this.pause, 100);
			return;
		}
		if (ig.system) {
			if(ig.game){
				if(ig.system.context.measureText){
					ig.system.context.font = '40px Courier';
					ig.system.context.fillStyle = 'white';
					var text = 'Game Paused';
					var metrics = ig.system.context.measureText(text);
					var width = metrics.width;
					ig.system.context.fillText(text,(ig.system.width/2)-(width/2),ig.system.height/2);			
				} else {
					ig.game.font.draw('Game Paused',ig.system.width/2,ig.system.height/2,ig.Font.ALIGN.CENTER);			
				}
			}
			ig.system.context.present();
			ig.system.stopRunLoop.call(ig.system);
			if(!this.muted){
				AppMobi.context.toggleBackgroundSound();
			}
			this.paused = true;
		}
	},
	
	unpause: function() {
		if (ig.system ) {
			ig.system.startRunLoop.call(ig.system);
			//reset frame rate
			this.resetFPS();
		}
		this.paused = false;
		if(!this.muted) {
			AppMobi.context.toggleBackgroundSound();
		}
	},
	
	muteToggle: function() {
		if(this.muted){
			if(!this.paused) {
				AppMobi.context.toggleBackgroundSound();
			}	
			this.muted=false;
		}else{
			if(!this.paused) {
				AppMobi.context.toggleBackgroundSound();
			}
			this.muted=true;
		}

		//reset fps stats
		this.resetFPS();
	}
	
});

//override event hooks
AppMobi.updateFPS = function(fps) {
};

//called from canvasLoaded() in index.html to start the game
AppMobi.main = function(fps, width, height, scale) {
	ig.main( '#canvas', MyGame, fps, width, height, scale );
}

//calls back to index.html after main.js is loaded
console.log('about to call canvasLoaded');
AppMobi.webview.execute('canvasLoaded()');
//console.log('bypassing canvasLoaded');
//AppMobi.main( 60, 1024, 768, 1 );		


});