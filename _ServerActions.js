"use server";
import DataService from "@/services/requestApi";
import getSessionToken from "./services/getServerSession";

async function generateServerAction(func, token, ...args) {
  const responseObj = {
    data: null,
    error: null,
    func: null,
  };

  try {
    responseObj.func = func.toString();
    let response;

    if (token) {
      const userAccessToken = await getSessionToken();
      if (userAccessToken) {
        if (args.length) {
          response = await func(...args, userAccessToken);
        } else {
          response = await func(userAccessToken);
        }
      }
    } else {
      response = await func(...args);
    }

    if (response) {
      responseObj.data = response.data;
    }
  } catch (error) {
    responseObj.error = error.response?.data?.message || error.message;
  }
  return responseObj;
}

export const CallDashboardSummary = async () =>
  await generateServerAction(DataService.Summary, true);

export const CallProductList = async () =>
  await generateServerAction(DataService.GetAllProduct, true);

export const CallCreateProduct = async (data) =>
  await generateServerAction(DataService.CreateProduct, true, data);

export const CallUpdateProduct = async (data) =>
  await generateServerAction(DataService.UpdateProduct, true, data);

export const CallDeleteProduct = async (data) =>
  await generateServerAction(DataService.DeleteProduct, true, data);

export const CallCustomerList = async () =>
  await generateServerAction(DataService.GetAllCustomer, true);

export const CallCreateCustomer = async (data) =>
  await generateServerAction(DataService.CreateCustomer, true, data);

export const CallUpdateCustomer = async (data) =>
  await generateServerAction(DataService.UpdateCustomer, true, data);

export const CallDeleteCustomer = async (data) =>
  await generateServerAction(DataService.DeleteCustomer, true, data);

export const CallGetAllSales = async () =>
  await generateServerAction(DataService.GetAllSales, true);

export const CallDeleteSales = async (data) =>
  await generateServerAction(DataService.DeleteSales, true, data);

export const CallCreateSale = async (data) =>
  await generateServerAction(DataService.CreateSale, true, data);

export const CallUpdateSale = async (data) =>
  await generateServerAction(DataService.UpdateSale, true, data);

export const CallUpdateSaleStatus = async (data) =>
  await generateServerAction(DataService.UpdateSaleStatus, true, data);

export const CallGetAllPurchase = async () =>
  await generateServerAction(DataService.GetAllPurchase, true);

export const CallDeletePurchase = async (data) =>
  await generateServerAction(DataService.DeletePurchase, true, data);

export const CallCreatePurchase = async (data) =>
  await generateServerAction(DataService.CreatePurchase, true, data);

export const CallUpdatePurchase = async (data) =>
  await generateServerAction(DataService.UpdatePurchase, true, data);

export const CallUpdatePurchaseStatus = async (data) =>
  await generateServerAction(DataService.UpdatePurchaseStatus, true, data);
