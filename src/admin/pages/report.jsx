/* eslint-disable react/prop-types */
import React from "react";
import { Helmet } from "react-helmet-async";
import { FerryBoatIcon, UserGroupIcon, WalletIcon } from "@/assets/icons";
import { formatValue } from "react-currency-input-field";
import { BarChart } from "@tremor/react";
import { BookingCTX } from "@/contexts/BookingContext";
// import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
// import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { format } from "date-fns";

const Report = () => {
  const { bookingQuery } = React.useContext(BookingCTX);
  const [total, setTotal] = React.useState({
    totalEarnings: 0,
    totalBooking: 0,
    totalOffline: 0,
    totalOnline: 0,
    totalPassengers: 0,
    totalTrips: 0,
    totalRentals: 0,
    totalRentalEarnings: 0,
    completedRentals: 0,
    upcomingRentals: 0,
    totalSuccess: 0,
    totalPending: 0,
    totalCanceled: 0,
    totalRentalCalabar: 0,
    totalRentalWithin: 0,
    totalRentalUyo: 0,
    revenue: [],
  });

  React.useEffect(() => {
    const totalEarnings = bookingQuery
      .filter((booking) => booking.status === "Success")
      .map((booking) => Number(booking?.total_ticket_cost ?? 0))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const totalOffline = bookingQuery.filter(
      (booking) => booking.medium === "Offline"
    ).length;

    const totalOnline = bookingQuery.filter(
      (booking) => booking.medium === "Online"
    ).length;

    const totalPassengers = bookingQuery
      .map((booking) => booking.total_passengers)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const totalSuccess = bookingQuery.filter(
      (booking) => booking.status == "Success"
    ).length;

    const totalPending = bookingQuery.filter(
      (booking) => booking.status == "Pending"
    ).length;

    const totalCanceled = bookingQuery.filter(
      (booking) => booking.status == "Canceled"
    ).length;

    axios
      .get("https://abitto-api.onrender.com/api/booking/getmonthly")
      .then((res) => {
        const totals = res.data;
        setTotal({
          totalEarnings,
          totalOffline,
          totalOnline,
          totalPassengers,
          totalSuccess,
          totalPending,
          totalCanceled,
          totalBooking: bookingQuery.length,
          totalTrips: totals.trips,
          totalRentals: totals.rentsCount,
          totalRentalEarnings: totals.rentRevenue,
          completedRentals: totals.rentalStatus.Completed,
          upcomingRentals: totals.rentalStatus.Upcoming,
          totalRentalWithin: totals.rentPackages["within marina"],
          totalRentalCalabar: totals.rentPackages["calabar to uyo"],
          totalRentalUyo: totals.rentPackages["uyo to calabar"],
          revenue: totals.revenue,
        });
      })
      .catch((error) => {
        console.error(error, "Error occurred while fetching journey list.");
        toast.error(
          "Error occurred while fetching journey list. Refresh page."
        );
      });
  }, [bookingQuery]);

  return (
    <>
      <Helmet>
        <title>Report | Admin</title>
      </Helmet>
      <h1 className="text-lg font-semibold">Report Overview</h1>
      <div className="my-8 grid grid-cols-12  gap-5 w-full ">
        <div className="col-start-1 col-span-8 row-span-1 bg-white rounded-lg p-5 ">
          <ul className="border rounded-lg p-5 flex flex-wrap *:grow  gap-5 justify-between items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
            <li className="item flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <WalletIcon />
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">Total Earnings (MRR)</p>
                <p className="text-base">
                  <strong>
                    {formatValue({
                      value: String(total.totalEarnings ?? 0),
                      prefix: "₦",
                      decimalScale: 2,
                    })}
                  </strong>
                </p>
              </div>
            </li>
            <li className="item flex items-center gap-3 ">
              <div className="rounded-lg bg-blue-50 p-2">
                <UserGroupIcon />
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">Total Passengers</p>
                <p className="text-base">
                  <strong>
                    {formatValue({ value: String(total.totalPassengers) })}
                  </strong>
                </p>
              </div>
            </li>
            <li className="item flex items-center gap-3 ">
              <div className="rounded-lg bg-blue-50 p-2">
                <FerryBoatIcon />
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">Completed Trips</p>
                <p className="text-base">
                  <strong>
                    {formatValue({ value: String(total.totalTrips) })}
                  </strong>
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="row-start-2 row-span-4  col-start-1 col-span-8 bg-white rounded-lg p-5 ">
          <div className="border rounded-lg p-5 flex flex-col justify-between h-full">
            <CustomizedBarChart props={{ data: total.revenue }} />
          </div>
        </div>

        <div className="row-span-3 row-start-1 col-start-9 col-span-4 bg-white rounded-lg  p-5">
          <div className="rounded-lg border p-5 space-y-5 mx-auto">
            <div className="max-w-[450px] mx-auto relative">
              <h3 className="font-semibold mb-1">Booking Overview</h3>
              <div className="w-fit aspect-video mx-auto">
                <PieChart
                  series={[
                    {
                      data: [
                        {
                          label: "Offline Booking",
                          value: total.totalOffline,
                          color: "#3366CC",
                        },
                        {
                          label: "Online Booking",
                          value: total.totalOnline,
                          color: "#85AD33",
                        },
                      ],
                      innerRadius: 100,
                      outerRadius: 150,
                      paddingAngle: 0,
                      cornerRadius: 0,
                      startAngle: -90,
                      endAngle: 90,
                      cx: 160,
                      cy: 145,
                    },
                  ]}
                  width={330}
                  height={200}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                />
              </div>
              <div className="w-full absolute top-28 space-y-3">
                <p className="text-center flex flex-col">
                  <strong className=" text-3xl font-semibold">
                    {total.totalBooking}
                  </strong>
                  <span className="text-[#7F7F7F] text-base">
                    Total Bookings
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5 items-center ">
                <p className="text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-blue-500 before:mr-3 text-nowrap">
                  {total.totalOffline} Offline Booking
                </p>
                <p className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
                  {total.totalOnline} Online Booking
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row-span-2 row-start-4 col-start-9 col-span-4 bg-white rounded-lg p-5 h-full w-full">
          <PaymentStatusPieChart
            props={{
              success: total.totalSuccess,
              pending: total.totalPending,
              canceled: total.totalCanceled,
            }}
          />
        </div>

        <div className="row-start-6 row-span-3 col-span-full rounded-lg h-96 pt-3">
          <h3 className="font-semibold">Rentals Overview</h3>
          <div className="my-8 grid grid-cols-12 gap-5 grid-rows-2 w-full">
            <div className="col-start-7 col-span-6 row-start-1 row-span-1 bg-white rounded-lg p-5 ">
              <ul className="border rounded-lg p-5 flex flex-wrap gap-5 justify-between *:grow items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
                <li className="item flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <WalletIcon />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F7F7F] ">
                      Total Rental Earnings
                    </p>
                    <p className="text-base">
                      <strong>
                        {formatValue({
                          value: String(total.totalRentalEarnings ?? 0),
                          prefix: "₦",
                          decimalScale: 2,
                        })}
                      </strong>
                    </p>
                  </div>
                </li>
                <li className="item flex items-center gap-3 ">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <UserGroupIcon />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F7F7F] ">Total Rentals</p>
                    <p className="text-base">
                      <strong>{total.totalRentals}</strong>
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="col-start-7 col-span-6 row-start-2 row-span-1 bg-white rounded-lg p-5 ">
              <ul className="border rounded-lg p-5 flex flex-wrap gap-5 justify-between *:grow items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
                <li className="item flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <WalletIcon />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F7F7F] ">Completed Rentals</p>
                    <p className="text-base">
                      <strong>{total.completedRentals}</strong>
                    </p>
                  </div>
                </li>
                <li className="item flex items-center gap-3 ">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <UserGroupIcon />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F7F7F] ">Upcoming Rentals</p>
                    <p className="text-base">
                      <strong>{total.upcomingRentals}</strong>
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="col-start-1 col-span-6 row-span-2 bg-white rounded-lg p-5">
              <div className="border rounded-lg p-2 h-full">
                <div className="max-w-[450px] h-full mx-auto">
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            label: "Within Marina",
                            value: total.totalRentalWithin,
                            color: "#3366CC",
                          },
                          {
                            label: "Uyo to Calabar",
                            value: total.totalRentalCalabar,
                            color: "#85AD33",
                          },
                          {
                            label: "Calabar to Uyo",
                            value: total.totalRentalUyo,
                            color: "#152b56",
                          },
                        ],
                        innerRadius: 35,
                        outerRadius: 110,
                        paddingAngle: 3,
                        cornerRadius: 5,
                        startAngle: -190,
                        endAngle: 40,
                        cx: 150,
                        cy: 115,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;

