import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { FacilitiesService } from './facilities.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReviewReservationDto } from './dto/review-reservation.dto.js';
import { ReservationQueryDto } from './dto/reservation-query.dto.js';
import { CreateRoomDto } from './dto/create-room.dto.js';

@Controller('facilities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get('overview')
  async getOverview(@Query('campusId') campusId?: string) {
    return this.facilitiesService.getFacilitiesOverview(campusId);
  }

  @Get('rooms')
  async getRooms(@Query('campusId') campusId?: string) {
    return this.facilitiesService.getRooms(campusId);
  }

  @Get('rooms/:id')
  async getRoomById(@Param('id') id: string) {
    return this.facilitiesService.getRoomById(id);
  }

  @Post('rooms')
  @Roles(Role.SeniorPastor, Role.Admin)
  async createRoom(@Body() dto: CreateRoomDto) {
    return this.facilitiesService.createRoom(dto);
  }

  @Get('reservations')
  async getReservations(@Query() query: ReservationQueryDto) {
    return this.facilitiesService.getAllReservations(query);
  }

  @Get('reservations/my')
  async getMyReservations(@CurrentUser('id') userId: string) {
    return this.facilitiesService.getMyReservations(userId);
  }

  @Post('reservations')
  async createReservation(
    @CurrentUser('id') userId: string,
    @CurrentUser('fullName') userName: string,
    @Body() dto: CreateReservationDto,
  ) {
    return this.facilitiesService.createReservation(
      userId,
      userName || 'Tín Hữu',
      dto,
    );
  }

  @Patch('reservations/:id/review')
  @Roles(Role.SeniorPastor, Role.Admin, Role.MinistryLeader)
  async reviewReservation(
    @Param('id') id: string,
    @CurrentUser('id') reviewerId: string,
    @CurrentUser('fullName') reviewerName: string,
    @Body() dto: ReviewReservationDto,
  ) {
    return this.facilitiesService.reviewReservation(
      id,
      reviewerId,
      reviewerName || 'Ban Quản Trị',
      dto,
    );
  }

  @Get('equipment')
  async getEquipment(@Query('campusId') campusId?: string) {
    return this.facilitiesService.getEquipment(campusId);
  }
}
