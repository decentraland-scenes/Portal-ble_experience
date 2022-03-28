// Config
export enum PortalColor {
  Blue = 0,
  Orange = 1
}

const HEIGHT_ABOVE_GROUND = 1.2 // In meters

export class Portal extends Entity {
  public cameraTarget: Vector3 = Vector3.Zero() // Direction the player should be facing after teleporting

  constructor(model: GLTFShape) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(
      new AnimationState('Expand', { looping: false })
    )
  }

  playAnimation() {
    this.getComponent(Animator).getClip('Expand').stop() // Bug workaround
    this.getComponent(Animator).getClip('Expand').play()
  }
  spawn(position: Vector3, rotation: Quaternion, cameraTarget: Vector3) {
    this.addComponentOrReplace(new Transform()) // Reset the Transform component
    const transform = this.getComponent(Transform)
    transform.rotation = rotation
    transform.position = position
    this.cameraTarget = cameraTarget

    this.playAnimation()
  }
}

export class DummyEnt extends Entity {
  cameraTarget: Vector3
  constructor(position: Vector3, hitNormal: Vector3) {
    super()
    engine.addEntity(this)

    this.addComponent(new Transform({}))

    this.getComponent(Transform).lookAt(hitNormal)

    this.getComponent(Transform).position = position

    if (this.getComponent(Transform).position.y <= HEIGHT_ABOVE_GROUND)
      this.getComponent(Transform).position.y = HEIGHT_ABOVE_GROUND // Make sure the portal is above ground height

    this.cameraTarget = this.getComponent(Transform).position.add(hitNormal)
    // this.getComponent(Transform).rotate(new Vector3(0, 0, 1), 180)
    // this.getComponent(Transform).rotate(new Vector3(0, 1, 0), 180)
  }
}
