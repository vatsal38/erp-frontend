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
  CallCreatePurchase,
  CallDeletePurchase,
  CallGetAllPurchase,
  CallProductList,
  CallUpdatePurchase,
  CallUpdatePurchaseStatus,
} from "@/_ServerActions";
import toast from "react-hot-toast";
import { handleCommonErrors } from "@/utils/handleCommonErrors";
import moment from "moment";
import { CiEdit } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import { IoPrintOutline } from "react-icons/io5";
import Dataservice from "@/services/requestApi";
import { useSession } from "next-auth/react";

const PurchaseForm = () => {
  const { data: session } = useSession();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [PurchaseToDelete, setPurchaseToDelete] = useState(null);
  const [isReceivedOpen, setIsReceivedOpen] = useState(false);
  const [receivedPurchase, setReceivedPurchase] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      supplierName: "",
      products: [{ product: "", quantity: 1 }],
    },
  });

  useEffect(() => {
    fetchPurchase();
  }, []);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const { data, error } = await CallGetAllPurchase();
      if (data?.data) setPurchaseData(data?.data);
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
    const productRes = await CallProductList();
    if (productRes?.data?.data) setProducts(productRes.data.data);
    if (editingPurchase) {
      reset({
        supplierName: editingPurchase.supplierName,
        products: editingPurchase.products.map((p) => ({
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
        supplierName: "",
        products: [{ product: "", quantity: 1 }],
      });
      setEditingPurchase(null);
    }
  }, [isOpen]);

  const onSubmit = async (formData) => {
    setLoadingBtn(true);
    const payload = {
      supplierName: formData?.supplierName,
      products: formData?.products,
    };

    try {
      let data;
      if (editingPurchase) {
        data = await CallUpdatePurchase({
          ...payload,
          _id: editingPurchase?._id,
        });
        toast.success(data?.data?.message);
      } else {
        data = await CallCreatePurchase(payload);
        toast.success(data?.data?.message);
      }
      fetchPurchase();
      onOpenChange(false);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBtn(false);
    }
  };

  const onEdit = (Purchase) => {
    setEditingPurchase(Purchase);
    reset({
      supplierName: Purchase?.supplierName || "",
      products:
        Purchase?.products?.map((ele) => ({
          product: ele?.product?._id,
          quantity: ele?.quantity,
        })) || [],
    });
    onOpen();
  };

  const confirmDelete = (PurchaseId) => {
    setPurchaseToDelete(PurchaseId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const { data, error } = await CallDeletePurchase(PurchaseToDelete);
      if (data) {
        toast.success(data?.message);
        await fetchPurchase();
      }
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("Delete Error:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setPurchaseToDelete(null);
    }
  };

  const onOpenReceived = () => setIsReceivedOpen(true);
  const onCloseReceived = () => setIsReceivedOpen(false);

  const handleReceived = async () => {
    try {
      const { data, error } = await CallUpdatePurchaseStatus({
        _id: receivedPurchase?._id,
      });
      if (data) {
        toast.success(data?.message);
        await fetchPurchase();
        onCloseReceived();
      }
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("Delete Error:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setPurchaseToDelete(null);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Purchase List</h2>
        <Button radius="sm" color="primary" onPress={onOpen}>
          + New Purchase
        </Button>
      </div>
      <Table aria-label="Purchase Table" isStriped>
        <TableHeader>
          <TableColumn>Sr.No</TableColumn>
          <TableColumn>Supplier Name</TableColumn>
          <TableColumn>Products</TableColumn>
          <TableColumn>Total Amount</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner />}
          emptyContent={"No purchase found."}
        >
          {purchaseData.map((Purchase, index) => (
            <TableRow key={Purchase._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{Purchase.supplierName || "N/A"}</TableCell>

              <TableCell>
                <ul className="list-disc pl-4">
                  {Purchase.products.map((item) => (
                    <li key={item._id}>
                      {`${item.product?.name} (${item.product?.unitPrice}₹)` ||
                        "N/A"}{" "}
                      × {item.quantity}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>₹{Purchase.totalAmount || 0}</TableCell>
              <TableCell>
                <Chip
                  color={
                    Purchase.status === "Confirmed" ? "success" : "warning"
                  }
                  size="sm"
                >
                  {Purchase.status}
                </Chip>
              </TableCell>

              <TableCell>
                {moment(Purchase.createdAt).format("DD/MM/YYYY hh:mm A")}
              </TableCell>

              <TableCell>
                <div className="flex gap-2 h-full">
                  <Tooltip content="Edit">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => onEdit(Purchase)}
                      isDisabled={Purchase.status === "Confirmed"}
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
                      onPress={() => confirmDelete(Purchase._id)}
                      isDisabled={Purchase.status === "Confirmed"}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </Tooltip>
                  <Button
                    size="sm"
                    radius="sm"
                    variant="bordered"
                    color="secondary"
                    onPress={() => {
                      setReceivedPurchase(Purchase);
                      onOpenReceived();
                    }}
                    isDisabled={Purchase.status === "Confirmed"}
                  >
                    Received
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            {editingPurchase ? "Edit Purchase" : "Create Purchase"}
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Input
                label="Supplier Name"
                isInvalid={!!errors.supplierName}
                variant="bordered"
                errorMessage={errors?.supplierName?.message}
                {...register("supplierName", {
                  required: "Supplier Name is required",
                })}
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
                {editingPurchase ? "Update Purchase" : "Create Purchase"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this Purchase? This action cannot be
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

      <Modal isOpen={isReceivedOpen} onOpenChange={onCloseReceived}>
        <ModalContent>
          <ModalHeader>Mark as Received</ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleReceived();
            }}
          >
            <ModalBody>
              <p>Are you sure you want to mark this Purchase as received?</p>
              <p className="text-sm text-gray-500">
                Supplier: {receivedPurchase?.supplierName}
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
                    {receivedPurchase?.products?.map((item) => (
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
                        ₹{receivedPurchase?.totalAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onCloseReceived}>
                Cancel
              </Button>
              <Button type="submit" color="success" isLoading={loadingBtn}>
                Confirm
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PurchaseForm;
