// Real-Time Collaboration Manager for EiQ™ powered by SikatLab™ and IDFS Pathway™

interface CollaborationRoom {
  id: string;
  name: string;
  type: 'study_session' | 'assessment' | 'project' | 'tutoring';
  participants: Participant[];
  currentActivity: string;
  maxParticipants: number;
  isPrivate: boolean;
  createdAt: string;
  createdBy: string;
  lastActivity: string;
  documents: string[];
  settings: RoomSettings;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'collaborator' | 'observer';
  status: 'online' | 'away' | 'busy';
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  lastSeen: string;
  permissions: ParticipantPermissions;
}

interface ParticipantPermissions {
  canEditDocuments: boolean;
  canManageParticipants: boolean;
  canStartScreenShare: boolean;
  canModerateChat: boolean;
}

interface RoomSettings {
  allowScreenShare: boolean;
  allowFileSharing: boolean;
  maxConcurrentSpeakers: number;
  autoRecording: boolean;
  chatModeration: boolean;
}

interface SharedDocument {
  id: string;
  roomId: string;
  title: string;
  type: 'whiteboard' | 'code' | 'assessment' | 'notes';
  content: string;
  lastModified: string;
  modifiedBy: string;
  collaborators: string[];
  version: number;
  changeHistory: DocumentChange[];
}

interface DocumentChange {
  id: string;
  userId: string;
  timestamp: string;
  operation: 'insert' | 'delete' | 'update';
  position: number;
  content: string;
  length: number;
}

// In-memory storage for demo (would be database in production)
const activeRooms = new Map<string, CollaborationRoom>();
const sharedDocuments = new Map<string, SharedDocument>();
const userSessions = new Map<string, Set<string>>(); // userId -> Set of roomIds

export async function createCollaborationRoom(data: {
  name: string;
  type: string;
  isPrivate: boolean;
  createdBy: string;
}): Promise<CollaborationRoom> {
  const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const room: CollaborationRoom = {
    id: roomId,
    name: data.name,
    type: data.type as any,
    participants: [{
      id: data.createdBy,
      name: "Room Creator", // Would get from user database
      role: "host",
      status: "online",
      isAudioEnabled: false,
      isVideoEnabled: false,
      isScreenSharing: false,
      lastSeen: new Date().toISOString(),
      permissions: {
        canEditDocuments: true,
        canManageParticipants: true,
        canStartScreenShare: true,
        canModerateChat: true
      }
    }],
    currentActivity: "Room created",
    maxParticipants: getMaxParticipants(data.type),
    isPrivate: data.isPrivate,
    createdAt: new Date().toISOString(),
    createdBy: data.createdBy,
    lastActivity: new Date().toISOString(),
    documents: [],
    settings: {
      allowScreenShare: true,
      allowFileSharing: true,
      maxConcurrentSpeakers: 3,
      autoRecording: false,
      chatModeration: false
    }
  };

  activeRooms.set(roomId, room);
  
  // Add user to session tracking
  if (!userSessions.has(data.createdBy)) {
    userSessions.set(data.createdBy, new Set());
  }
  userSessions.get(data.createdBy)!.add(roomId);

  console.log(`[COLLABORATION] Room created: ${roomId} by ${data.createdBy}`);
  return room;
}

export async function joinCollaborationRoom(roomId: string, userId: string): Promise<CollaborationRoom> {
  const room = activeRooms.get(roomId);
  
  if (!room) {
    throw new Error("Room not found");
  }

  if (room.participants.length >= room.maxParticipants) {
    throw new Error("Room is full");
  }

  // Check if user is already in the room
  const existingParticipant = room.participants.find(p => p.id === userId);
  if (existingParticipant) {
    existingParticipant.status = "online";
    existingParticipant.lastSeen = new Date().toISOString();
  } else {
    // Add new participant
    const newParticipant: Participant = {
      id: userId,
      name: `User ${userId}`, // Would get from user database
      role: "collaborator",
      status: "online",
      isAudioEnabled: false,
      isVideoEnabled: false,
      isScreenSharing: false,
      lastSeen: new Date().toISOString(),
      permissions: {
        canEditDocuments: true,
        canManageParticipants: false,
        canStartScreenShare: true,
        canModerateChat: false
      }
    };

    room.participants.push(newParticipant);
  }

  room.lastActivity = new Date().toISOString();
  room.currentActivity = `${room.participants.length} participants active`;

  // Add user to session tracking
  if (!userSessions.has(userId)) {
    userSessions.set(userId, new Set());
  }
  userSessions.get(userId)!.add(roomId);

  console.log(`[COLLABORATION] User ${userId} joined room ${roomId}`);
  return room;
}

export async function leaveCollaborationRoom(roomId: string, userId: string): Promise<void> {
  const room = activeRooms.get(roomId);
  
  if (!room) {
    return;
  }

  // Remove participant
  room.participants = room.participants.filter(p => p.id !== userId);
  
  // If no participants left, delete room
  if (room.participants.length === 0) {
    activeRooms.delete(roomId);
    console.log(`[COLLABORATION] Room ${roomId} deleted - no participants`);
  } else {
    // If host left, assign new host
    if (room.createdBy === userId && room.participants.length > 0) {
      const newHost = room.participants[0];
      newHost.role = "host";
      newHost.permissions = {
        canEditDocuments: true,
        canManageParticipants: true,
        canStartScreenShare: true,
        canModerateChat: true
      };
      room.createdBy = newHost.id;
      console.log(`[COLLABORATION] New host assigned: ${newHost.id} for room ${roomId}`);
    }
    
    room.lastActivity = new Date().toISOString();
    room.currentActivity = `${room.participants.length} participants active`;
  }

  // Remove user from session tracking
  userSessions.get(userId)?.delete(roomId);
  
  console.log(`[COLLABORATION] User ${userId} left room ${roomId}`);
}

