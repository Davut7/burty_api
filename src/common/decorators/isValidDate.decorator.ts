import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(startDate: any, args: ValidationArguments) {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    return typeof startDate === 'string' && dateRegex.test(startDate);
  }

  defaultMessage(args: ValidationArguments) {
    return 'startDate must be in dd.mm.yyyy format';
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
