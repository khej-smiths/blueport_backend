export const input = 'input';

// 제네릭 타입으로 지정한 객체의 키를 배열로 반환하는 함수
export function getObjectKeysByGeneric<T extends object>(
  object: T,
): Array<keyof T> {
  return Object.keys(object) as Array<keyof T>;
}
