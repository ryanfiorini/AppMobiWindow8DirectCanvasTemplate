ig.module(
	'plugins.dc.system'
)
.requires(
	'impact.system'
)
.defines(function(){


ig.System.inject({
	init: function( canvasId, fps, width, height, scale ) {
		this.fps = fps;

		this.clock = new ig.Timer();
		this.canvas = Canvas;
		this.context = this.canvas.getContext('2d');
		this.resize( width, height, scale );
	},

	resize: function( width, height, scale ) {
		this.width = width;
		this.height = height;
		//this.scale = scale || this.scale;

		this.realWidth = this.width * this.scale;
		this.realHeight = this.height * this.scale;
		//this.context.width = this.realWidth;
		//this.context.height = this.realHeight;
		this.context.width = this.width;
		this.context.height = this.height;
		this.context.globalScale = scale;
	},	

	debugrun: function() {
		var t1 = new Date(), t2, debugstr='', br, du1, du2, dd, ar, p, t, brp, dup1, dup2, ddp, arp, pp;
		ig.Timer.step();
		this.tick = this.clock.tick();		
		t2 = new Date();
		br = t2-t1;
		t1 = t2;
		
		//this.delegate.run();
		ig.world.Step( ig.system.tick, 5 );
		t2 = new Date();
		du1 = t2-t1;
		t1 = t2;
		this.delegate.update();
		t2 = new Date();
		du2 = t2-t1;
		t1 = t2;

		this.delegate.draw();
		t2 = new Date();
		dd = t2-t1;
		t1 = t2;

		ig.input.clearPressed();
		
		if( this.newGameClass ) {
			this.setGameNow( this.newGameClass );
			this.newGameClass = null;
		}
		t2 = new Date();
		ar = t2-t1;
		t1 = t2;
		
		this.context.present();
		t2 = new Date();
		p = t2-t1;
		t1 = t2;
		
		t = br+du1+du2+dd+br+p;
		brp = Math.floor(br/t*100);
		dup1 = Math.floor(du1/t*100);
		dup2 = Math.floor(du2/t*100);
		ddp = Math.floor(dd/t*100);
		arp = Math.floor(ar/t*100);
		pp = Math.floor(p/t*100);
		
		debugstr+=('prerun:' + brp);
		debugstr+=('% delup1:' + dup1);
		debugstr+=('% delup2:' + dup2);
		debugstr+=('% deldraw:' + ddp);
		debugstr+=('% postrun:' + arp);
		debugstr+=('% present:' + pp);
		debugstr+=('% total:' + t);
		//console.log(debugstr);
	},

	run: function() {
		//this.debugrun();

		this.parent();
		this.context.present();
	}
	
});


});
