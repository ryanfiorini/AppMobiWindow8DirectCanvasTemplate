ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	size: {x: 71, y:60},
	offset: {x: 4, y: 2},
	bounciness: 1.5,
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.NONE,
	animSheet: new ig.AnimationSheet( 'media/RagingRooster.png', 71, 95 ),	
	flip: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', .08, [0,1,2,1] );
		this.vel.x=(Math.floor(Math.random()*50)+50)*(Math.random() < 0.5 ? -1 : 1);
		this.vel.y=(Math.floor(Math.random()*50)+50)*(Math.random() < 0.5 ? -1 : 1);
	},
	
	update: function() {
		this.parent();
	},

	handleMovementTrace: function( res ) {
		try{
			if( res.collision.x&&!ig.game.muted||res.collision.y&&!ig.game.muted) {
				AppMobi.context.playSound(ig.game.bounceSound);
			}
		}
		catch(e){}
		
		this.parent( res );
	}
});

});