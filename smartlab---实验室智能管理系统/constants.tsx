
import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Package, 
  Calendar, 
  Wrench, 
  BookOpen, 
  ShieldCheck,
  Bell,
  Settings,
  Menu,
  X,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  UserCheck
} from 'lucide-react';
import { EquipmentStatus, Equipment, Consumable, LabLog, Booking, ConsumableRequest, RepairRecord } from './types';

export const ICONS = {
  Dashboard: LayoutDashboard,
  Equipment: FlaskConical,
  Inventory: Package,
  Booking: Calendar,
  Maintenance: Wrench,
  Logs: BookOpen,
  Security: ShieldCheck,
  Alerts: Bell,
  Settings: Settings,
  Menu: Menu,
  Close: X,
  Plus: Plus,
  ArrowRight: ArrowRight,
  Alert: AlertTriangle,
  Check: CheckCircle2,
  Clock: Clock,
  Approval: ClipboardCheck,
  User: UserCheck
};

export const MOCK_EQUIPMENT: Equipment[] = [
  { 
    id: 'EQ-001', 
    name: '高速冷冻离心机', 
    model: 'Beckman-7000', 
    status: EquipmentStatus.AVAILABLE, 
    sop: '【准备阶段】\n1. 检查离心腔内是否有积水或异物。\n2. 确认转子型号并检查密封圈是否完好。\n3. 使用天平对离心管进行精确配平（误差 < 0.1g）。\n\n【运行阶段】\n4. 将配平后的离心管对称放入转子。\n5. 盖紧转子盖，关闭离心机舱门。\n6. 设定转速 (RPM/RCF)、时间及目标温度（通常为 4°C）。\n7. 点击 START，等待转速升至设定值后再离开。\n\n【结束阶段】\n8. 待转子完全静止后，开盖取出样品。\n9. 擦干离心腔内冷凝水，保持舱门半开以干燥。', 
    lastMaintenance: '2024-05-15', 
    nextMaintenance: '2024-11-15', 
    qrCode: 'QR_EQ001',
    imageUrl: 'https://images.unsplash.com/photo-1579152276532-a39c7efc907f?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'EQ-002', 
    name: '液相色谱质谱联用仪 (LC-MS)', 
    model: 'Waters Xevo TQ-S', 
    status: EquipmentStatus.IN_USE, 
    sop: '【系统自检】\n1. 检查流动相余量，确保溶剂瓶滤头完全浸没。\n2. 开启排气泵 (Purge) 3分钟，排除管路气泡。\n\n【样品准备】\n3. 样品必须经过 0.22μm 滤膜过滤或超速离心。\n4. 确认洗针液充足且与流动相兼容。\n\n【采集程序】\n5. 加载对应项目的 MS 方法及 LC 梯度。\n6. 监测基线噪音，确认压力波动范围在 ±10 psi 以内。\n\n【维护程序】\n7. 实验结束后，使用 50% 甲醇水溶液冲洗系统 30 分钟。\n8. 关闭离子源气体，待降温后退出软件。', 
    lastMaintenance: '2024-03-20', 
    nextMaintenance: '2024-09-20', 
    qrCode: 'QR_EQ002',
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'EQ-003', 
    name: '全自动 PCR 扩增仪', 
    model: 'Bio-Rad T100', 
    status: EquipmentStatus.MAINTENANCE, 
    sop: '【放置样品】\n1. 确认 PCR 管盖已压紧，防止高温蒸发。\n2. 将反应管放置在模块中央，对称分布。\n\n【参数设置】\n3. 选择或新建 PCR 循环程序。\n4. 设置热盖温度（推荐 105°C）。\n\n【运行与安全】\n5. 关闭并锁死热盖，听到“咔哒”声确认。\n6. 点击 RUN，观察前两个循环是否有报错信息。\n\n【清理】\n7. 运行结束后及时取出样品，切勿将样品长时间保存在 4°C 模块中（损坏制冷片）。\n8. 使用无绒布清理模块孔位。', 
    lastMaintenance: '2024-01-10', 
    nextMaintenance: '2024-07-10', 
    qrCode: 'QR_EQ003',
    imageUrl: 'https://images.unsplash.com/photo-1581093583449-84d51797502c?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'EQ-004', 
    name: '万级洁净通风柜 A1', 
    model: 'LabConco 2024', 
    status: EquipmentStatus.AVAILABLE, 
    sop: '【环境确认】\n1. 检查风机运行指示灯是否为绿色。\n2. 确认通风柜内无堆放过多的废弃物，以免影响气流。\n\n【操作规范】\n3. 调节拉门至工作警戒线以下（通常为 20cm）。\n4. 所有操作应在台面中心区域进行，距开口处至少 15cm。\n5. 禁止在通风柜内使用明火，除非有特殊防爆措施。\n\n【清洁处理】\n6. 溢出的酸碱溶剂应立即使用中和吸附棉处理。\n7. 工作结束，排风 5 分钟后方可关闭风机。', 
    lastMaintenance: '2024-02-01', 
    nextMaintenance: '2024-08-01', 
    qrCode: 'QR_EQ004',
    imageUrl: 'https://images.unsplash.com/photo-1532187875605-18382184c97c?auto=format&fit=crop&q=80&w=400'
  }
];

