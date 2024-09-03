export type ReplyFormat = {
  data: any;
  message: string | any;
  success: boolean;
  status: number;
};

export function requestBuilder(
  data: any,
  message: string | any,
  success: boolean,
  status: number,
): ReplyFormat {
  return {
    data: data,
    message: message,
    success: success,
    status: status,
  };
}
