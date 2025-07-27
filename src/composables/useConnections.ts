import { ref, computed } from 'vue'
import type { Connection, AnchorPoint, ConnectionPoint, ShapeConnectionData } from '../components/shape/types'

export function useConnections() {
    const connections = ref<Connection[]>([])
    const pendingConnection = ref<ShapeConnectionData | null>(null)
    const isConnecting = ref(false)

    const startConnection = (shapeId: string, anchor: AnchorPoint, position: ConnectionPoint) => {
        console.log('🔗 Starting connection from:', { shapeId, anchor, position })

        pendingConnection.value = {
            shapeId,
            anchor,
            position
        }
        isConnecting.value = true
    }

    const completeConnection = (targetShapeId: string, targetAnchor: AnchorPoint) => {
        if (!pendingConnection.value) {
            console.warn('No pending connection to complete')
            return null
        }

        if (pendingConnection.value.shapeId === targetShapeId) {
            console.warn('Cannot connect shape to itself')
            cancelConnection()
            return null
        }

        const newConnection: Connection = {
            id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sourceShapeId: pendingConnection.value.shapeId,
            sourceAnchor: pendingConnection.value.anchor,
            targetShapeId,
            targetAnchor
        }

        connections.value.push(newConnection)
        console.log('✅ Connection created:', newConnection)

        cancelConnection()
        return newConnection
    }

    const cancelConnection = () => {
        pendingConnection.value = null
        isConnecting.value = false
    }

    const removeConnection = (connectionId: string) => {
        const index = connections.value.findIndex(conn => conn.id === connectionId)
        if (index !== -1) {
            connections.value.splice(index, 1)
            console.log('🗑️ Connection removed:', connectionId)
        }
    }

    const getConnectionsForShape = (shapeId: string) => {
        return connections.value.filter(
            conn => conn.sourceShapeId === shapeId || conn.targetShapeId === shapeId
        )
    }

    const clearAllConnections = () => {
        connections.value = []
        cancelConnection()
    }

    return {
        connections: computed(() => connections.value),
        pendingConnection: computed(() => pendingConnection.value),
        isConnecting: computed(() => isConnecting.value),
        startConnection,
        completeConnection,
        cancelConnection,
        removeConnection,
        getConnectionsForShape,
        clearAllConnections
    }
}
