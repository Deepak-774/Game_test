var player = function(game){
    this.game = game;
    this.player;
    this.cursor;
    this.jumpButton;
    this.flag;
};

player.prototype = {

    create: function(){ 
        this.player = game.add.sprite(game.world.centerX,game.world.centerY,'jolly',1);
        this.player.anchor.setTo(0.5,0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.setSize(25,55,0,0);
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.set(0,game.rnd.integerInRange(500,800));

        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.cursor = game.input.keyboard.createCursorKeys();

        this.yOrig = this.player.y;
        this.yChange = 0;
        this.cameraYMin = 99999;
    },

    handleBounce: function(i){
        this.player.body.bounce.set(1,i);    
    },

    update: function(){
        game.world.setBounds(0,-this.yChange,game.world.width,game.height+this.yChange);
        this.cameraYMin = Math.min(this.cameraYMin,this.player.y-game.height+300);
        game.camera.y = this.cameraYMin;
        this.handleMovement();
    },

    handleMovement: function(){
        this.standing = this.player.body.touching.down || this.player.body.blocked.down;

        var usingKeyboard = this.jumpButton.isDown || this.cursor.left.isDown || this.cursor.right.isDown;
        var pointer = game.input.activePointer;

        if (usingKeyboard) {
            // Original keyboard controls
            if(this.jumpButton.isDown && this.standing===true){
                this.player.frame = 0;
                this.player.body.velocity.y = -500;
            }
            else if(this.cursor.left.isDown){
                this.player.frame = 4;
                this.player.body.velocity.x = -150;
            }
            else if(this.cursor.right.isDown){
                this.player.frame = 3;   
                this.player.body.velocity.x = 150;
            }
            else{
                this.player.frame = 1;
                this.player.body.velocity.x = 0;
            }
        } else if (pointer.isDown) {
            // Touch controls: move left/right based on touch position, tap near top to jump
            var worldX = pointer.worldX;
            var worldY = pointer.worldY;

            // Horizontal movement
            if(worldX < this.player.x - 20){
                this.player.frame = 4;
                this.player.body.velocity.x = -150;
            } else if(worldX > this.player.x + 20){
                this.player.frame = 3;
                this.player.body.velocity.x = 150;
            } else {
                this.player.frame = 1;
                this.player.body.velocity.x = 0;
            }

            // Jump if touch is above the player and he is standing
            if (this.standing && worldY < this.player.y - 40) {
                this.player.frame = 0;
                this.player.body.velocity.y = -500;
            }
        } else {
            // No input
            this.player.frame = 1;
            this.player.body.velocity.x = 0;
        }

        // track the maximum amount that hero has traveled
        var t1 = Math.abs(this.player.y);     
        this.yChange = Math.max(Math.abs(t1+this.yOrig)+2000);
    },

    render: function(){
        game.debug.bodyInfo(this.player,32,32);
        // game.debug.body(this.player);
        //game.debug.text(this.standing,62,135); //return false when air
    }
};