export const MOCK_REPAIR_HISTORY: RepairRecord[] = [
  {
    id: 'H-001',
    equipmentId: 'EQ-001',
    equipmentName: '高速冷冻离心机',
    reporter: '王同学',
    description: '运行过程中转子出现异常抖动。',
    status: 'RESOLVED',
    timestamp: '2023-11-12T10:00:00Z',
    engineer: '刘工',
    result: '更换了磨损的转子密封圈，重新校准平衡传感器。'
  },
  {
    id: 'H-002',
    equipmentId: 'EQ-002',
    equipmentName: 'LC-MS 质谱仪',
    reporter: '陈老师',
    description: '质谱基线噪音过大，无法正常积分。',
    status: 'RESOLVED',
    timestamp: '2024-01-05T14:30:00Z',
    engineer: '李工',
    result: '清洗了离子源，更换了氮气发生器的过滤器。'
  },
  {
    id: 'H-003',
    equipmentId: 'EQ-001',
    equipmentName: '高速冷冻离心机',
    reporter: '李同学',
    description: '显示屏触摸失灵。',
    status: 'RESOLVED',
    timestamp: '2024-03-22T09:15:00Z',
    engineer: '张工',
    result: '更换了前面板控制模块。'
  }
];

export const MOCK_CONSUMABLES: Consumable[] = [
  { id: 'CS-001', name: '一次性吸头 (200uL)', category: '耗材-塑料', stock: 120, threshold: 200, unit: '盒', location: 'B-4 货架' },
  { id: 'CS-002', name: '95% 乙醇 (分析纯)', category: '试剂-化学品', stock: 15, threshold: 10, unit: '升', location: '1号防爆柜' },
  { id: 'CS-003', name: '丁腈检查手套 (M号)', category: '防护用品', stock: 8, threshold: 15, unit: '箱', location: '入口物资架' }
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'B-1', equipmentId: 'EQ-001', equipmentName: '高速冷冻离心机', userId: 'U-101', userName: '张同学', date: '2024-06-20', slot: '09:00 - 11:00', status: 'APPROVED' },
  { id: 'B-2', equipmentId: 'EQ-002', equipmentName: 'LC-MS 质谱仪', userId: 'U-102', userName: '李同学', date: '2024-06-20', slot: '14:00 - 17:00', status: 'PENDING' }
];

export const MOCK_REQUESTS: ConsumableRequest[] = [
  { id: 'REQ-1', itemName: '95% 乙醇 (分析纯)', quantity: 2, unit: '升', requester: '王同学', reason: '合成实验 A 组溶剂使用', status: 'PENDING', timestamp: '2024-06-19T10:00:00Z' }
];

export const MOCK_REPAIRS: RepairRecord[] = [
  { id: 'REP-1', equipmentId: 'EQ-003', equipmentName: '全自动 PCR 扩增仪', reporter: '赵同学', description: '热盖无法完全锁定，报错代码 E-04', status: 'FIXING', timestamp: '2024-06-18T09:30:00Z' }
];

export const MOCK_LOGS: LabLog[] = [
  { id: 'L-1', title: 'RNA 提取实验方案 Alpha', content: '尝试提高洗脱温度。结果显示产量增加了 15%，完整性良好。', author: '陈爱丽', timestamp: '2024-06-12T14:30:00Z', isArchived: true },
  { id: 'L-2', title: '纳米粒子合成测试', content: '初步合成成功，粒径分布在 20-30nm 之间，待进一步电镜观察。', author: '陈爱丽', timestamp: '2024-06-15T16:00:00Z', isArchived: false }
];
