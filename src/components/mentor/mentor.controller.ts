import { Controller } from '@nestjs/common';
import { MentorService } from './mentor.service';

@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}
}
