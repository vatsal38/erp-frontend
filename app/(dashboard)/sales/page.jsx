"use client";

import {
  Select,
  SelectItem,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  CallCustomerList,
  CallProductList,
  CallCreateSale,
  CallUpdateSale,
  CallGetAllSales,
  CallDeleteSales,
  CallUpdateSaleStatus,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { handleCommonErrors } from "@/utils/handleCommonErrors";
import moment from "moment";
import { CiEdit } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import { IoPrintOutline } from "react-icons/io5";
import Dataservice from "@/services/requestApi";
import { useSession } from "next-auth/react";

const SalesForm = () => {
  const { data: session } = useSession();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSale, setEditingSale] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isCancelSellOpen, setIsCancelSellOpen] = useState(false);
  const [sellSale, setSellSale] = useState(null);
  const [cancelSale, setCancelSellSale] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customer: "",
      products: [{ product: "", quantity: 1 }],
    },
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await CallGetAllSales();
      if (data?.data) setSalesData(data?.data);
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const getData = async () => {
    const customerRes = await CallCustomerList();
    const productRes = await CallProductList();

    if (customerRes?.data?.data) setCustomers(customerRes.data.data);
    if (productRes?.data?.data) setProducts(productRes.data.data);

    if (editingSale) {
      reset({
        customer: editingSale.customer,
        products: editingSale.products.map((p) => ({
          product: p.product,
          quantity: p.quantity,
        })),
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      reset({
        customer: "",
        products: [{ product: "", quantity: 1 }],
      });
      setEditingSale(null);
    }
  }, [isOpen]);

  const onSubmit = async (formData) => {
    setLoadingBtn(true);
    const payload = {
      customer: formData?.customer,
      products: formData?.products,
    };

    try {
      let data;
      if (editingSale) {
        data = await CallUpdateSale({ ...payload, _id: editingSale?._id });
        toast.success(data?.data?.message);
      } else {
        data = await CallCreateSale(payload);
        toast.success(data?.data?.message);
      }
      fetchSales();
      onOpenChange(false);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBtn(false);
    }
  };

  const onEdit = (sale) => {
    setEditingSale(sale);
    reset({
      customer: sale?.customer?._id || "",
      products:
        sale?.products?.map((ele) => ({
          product: ele?.product?._id,
          quantity: ele?.quantity,
        })) || [],
    });
    onOpen();
  };

  const confirmDelete = (saleId) => {
    setSaleToDelete(saleId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const { data, error } = await CallDeleteSales(saleToDelete);
      if (data) {
        toast.success(data?.message);
        await fetchSales();
      }
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("Delete Error:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setSaleToDelete(null);
      setIsCancelSellOpen(false);
    }
  };

  const onOpenSell = () => setIsSellOpen(true);
  const onOpenCancelSell = () => setIsCancelSellOpen(true);
  const onCloseSell = () => setIsSellOpen(false);
  const onCloseCancelSell = () => setIsCancelSellOpen(false);

  const handleSell = async (status, state) => {
    try {
      const { data, error } = await CallUpdateSaleStatus({
        _id: state?._id,
        status: status,
      });
      if (data) {
        toast.success(data?.message);
        await fetchSales();
        onCloseSell();
      }
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("Delete Error:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setSaleToDelete(null);
      setIsCancelSellOpen(false);
      setCancelSellSale(null);
    }
  };
  const printPdf = async (id) => {
    try {
      const { data: printResponse } = await Dataservice.SaleInvoice(
        id,
        session?.user?.token
      );
      const url = window.URL.createObjectURL(new Blob([printResponse]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.log("error::: ", error);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sales List</h2>
        <Button radius="sm" color="primary" onPress={onOpen}>
          + New Sale
        </Button>
      </div>
      <Table aria-label="Sales Table" isStriped>
        <TableHeader>
          <TableColumn>Sr.No</TableColumn>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Products</TableColumn>
          <TableColumn>Total Amount</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner />}
          emptyContent={"No sales found."}
        >
          {salesData.map((sale, index) => (
            <TableRow key={sale._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{sale.customer?.name || "N/A"}</TableCell>

              <TableCell>
                <ul className="list-disc pl-4">
                  {sale.products.map((item) => (
                    <li key={item._id}>
                      {`${item.product?.name} (${item.product?.unitPrice}₹)` ||
                        "N/A"}{" "}
                      × {item.quantity}
                    </li>
                  ))}
                </ul>
              </TableCell>

              <TableCell>₹{sale.totalAmount}</TableCell>

              <TableCell>
                <Chip
                  color={
                    sale.status === "Confirmed"
                      ? "success"
                      : sale.status === "Cancelled"
                      ? "danger"
                      : "warning"
                  }
                  size="sm"
                >
                  {sale.status}
                </Chip>
              </TableCell>

              <TableCell>
                {moment(sale.createdAt).format("DD/MM/YYYY hh:mm A")}
              </TableCell>

              <TableCell>
                <div className="flex gap-2 h-full">
                  <Tooltip content="Edit">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => onEdit(sale)}
                      isDisabled={
                        sale.status === "Confirmed" ||
                        sale.status === "Cancelled"
                      }
                    >
                      <CiEdit size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => confirmDelete(sale._id)}
                      isDisabled={
                        sale.status === "Confirmed" ||
                        sale.status === "Cancelled"
                      }
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Print">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="default"
                      onPress={() => printPdf(sale._id)}
                    >
                      <IoPrintOutline size={16} />
                    </Button>
                  </Tooltip>
                  <Button
                    size="sm"
                    radius="sm"
                    variant="bordered"
                    color="secondary"
                    onPress={() => {
                      setSellSale(sale);
                      onOpenSell();
                    }}
                    isDisabled={
                      sale.status === "Confirmed" || sale.status === "Cancelled"
                    }
                  >
                    Sell
                  </Button>
                  <Button
                    size="sm"
                    radius="sm"
                    variant="bordered"
                    color="danger"
                    onPress={() => {
                      setCancelSellSale(sale);
                      onOpenCancelSell();
                    }}
                    isDisabled={
                      sale.status === "Confirmed" || sale.status === "Cancelled"
                    }
                  >
                    Cancelled
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{editingSale ? "Edit Sale" : "Create Sale"}</ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              {/* Customer Select */}
              <Controller
                name="customer"
                control={control}
                rules={{ required: "Customer is required" }}
                render={({ field }) => (
                  <Select
                    label="Customer"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(val) => field.onChange([...val][0])}
                    variant="bordered"
                    isInvalid={!!errors.customer}
                    errorMessage={errors.customer?.message}
                  >
                    {customers.map((cust) => (
                      <SelectItem key={cust._id}>{cust.name}</SelectItem>
                    ))}
                  </Select>
                )}
              />

              {/* Product Fields */}
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  {/* Product Select */}
                  <Controller
                    name={`products.${index}.product`}
                    control={control}
                    rules={{ required: "Product is required" }}
                    render={({ field }) => (
                      <Select
                        label="Product"
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(val) => field.onChange([...val][0])}
                        className="w-full"
                        variant="bordered"
                        isInvalid={!!errors.products?.[index]?.product}
                        errorMessage={
                          errors.products?.[index]?.product?.message
                        }
                      >
                        {products.map((prod) => (
                          <SelectItem key={prod._id}>{prod.name}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  {/* Quantity Input */}
                  <Input
                    type="number"
                    label="Qty"
                    {...register(`products.${index}.quantity`, {
                      required: "Quantity is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Minimum quantity is 1",
                      },
                    })}
                    isInvalid={!!errors.products?.[index]?.quantity}
                    errorMessage={errors.products?.[index]?.quantity?.message}
                    className="max-w-[100px]"
                  />

                  {/* Remove Button */}
                  <Button
                    isIconOnly
                    color="danger"
                    onPress={() => remove(index)}
                  >
                    −
                  </Button>
                </div>
              ))}

              {/* Add Product Button */}
              <Button
                type="button"
                onPress={() => append({ product: "", quantity: 1 })}
              >
                + Add Product
              </Button>
            </ModalBody>

            <ModalFooter>
              <Button variant="light" onPress={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loadingBtn} color="primary">
                {editingSale ? "Update Sale" : "Create Sale"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this sale? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteConfirmed}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSellOpen} onOpenChange={onCloseSell}>
        <ModalContent>
          <ModalHeader>Mark as Sell</ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSell("Confirmed", sellSale);
            }}
          >
            <ModalBody>
              <p>Are you sure you want to mark this sold?</p>
              <p className="text-sm text-gray-500">
                Customer: {sellSale?.customer?.name}
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left">Product</th>
                      <th className="border px-2 py-1 text-left">SKU</th>
                      <th className="border px-2 py-1 text-right">Qty</th>
                      <th className="border px-2 py-1 text-right">
                        Unit Price
                      </th>
                      <th className="border px-2 py-1 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellSale?.products?.map((item) => (
                      <tr key={item._id}>
                        <td className="border px-2 py-1">
                          {item.product.name}
                        </td>
                        <td className="border px-2 py-1">{item.product.sku}</td>
                        <td className="border px-2 py-1 text-right">
                          {item.quantity}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          ₹{item.product.unitPrice}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          ₹{item.quantity * item.product.unitPrice}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td className="border px-2 py-1 text-right" colSpan={4}>
                        Total Amount
                      </td>
                      <td className="border px-2 py-1 text-right">
                        ₹{sellSale?.totalAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCloseSell}>
                Cancel
              </Button>
              <Button type="submit" color="success" isLoading={loadingBtn}>
                Confirm
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Modal isOpen={isCancelSellOpen} onOpenChange={onCloseCancelSell}>
        <ModalContent>
          <ModalHeader>Mark as Cancel</ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSell("Cancelled", cancelSale);
            }}
          >
            <ModalBody>
              <p>Are you sure you want to cancel?</p>
              <p className="text-sm text-gray-500">
                Customer: {cancelSale?.customer?.name}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCloseCancelSell}>
                Cancel
              </Button>
              <Button type="submit" color="danger" isLoading={loadingBtn}>
                Confirm
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SalesForm;
