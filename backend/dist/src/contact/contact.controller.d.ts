import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    findAll(): Promise<{
        items: {
            id: number;
            createdAt: Date;
            name: string;
            phone: string;
            message: string;
            isRead: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    submitForm(createContactDto: CreateContactDto): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string;
        message: string;
        isRead: boolean;
    }>;
    markAsRead(id: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        phone: string;
        message: string;
        isRead: boolean;
    }>;
}
