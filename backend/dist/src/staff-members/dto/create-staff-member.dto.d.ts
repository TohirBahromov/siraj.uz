import { StaffMemberTranslationDto } from './staff-member-translation.dto';
export declare class CreateStaffMemberDto {
    imageUrl: string;
    order?: number;
    translations: StaffMemberTranslationDto[];
}
