import { Controller, Get, Body, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyInfoDto } from './dto/update-company.dto';

@Controller('company-info')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('contact')
  async getContact() {
    return this.companyService.getContact();
  }

  @Get('map')
  async getMap() {
    return this.companyService.getMap();
  }

  // Admin: Used to update company details
  @Put('update')
  async updateInfo(@Body() updateDto: UpdateCompanyInfoDto) {
    return this.companyService.update(updateDto);
  }
}
