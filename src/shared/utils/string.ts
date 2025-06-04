/**
 * 문자열의 첫 글자만 대문자로 변환하는 함수
 * @example
 * capitalizeFirstLetter('hello world') // 'Hello world'
 * @example
 * capitalizeFirstLetter('array in a') // 'Array in a'
 * @example
 * capitalizeFirstLetter('typeScript') // 'Typescript'
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function slugify(node: React.ReactNode) {
  const str = node?.toString();
  if (!str || str.includes("title")) {
    return null;
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^a-zㄱ-ㅎㅏ-ㅣ가-힣0-9-]/g, "");
}
