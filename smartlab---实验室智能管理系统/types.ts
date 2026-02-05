
export enum EquipmentStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER'
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  status: EquipmentStatus;
  sop: string;
  lastMaintenance: string;
  nextMaintenance: string;
  qrCode: string;
  imageUrl?: string;
}

export interface Consumable {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  unit: string;
  location: string;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  date: string;
  slot: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
}

export interface ConsumableRequest {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  requester: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISTRIBUTED';
  timestamp: string;
}

export interface RepairRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  reporter: string;
  description: string;
  status: 'REPORTED' | 'FIXING' | 'RESOLVED';
  timestamp: string;
  engineer?: string;
  result?: string;
}

export interface LabLog {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  author: string;
  isArchived: boolean;
  attachments?: string[];
}
