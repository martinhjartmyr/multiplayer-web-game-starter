import * as THREE from 'three'

export function createCube(connectionId: string, color: number): THREE.Mesh {
  const size = 1.0
  const cubeMaterial = new THREE.MeshStandardMaterial({ color })
  const cubeGeometry = new THREE.BoxGeometry(size, size, size)
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.name = `cube-${connectionId}`
  return cube
}
