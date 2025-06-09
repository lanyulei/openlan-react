export type FieldType =
  | 'shortString'
  | 'number'
  | 'float'
  | 'enum'
  | 'enumMulti'
  | 'date'
  | 'time'
  | 'datetime'
  | 'longString'
  | 'user'
  | 'timeZone'
  | 'boolean'
  | 'list'
  | 'table';

export const FieldTypeShortString: FieldType = 'shortString';
export const FieldTypeNumber = 'number';
export const FieldTypeFloat = 'float';
export const FieldTypeEnum = 'enum';
export const FieldTypeEnumMulti = 'enumMulti';
export const FieldTypeDate = 'date';
export const FieldTypeTime = 'time';
export const FieldTypeDatetime = 'datetime';
export const FieldTypeLongString = 'longString';
export const FieldTypeUser = 'user';
export const FieldTypeTimeZone = 'timeZone';
export const FieldTypeBoolean = 'boolean';
export const FieldTypeList = 'list';
export const FieldTypeTable = 'table';
