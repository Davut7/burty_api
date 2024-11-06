import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidVisitTimeConstraint
  implements ValidatorConstraintInterface
{
  validate(visitTime: any, args: ValidationArguments) {
    const timeRegex = /^\d{2}:(00|30)-\d{2}:(00|30)$/;

    if (typeof visitTime !== 'string' || !timeRegex.test(visitTime)) {
      return false;
    }

    const [startTime, endTime] = visitTime.split('-');

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    if (
      startHour > endHour ||
      (startHour === endHour && startMinute >= endMinute)
    ) {
      return false;
    }

    if (
      startHour < 0 ||
      startHour > 23 ||
      endHour < 0 ||
      endHour > 23 ||
      (startMinute !== 0 && startMinute !== 30) ||
      (endMinute !== 0 && endMinute !== 30)
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'visitTime must be in hh:mm-hh:mm format with only 00 or 30 minutes, and the start time must be less than the end time within the 00:00 to 23:30 range';
  }
}

export function IsValidVisitTime(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidVisitTimeConstraint,
    });
  };
}
