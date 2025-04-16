"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import {
  CallProductList,
  CallCreateProduct,
  CallUpdateProduct,
  CallDeleteProduct,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/utils/handleCommonErrors";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();

  const [productToDelete, setProductToDelete] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const getProductData = async () => {
    try {
      setLoading(true);
      const { data, error } = await CallProductList();
      if (data?.data) {
        setProducts(data.data);
      }
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  const openCreateModal = () => {
    reset();
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    for (const key in product) {
      if (Object.hasOwn(product, key)) {
        setValue(key, product[key]);
      }
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoadingBtn(true);

      if (editingProduct) {
        const { data, error } = await CallUpdateProduct({
          ...formData,
          _id: editingProduct._id,
        });
        if (data?.data) {
          toast.success("Product updated successfully!");
        }
        if (error) handleCommonErrors(error);
      } else {
        const { data, error } = await CallCreateProduct(formData);
        if (data?.data) {
          toast.success("Product created successfully!");
        }
        if (error) handleCommonErrors(error);
      }

      setIsModalOpen(false);
      reset();
      await getProductData();
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setLoadingBtn(false);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const { data, error } = await CallDeleteProduct(productToDelete._id);
      if (data?.message) {
        toast.success("Product deleted successfully!");
        await getProductData();
      }
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("Delete Error:", err);
    } finally {
      onDeleteModalOpenChange(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product List</h2>
        <Button radius="sm" color="primary" onClick={openCreateModal}>
          + Create Product
        </Button>
      </div>

      <Table aria-label="Product List Table" isStriped className="text-sm">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>SKU</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>QUANTITY</TableColumn>
          <TableColumn>UNIT PRICE</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={
            <Spinner label="Loading Products..." color="primary" />
          }
        >
          {products.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantityAvailable}</TableCell>
              <TableCell>₹{item.unitPrice}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => openEditModal(item)}
                    className="p-1 min-w-fit"
                  >
                    <CiEdit size={25} />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setProductToDelete(item);
                      openDeleteModal();
                    }}
                    className="p-1 min-w-fit"
                  >
                    <MdDeleteOutline size={25} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create/Edit Product Modal */}
      <Modal radius="sm" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            {editingProduct ? "Edit Product" : "Create Product"}
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody className="space-y-2">
              <Input
                label="Name"
                isInvalid={!!errors.name}
                errorMessage={errors?.name?.message}
                {...register("name", { required: "Name is required" })}
              />
              <Input
                label="SKU"
                isInvalid={!!errors.sku}
                errorMessage={errors?.sku?.message}
                {...register("sku", { required: "SKU is required" })}
              />
              <Input
                label="Category"
                isInvalid={!!errors.category}
                errorMessage={errors?.category?.message}
                {...register("category", { required: "Category is required" })}
              />
              <Input
                label="Description"
                isInvalid={!!errors.description}
                errorMessage={errors?.description?.message}
                {...register("description", {
                  required: "Description is required",
                })}
              />
              <Input
                label="Quantity Available"
                type="number"
                isInvalid={!!errors.quantityAvailable}
                errorMessage={errors?.quantityAvailable?.message}
                {...register("quantityAvailable", {
                  required: "Quantity is required",
                  valueAsNumber: true,
                })}
              />
              <Input
                label="Unit Price (₹)"
                type="number"
                isInvalid={!!errors.unitPrice}
                errorMessage={errors?.unitPrice?.message}
                {...register("unitPrice", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                radius="sm"
                variant="light"
                onPress={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                isLoading={loadingBtn}
                radius="sm"
                type="submit"
                color="primary"
              >
                {editingProduct ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <div>
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>?
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              radius="sm"
              onPress={() => onDeleteModalOpenChange(false)}
            >
              Cancel
            </Button>
            <Button radius="sm" color="danger" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Product;
