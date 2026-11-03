import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacilityRoom } from './entities/facility-room.entity.js';
import { FacilityReservation } from './entities/facility-reservation.entity.js';
import { EquipmentItem } from './entities/equipment-item.entity.js';
import {
  EquipmentCondition,
  EquipmentType,
  FacilityType,
  ReservationStatus,
} from './enums/facility.enums.js';

@Injectable()
export class FacilitiesSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FacilitiesSeedService.name);

  constructor(
    @InjectRepository(FacilityRoom)
    private readonly roomRepo: Repository<FacilityRoom>,
    @InjectRepository(FacilityReservation)
    private readonly reservationRepo: Repository<FacilityReservation>,
    @InjectRepository(EquipmentItem)
    private readonly equipmentRepo: Repository<EquipmentItem>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRooms();
    await this.seedEquipment();
    await this.seedSampleReservations();
  }

  private async seedRooms() {
    const count = await this.roomRepo.count();
    if (count > 0) return;

    this.logger.log('Khởi tạo danh mục phòng nhóm & cơ sở vật chất Hội Thánh...');

    const rooms: Partial<FacilityRoom>[] = [
      {
        name: 'Thánh Đường Lớn (Main Sanctuary)',
        type: FacilityType.SANCTUARY,
        campusId: 'Dallas Main Campus',
        capacity: 450,
        amenities: [
          'Hệ thống âm thanh số Behringer X32',
          'Máy chiếu Laser 4K & Màn hình LED 200 inch',
          'Đàn Grand Piano Yamaha C7',
          'Hệ thống Livestream 3 Camera PTZ 4K',
          'Đèn sân khấu DMX tự động',
        ],
        isAvailable: true,
        requiresApproval: true,
        notes: 'Chỉ dành cho Lễ Thờ Phượng, Đêm Thánh Ca, Bồi Linh và Lễ Cưới/Tang trang trọng.',
      },
      {
        name: 'Nhà Thông Công & Hội Trường (Fellowship Hall)',
        type: FacilityType.FELLOWSHIP_HALL,
        campusId: 'Dallas Main Campus',
        capacity: 150,
        amenities: [
          'Bàn tiệc tròn 10 người (15 bàn)',
          'Khu vực bếp thương mại tiêu chuẩn nhà hàng',
          'Hệ thống loa treo trần & Micro không dây',
          'Máy chiếu cơ động',
        ],
        isAvailable: true,
        requiresApproval: true,
        notes: 'Dành cho tiệc thông công, lớp bồi linh gia đình và tiệc mừng sau lễ.',
      },
      {
        name: 'Nhà Nguyện Tĩnh Nguyện (Prayer Chapel)',
        type: FacilityType.CHAPEL,
        campusId: 'Dallas Main Campus',
        capacity: 45,
        amenities: [
          'Đàn Piano điện Roland',
          'Ánh sáng ấm êm dịu chuyên cho tĩnh nguyện',
          'Bục quỳ cầu nguyện riêng tư',
        ],
        isAvailable: true,
        requiresApproval: false,
        notes: 'Mở cửa tự do mỗi sáng cho các nhóm nhỏ cầu thay và tĩnh nguyện.',
      },
      {
        name: 'Phòng Sinh Hoạt Thanh Thiếu Niên (Youth Lounge 201)',
        type: FacilityType.YOUTH_CENTER,
        campusId: 'Dallas Main Campus',
        capacity: 80,
        amenities: [
          'Hệ thống âm thanh ban nhạc Acoustic',
          'Màn hình TV 85 inch hỗ trợ Apple AirPlay',
          'Bàn bóng bàn và ghế sofa thông công',
        ],
        isAvailable: true,
        requiresApproval: true,
        notes: 'Dành riêng cho Ban Thanh Niên và Thiếu Niên sinh hoạt tối Thứ Sáu & Chúa Nhật.',
      },
      {
        name: 'Lớp Học Trường Chúa Nhật (Classroom 102)',
        type: FacilityType.CLASSROOM,
        campusId: 'Dallas Main Campus',
        capacity: 25,
        amenities: ['Bảng viết kính', 'Smart TV 65 inch', 'Bàn ghế học sinh tiêu chuẩn'],
        isAvailable: true,
        requiresApproval: true,
        notes: 'Phục vụ lớp Thiếu Nhi và lớp Tân Tín Hữu.',
      },
      {
        name: 'Thánh Đường Houston (Houston Sanctuary)',
        type: FacilityType.SANCTUARY,
        campusId: 'Houston Campus',
        capacity: 200,
        amenities: ['Hệ thống âm thanh Yamaha', 'Máy chiếu Full HD', 'Đàn Piano Roland'],
        isAvailable: true,
        requiresApproval: true,
      },
    ];

    for (const r of rooms) {
      await this.roomRepo.save(this.roomRepo.create(r));
    }
  }

  private async seedEquipment() {
    const count = await this.equipmentRepo.count();
    if (count > 0) return;

    this.logger.log('Khởi tạo kho thiết bị âm thanh & thánh lễ...');

    const items: Partial<EquipmentItem>[] = [
      {
        name: 'Bộ Micro Không Dây Shure QLXD24 (Set 4 Mic)',
        type: EquipmentType.AUDIO_SOUND,
        campusId: 'Dallas Main Campus',
        quantity: 4,
        availableQuantity: 4,
        condition: EquipmentCondition.EXCELLENT,
        location: 'Tủ Âm Thanh Tầng 2 - Phòng Kỹ Thuật',
        notes: 'Sử dụng cho Ban Hát Thờ Phượng & Giảng Luận.',
      },
      {
        name: 'Đàn Piano Điện Di Động Roland FP-90X (Kèm Chân & Pedal)',
        type: EquipmentType.MUSICAL_INSTRUMENT,
        campusId: 'Dallas Main Campus',
        quantity: 2,
        availableQuantity: 2,
        condition: EquipmentCondition.EXCELLENT,
        location: 'Nhà Thông Công',
      },
      {
        name: 'Khay Chén & Bánh Tiệc Thánh Bạc Chuẩn Hội Thánh (Bộ 8 khay)',
        type: EquipmentType.COMMUNION_HOLY_BAPTISM,
        campusId: 'Dallas Main Campus',
        quantity: 8,
        availableQuantity: 8,
        condition: EquipmentCondition.EXCELLENT,
        location: 'Tủ Khánh Tiết Phòng Chấp Sự',
        notes: 'Dành riêng cho Chúa Nhật đầu tháng.',
      },
      {
        name: 'Áo Lễ Báp-têm Trắng Thêu Thập Tự Giá (Đủ size S/M/L/XL)',
        type: EquipmentType.COMMUNION_HOLY_BAPTISM,
        campusId: 'Dallas Main Campus',
        quantity: 25,
        availableQuantity: 25,
        condition: EquipmentCondition.GOOD,
        location: 'Tủ Hồ Báp-têm Phía Sau Cánh Gà',
      },
      {
        name: 'Bộ Bàn Tròn Gấp Xếp 10 Người & 100 Ghế Nệm Tiệc Thông Công',
        type: EquipmentType.FURNITURE,
        campusId: 'Dallas Main Campus',
        quantity: 20,
        availableQuantity: 20,
        condition: EquipmentCondition.GOOD,
        location: 'Kho Bàn Ghế Nhà Ăn',
      },
    ];

    for (const item of items) {
      await this.equipmentRepo.save(this.equipmentRepo.create(item));
    }
  }

  private async seedSampleReservations() {
    const count = await this.reservationRepo.count();
    if (count > 0) return;

    const sanctuary = await this.roomRepo.findOne({
      where: { name: 'Thánh Đường Lớn (Main Sanctuary)' },
    });
    const fellowshipHall = await this.roomRepo.findOne({
      where: { name: 'Nhà Thông Công & Hội Trường (Fellowship Hall)' },
    });

    if (sanctuary) {
      await this.reservationRepo.save(
        this.reservationRepo.create({
          roomId: sanctuary.id,
          requestedByUserId: 'leader-1',
          requestedByUserName: 'Trưởng Ban Thờ Phượng Nguyễn Anh Tuấn',
          eventName: 'Tổng Duyệt & Tập Hát Nhạc Phục Hưng Chúa Nhật',
          ministryName: 'Ban Thờ Phượng & Media',
          campusId: 'Dallas Main Campus',
          startTime: '2026-11-07T18:00:00Z',
          endTime: '2026-11-07T21:00:00Z',
          setupNotes: 'Cần mở dàn âm thanh X32 và 4 micro không dây trước 15 phút.',
          status: ReservationStatus.APPROVED,
          approvedByUserId: 'pastor-1',
          approvedByUserName: 'Mục Sư Quản Nhiệm',
        }),
      );
    }

    if (fellowshipHall) {
      await this.reservationRepo.save(
        this.reservationRepo.create({
          roomId: fellowshipHall.id,
          requestedByUserId: 'leader-2',
          requestedByUserName: 'Chấp Sự Trần Văn Minh',
          eventName: 'Tiệc Thông Công Tạ Ơn & Mừng Tân Tín Hữu',
          ministryName: 'Ban Ẩm Thực & Tiếp Tân',
          campusId: 'Dallas Main Campus',
          startTime: '2026-11-08T12:30:00Z',
          endTime: '2026-11-08T15:00:00Z',
          setupNotes: 'Cần sắp xếp 12 bàn tròn và mở bếp nấu nước súp từ 11:30 AM.',
          status: ReservationStatus.PENDING,
        }),
      );
    }
  }
}