export async function getActiveRooms(): Promise<CollaborationRoom[]> {
  // Clean up inactive rooms (no activity for 4+ hours)
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
  
  for (const [roomId, room] of Array.from(activeRooms.entries())) {
    if (new Date(room.lastActivity) < fourHoursAgo) {
      activeRooms.delete(roomId);
      console.log(`[COLLABORATION] Cleaned up inactive room: ${roomId}`);
    }
  }

  return Array.from(activeRooms.values());
}

export async function getSharedDocuments(userId: string): Promise<SharedDocument[]> {
  // Get documents from rooms the user is part of
  const userRooms = Array.from(userSessions.get(userId) || []);
  const documents: SharedDocument[] = [];

  for (const doc of Array.from(sharedDocuments.values())) {
    if (userRooms.includes(doc.roomId) || doc.collaborators.includes(userId)) {
      documents.push(doc);
    }
  }

  return documents;
}

export async function createSharedDocument(data: {
  roomId: string;
  title: string;
  type: string;
  createdBy: string;
}): Promise<SharedDocument> {
  const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const document: SharedDocument = {
    id: docId,
    roomId: data.roomId,
    title: data.title,
    type: data.type as any,
    content: "",
    lastModified: new Date().toISOString(),
    modifiedBy: data.createdBy,
    collaborators: [data.createdBy],
    version: 1,
    changeHistory: []
  };

  sharedDocuments.set(docId, document);

  // Add document to room
  const room = activeRooms.get(data.roomId);
  if (room) {
    room.documents.push(docId);
    room.lastActivity = new Date().toISOString();
  }

  console.log(`[COLLABORATION] Document created: ${docId} in room ${data.roomId}`);
  return document;
}

export async function updateSharedDocument(data: {
  documentId: string;
  content: string;
  userId: string;
  operation: 'insert' | 'delete' | 'update';
  position: number;
}): Promise<SharedDocument> {
  const document = sharedDocuments.get(data.documentId);
  
  if (!document) {
    throw new Error("Document not found");
  }

  // Check if user has permission to edit
  if (!document.collaborators.includes(data.userId)) {
    throw new Error("Permission denied");
  }

  // Create change record
  const change: DocumentChange = {
    id: `change_${Date.now()}`,
    userId: data.userId,
    timestamp: new Date().toISOString(),
    operation: data.operation,
    position: data.position,
    content: data.content,
    length: data.content.length
  };

  // Apply the change
  switch (data.operation) {
    case 'insert':
      document.content = document.content.slice(0, data.position) + 
                        data.content + 
                        document.content.slice(data.position);
      break;
    case 'delete':
      document.content = document.content.slice(0, data.position) + 
                        document.content.slice(data.position + data.content.length);
      break;
    case 'update':
      document.content = data.content;
      break;
  }

  document.lastModified = new Date().toISOString();
  document.modifiedBy = data.userId;
  document.version += 1;
  document.changeHistory.push(change);

  // Keep only last 100 changes
  if (document.changeHistory.length > 100) {
    document.changeHistory = document.changeHistory.slice(-100);
  }

  console.log(`[COLLABORATION] Document updated: ${data.documentId} by ${data.userId}`);
  return document;
}

export async function updateParticipantStatus(data: {
  roomId: string;
  userId: string;
  status?: 'online' | 'away' | 'busy';
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
  isScreenSharing?: boolean;
}): Promise<void> {
  const room = activeRooms.get(data.roomId);
  
  if (!room) {
    throw new Error("Room not found");
  }

  const participant = room.participants.find(p => p.id === data.userId);
  
  if (!participant) {
    throw new Error("Participant not found");
  }

  // Update participant status
  if (data.status !== undefined) {
    participant.status = data.status;
  }
  if (data.isAudioEnabled !== undefined) {
    participant.isAudioEnabled = data.isAudioEnabled;
  }
  if (data.isVideoEnabled !== undefined) {
    participant.isVideoEnabled = data.isVideoEnabled;
  }
  if (data.isScreenSharing !== undefined) {
    participant.isScreenSharing = data.isScreenSharing;
  }

  participant.lastSeen = new Date().toISOString();
  room.lastActivity = new Date().toISOString();

  console.log(`[COLLABORATION] Participant status updated: ${data.userId} in room ${data.roomId}`);
}

function getMaxParticipants(roomType: string): number {
  switch (roomType) {
    case 'tutoring':
      return 2;
    case 'assessment':
      return 4;
    case 'project':
      return 6;
    case 'study_session':
      return 8;
    default:
      return 8;
  }
}

// Mock data initialization
export function initializeMockData(): void {
  // Create some demo rooms
  const demoRooms = [
    {
      name: "Advanced Mathematics Study Group",
      type: "study_session",
      isPrivate: false,
      createdBy: "demo_user_1"
    },
    {
      name: "System Design Interview Prep",
      type: "project",
      isPrivate: true,
      createdBy: "demo_user_2"
    },
    {
      name: "AI/ML Concepts Discussion",
      type: "study_session",
      isPrivate: false,
      createdBy: "demo_user_3"
    }
  ];

  demoRooms.forEach(room => {
    createCollaborationRoom(room);
  });

  console.log("[COLLABORATION] Mock data initialized");
}

// Initialize mock data on startup
initializeMockData();