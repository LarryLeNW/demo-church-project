import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { CheckinChildrenDto } from './dto/checkin-children.dto.js';
import { RegisterChildDto } from './dto/register-child.dto.js';
import { ChildCheckin } from './entities/child-checkin.entity.js';
import { ChildProfile } from './entities/child-profile.entity.js';
import { CheckinStatus, Classroom } from './enums/children.enums.js';

@Injectable()
export class ChildrenService {
  private readonly logger = new Logger(ChildrenService.name);

  constructor(
    @InjectRepository(ChildProfile)
    private readonly profileRepo: Repository<ChildProfile>,
    @InjectRepository(ChildCheckin)
    private readonly checkinRepo: Repository<ChildCheckin>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private generateSecurityCode(): string {
    const letters = ['G', 'A', 'K', 'M', 'P', 'R', 'S', 'T'];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${randomLetter}-${randomDigits}`;
  }

  async registerChild(parentId: string, dto: RegisterChildDto) {
    const child = this.profileRepo.create({
      parentId,
      fullName: dto.fullName.trim(),
      birthDate: dto.birthDate,
      classroom: dto.classroom,
      allergies: dto.allergies?.trim() || null,
      specialNotes: dto.specialNotes?.trim() || null,
      emergencyContactName: dto.emergencyContactName.trim(),
      emergencyContactPhone: dto.emergencyContactPhone.trim(),
    });

    return this.profileRepo.save(child);
  }

  async getMyChildren(parentId: string) {
    return this.profileRepo.find({
      where: { parentId },
      order: { fullName: 'ASC' },
    });
  }

  async checkinChildren(parentId: string, checkedInByUserId: string, dto: CheckinChildrenDto) {
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const children = await this.profileRepo.find({
      where: { id: In(dto.childIds) },
      relations: { parent: true },
    });

    if (children.length === 0) {
      throw new NotFoundException('Không tìm thấy thông tin của các bé được chọn.');
    }

    // Shared family security code for this checkin session
    const securityCode = this.generateSecurityCode();
    const parent = children[0]?.parent || (await this.userRepo.findOne({ where: { id: parentId } }));

    const savedCheckins: ChildCheckin[] = [];
    const childBadges = [];

    for (const child of children) {
      // Check if already checked in today
      let checkin = await this.checkinRepo.findOne({
        where: {
          childId: child.id,
          sessionDate: todayStr,
          status: CheckinStatus.CheckedIn,
        },
      });

      if (!checkin) {
        checkin = this.checkinRepo.create({
          childId: child.id,
          parentId,
          sessionDate: todayStr,
          securityCode,
          classroom: child.classroom,
          checkinTime: new Date(),
          checkedInByUserId,
          status: CheckinStatus.CheckedIn,
        });
        checkin = await this.checkinRepo.save(checkin);
      } else {
        // Update existing with current code for print sync
        checkin.securityCode = securityCode;
        checkin = await this.checkinRepo.save(checkin);
      }

      savedCheckins.push(checkin);

      childBadges.push({
        checkinId: checkin.id,
        childId: child.id,
        fullName: child.fullName,
        classroom: child.classroom,
        allergies: child.allergies,
        specialNotes: child.specialNotes,
        emergencyContactName: child.emergencyContactName,
        emergencyContactPhone: child.emergencyContactPhone,
        securityCode,
        sessionDate: todayStr,
        checkinTime: checkin.checkinTime,
      });
    }

    this.logger.log(
      `[Child Safety Check-in] Đã check-in ${savedCheckins.length} bé cho phụ huynh ${parent?.fullName || parentId} với Mã An Toàn ${securityCode}`,
    );

    return {
      success: true,
      securityCode,
      sessionDate: todayStr,
      guardianClaimTicket: {
        parentName: parent?.fullName || 'Quý Phụ Huynh',
        securityCode,
        sessionDate: todayStr,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        children: children.map((c) => ({
          name: c.fullName,
          classroom: c.classroom,
        })),
        legalNotice:
          'Xin xuất trình vé này cho giáo viên khi đón bé. Vì an toàn tuyệt đối của trẻ, giáo viên chỉ bàn giao khi mã bảo mật trùng khớp 100%.',
      },
      childBadges,
    };
  }

  async getActiveRoster(classroom?: Classroom) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const qb = this.checkinRepo
      .createQueryBuilder('checkin')
      .leftJoinAndSelect('checkin.child', 'child')
      .leftJoinAndSelect('checkin.parent', 'parent')
      .where('checkin.sessionDate = :todayStr', { todayStr })
      .andWhere('checkin.status = :checkedIn', { checkedIn: CheckinStatus.CheckedIn })
      .orderBy('checkin.checkinTime', 'ASC');

    if (classroom) {
      qb.andWhere('checkin.classroom = :classroom', { classroom });
    }

    const checkins = await qb.getMany();

    const summary = {
      totalActive: checkins.length,
      byClassroom: {
        [Classroom.Nursery]: 0,
        [Classroom.Preschool]: 0,
        [Classroom.Elementary]: 0,
        [Classroom.Youth]: 0,
      },
      allergiesCount: 0,
    };

    for (const c of checkins) {
      if (summary.byClassroom[c.classroom] !== undefined) {
        summary.byClassroom[c.classroom]++;
      }
      if (c.child?.allergies) {
        summary.allergiesCount++;
      }
    }

    return {
      summary,
      items: checkins,
    };
  }

  async checkoutChild(checkinId: string, securityCode: string, teacherUserId: string) {
    const checkin = await this.checkinRepo.findOne({
      where: { id: checkinId },
      relations: { child: true, parent: true },
    });

    if (!checkin) {
      throw new NotFoundException('Không tìm thấy phiên điểm danh của bé.');
    }

    if (checkin.status === CheckinStatus.CheckedOut) {
      throw new BadRequestException('Bé này đã được phụ huynh đón về trước đó.');
    }

    // Security Verification Check
    const normalizedInput = securityCode.trim().toUpperCase();
    const normalizedExpected = checkin.securityCode.trim().toUpperCase();

    if (normalizedInput !== normalizedExpected) {
      this.logger.warn(
        `[Child Safety Alert] Cảnh báo nhập sai mã đón bé ${checkin.child?.fullName}: nhập "${normalizedInput}" nhưng mã đúng là "${normalizedExpected}"`,
      );
      throw new BadRequestException(
        'Mã bảo mật không trùng khớp! Vì an toàn của bé, giáo viên không được bàn giao nếu mã không khớp.',
      );
    }

    checkin.status = CheckinStatus.CheckedOut;
    checkin.checkoutTime = new Date();
    checkin.checkedOutByUserId = teacherUserId;

    await this.checkinRepo.save(checkin);

    this.logger.log(
      `[Child Safety Checkout] Đã bàn giao bé ${checkin.child?.fullName} an toàn cho phụ huynh (Mã ${securityCode})`,
    );

    return {
      success: true,
      message: `Đã xác nhận trả bé ${checkin.child?.fullName} an toàn cho phụ huynh.`,
      checkoutTime: checkin.checkoutTime,
    };
  }
}
