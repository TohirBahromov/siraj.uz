import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminStaffMembersController } from './admin-staff-members.controller';
import { StaffMembersController } from './staff-members.controller';
import { StaffMembersService } from './staff-members.service';

@Module({
  imports: [AuthModule],
  controllers: [StaffMembersController, AdminStaffMembersController],
  providers: [StaffMembersService],
})
export class StaffMembersModule {}
