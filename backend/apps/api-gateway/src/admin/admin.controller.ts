import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('public')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
}
