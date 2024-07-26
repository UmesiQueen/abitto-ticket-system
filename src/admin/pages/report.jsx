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

const Report = () => {
  const [journeyList, setJourneyList] = React.useState([]);
  const { bookingQuery } = React.useContext(BookingCTX);
  const [total, setTotal] = React.useState({
    totalEarnings: 0,
    totalOffline: 0,
    totalOnline: 0,
    totalPassengers: 0,
    totalTrips: 0,
  });

  React.useEffect(() => {
    axios
      .get("https://abitto-api.onrender.com/api/ticket/get")
      .then((res) => {
        setJourneyList(res.data.tickets);
      })
      .catch((error) => {
        console.error(error, "Error occurred while fetching journey list.");
        toast.error(
          "Error occurred while fetching journey list. Refresh page."
        );
      });
  }, []);

  // React.useEffect(() => {
  //   axios
  //     .get("https://abitto-api.onrender.com/api/booking/getbooking")
  //     .then((res) => {
  //       const data = res.data.bookings;
  //       const sorted = data
  //         .filter((item) => item.status == "Success")
  //         .map((item) => ({
  //           amount: item.amount,
  //           created_at: format(new Date(item.created_at), "PP"),
  //         }));

  //       console.log(sorted, "sorted");

  //       // const result = new Array(
  //       //   Object.groupBy(sorted, ({ created_at }) => created_at)
  //       // );

  //       // result[0].map(item=>{})

  //       // console.log(result, "all booking");
  //     })
  //     .catch((error) => {
  //       console.error(error, "Error occurred while all data.");
  //     });
  // }, []);

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

    const totalTrips = journeyList.filter(
      (trip) => trip.trip_status === "Completed"
    ).length;

    if (journeyList.length) {
      setTotal({
        totalEarnings,
        totalOffline,
        totalOnline,
        totalPassengers,
        totalTrips,
      });
    }
  }, [bookingQuery, journeyList]);

  const dataFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

  const chartDataDemo = [
    {
      date: "Jan",
      "first half": 1488,
      "second half": 300,
    },
    {
      date: "Feb",
      "first half": 1445,
      "second half": 900,
    },
    {
      date: "March",
      "first half": 743,
      "second half": 1000,
    },
    {
      date: "April",
      "first half": 281,
      "second half": 1900,
    },
    {
      date: "May",
      "first half": 1501,
      "second half": 1700,
    },
    {
      date: "Jun",
      "first half": 2302,
      "second half": 900,
    },
    {
      date: "July",
      "first half": 1098,
      "second half": 970,
    },
    {
      date: "Aug",
      "first half": 980,
      "second half": 2300,
    },
    {
      date: "Sept",
      "first half": 1998,
      "second half": 1000,
    },
    {
      date: "Oct",
      "first half": 2188,
      "second half": 1300,
    },
    {
      date: "Nov",
      "first half": 98,
      "second half": 2300,
    },
    {
      date: "Dec",
      "first half": 1098,
      "second half": 300,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Report | Admin</title>
      </Helmet>
      <h1 className="text-lg font-semibold">Report Overview</h1>
      <div className="my-8 grid grid-cols-12 gap-5 w-full ">
        <div className="col-start-1 col-span-8 row-start-1 row-span-1 bg-white rounded-lg p-5 ">
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

        <div className="row-start-2 row-span-2 col-start-1 col-span-8 bg-white rounded-lg p-5">
          <div className="flex justify-between mb-5">
            <hgroup className="flex gap-1 items-center">
              <h3 className="font-semibold">Sales Revenue</h3>
              <span>(₦0)</span>
            </hgroup>

            <div className="flex items-center gap-2">
              <button className="rounded-lg p-2 border">13, Feb 2024</button>
              <p>to</p>
              <button className="rounded-lg p-2 border">14, Feb 2024</button>
            </div>
          </div>
          <BarChart
            data={chartDataDemo}
            index="date"
            categories={["first half", "second half"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
            onValueChange={(v) => console.log(v)}
            showLegend={false}
          />
        </div>

        <div className="row-span-3 row-start-1 col-start-9 col-span-4 bg-white rounded-lg  p-5">
          <div className="rounded-lg border h-full p-5 space-y-5 max-w-[370px] mx-auto">
            <h3 className="font-semibold">Booking Overview</h3>
            <div className="relative">
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
                width={"100%"}
                height={"100%"}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
              <div className="w-full absolute top-28 space-y-3">
                <p className="text-center flex flex-col">
                  <strong className=" text-3xl font-semibold">
                    {bookingQuery.length}
                  </strong>
                  <span className="text-[#7F7F7F] text-base">
                    Total Bookings
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-5 items-center mt-10">
                <p className="text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-blue-500 before:mr-3 text-nowrap">
                  {total.totalOffline} Offline Booking
                </p>
                <p className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
                  {total.totalOnline} Online Booking
                </p>
              </div>
            </div>
            <PieChartWithCustomizedLabel />
          </div>
        </div>

        <div className="col-span-full rounded-lg h-96 mt-3">
          <h3 className="font-semibold">Rentals Overview</h3>
          <div className="my-8 grid grid-cols-12 gap-5 grid-rows-2 w-full">
            <div className="col-start-1 col-span-6 row-start-1 row-span-1 bg-white rounded-lg p-5 ">
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
                    <p className="text-xs text-[#7F7F7F] ">Total Rentals</p>
                    <p className="text-base">
                      <strong>
                        {formatValue({ value: String(total.totalPassengers) })}
                      </strong>
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="col-start-1 col-span-6 row-start-2 row-span-1 bg-white rounded-lg p-5 ">
              <ul className="border rounded-lg p-5 flex flex-wrap gap-5 justify-between *:grow items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
                <li className="item flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <WalletIcon />
                  </div>
                  <div>
                    <p className="text-xs text-[#7F7F7F] ">add stuff</p>
                    <p className="text-base">
                      <strong>
                        {formatValue({
                          value: String(0),
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
                    <p className="text-xs text-[#7F7F7F] ">add stuff</p>
                    <p className="text-base">
                      <strong>{formatValue({ value: String(0) })}</strong>
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="col-start-7 col-span-6 row-span-2 bg-white rounded-lg p-5">
              <div className="border rounded-lg p-2 h-full">
                <div className="max-w-[450px] h-full mx-auto">
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            label: "Within Marina",
                            value: total.totalOffline,
                            color: "#3366CC",
                          },
                          {
                            label: "Uyo to Calabar",
                            value: total.totalOnline,
                            color: "#85AD33",
                          },
                          {
                            label: "Calabar to Uyo",
                            value: total.totalOnline,
                            color: "#152b56",
                          },
                        ],
                        innerRadius: 35,
                        outerRadius: 110,
                        paddingAngle: 3,
                        cornerRadius: 5,
                        startAngle: -190,
                        endAngle: 43,
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

const data = [
  { label: "Success", value: 400, color: "#85AD33" },
  { label: "Pending", value: 300, color: "#E78913" },
  { label: "Cancelled", value: 300, color: "#F00000" },
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

function PieChartWithCustomizedLabel() {
  return (
    <div className="flex items-center">
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
        <li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-[#F00000] before:mr-3 text-nowrap">
          Cancelled
        </li>
        <li className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
          Success
        </li>
      </ul>
    </div>
  );
}
