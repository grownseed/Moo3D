/*
 ---
 description: Moo3DFx - MooTools Fx based class for Moo3D

 license: MIT-style

 authors:
 - Hadrien Jouet

 requires:
 - MooTools 1.4
 - Options
 - Moo3D

 provides: [Moo3DFx]

 */

var Moo3DFx = new Class(
{
	Extends: Fx,
	
	options:
	{
		renderPoints: true
	},
	
	initialize: function(points, scene, options)
	{
		this.points = (points.push ? points : [points]);
		this.scene = scene;
		this.parent(options);
	},
	
	step: function(now)
	{
		if (this.options.frameSkip)
		{
			var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
			this.time = now;
			this.frame += frames;
		}else{
			this.frame++;
		}

		if (this.frame < this.frames)
		{
			this.delta = this.transition(this.frame / this.frames);
			this.setNow();
			this.increase();
		}else{
			this.frame = this.frames;
			this.set(this.to_list);
			this.fireEvent('complete', this.element, 10);
			this.stop();
		}
	},
	
	set: function(to_list)
	{
		this.now_list = to_list;
		
		this.increase();
		
		return to_list;
	},
	
	setNow: function()
	{
		for (var i = 0; i < this.points.length; i++)
		{
			Object.each(this.from, function(p, j)
			{
				this.now_list[i][j] = this.compute(this.from_list[i][j], this.to_list[i][j], this.delta);
			}.bind(this));
		}
	},
	
	start: function(obj)
	{
		if (!this.check(obj)) return this;
		
		this.transition = this.getTransition();
		
		this.from_list = [];
		this.to_list = [];
		this.now_list = [];
		this.obj_list = [];
		
		for (var i = 0; i < this.points.length; i++)
		{
			this.now_list[i] = {};
			this.from_list[i] = {};
			this.to_list[i] = {};
			
			this.obj_list[i] = obj;
			
			Object.each(obj, function(p, j)
			{
				this.from_list[i][j] = this.points[i][j];
				this.to_list[i][j] = this.points[i][j] + this.obj_list[i][j];
			}.bind(this));
			
			this.parent(this.from_list[i], this.to_list[i]);
		}
		
		return this;
	},

	increase: function()
	{
		this.points.each(function(point, i)
		{
			Object.each(this.now_list[i], function(p, j){ this.points[i][j] = this.now_list[i][j]; }.bind(this));
		}.bind(this));
		
		if (this.scene)
		{
			if (this.options.renderPoints)
				this.scene.render(this.points);
			else
				this.scene.render();
		}
	}
});