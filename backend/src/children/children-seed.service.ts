import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { ChildCheckin } from './entities/child-checkin.entity.js';
import { ChildProfile } from './entities/child-profile.entity.js';
import { CheckinStatus, Classroom } from './enums/children.enums.js';

@Injectable()
export class ChildrenSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ChildrenSeedService.name);

  constructor(
    @InjectRepository(ChildProfile)
    private readonly profileRepo: Repository<ChildProfile>,
    @InjectRepository(ChildCheckin)
    private readonly checkinRepo: Repository<ChildCheckin>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.seedChildrenData();
    } catch (err) {
      this.logger.warn(`Lỗi khởi tạo Children Seed: ${(err as Error).message}`);
    }
  }

  private async seedChildrenData() {
    const count = await this.profileRepo.count();
    if (count > 0) return;

    // Find any user or pastor to be the parent
    const parents = await this.userRepo.find({ take: 2 });
    if (parents.length === 0) return;

    const parentA = parents[0];
    const parentB = parents[1] || parents[0];

    const child1 = this.profileRepo.create({
      parentId: parentA.id,
      fullName: 'Timothy Nguyen',
      birthDate: '2020-04-12',
      classroom: Classroom.Preschool,
      allergies: 'Dị ứng đậu phộng (Peanut Allergy)',
      specialNotes: 'Bé cần uống nước ấm sau giờ ca hát',
      emergencyContactName: parentA.fullName,
      emergencyContactPhone: parentA.phone || '(214) 555-0199',
    });

    const child2 = this.profileRepo.create({
      parentId: parentA.id,
      fullName: 'Hannah Nguyen',
      birthDate: '2017-09-25',
      classroom: Classroom.Elementary,
      allergies: null,
      specialNotes: 'Bé thích kể chuyện Kinh Thánh',
      emergencyContactName: parentA.fullName,
      emergencyContactPhone: parentA.phone || '(214) 555-0199',
    });

    const child3 = this.profileRepo.create({
      parentId: parentB.id,
      fullName: 'Samuel Tran',
      birthDate: '2023-11-05',
      classroom: Classroom.Nursery,
      allergies: 'Nhạy cảm với sữa chua',
      specialNotes: 'Cần ngủ trưa lúc 11:00',
      emergencyContactName: parentB.fullName,
      emergencyContactPhone: parentB.phone || '(972) 555-0144',
    });

    const [saved1, saved2, saved3] = await this.profileRepo.save([child1, child2, child3]);

    // Seed active Sunday check-in for today
    const todayStr = new Date().toISOString().slice(0, 10);
    const securityCodeA = 'G-7429';
    const securityCodeB = 'K-3184';

    const checkin1 = this.checkinRepo.create({
      childId: saved1.id,
      parentId: parentA.id,
      sessionDate: todayStr,
      securityCode: securityCodeA,
      classroom: saved1.classroom,
      checkinTime: new Date(Date.now() - 45 * 60 * 1000),
      checkedInByUserId: parentA.id,
      status: CheckinStatus.CheckedIn,
    });

    const checkin2 = this.checkinRepo.create({
      childId: saved2.id,
      parentId: parentA.id,
      sessionDate: todayStr,
      securityCode: securityCodeA,
      classroom: saved2.classroom,
      checkinTime: new Date(Date.now() - 40 * 60 * 1000),
      checkedInByUserId: parentA.id,
      status: CheckinStatus.CheckedIn,
    });

    const checkin3 = this.checkinRepo.create({
      childId: saved3.id,
      parentId: parentB.id,
      sessionDate: todayStr,
      securityCode: securityCodeB,
      classroom: saved3.classroom,
      checkinTime: new Date(Date.now() - 25 * 60 * 1000),
      checkedInByUserId: parentB.id,
      status: CheckinStatus.CheckedIn,
    });

    await this.checkinRepo.save([checkin1, checkin2, checkin3]);

    this.logger.log('Đã khởi tạo dữ liệu mẫu điểm danh an toàn lớp Thiếu Nhi (Child Safety Check-in).');
  }
}
