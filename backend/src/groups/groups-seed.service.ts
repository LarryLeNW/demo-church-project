import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmallGroup } from './entities/small-group.entity.js';
import { GroupMember } from './entities/group-member.entity.js';
import { GroupCategory, GroupMemberRole } from './enums/group.enums.js';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../common/enums/role.enum.js';

@Injectable()
export class GroupsSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(GroupsSeedService.name);

  constructor(
    @InjectRepository(SmallGroup)
    private readonly groupRepo: Repository<SmallGroup>,
    @InjectRepository(GroupMember)
    private readonly memberRepo: Repository<GroupMember>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const leader = await this.userRepo.findOne({
        where: [{ role: Role.SeniorPastor }, { role: Role.Admin }],
      });

      if (!leader) return;

      const count = await this.groupRepo.count();
      if (count >= 4) return;

      this.logger.log('Khởi tạo danh sách Nhóm Nhỏ / Tế Bào Hội Thánh (Life Groups)...');

      const seedGroups: Array<{
        name: string;
        category: GroupCategory;
        scheduleRule: string;
        location: string;
        zoomLink: string;
        zipcode: string;
        description: string;
      }> = [
        {
          name: 'Nhóm Gia Đình Trẻ Dallas (Plano, TX)',
          category: GroupCategory.Families,
          scheduleRule: 'Thứ Sáu 19:30',
          location: 'Tư gia Chấp sự Nguyen, Plano, TX',
          zoomLink: 'https://zoom.us/j/777888999',
          zipcode: '75024',
          description:
            'Nhóm thông công học Lời Chúa và cùng nuôi dạy con cái trong đức tin vững vàng giữa văn hóa Mỹ.',
        },
        {
          name: 'Nhóm Sinh Viên & Đi Làm Trẻ (UTD & Richardson)',
          category: GroupCategory.YoungAdults,
          scheduleRule: 'Tối Thứ Bảy 19:00',
          location: 'Khuôn viên UTD & Nhà Tín hữu, Richardson, TX',
          zoomLink: 'https://zoom.us/j/555666777',
          zipcode: '75080',
          description:
            'Nâng đỡ đức tin cho sinh viên và các bạn trẻ mới đi làm, trang bị thế giới quan Cơ Đốc tại nơi làm việc.',
        },
        {
          name: 'Nhóm Thanh Thiếu Niên Ánh Sáng (Carrollton Youth)',
          category: GroupCategory.Youth,
          scheduleRule: 'Chiều Chúa Nhật 14:00',
          location: 'Phòng Sinh Hoạt Thanh Niên, Carrollton, TX',
          zoomLink: 'https://zoom.us/j/333444555',
          zipcode: '75006',
          description:
            'Sân chơi thuộc linh gắn kết các bạn trẻ thế hệ thứ 2 (Gen Z), học Kinh Thánh song ngữ Anh - Việt.',
        },
        {
          name: 'Nhóm Trung Cao Niên Phước Hạnh (Garland)',
          category: GroupCategory.Seniors,
          scheduleRule: 'Sáng Thứ Năm 10:00',
          location: 'Fellowship Hall, Dallas Main Campus',
          zoomLink: '',
          zipcode: '75040',
          description:
            'Hiệp nguyện dốc đổ cho con cháu và Hội Thánh, thông công ẩm thực và nâng đỡ các bác cao niên.',
        },
        {
          name: 'Nhóm Tế Bào Đức Tin Fort Worth (Alliance)',
          category: GroupCategory.Families,
          scheduleRule: 'Tối Thứ Sáu 19:30',
          location: 'Nhà Thông Công Fort Worth Campus, TX',
          zoomLink: 'https://zoom.us/j/111222333',
          zipcode: '76102',
          description:
            'Điểm hẹn tâm linh cho các gia đình tín hữu khu vực Fort Worth, Tarrant County.',
        },
      ];

      for (const g of seedGroups) {
        const existing = await this.groupRepo.findOne({ where: { name: g.name } });
        if (!existing) {
          const newGroup = await this.groupRepo.save(
            this.groupRepo.create({
              ...g,
              leaderId: leader.id,
              isActive: true,
            }),
          );

          await this.memberRepo.save(
            this.memberRepo.create({
              groupId: newGroup.id,
              userId: leader.id,
              role: GroupMemberRole.Leader,
            }),
          );
        }
      }

      this.logger.log('Đã cập nhật các Nhóm Tế Bào thành công với font chữ tiếng Việt chuẩn xác.');
    } catch (err) {
      this.logger.error('Lỗi khởi tạo seed groups:', err);
    }
  }
}
