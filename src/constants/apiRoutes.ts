export const API_ROUTES = {
  ONLINE_STORE: (store: string) => `/api/OnlineStore/${store}`,

  CHECK_PHONE_NUMBER: (store: string, phone: string) =>
    `/api/OnlineStore/${store}/checknumber/${phone}`,
};
