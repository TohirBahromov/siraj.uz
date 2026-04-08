import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
export declare class StaffMembersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findPublic(locale: string): Promise<{
        id: number;
        imageUrl: string;
        name: string;
        position: string;
    }[]>;
    findAllAdmin(): Promise<({
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
    })[]>;
    findOneAdmin(id: number): Promise<{
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
