import { IsObject, IsOptional, IsString } from 'class-validator';

export class SaveMyNoteDto {
  @IsOptional()
  @IsObject()
  filledAnswers?: Record<string, string>;

  @IsOptional()
  @IsObject()
  personalNotes?: Record<string, string>;

  @IsOptional()
  @IsString()
  prayerCommitment?: string;
}
