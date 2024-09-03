export function formatResponse(data: any) {
  const formStringifyData = JSON.stringify(data, null, 2);
  return JSON.parse(formStringifyData);
}
