class WorldDriver {
	constructor() {
		this.height = $(document).height();
		this.width = $(document).width();
		this.engine = Matter.Engine.create({
			element: document.getElementById('physics'),
		});
		this.render = Matter.Render.create({
			element: document.getElementById('physics'),
			engine: this.engine,
			options: {
				height: this.height,
				width: this.width,
				element: document.getElementById('physics')
			}

		});

		// educated guess about on mobile or not based on landscape/portrait
		this.max_body_count = (this.height > this.width) ? 50 : 150;
		this.initialize_bounds();
		this.mouse_constraint = Matter.MouseConstraint.create(this.engine, {
			element: this.render.canvas
		});
		Matter.World.add(this.engine.world, this.mouse_constraint);
		this.render.mouse = this.mouse_constraint.mouse;

		$('window').resize($.proxy(this.on_window_resize, this));

		if (this.height > this.width) {
			window.addEventListener('deviceorientation', $.proxy(this.update_gravity, this));
		}

		setTimeout(this.show_hint, 5000);
		this.run_simulation();
	}

	show_hint() {
		$('#hint').slideDown();
		setTimeout(function() {
			$('#hint').slideUp();
		}, 3500);
	}

	create_vector(multx, multy, negative) {
		multx = (multx === undefined) ? 1 : multx;
		multy = (multy === undefined) ? multx : multy;
		if (negative) {
			multx = (Math.random() > 0.5) ? multx : -1 * multx;
			multy = (Math.random() > 0.5) ? multy : -1 * multy;
		}
		return {x: Math.random() * multx, y: Math.random() * multy};
	}

	set_opts(obj, opts) {
		for (var prop in opts) {
			if (opts.hasOwnProperty(prop)) {
				obj[prop] = opts[prop];
			}
		}
		return obj;
	}

	initialize_bounds() {
		// create bounds
		var boundOpts = {isStatic: true, visible: false, render: {lineWidth: 1}};
		var lbound = Matter.Bodies.rectangle(-24, this.height/2, 50, this.height, boundOpts);
		var rbound = Matter.Bodies.rectangle(this.width + 24, this.height/2, 50, this.height, boundOpts);
		var tbound = Matter.Bodies.rectangle(this.width/2, -24, this.width, 50, boundOpts);
		var bbound = Matter.Bodies.rectangle(this.width/2, this.height + 24, this.width, 50, boundOpts);
		var bounds = [lbound, rbound, tbound, bbound];
		for (var c = 0; c < 4; c++) {
			Matter.Body.set(bounds[c],  boundOpts);
		}
		Matter.World.add(this.engine.world, bounds);
	}

	create_projectile() {
		var box = (Math.random() > 0.95) ? Matter.Bodies.rectangle(this.width/2, this.height/2, 40 + Math.random()*80, 40 + Math.random()*80) : Matter.Bodies.circle(this.width/2, this.height/2, 10 + Math.random()*20);
		floc = this.create_vector(this.height/2, this.width/2);
		floc.x += this.width/4;
		floc.y += this.height/4;
		if (Math.random() < 0.05) {
			var group = Matter.Body.nextGroup(true);
			var particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false }};
			// box = Matter.Composites.softBody(this.width/2, this.height/2, 5 + Math.random()*10, 5 + Math.random()*10, 5, true, 2, particleOptions);
			box = Matter.Composites.softBody(this.width/2, this.height/2, 3, 3, 5, 5, true, 8, particleOptions, {stiffness: 0.9});
			
		} else {
			Matter.Body.applyForce(box, floc, this.create_vector(0.01, 0.01, true));
		}
		Matter.World.add(this.engine.world, [box]);
		if (this.engine.world.bodies.length < this.max_body_count) {
			setTimeout($.proxy(this.create_projectile, this), 250);
		}
	}

	update_gravity(event) {
		var orientation = window.orientation, gravity = this.engine.world.gravity;
		if (orientation === 0) {
			gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 90;
			gravity.y = Matter.Common.clamp(event.beta, -90, 90) / 90;
		} else if (orientation === 180) {
			gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 90;
			gravity.y = Matter.Common.clamp(-event.beta, -90, 90) / 90;
		} else if (orientation === 90) {
			gravity.x = Matter.Common.clamp(event.beta, -90, 90) / 90;
			gravity.y = Matter.Common.clamp(-event.gamma, -90, 90) / 90;
		} else if (orientation === -90) {
			gravity.x = Matter.Common.clamp(-event.beta, -90, 90) / 90;
			gravity.y = Matter.Common.clamp(event.gamma, -90, 90) / 90;
		}
	}

	run_simulation() {
		Matter.Engine.run(this.engine);
		Matter.Render.run(this.render);
	}

	on_window_resize() {
		Matter.Engine.clear(this.engine);
		this.height = $(document).height();
		this.width = $(document).width();
		this.render.options.height = this.height;
		this.render.options.width = this.width;
		this.initialize_bounds();
	}

	disable_jumbo() {
		$('.fg').addClass('nonreactive');
	}
	enable_jumbo() {
		$('.fg').removeClass('nonreactive');
	}
}

var wd = new WorldDriver();
wd.create_projectile();
