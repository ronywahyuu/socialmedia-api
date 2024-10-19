enum StatusMessage {
  SUCCESS = 'success',
  ERROR = 'error',
}

export function createResponse({
  status,
  statusCode,
  message,
  data,
}: {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data?: any;
}) {
  return {
    status,
    statusCode,
    message,
    data,
  };
}

export function createErrorResponse(
  statusCode: number,
  message: string,
  error?: any,
) {
  return {
    statusCode,
    message,
    error,
  };
}
