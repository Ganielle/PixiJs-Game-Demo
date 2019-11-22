let b = new Bump(PIXI);
let c = new Bump(PIXI);
let _w = 800;
let _h =522;

let canvas = document.getElementById("game-canvas");

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new PIXI.Renderer({
    view: canvas,
    width: _w,
    height: _h
});


//world
let tutscontainer = new PIXI.Container(), groundContainer = new PIXI.Container();
const stage = new PIXI.Container();
const healthbar = new PIXI.Container();

let ticker = new PIXI.Ticker();
let loader = PIXI.Loader.shared;

loader.add("./sprites/mc/animations/mcanimation.json")
    .add("./sprites/enemy/enemy.json")
    .load(mainGame);

    
    let character = {
        x: 0, y: 0,
        vx: 0, vy: 0,
        rightB: true, leftB: false,
        idle: true, walking: false,
        jumping: false, health: 3 
    };

    let movementspeed = 0.0;
    
    let tileTextures = [], tileSize = 16;

    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");
        attack = keyboard("z");
        space = keyboard("spacebar");


    // 14 width, 16 height
    let groundTexture = new PIXI.Texture.from("./world/ground/ground.png");

    for(var i = 0 ; i < 14 * 16; i++){
        let x = i  % 14;
        let y = Math.floor(i / 14);
        tileTextures[i] = new PIXI.Texture(groundTexture,
            new PIXI.Rectangle(x * tileSize, y * tileSize, tileSize, tileSize)
            );
    }

    let floor = {
        width: 118,
        height: 13,
        tiles: [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,174,140,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,114,115,116,117,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,176,177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,129,130,131,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,85,190,191,176,177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,170,171,223,223,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,66,67,68,69,112,113,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,200,201,202,203,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,78,79,78,79,85,0,0,0,0,0,0,0,0,0,0,0,0,84,78,79,78,79,78,79,84,85,0,0,0,0,0,114,115,120,121,96,97,126,127,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,214,215,216,217,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98,99,0,0,0,78,79,128,129,134,135,110,111,180,171,87,78,79,78,79,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            119,125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,142,143,223,223,180,171,194,185,81,125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            223,138,125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,78,79,78,79,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,157,223,223,194,185,223,223,138,138,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            223,223,139,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,142,143,223,223,223,223,223,223,152,0153,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            223,223,138,118,119,118,119,118,119,118,119,120,121,118,119,118,119,90,91,92,93,118,119,118,119,120,121,92,93,90,124,125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,156,157,223,223,223,223,223,223,166,167,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,174,175,176,177,176,177,
            223,223,195,183,184,183,184,183,184,183,184,183,184,183,184,183,184,183,184,183,184,183,184,183,184,183,184,183,184,183,138,139,90,91,90,91,94,95,96,97,56,57,86,87,88,89,90,91,90,91,118,119,90,91,96,97,56,57,86,87,88,89,90,91,96,97,56,57,56,57,86,87,88,89,90,91,92,93,170,171,223,223,223,223,223,223,180,181,86,87,88,89,90,91,92,93,94,95,90,91,88,89,90,91,92,93,94,95,90,91,92,93,94,95,170,171,223,223,
            223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,223,194,193,104,105,104,105,108,109,110,111,70,71,100,101,102,103,104,105,104,105,132,133,104,105,110,111,70,71,100,101,182,183,104,105,110,111,70,71,70,71,100,101,102,103,104,105,106,107,184,185,223,223,223,223,223,223,194,195,100,101,102,103,104,105,106,107,108,109,104,105,102,103,104,105,106,107,108,109,104,105,106,107,108,109,184,185,223,223
        ],
        collisions: [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
        ]
    };

    //music
    let bg_music = new Audio();
    let bg_ambiance = new Audio();
    let go_music = new Audio();
    let battle_music = new Audio();
    let victory_music = new Audio();
    let damage_music = new Audio();

    let tileScale = 2.5;

    
    let state = true;