const PaymentStatusPieChart = ({ props: { success, pending, canceled } }) => {
  const data = [
    { label: "Success", value: success, color: "#00563B" },
    { label: "Pending", value: pending, color: "#E78913" },
    { label: "Canceled", value: canceled, color: "#AA0000" },
  ];

  const sizing = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    legend: { hidden: true },
  };
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="border rounded-lg">
      <div className="flex items-center max-w-[450px]  mx-auto">
        <PieChart
          series={[
            {
              outerRadius: 80,
              data,
              arcLabel: getArcLabel,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
              fontSize: 14,
            },
          }}
          {...sizing}
        />
        <ul className="w-1/2 space-y-2 pl-2 ">
          <li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#E78913] before:mr-3 text-nowrap">
            Pending
          </li>
          <li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#AA0000] before:mr-3 text-nowrap">
            Cancelled
          </li>
          <li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#00563B] before:mr-3 text-nowrap">
            Success
          </li>
        </ul>
      </div>
    </div>
  );
};

const processData = (data, filter) => {
  const result = {};
  const now = new Date();

  const isDateInRange = (date) => {
    const [year, month, day] = date.split("-");
    const itemDate = new Date(year, month - 1, day);

    switch (filter) {
      case "7days": {
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      case "1month": {
        const lastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return itemDate >= lastMonth;
      }
      case "1year": {
        const lastYear = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        return itemDate >= lastYear;
      }
      default:
        return true;
    }
  };

  data.forEach(({ date, totalRevenue }) => {
    if (isDateInRange(date)) {
      const [month, year] = date.split("-");
      const key = `${month} ${year}`;

      if (!result[key]) {
        result[key] = 0;
      }

      result[key] += totalRevenue;
    }
  });

  return Object.keys(result)
    .sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    })
    .map((key) => {
      const [year, month] = key.split(" ");
      return {
        date: `${format(month, "MMM")} ${year}`,
        totalRevenue: result[key],
      };
    });
};

