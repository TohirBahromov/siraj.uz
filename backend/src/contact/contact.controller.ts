import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('')
  async findAll() {
    return this.contactService.findAll();
  }

  @Post('submit')
  async submitForm(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.markAsRead(id);
  }
}
