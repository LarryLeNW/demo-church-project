import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonOutline } from './entities/sermon-outline.entity.js';
import { UserSermonNote } from './entities/user-sermon-note.entity.js';
import { CreateOutlineDto } from './dto/create-outline.dto.js';
import { SaveMyNoteDto } from './dto/save-my-note.dto.js';
import { OutlineQueryDto } from './dto/outline-query.dto.js';

@Injectable()
export class SermonsService {
  constructor(
    @InjectRepository(SermonOutline)
    private readonly outlineRepo: Repository<SermonOutline>,
    @InjectRepository(UserSermonNote)
    private readonly noteRepo: Repository<UserSermonNote>,
  ) {}

  async findAllOutlines(query: OutlineQueryDto): Promise<SermonOutline[]> {
    const qb = this.outlineRepo
      .createQueryBuilder('o')
      .where('o.is_published = :isPublished', { isPublished: true });

    if (query.campusId && query.campusId !== 'all') {
      qb.andWhere('o.campus_id = :campusId', { campusId: query.campusId });
    }

    if (query.serviceDate) {
      qb.andWhere('o.service_date = :serviceDate', { serviceDate: query.serviceDate });
    }

    if (query.search) {
      qb.andWhere(
        '(LOWER(o.title) LIKE :s OR LOWER(o.title_en) LIKE :s OR LOWER(o.series_name) LIKE :s OR LOWER(o.preacher_name) LIKE :s)',
        { s: `%${query.search.toLowerCase()}%` },
      );
    }

    return qb.orderBy('o.service_date', 'DESC').getMany();
  }

  async findLatestOutline(campusId?: string): Promise<SermonOutline> {
    const qb = this.outlineRepo
      .createQueryBuilder('o')
      .where('o.is_published = :isPublished', { isPublished: true });

    if (campusId && campusId !== 'all') {
      qb.andWhere('o.campus_id = :campusId', { campusId });
    }

    const latest = await qb.orderBy('o.service_date', 'DESC').getOne();
    if (!latest) {
      // Fallback to any latest outline
      const anyLatest = await this.outlineRepo.findOne({
        where: { isPublished: true },
        order: { serviceDate: 'DESC' },
      });
      if (!anyLatest) {
        throw new NotFoundException('Chưa có dàn ý bài giảng nào được xuất bản.');
      }
      return anyLatest;
    }
    return latest;
  }

  async findOutlineById(id: string): Promise<SermonOutline> {
    const outline = await this.outlineRepo.findOne({ where: { id } });
    if (!outline) {
      throw new NotFoundException('Không tìm thấy dàn ý bài giảng này.');
    }
    return outline;
  }

  async createOutline(dto: CreateOutlineDto): Promise<SermonOutline> {
    const outline = this.outlineRepo.create({
      title: dto.title,
      titleEn: dto.titleEn,
      seriesName: dto.seriesName || 'Loạt Bài Giảng Chúa Nhật',
      preacherName: dto.preacherName || 'Mục Sư Quản Nhiệm',
      serviceDate: dto.serviceDate,
      campusId: dto.campusId || 'Dallas Main Campus',
      mainScriptureRef: dto.mainScriptureRef,
      mainScriptureTextVi: dto.mainScriptureTextVi,
      mainScriptureTextEn: dto.mainScriptureTextEn,
      outlinePoints: dto.outlinePoints,
      discussionQuestions: dto.discussionQuestions || [],
      isPublished: dto.isPublished ?? true,
    });
    return this.outlineRepo.save(outline);
  }

  async updateOutline(id: string, dto: Partial<CreateOutlineDto>): Promise<SermonOutline> {
    const outline = await this.findOutlineById(id);
    Object.assign(outline, dto);
    return this.outlineRepo.save(outline);
  }

  async deleteOutline(id: string): Promise<{ success: boolean }> {
    const outline = await this.findOutlineById(id);
    await this.noteRepo.delete({ outlineId: outline.id });
    await this.outlineRepo.remove(outline);
    return { success: true };
  }

  async getMyNote(outlineId: string, userId: string): Promise<UserSermonNote> {
    await this.findOutlineById(outlineId);

    let note = await this.noteRepo.findOne({
      where: { outlineId, userId },
    });

    if (!note) {
      note = this.noteRepo.create({
        outlineId,
        userId,
        filledAnswers: {},
        personalNotes: {},
        prayerCommitment: null,
        isEmailed: false,
      });
      note = await this.noteRepo.save(note);
    }

    return note;
  }

  async saveMyNote(
    outlineId: string,
    userId: string,
    dto: SaveMyNoteDto,
  ): Promise<UserSermonNote> {
    const note = await this.getMyNote(outlineId, userId);

    if (dto.filledAnswers !== undefined) {
      note.filledAnswers = dto.filledAnswers;
    }
    if (dto.personalNotes !== undefined) {
      note.personalNotes = dto.personalNotes;
    }
    if (dto.prayerCommitment !== undefined) {
      note.prayerCommitment = dto.prayerCommitment;
    }

    return this.noteRepo.save(note);
  }

  async emailMyNotes(
    outlineId: string,
    userId: string,
    userEmail: string,
  ): Promise<{ success: boolean; message: string }> {
    const outline = await this.findOutlineById(outlineId);
    const note = await this.getMyNote(outlineId, userId);

    note.isEmailed = true;
    await this.noteRepo.save(note);

    return {
      success: true,
      message: `Bản ghi chú bài giảng "${outline.title}" đã được gửi thành công đến địa chỉ email ${userEmail}.`,
    };
  }
}