const CustomizedBarChart = ({ props: { data } }) => {
  const [summary, setSummary] = React.useState([]);
  const [filter, setFilter] = React.useState("1year");
  const [salesRevenue, setSalesRevenue] = React.useState(0);

  React.useEffect(() => {
    const summaryData = processData(data, filter);
    setSummary(summaryData);
  }, [data, filter]);

  React.useEffect(() => {
    const totalSales = summary
      .map((item) => item.totalRevenue)
      .reduce((a, c) => a + c, 0);

    setSalesRevenue(totalSales);
  }, [summary]);

  const dataFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  return (
    <>
      <div className="flex justify-between mb-5">
        <hgroup className="flex gap-1 items-center">
          <h3 className="font-semibold">Sales Revenue</h3>
          <span>
            ({formatValue({ value: String(salesRevenue), prefix: "₦" })})
          </span>
        </hgroup>
        <Select
          defaultValue="1year"
          select
          value={filter}
          onValueChange={(value) => {
            setFilter(value);
          }}
        >
          <SelectTrigger className="w-fit px-5 rounded-lg border bg-gray_iron-100  focus:ring-0 focus:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1year">Last 1 year </SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="1month">Last 1 Month</SelectItem>
              {/* <SelectItem value="1year">Last 1 Year</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <BarChart
        data={summary}
        index="date"
        categories={["totalRevenue"]}
        colors={["blue"]}
        valueFormatter={dataFormatter}
        yAxisWidth={70}
        showLegend={false}
      />
    </>
  );
};
