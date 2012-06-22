/*
Moo3DFx - MooTools Fx based class for Moo3D
Copyright (C) 2010 Hadrien Jouet @ Grownseed

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
 ---
 description: Moo3DFx - MooTools Fx based class for Moo3D

 license: MIT-style

 authors:
 - Hadrien Jouet

 requires:
 - MooTools 1.4
 - Fx

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
			this.fireEvent('onComplete', this.element, 10);
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
		Object.each(this.points, function(point, i)
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