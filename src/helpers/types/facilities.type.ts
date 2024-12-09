import { Facilities } from '@prisma/client';

export class FacilitiesType implements Facilities {
  id: string;

  name: string;

  mediaId: string;
}
