import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { parse, isValid } from 'date-fns';

@ValidatorConstraint({ async: false })
export class IsValidStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(startDate: any, args: ValidationArguments) {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

    if (typeof startDate !== 'string' || !dateRegex.test(startDate)) {
      return false;
    }

    const parsedDate = parse(startDate, 'dd.MM.yyyy', new Date());
    return isValid(parsedDate);
  }

  defaultMessage(args: ValidationArguments) {
    return 'startDate must be in dd.mm.yyyy format and be a valid date';
  }
}

export function IsValidStartDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidStartDateConstraint,
    });
  };
}