function mainGame(){

    bg_ambiance.src = "./sounds/forest_ambiance.mp3";
    bg_music.src = "./sounds/forest_bg.mp3";
    go_music.src = "./sounds/gameOver.mp3";
    battle_music.src = "./sounds/battleTheme.mp3";
    victory_music.src = "./sounds/victory.mp3";
    damage_music.src = "./sounds/damage.mp3";

    bg_ambiance.play();
    bg_music.play();
    bg_ambiance.loop = true;
    bg_music.loop = true;

    //world
    var farTexture = PIXI.Texture.from("./world/stage1/Backdrop_1.png");
    far = new PIXI.TilingSprite(farTexture,23600,2688);
    var midTexture = PIXI.Texture.from("./world/stage1/Backdrop_2.png");
    mid = new PIXI.TilingSprite(midTexture,23600,2688);
    var nearTexture = PIXI.Texture.from("./world/stage1/Backdrop_3.png");
    near = new PIXI.TilingSprite(nearTexture,23600,2688);
    
    far.tilePosition.x = 0;
    far.tilePosition.y = 0;
    mid.tilePosition.set(0,0);
    near.tilePosition.set(0,0)

    //ground
    for(let x = 0; x < floor.width; x++){
        for(let y = 0; y < floor.width; y++){
            let tile = floor.tiles[y * floor.width + x];
            let spritefloor = new PIXI.Sprite(tileTextures[tile]);
            spritefloor.x = x * tileSize;
            spritefloor.y = y * tileSize;
            groundContainer.addChild(spritefloor);
        }
    }

    groundContainer.scale.x = tileScale;
    groundContainer.scale.y = tileScale;

    tutscontainer.addChild(far,mid,near);
    
    tutscontainer.scale.x = 0.2;
    tutscontainer.scale.y = 0.28;

    tutscontainer.position.set(0,-220);

    stage.addChild(tutscontainer,groundContainer);
    renderer.render(stage);

    //health
    let fHealth = PIXI.Texture.from("./health bar/health-3.png");
    let THealth = PIXI.Texture.from("./health bar/health-2.png");
    let OHealth = PIXI.Texture.from("./health bar/health-1.png");
    let NHealth = PIXI.Texture.from("./health bar/health-0.png");

    health = new PIXI.Sprite(fHealth);
    
    healthbar.addChild(health);
    healthbar.width = 300;
    healthbar.height = 90;
    stage.addChild(healthbar);
    
    renderer.render(stage);

    //gameOver Screen
    let go = PIXI.Texture.from("./world/gameOver.jpg");
    gameOver = new PIXI.Sprite(go);
    gameOver.alpha = 0;

    gameOver.width = _w;
    gameOver.height = _h;

    stage.addChild(gameOver);

    renderer.render(stage);

    //victory screen
    let vtory = PIXI.Texture.from("./world/victory.jpg");
    victory = new PIXI.Sprite(vtory);
    victory.alpha = 0;

    victory.width = _w;
    victory.height = _h;

    stage.addChild(victory);

    renderer.render(stage);

    //animation

    //main character
    let sheet = PIXI.Loader.shared.resources["./sprites/mc/animations/mcanimation.json"].spritesheet;
    anim = new PIXI.AnimatedSprite(sheet.animations["idle"]);
    anim.scale.x = 0.19;
    anim.scale.y = 0.19;
    anim.animationSpeed = 0.1;
    anim.position.x = character.x + 100;

    //enemy
    let enemySheet = PIXI.Loader.shared.resources["./sprites/enemy/enemy.json"].spritesheet;
    enemyanim = new PIXI.AnimatedSprite(enemySheet.animations["sprite"]);
    enemyanim.scale.x = 0.3;
    enemyanim.scale.y = 0.3;
    enemyanim.position.x = 4387;
    enemyanim.position.y = 375;
    enemyanim.animationSpeed = 1.5;

    let enemy = {
        rightB: false, leftB: true,
        heatlh: 10
    };

//render all the mc animation, force, collision detection, camera movement and gravity
    ticker.add((time) =>{
        //battle mode
        if(anim.position.x > 3531){
            bg_music.pause();
            battle_music.play();
            battle_music.loop = true;

            //enemy movements
            if(enemyanim.position.x == 4387){
                enemy.rightB = false;
                enemy.leftB = true;
            }
            //min. velocity of player position
            if(enemyanim.position.x == 3757){
                enemy.leftB = false;
                enemy.rightB = true;
            }
            
            if(enemy.leftB){
                enemyanim.position.x -= 6;
                enemyanim.scale.x = 0.3;
            }
            if(enemy.rightB){
                enemyanim.position.x += 3;
                enemyanim.scale.x = -0.3;
            }

            //enemy and player damage
            if(b.hit(anim,enemyanim)){
                character.health -= 1;
                damage_music.play();
                if(character.rightB){
                    character.vx = -5;
                    character.vy = -5;
                }
                if(character.leftB){
                    character.vx = 5;
                    character.vy = 5;
                }
            }

        }


        //health check
        if(character.health == 3){
            health.texture = fHealth;
        }
        if(character.health == 2){
            health.texture = THealth;
        }
        if(character.health == 1){
            health.texture = OHealth;
        }
        if(character.health <= 0){
            health.texture = NHealth;
            if(gameOver.alpha < 1){
                anim.alpha -= .01;
                enemyanim.alpha -=.01;
                gameOver.alpha += .01;
            }
        }

        //enemy health check
        if(anim.position.x == 4710){
            console.log("hi");
            if(victory.alpha < 1){
                anim.alpha -= .01;
                enemyanim.alpha -=.01;
                victory.alpha += .01;
            }
        }

        console.log(enemy.heatlh);
        
        if(gameOver.alpha == 1.0000000000000007){
            ticker.destroy();
            bg_music.pause();
            bg_ambiance.pause();
            bg_ambiance.currentTime = 0;
            bg_music.currentTime = 0;
            go_music.play();
        }
        if(victory.alpha == 1.0000000000000007){
            bg_music.pause();
            bg_ambiance.pause();
            battle_music.pause();
        }


        //movements
        anim.position.x = character.x;
        anim.position.y = character.y; 
        character.vy = Math.min(12, character.vy + 1)
        
        let touchingGround = testCollision(
            character.x + tileScale,
            character.y + anim.height * anim.scale.y * tileScale + 1
        ) || testCollision(
            character.x + anim.width * anim.scale.x - tileScale,
            character.y + anim.height * anim.scale.y * tileScale + 1
        );

        //spike damage

        //3rd spike
        if(spikeDamge(anim.position.x, anim.position.y)){
            damage_music.play();
            character.health -= 1;
            if(character.rightB){
                character.vx = -5;
                character.vy = -5;
            }
            if(character.leftB){
                character.vx = 5;
                character.vy = 5;
            }
        }
        

        //collision on y axis
        if(character.vy > 0){
            for(let i = 0; i < character.vy; i++){
                let testX1 = character.x;
                let testX2 = character.x + anim.width * anim.scale.x - tileScale;
                let testY = character.y + anim.height * anim.scale.y * tileScale;
                if(testCollision(testX1,testY) || testCollision(testX2,testY)){
                    character.vy = 0;
                    break;
                }
                character.y = character.y + 1;
            }
        }
        if (character.vy < 0) {
            for (let i = character.vy; i < 0; i++) {
                let testX1 = character.x + tileScale;
                let testX2 = character.x + anim.height * anim.scale.x - tileScale;
                let testY = character.y + tileScale;
                if (testCollision(testX1, testY) || testCollision(testX2, testY)) {
                    character.vy = 0;
                    break;
                }
                character.y = character.y - 1;
            }
        }

        if(character.vx > 0){
            for (let i = 0; i < character.vx; i++) {
                let testX = character.x + anim.width * anim.scale.x - tileScale;
                let testY1 = character.y + 5;
                let testY2 = character.y + anim.height * anim.scale.y;
                let testY3 = character.y + anim.height * anim.scale.y * tileScale - 1;
                if (testX >= floor.width * tileSize * tileScale || testCollision(testX, testY1) || testCollision(testX, testY2) || testCollision(testX, testY3)) {
                    character.vx = 0;
                    far.position.x = 0;
                    mid.position.x = 0;
                    near.position.x = 0;
                    break;
                }
                if(anim.position.x > 403 && anim.position.y > 377){
                    far.tilePosition.x += 1.5;
                    mid.tilePosition.x += 1;
                    near.tilePosition.x += 0.5;
                };
                character.x +=  2;
            }
        }

        if (character.vx < 0) {
            character.direction = 1;
            for (let i = character.vx; i < 0; i++) {
                let testX = character.x + 1;
                let testY1 = character.y + 5;
                let testY2 = character.y + anim.height *  anim.scale.y;
                let testY3 = character.y + anim.height *  anim.scale.y * tileScale - 1;
                if (testX < 0 || testCollision(testX, testY1) || testCollision(testX, testY2) || testCollision(testX, testY3)) {
                    character.vx = 0;
                    far.position.x = 0;
                    mid.position.x = 0;
                    near.position.x = 0;
                    break;
                }
                if(anim.position.x > 403 && anim.position.y > 377){
                    far.tilePosition.x -= 1.5;
                    mid.tilePosition.x -= 1;
                    near.tilePosition.x -= 0.5;
                };
                character.x -=  2;
            }
        }

         //controls
        left.press = () =>{
            stage.removeChild(anim);
            anim = new PIXI.AnimatedSprite(sheet.animations["walking"]);
            anim.animationSpeed = 0.2;
            anim.scale.x = -0.19;
            anim.scale.y = 0.19;
            character.vx = -3;
            character.leftB = true;
            character.rightB = false;
        };
        left.release = () =>{
            stage.removeChild(anim);
            anim = new PIXI.AnimatedSprite(sheet.animations["idle"]);
            anim.animationSpeed = 0.1;
            anim.scale.x = -0.19;
            anim.scale.y = 0.19;
            character.vx = 0;
        };

        right.press = () => {
            stage.removeChild(anim);
            anim = new PIXI.AnimatedSprite(sheet.animations["walking"]);
            anim.animationSpeed = 0.2;
            anim.scale.x = 0.19;
            anim.scale.y = 0.19;
            character.vx = 3;
            character.leftB = false;
            character.rightB = true;
        };
        right.release = () =>{
            stage.removeChild(anim);
            anim = new PIXI.AnimatedSprite(sheet.animations["idle"]);
            anim.animationSpeed = 0.1;
            anim.scale.x = 0.19;
            anim.scale.y = 0.19;
            character.vx = 0;
        };

        up.press = () =>{
            if(touchingGround && character.jumping){
                character.jumping = false;
            }
            if(touchingGround && !character.jumping){
                character.vy = -19;
                character.jumping = true;
            }
        };
        up.release = () =>{
            if(touchingGround && character.jumping){
                character.jumping = false;
            }
        };

        attack.press = () =>{
            stage.removeChild(anim);
            anim = new PIXI.AnimatedSprite(sheet.animations["attack1"]);
            anim.animationSpeed = 0.3;
            if(character.rightB){
                anim.scale.x = 0.19;
                anim.scale.y = 0.19;
            }
            if(character.leftB){
                anim.scale.x = -0.19;
                anim.scale.y = 0.19;
            }
        };
        attack.release = () =>{
            stage.removeChild(anim);
            anim = new PIXI.AnimatedSprite(sheet.animations["idle"]);
            anim.animationSpeed = 0.1;
            if(character.rightB){
                anim.scale.x = 0.19;
                anim.scale.y = 0.19;
            }
            if(character.leftB){    
                anim.scale.x = -0.19;
                anim.scale.y = 0.19;
            }
        }
        anim.play();
        enemyanim.play();
        stage.addChild(enemyanim);
        stage.addChild(anim);

        if(anim.position.x < 3758){
            battle_music.pause();
            battle_music.currentTime = 0;
            bg_music.play();
        }
        
        
        //camera
        stage.position.set(_w / 2, _h / 2 + 105);
        healthbar.position.x = stage.pivot.x - 400;
        healthbar.position.y = stage.pivot.y - 350;
        gameOver.position.set(stage.pivot.x - (_w / 2),stage.pivot.y - (_h / 2 + 105))
        victory.position.set(stage.pivot.x - (_w / 2),stage.pivot.y - (_h / 2 + 105))
        if(anim.position.x < 403 && anim.position.y < 377){
            stage.pivot.set(400,366);
            healthbar.pivot.set(_w / 2 - 405, _h / 2 - 260);
        }
        if(anim.position.x > 403 && anim.position.y > 377){
            stage.pivot.set(anim.position.x, 366);
        }
        if(anim.position.x > 403 && anim.position.y < 377){
            stage.pivot.copyFrom(anim.position);
        }
        if(anim.position.x > 4311 && anim.position.y < 407){
            stage.pivot.set(4312,366);
        }
        if((anim.position.x > 1637 && anim.position.x < 3627) && anim.position.y < 207){
            stage.pivot.set(anim.position.x, 200);
        }


        renderer.render(stage);
    });
    ticker.start();

}


function spikeDamge(posX,posY){
    if((posX > 2665 && posX < 2779) && posY == 406){
        return true;
    }
    if((posX > 2245 && posX < 2298) && posY == 406){
        return true;
    }
    if((posX > 1625 && posX < 1656) && posY == 406){
        return true;
    }
    return false;
}

function testCollision(worldX,worldY){
    let mapX = Math.floor(worldX / tileSize / tileScale);
    let mapY = Math.floor(worldY / tileSize / tileScale);
    return floor.collisions[mapY * floor.width + mapX];
}

//keyboard bindings
function keyboard(value){
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
        
    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );
        
    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };
    return key;
}




//jquery reset button
// $(document).ready(function(){

//     $("#reset").click
// });