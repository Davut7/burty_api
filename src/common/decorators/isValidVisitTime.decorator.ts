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
    const timeRegex = /^\d{2}-\d{2}$/;

    if (typeof visitTime !== 'string' || !timeRegex.test(visitTime)) {
      return false;
    }

    const [startHour, endHour] = visitTime.split('-').map(Number);

    if (startHour >= endHour) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'visitTime must be in hh-hh format, and the first hh must be less than the second hh';
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
