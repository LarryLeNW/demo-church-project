import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { SermonsService } from './sermons.service.js';

describe('SermonsService', () => {
  let service: SermonsService;
  let outlineRepo: any;
  let noteRepo: any;

  beforeEach(() => {
    outlineRepo = {
      findOne: vi.fn(),
      find: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'outline-1' })),
      save: vi.fn(async (o) => ({ ...o, id: o.id || 'outline-1' })),
      remove: vi.fn().mockResolvedValue(true),
      createQueryBuilder: vi.fn(),
    };

    noteRepo = {
      findOne: vi.fn(),
      create: vi.fn((dto) => ({ ...dto, id: 'note-1' })),
      save: vi.fn(async (n) => ({ ...n, id: n.id || 'note-1' })),
      delete: vi.fn().mockResolvedValue(true),
    };

    service = new SermonsService(outlineRepo, noteRepo);
  });

  it('creates sermon outline with points and discussion questions', async () => {
    const outline = await service.createOutline({
      title: 'Sức Mạnh Lòng Biết Ơn',
      titleEn: 'Power of Gratitude',
      serviceDate: '2026-11-08',
      mainScriptureRef: '1 Tê-sa-lô-ni-ca 5:18',
      mainScriptureTextVi: 'Phàm việc gì cũng phải tạ ơn Chúa.',
      mainScriptureTextEn: 'Give thanks in all circumstances.',
      outlinePoints: [
        {
          id: 'p1',
          pointNumber: 1,
          titleVi: 'Điểm 1',
          titleEn: 'Point 1',
          fillInBlankTextVi: 'Chúa {{lớn hơn}} nan đề.',
          blankAnswersVi: ['lớn hơn'],
          fillInBlankTextEn: 'God is {{greater}} than problems.',
          blankAnswersEn: ['greater'],
        },
      ],
      discussionQuestions: ['Câu hỏi 1?'],
    });

    expect(outlineRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Sức Mạnh Lòng Biết Ơn',
        serviceDate: '2026-11-08',
      }),
    );
    expect(outline.id).toBe('outline-1');
  });

  it('finds latest published sermon outline', async () => {
    const mockOutline = { id: 'latest-1', title: 'Bài Giảng Mới Nhất' };

    outlineRepo.createQueryBuilder.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getOne: vi.fn().mockResolvedValue(mockOutline),
    });

    const result = await service.findLatestOutline('Dallas Main Campus');
    expect(result.id).toBe('latest-1');
  });

  it('gets or creates empty user sermon note when first opened', async () => {
    outlineRepo.findOne.mockResolvedValue({ id: 'outline-1' });
    noteRepo.findOne.mockResolvedValue(null);

    const note = await service.getMyNote('outline-1', 'user-1');

    expect(noteRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        outlineId: 'outline-1',
        userId: 'user-1',
        filledAnswers: {},
        personalNotes: {},
      }),
    );
    expect(note.id).toBe('note-1');
  });

  it('saves member fill-in-the-blank answers and personal reflection notes', async () => {
    outlineRepo.findOne.mockResolvedValue({ id: 'outline-1' });
    const existingNote = {
      id: 'note-1',
      outlineId: 'outline-1',
      userId: 'user-1',
      filledAnswers: {},
      personalNotes: {},
    };
    noteRepo.findOne.mockResolvedValue(existingNote);

    const saved = await service.saveMyNote('outline-1', 'user-1', {
      filledAnswers: { p1_0: 'lớn hơn' },
      personalNotes: { p1: 'Cần ghi nhớ điều này khi gặp áp lực công việc.' },
      prayerCommitment: 'Lạy Chúa xin giúp con luôn tạ ơn.',
    });

    expect(saved.filledAnswers).toEqual({ p1_0: 'lớn hơn' });
    expect(saved.personalNotes).toEqual({ p1: 'Cần ghi nhớ điều này khi gặp áp lực công việc.' });
    expect(saved.prayerCommitment).toBe('Lạy Chúa xin giúp con luôn tạ ơn.');
    expect(noteRepo.save).toHaveBeenCalled();
  });

  it('records email sent status for sermon notes', async () => {
    outlineRepo.findOne.mockResolvedValue({ id: 'outline-1', title: 'Sức Mạnh Lòng Biết Ơn' });
    const existingNote = { id: 'note-1', outlineId: 'outline-1', userId: 'user-1', isEmailed: false };
    noteRepo.findOne.mockResolvedValue(existingNote);

    const result = await service.emailMyNotes('outline-1', 'user-1', 'member@example.com');

    expect(result.success).toBe(true);
    expect(existingNote.isEmailed).toBe(true);
    expect(noteRepo.save).toHaveBeenCalled();
  });

  it('throws NotFoundException when outline does not exist', async () => {
    outlineRepo.findOne.mockResolvedValue(null);

    await expect(service.findOutlineById('unknown')).rejects.toThrow(NotFoundException);
  });
});
