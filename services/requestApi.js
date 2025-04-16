import http from "./http-common";

class DataService {
  // Login Services
  Login(data) {
    return http.post(`auth/login`, data);
  }
  Signup(data) {
    return http.post(`auth/signup`, data);
  }
  Summary(token) {
    return http.get(`dashboard/summary`, {
      headers: {
        Authorization: token,
      },
    });
  }
  GetAllProduct(token) {
    return http.get(`products`, {
      headers: {
        Authorization: token,
      },
    });
  }
  CreateProduct(data, token) {
    return http.post(`products`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  UpdateProduct(data, token) {
    return http.put(`products/${data?._id}`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  DeleteProduct(data, token) {
    return http.delete(`products/${data}`, {
      headers: {
        Authorization: token,
      },
    });
  }
  GetAllCustomer(token) {
    return http.get(`customers`, {
      headers: {
        Authorization: token,
      },
    });
  }
  CreateCustomer(data, token) {
    return http.post(`customers`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  UpdateCustomer(data, token) {
    return http.put(`customers/${data?._id}`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  DeleteCustomer(data, token) {
    return http.delete(`customers/${data}`, {
      headers: {
        Authorization: token,
      },
    });
  }
  GetAllSales(token) {
    return http.get(`sales`, {
      headers: {
        Authorization: token,
      },
    });
  }
  DeleteSales(data, token) {
    return http.delete(`sales/${data}`, {
      headers: {
        Authorization: token,
      },
    });
  }
  CreateSale(data, token) {
    return http.post(`sales`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  UpdateSale(data, token) {
    return http.put(`sales/${data?._id}`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  UpdateSaleStatus(data, token) {
    return http.put(`sales/${data?._id}/status`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  SaleInvoice(data, token) {
    return http.get(`sales/${data}/invoice`, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });
  }
  GetAllPurchase(token) {
    return http.get(`purchase`, {
      headers: {
        Authorization: token,
      },
    });
  }
  DeletePurchase(data, token) {
    return http.delete(`purchase/${data}`, {
      headers: {
        Authorization: token,
      },
    });
  }
  CreatePurchase(data, token) {
    return http.post(`purchase`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  UpdatePurchase(data, token) {
    return http.put(`purchase/${data?._id}`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
  UpdatePurchaseStatus(data, token) {
    return http.patch(`purchase/${data?._id}/confirm`, data, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new DataService();
