export type imageTypes = {
    requestId: string;
    at: string;
    data: {
      url: string;
      ext: string;
      name: string;
    };
    error: {
      code: number;
      message: string;
    }
  };