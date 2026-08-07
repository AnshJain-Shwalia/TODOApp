import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  iceCreamStatus(): string {
    return 'IceCream is COLD!';
  }
}
