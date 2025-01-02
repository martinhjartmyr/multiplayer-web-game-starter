import * as THREE from 'three'
import { createCube } from './cube'
import type { ServerState, ControlsState } from '@repo/models'

let instance: Game | undefined

export class Game {
  canvas: HTMLCanvasElement | undefined
  renderer: THREE.WebGLRenderer | undefined
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  needRender = false
  cubes: Map<string, THREE.Mesh> = new Map()
  serverState = $state<ServerState>({ connectionIds: [], cubes: {} })
  controlsState = $state<ControlsState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  static getInstance(): Game {
    if (!instance) {
      instance = new Game()
    }
    return instance
  }

  private constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 0, 0.1, 100)
    this.camera.position.set(0, 18, 4)
    this.camera.lookAt(0, 0, 0)

    $effect(() => {
      this.updateScene(this.serverState)
    })
  }

  public init(canvas: HTMLCanvasElement, viewportSize: { height: number; width: number }): void {
    this.canvas = canvas

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(viewportSize.width, viewportSize.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.scene.add(this.camera)

    // Ambient light
    const ambientLight = new THREE.AmbientLight()
    ambientLight.color = new THREE.Color(0xffffff)
    ambientLight.intensity = 12
    this.scene.add(ambientLight)

    // Add a base plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
    planeMaterial.side = THREE.DoubleSide
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    this.scene.add(plane)
  }

  public updateControls(state: ControlsState): void {
    this.controlsState = state
  }

  public updateScene(state: ServerState): void {
    if (!state.connectionIds?.length || !this.cubes) {
      return
    }
    for (const id of state.connectionIds) {
      if (this.cubes.has(id)) {
        // Update existing cubes position
        const cube = this.cubes.get(id)
        if (cube) {
          cube.position.set(
            state.cubes[id].position.x,
            state.cubes[id].position.y,
            state.cubes[id].position.z,
          )
          cube.rotation.set(
            state.cubes[id].rotation.x,
            state.cubes[id].rotation.y,
            state.cubes[id].rotation.z,
          )
        }
      } else {
        // Create new cube
        const cube = createCube(id, state.cubes[id].color)
        this.cubes.set(id, cube)
        this.scene.add(cube)
      }
    }
    // Clean up cubes that are no longer in the state
    for (const [id, cube] of this.cubes) {
      if (!state.connectionIds.includes(id)) {
        this.scene.remove(cube)
        this.cubes.delete(id)
      }
    }
    this.needRender = true
  }

  public render(): void {
    if (!this.renderer) return
    this.renderer.render(this.scene, this.camera)
  }

  public renderDebug(vertices: Record<number, number>, colors: Record<number, number>) {
    if (!vertices || !colors) {
      console.warn('No debug data to render.')
      return
    }
    const verticesArray = Object.values(vertices) as number[]
    const colorsArray = Object.values(colors) as number[]

    if (verticesArray.length === 0 || colorsArray.length === 0) {
      console.warn('No debug data to render.')
      return
    }

    // Remove existing debug object if any
    const existingDebugObject = this.scene.getObjectByName('rapierDebug')
    if (existingDebugObject) {
      this.scene.remove(existingDebugObject)
    }

    // Create BufferGeometry
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(verticesArray)
    const normalizedColors = new Float32Array(colorsArray)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(normalizedColors, 4))
    geometry.computeBoundingSphere()

    // Create material
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
    })

    // Create LineSegments and add to scene
    const lineSegments = new THREE.LineSegments(geometry, material)
    lineSegments.name = 'rapierDebug'
    this.scene.add(lineSegments)
    this.needRender = true
  }
}
