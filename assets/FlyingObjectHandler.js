var self = null;
cc.Class({
    extends: cc.Component,

    properties: {
        projectilePrefab: {
            default: null,
            type: cc.Prefab
        },
        boxesPrefab: {
            default: null,
            type: cc.Prefab
        },
        TargetPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    resetBtn() {
        self.projectile.destroy();
        self.projectile = null;
        self.projectile = cc.instantiate(self.projectilePrefab);
        self.projectile.parent = self.node;
        self.box1.destroy();
        self.box1 = null;
        self.box2.destroy();
        self.box2 = null;
        self.target.destroy();
        self.target = null;
        self.instantiateObjs();
    },

    instantiateObjs() {
        self.box1 = cc.instantiate(self.boxesPrefab);
        self.box1.parent = self.node;
        self.box1.setPosition(247.394, -172.101);

        self.box2 = cc.instantiate(self.boxesPrefab);
        self.box2.parent = self.node;
        self.box2.setPosition(247.394, -83.362);

        self.target = cc.instantiate(self.TargetPrefab);
        self.target.parent = self.node;
        self.target.setPosition(250.084, 0);

    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

        self = this;

        self.instantiateObjs();
        self.projectile = cc.instantiate(self.projectilePrefab);
        self.projectile.parent = self.node;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;

        console.log("current Pos ", self.startPos);
        console.log("projectile rigidbody ", self.projectile.getComponent(cc.RigidBody));
        // self.lastPos = self.node.getPosition();
        self.node.on(cc.Node.EventType.TOUCH_START, self.onTouchStartCallback, self, true);
        self.node.on(cc.Node.EventType.TOUCH_END, self.onTouchEndCallback, self, true);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, self.onTouchMoveCallback, self, true);

    },
    onTouchStartCallback(event) {
        self.startPos = this.node.convertToNodeSpaceAR(
            new cc.Vec2(event.getLocation().x, event.getLocation().y));
        self.currentPos = self.startPos;
        console.log("startPos ", self.startPos);
    },

    onTouchMoveCallback(event) {
        // let projectileLastPos = this.projectile.getPosition();
        let lastWorldPos = new cc.Vec2(self.currentPos.x, self.currentPos.y);
        self.currentPos = this.node.convertToNodeSpaceAR(
            new cc.Vec2(event.getLocation().x, event.getLocation().y));
        console.log("lastWorldPos ", lastWorldPos.x, lastWorldPos.y, ", currentPos ",
            self.currentPos.x, self.currentPos.y);
        let xMove = ((lastWorldPos.x - self.currentPos.x) / 10);
        let yMove = ((lastWorldPos.y - self.currentPos.y) / 10);
        console.log("xMove ", xMove, ", yMove ", yMove);
        // console.log("projectile Prev Pos ", this.projectile.x, this.projectile.y);
        let newProjectilePos = new cc.Vec2(this.projectile.x - xMove, this.projectile.y - yMove);
        // console.log("projectile new Pos ", newProjectilePos.x, newProjectilePos.y);
        this.projectile.setPosition(newProjectilePos);
    },

    onTouchEndCallback(event) {
        self.lastPos = this.node.convertToNodeSpaceAR(
            new cc.Vec2(event.getLocation().x, event.getLocation().y));
        console.log("lastPos ", self.lastPos);
        let impulseX = (self.startPos.x - self.lastPos.x) * 1.4;
        let impulseY = (self.startPos.y - self.lastPos.y) * 1.4;
        let impulseVec = new cc.Vec2(impulseX, impulseY);
        console.log("impulse ", impulseVec);
        self.launchProjectile(impulseVec);
    },

    update(dt) {

    },

    launchProjectile(impulseVec) {
        console.log("launcProjectile ");
        self.projectile.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        self.projectile.getComponent(cc.RigidBody).applyLinearImpulse(impulseVec,
            self.projectile.getComponent(cc.RigidBody).getWorldCenter(), false);

    },

    start() {

    },

    // update (dt) {},
});
