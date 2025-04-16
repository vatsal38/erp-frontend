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
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import {
  CallCustomerList,
  CallCreateCustomer,
  CallUpdateCustomer,
  CallDeleteCustomer,
} from "@/_ServerActions";
import { handleCommonErrors } from "@/utils/handleCommonErrors";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const getCustomerData = async () => {
    try {
      setLoading(true);
      const { data, error } = await CallCustomerList();
      if (data?.data) setCustomers(data.data);
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  const openCreateModal = () => {
    reset();
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
    for (const key in customer) {
      if (Object.hasOwn(customer, key)) {
        setValue(key, customer[key]);
      }
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoadingBtn(true);

      if (editingCustomer) {
        const { data, error } = await CallUpdateCustomer({
          ...formData,
          _id: editingCustomer._id,
        });
        if (data?.data) toast.success("Customer updated successfully!");
        if (error) handleCommonErrors(error);
      } else {
        const { data, error } = await CallCreateCustomer(formData);
        if (data?.data) toast.success("Customer created successfully!");
        if (error) handleCommonErrors(error);
      }

      setIsModalOpen(false);
      reset();
      await getCustomerData();
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setLoadingBtn(false);
    }
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      const { data, error } = await CallDeleteCustomer(customerToDelete._id);
      if (data?.message) {
        toast.success("Customer deleted successfully!");
        await getCustomerData();
      }
      if (error) handleCommonErrors(error);
    } catch (err) {
      console.log("Delete Error:", err);
    } finally {
      onDeleteModalOpenChange(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Customer List</h2>
        <Button radius="sm" color="primary" onClick={openCreateModal}>
          + Create Customer
        </Button>
      </div>

      <Table aria-label="Customer List Table" isStriped className="text-sm">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE</TableColumn>
          <TableColumn>ADDRESS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={
            <Spinner label="Loading Customers..." color="primary" />
          }
        >
          {customers.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.address}</TableCell>
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
                      setCustomerToDelete(item);
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

      {/* Create/Edit Modal */}
      <Modal radius="sm" isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            {editingCustomer ? "Edit Customer" : "Create Customer"}
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
                label="Email"
                isInvalid={!!errors.email}
                errorMessage={errors?.email?.message}
                {...register("email", { required: "Email is required" })}
              />
              <Input
                label="Phone"
                isInvalid={!!errors.phone}
                errorMessage={errors?.phone?.message}
                {...register("phone", { required: "Phone is required" })}
              />
              <Textarea
                label="Address"
                isInvalid={!!errors.address}
                errorMessage={errors?.address?.message}
                {...register("address", { required: "Address is required" })}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                radius="sm"
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
                {editingCustomer ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <div>
              Are you sure you want to delete{" "}
              <strong>{customerToDelete?.name}</strong>?
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

export default Customer;
