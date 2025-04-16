"use client";

import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";
import { CallDashboardSummary } from "@/_ServerActions";
import { handleCommonErrors } from "@/utils/handleCommonErrors";
import { Card, CardBody, Skeleton } from "@heroui/react";

const statCards = [
  {
    title: "Total Sales",
    key: "totalSales",
    icon: <FaShoppingCart className="text-blue-500" size={30} />,
  },
  {
    title: "Confirmed Sales",
    key: "confirmedSales",
    icon: <FaCheckCircle className="text-green-500" size={30} />,
  },
  {
    title: "Cancelled Sales",
    key: "cancelledSales",
    icon: <FaTimesCircle className="text-red-500" size={30} />,
  },
  {
    title: "Pending Sales",
    key: "pendingSales",
    icon: <FaClock className="text-yellow-500" size={30} />,
  },
  {
    title: "Total Revenue",
    key: "totalRevenue",
    icon: <FaRupeeSign className="text-purple-500" size={30} />,
    isCurrency: true,
  },
];

const Home = () => {
  const [data, setData] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoad(true);
      const { data, error } = await CallDashboardSummary();
      if (data) {
        setData(data);
      }
      if (error) {
        handleCommonErrors(error);
      }
    } catch (error) {
      console.log("error::: ", error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(load ? Array.from({ length: 5 }) : statCards).map((card, index) => (
          <Card key={index} shadow="sm" className="p-4">
            <CardBody className="flex items-center gap-4">
              {load ? (
                <>
                  <Skeleton className="w-6 h-6 rounded-full bg-default-300" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-3/5 rounded-lg bg-default-200 mb-2" />
                    <Skeleton className="h-4 w-2/5 rounded-lg bg-default-300" />
                  </div>
                </>
              ) : (
                <>
                  {card.icon}
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-lg font-bold text-center">
                      {card.isCurrency
                        ? `₹${data[card.key] ?? 0}`
                        : data[card.key] ?? 0}
                    </p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
