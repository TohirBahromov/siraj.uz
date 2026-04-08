import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMembersService } from './staff-members.service';

@Controller('admin/staff-members')
@UseGuards(JwtAuthGuard)
export class AdminStaffMembersController {
  constructor(private readonly staffMembersService: StaffMembersService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.staffMembersService.findAllAdmin(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 15,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.staffMembersService.findOneAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateStaffMemberDto) {
    return this.staffMembersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStaffMemberDto) {
    return this.staffMembersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.staffMembersService.remove(id);
  }
}
