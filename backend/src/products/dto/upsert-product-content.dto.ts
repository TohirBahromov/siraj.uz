import { IsArray } from 'class-validator';

export class UpsertProductContentDto {
  @IsArray()
  blocks: Record<string, unknown>[];
}
