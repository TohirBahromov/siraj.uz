import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMembersService } from './staff-members.service';
export declare class AdminStaffMembersController {
    private readonly staffMembersService;
    constructor(staffMembersService: StaffMembersService);
    findAll(page?: string, limit?: string): Promise<{
        items: ({
            translations: {
                locale: string;
                id: number;
                name: string;
                position: string;
                staffMemberId: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            imageUrl: string;
            order: number;
        })[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    findOne(id: number): Promise<{
        translations: {
            locale: string;
            id: number;
            name: string;
            position: string;
            staffMemberId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        order: number;
    }>;
    create(dto: CreateStaffMemberDto): Promise<{
        translations: {
            locale: string;
            id: number;
            name: string;
            position: string;
            staffMemberId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        order: number;
    }>;
    update(id: number, dto: UpdateStaffMemberDto): Promise<{
        translations: {
            locale: string;
            id: number;
            name: string;
            position: string;
            staffMemberId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        order: number;
    }>;
    remove(id: number): Promise<{
        ok: boolean;
    }>;
}
