export interface ServerState {
  debugData?: { vertices: Record<number, number>; colors: Record<number, number> }
  connectionIds: string[]
  cubes: Record<
    string,
    {
      position: { x: number; y: number; z: number }
      rotation: { x: number; y: number; z: number }
      color: number
    }
  >
}

export interface ClientEvent {
  type: 'move'
}

export interface ClientEventMove extends ClientEvent {
  type: 'move'
  controls: ControlsState
}
export interface ControlsState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}
