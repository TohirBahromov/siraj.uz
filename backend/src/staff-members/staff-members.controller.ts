import { Controller, Get, Query } from '@nestjs/common';
import { StaffMembersService } from './staff-members.service';

@Controller('staff-members')
export class StaffMembersController {
  constructor(private readonly staffMembersService: StaffMembersService) {}

  @Get()
  findPublic(@Query('locale') locale?: string) {
    return this.staffMembersService.findPublic(locale?.trim() || 'uz');
  }
}
