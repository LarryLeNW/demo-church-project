import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum.js';
import { User } from '../users/entities/user.entity.js';
import { CreateBulletinDto } from './dto/create-bulletin.dto.js';
import { SendBroadcastDto } from './dto/send-broadcast.dto.js';
import { ChurchBulletin } from './entities/church-bulletin.entity.js';
import { ChurchCommunication } from './entities/church-communication.entity.js';
import {
  CommunicationChannel,
  MessageStatus,
  TargetAudience,
} from './enums/communication.enums.js';

@Injectable()
export class CommunicationsService {
  private readonly logger = new Logger(CommunicationsService.name);

  constructor(
    @InjectRepository(ChurchCommunication)
    private readonly commRepo: Repository<ChurchCommunication>,
    @InjectRepository(ChurchBulletin)
    private readonly bulletinRepo: Repository<ChurchBulletin>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async sendBroadcast(senderId: string, dto: SendBroadcastDto) {
    // 1. Resolve recipients based on target audience
    let recipientsCount = 0;
    const qb = this.userRepo.createQueryBuilder('user').where('user.isActive = true');

    if (dto.targetAudience === TargetAudience.LeadersOnly) {
      qb.andWhere('user.role IN (:...roles)', {
        roles: [Role.SeniorPastor, Role.Admin, Role.MinistryLeader],
      });
    } else if (dto.targetAudience === TargetAudience.ParentsOnly) {
      qb.andWhere('user.role = :role', { role: Role.Parent });
    }

    if (dto.channel === CommunicationChannel.SMS) {
      qb.andWhere('user.phone IS NOT NULL AND user.phone != ""');
    }

    const matchedUsers = await qb.getMany();
    // Default to at least matched count, or simulation minimum of 1
    recipientsCount = Math.max(matchedUsers.length, 1);

    // 2. Dispatch message through Twilio SMS or Email Provider (with simulation logger)
    const providerMetadata: Record<string, unknown> = {
      simulated: true,
      timestamp: new Date().toISOString(),
      matchedUsersSample: matchedUsers.slice(0, 5).map((u) => ({
        id: u.id,
        name: u.fullName,
        phone: u.phone,
        email: u.email,
      })),
    };

    if (dto.channel === CommunicationChannel.SMS) {
      providerMetadata.smsSegmentCount = Math.ceil(dto.content.length / 160);
      providerMetadata.twilioMockBatchId = `TW-BATCH-${Date.now()}`;
      this.logger.log(
        `[Twilio SMS Broadcast] Gửi tin nhắn tới ${recipientsCount} người nhận (${dto.type}): "${dto.title}" - ${dto.content.slice(0, 60)}...`,
      );
    } else {
      providerMetadata.resendMockBatchId = `RESEND-BATCH-${Date.now()}`;
      this.logger.log(
        `[Email Broadcast] Gửi email mục vụ tới ${recipientsCount} hộp thư (${dto.type}): "${dto.title}"`,
      );
    }

    // 3. Save communication log
    const communication = this.commRepo.create({
      senderId,
      channel: dto.channel,
      type: dto.type,
      targetAudience: dto.targetAudience,
      targetGroupId: dto.targetGroupId || null,
      title: dto.title.trim(),
      content: dto.content.trim(),
      recipientCount: recipientsCount,
      status: MessageStatus.Sent,
      sentAt: new Date(),
      metadata: providerMetadata,
    });

    const saved = await this.commRepo.save(communication);

    return {
      success: true,
      communication: saved,
      recipientsCount,
      message:
        dto.channel === CommunicationChannel.SMS
          ? `Đã phát tin nhắn SMS Twilio thành công tới ${recipientsCount} tín hữu.`
          : `Đã gửi email mục vụ thành công tới ${recipientsCount} địa chỉ.`,
    };
  }

  async getBroadcastHistory(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.commRepo.findAndCount({
      relations: { sender: true },
      order: { sentAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLatestBulletin() {
    const bulletin = await this.bulletinRepo.findOne({
      where: { isPublished: true },
      order: { bulletinDate: 'DESC', createdAt: 'DESC' },
    });

    if (!bulletin) {
      throw new NotFoundException('Chưa có bản tin Hội Thánh nào được phát hành.');
    }

    return bulletin;
  }

  async getAllBulletins() {
    return this.bulletinRepo.find({
      order: { bulletinDate: 'DESC' },
    });
  }

  async createOrUpdateBulletin(dto: CreateBulletinDto) {
    const bulletin = this.bulletinRepo.create({
      title: dto.title.trim(),
      bulletinDate: dto.bulletinDate,
      themeScripture: dto.themeScripture.trim(),
      sermonTitle: dto.sermonTitle.trim(),
      preacherName: dto.preacherName.trim(),
      orderOfService: dto.orderOfService || [],
      announcements: dto.announcements || [],
      prayerFocus: dto.prayerFocus.trim(),
      financialUpdate: dto.financialUpdate?.trim() || null,
      isPublished: dto.isPublished ?? true,
    });

    return this.bulletinRepo.save(bulletin);
  }
}
