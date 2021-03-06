
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level3', 'assets/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/maps/cybernoid.png', 16, 16);
    game.load.image('phaser', 'assets/sprites/phaser-ship.png');

}

var map;
var tileset;
var layer;
var cursors;
var overlap;
var sprite;

function create() {

    game.stage.backgroundColor = '#3d3d3d';

    //  A Tilemap object just holds the data needed to describe the map (i.e. the json exported from Tiled, or the CSV exported from elsewhere).
    //  You can add your own data or manipulate the data (swap tiles around, etc) but in order to display it you need to create a TilemapLayer.
    map = new Phaser.Tilemap(game, 'level3');

    //  A Tileset is a single image containing a strip of tiles. Each tile is broken down into its own Phaser.Tile object on import.
    //  You can set properties on the Tile objects, such as collision, n-way movement and meta data.
    //  A Tilemap uses a Tileset to render. The indexes in the map corresponding to the Tileset indexes.
    //  This way multiple levels can share the same single Tileset without requiring one each.
    tileset = game.cache.getTileset('tiles');
    
    //  Basically this sets EVERY SINGLE tile to fully collide on all faces
    tileset.setCollisionRange(0, tileset.total - 1, true, true, true, true);

    //  And this turns off collision on the only tile we don't want collision on :)
    tileset.setCollision(6, false, false, false, false);
    tileset.setCollision(31, false, false, false, false);
    tileset.setCollision(34, false, false, false, false);
    tileset.setCollision(35, false, false, false, false);
    tileset.setCollision(46, false, false, false, false);

    //  A TilemapLayer consists of an x,y coordinate (position), a width and height, a Tileset and a Tilemap which it uses for map data.
    //  The x/y coordinates are in World space and you can place the tilemap layer anywhere in the world.
    //  The width/height is the rendered size of the layer in pixels, not the size of the map data itself.

    //  This one gives tileset as a string, the other an object
    layer = new Phaser.TilemapLayer(game, 0, 0, 800, 600, tileset, map, 0);
    // layer = new Phaser.TilemapLayer(game, 0, 0, 400, 200, tileset, map, 0);
    // layer.sprite.scale.setTo(2, 2);

    // layer.sprite.anchor.setTo(0.5, 0.5);

    layer.resizeWorld();

    game.world.add(layer.sprite);

    //  This is a bit nuts, ought to find a way to automate it, but it looks cool :)
    map.debugMap = [ '#000000', 
        '#e40058', '#e40058', '#e40058', '#80d010', '#bcbcbc', '#e40058', '#000000', '#0070ec', '#bcbcbc', '#bcbcbc', '#bcbcbc',
        '#bcbcbc', '#bcbcbc', '#e40058', '#e40058', '#0070ec', '#0070ec', '#80d010', '#80d010', '#80d010', '#bcbcbc', '#bcbcbc', 
        '#bcbcbc', '#80d010', '#80d010', '#80d010', '#0070ec', '#0070ec', '#80d010', '#80d010', '#80d010', '#80d010', '#0070ec',
        '#0070ec', '#24188c', '#24188c', '#80d010', '#80d010', '#80d010', '#bcbcbc', '#80d010', '#80d010', '#80d010', '#e40058',
        '#e40058', '#bcbcbc', '#e40058', '#bcbcbc', '#e40058', '#bcbcbc', '#80d010', '#bcbcbc', '#80d010', '#000000', '#80d010', 
        '#80d010', '#80d010', '#bcbcbc', '#e40058', '#80d010', '#80d010', '#e40058', '#e40058', '#bcbcbc', '#bcbcbc', '#bcbcbc',
        '#0070ec', '#0070ec', '#bcbcbc', '#bcbcbc', '#0070ec', '#0070ec', '#bcbcbc', '#bcbcbc', '#bcbcbc', '#bcbcbc', '#bcbcbc', 
        '#bcbcbc', '#bcbcbc'
    ];

    // map.dump();

    // layer.sprite.scale.setTo(2, 2);

    //  Works a treat :)
    // game.add.sprite(320, 0, layer.texture, layer.frame);
    // game.add.sprite(0, 200, layer.texture, layer.frame);
    // game.add.sprite(320, 200, layer.texture, layer.frame);

    // game.world.setBounds(0, 0, 2000, 2000);
    // game.camera.x = 400;

    sprite = game.add.sprite(450, 80, 'phaser');
    sprite.anchor.setTo(0.5, 0.5);
    // sprite.x = 140;
    // sprite.y = 40;

    //sprite.scale.setTo(2, 2);

    // sprite.body.gravity.y = 100;
    // sprite.body.bounce.x = 0.5;
    // sprite.body.bounce.y = 0.2;

    game.camera.follow(sprite);
    game.camera.deadzone = new Phaser.Rectangle(160, 160, layer.renderWidth-320, layer.renderHeight-320);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    layer.update();

    //    getTiles: function (x, y, width, height, collides, layer) {
    overlap = layer.getTiles(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height, true);

    if (overlap.length > 1)
    {
        for (var i = 1; i < overlap.length; i++)
        {
            game.physics.separateTile(sprite.body, overlap[i]);
        }
    }

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.up.isDown)
    {
         sprite.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 150;
    }

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -150;
        sprite.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 150;
        sprite.scale.x = 1;
    }


}

function render() {

    layer.render();

    // game.debug.spriteBody(sprite);

    // game.debug.spriteInfo(sprite, 32, 450);

    // game.debug.cameraInfo(game.camera, 32, 32);

    /*
    game.context.save();
    game.context.setTransform(1, 0, 0, 1, 0, 0);


    game.context.fillStyle = 'rgba(255, 0, 0, 0.5)';

    if (overlap.length > 1)
    {
        var x = 0;
        var y = 0;

        for (var i = 1; i < overlap.length; i++)
        {
            game.context.drawImage(
                overlap[i].tile.tileset.image,
                overlap[i].tile.x,
                overlap[i].tile.y,
                overlap[i].tile.width,
                overlap[i].tile.height,
                0 + (x * overlap[i].tile.width),
                420 + (y * overlap[i].tile.height),
                overlap[i].tile.width,
                overlap[i].tile.height
            );

            if (overlap[i].tile.collideNone == false)
            {
                game.context.fillRect(0 + (x * overlap[i].tile.width), 420 + (y * overlap[i].tile.height), overlap[i].tile.width, overlap[i].tile.height);
            }

            x++;

            if (x == overlap[0].tw)
            {
                x = 0;
                y++;
            }
        }
    }

    game.context.restore();
    */

    // game.debug.geom(game.camera.deadzone, 'rgba(0,200,0,0.5)');

}
