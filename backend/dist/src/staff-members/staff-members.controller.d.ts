import { StaffMembersService } from './staff-members.service';
export declare class StaffMembersController {
    private readonly staffMembersService;
    constructor(staffMembersService: StaffMembersService);
    findPublic(locale?: string): Promise<{
        id: number;
        imageUrl: string;
        name: string;
        position: string;
    }[]>;
}
