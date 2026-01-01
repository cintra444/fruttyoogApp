// Services/stockService.ts
import api from "./apiFruttyoog";

export const getCurrentStock = async () => {
  const response = await api.get("/estoque");
  return response.data;
};
