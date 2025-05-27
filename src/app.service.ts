import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return { stauts: 'up', time: new Date().toUTCString() };
  }
}
