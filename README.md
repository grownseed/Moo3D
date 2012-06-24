Moo3D
=====

Moo3D and Moo3DFx - MooTools classes that help render basic 3D with JavaScript and an Fx based class to go with it

How to use
----------

**Create a new scene:**

    var scene = new Moo3D();

You can also pass in some options:

*to tilt the scene*

    rotationAxis: {x: 0, y: 0, z: 0}

*position the camera*

    camera: {x: 0, y: 0, z: 0, focalLength: 0}

*offset points in 2D*

    origins: {x: 0, y: 0}

--------------------------------------------------------------------

**Add points:**

    var points = [];

    //Add all images as points
    $$('img').each(function(image, i)
    {
        var image_width = image.width,
            image_height = image.height;

        points.push(
        {
            //the element to apply the transformation to
            element: image,
            //3D coordinates
            x: 0 - image_width / 2,
            y: 0 - 50,
            z: i * distance,
            //can be a simple string or a function
            modifiers:
            {
                'left': function(){return this.projection.x + scene.options.origins.x;},
                'top': function(){return this.projection.y + scene.options.origins.y;},
                'width': function(){return this.projection.scale * image_width},
                'height': function(){return this.projection.scale * image_height},
                'opacity': function(){return this.projection.scale.limit(0, 1);},
                'z-index': function(){return Math.round(this.projection.scale * 100);}
            }
        });
    });

    //Add points to scene
    scene.add(points);

Your modifiers can make use of the following projection properties through ``this.projection``:

    this.projection = {x, y, depth, scale}

--------------------------------------------------------------------

**Update the scene**

Render the whole scene:

    scene.render();

You can also only render certain points:

    scene.render(points);

--------------------------------------------------------------------

**Using effects**

A simple effect:

    var myEffect = new Moo3DFx(myPoint, scene, {});
    myEffect.start({x: 10, y: 50});

Options:

On top of options inherited from ``Fx``, you also have ``renderPoints``, if ``true`` (default),
will only render the scene on the passed in points

You can essentially use Moo3DFx on any object with ``{x, y, z}`` properties, for instance:

    var sceneFx = new Moo3DFx(scene.options.rotationAxis, scene,
    {
        duration: 1200,
        transition: Fx.Transitions.Elastic.easeOut,
        wait: true,
        //since it's not a real point, we want to render everything
        renderPoints: false
    });

--------------------------------------------------------------------

**Please look at the examples in the Examples folder to get a better idea:**
 - Moo3D: move your mouse around to see the changes
 - Moo3DFx: click anywhere to make the carousel rotate
 - Seeders: a game interface concept, use bottom right corner pad

All the Examples' code contains comments to explain usage of the two classes Moo3D() and Moo3DFx()
