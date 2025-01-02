import RAPIER from '@dimforge/rapier3d-compat'
export interface Cube {
  body: RAPIER.RigidBody
  collider: RAPIER.Collider
  color: number
}

export function createCube(world: RAPIER.World): Cube {
  // Create a dynamic rigidBody with a random position
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    Math.random() * 10.0 - 5.0,
    10.0,
    Math.random() * 10.0 - 5.0,
  )
  const rigidBody = world.createRigidBody(rigidBodyDesc)

  // Create a cuboid collider attached to the dynamic rigidBody.
  const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
  const collider = world.createCollider(colliderDesc, rigidBody)

  // Random color
  const color = Math.floor(Math.random() * 16777215)

  return { body: rigidBody, collider, color }
}

export function removeCube(world: RAPIER.World, cube: Cube) {
  world.removeRigidBody(cube.body)
  world.removeCollider(cube.collider, true)
}
