import React from "react";
import { Helmet } from "react-helmet-async";
import { FerryBoatIcon, UserGroupIcon, WalletIcon } from "@/assets/icons";
import { formatValue } from "react-currency-input-field";
import { BarChart } from "@tremor/react";
import { GlobalCTX } from "@/contexts/GlobalContext";

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

const Report = () => {
  const { dataQuery } = React.useContext(GlobalCTX);
  const [total, setTotal] = React.useState({
    totalEarning: 0,
    totalOffline: 0,
    totalOnline: 0,
    totalPassengers: 0,
    totalTrips: 0,
  });

  React.useEffect(() => {
    const totalEarnings = dataQuery
      .filter((booking) => booking.status === "Success")
      .map((booking) => booking.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const totalOffline = dataQuery.filter(
      (booking) => booking.medium === "Offline"
    ).length;

    const totalOnline = dataQuery.filter(
      (booking) => booking.medium === "Online"
    ).length;

    // TODO: REMOVE NULLISH COALESCING
    const totalPassengers = dataQuery
      .map((booking) => booking.total_passengers ?? 0)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const tripDates = dataQuery
      // .filter((booking) => booking.status === "Success")
      .map((booking) => {
        const date = new Date(booking.departure_date)
          .toISOString()
          .split("T")[0];
        return date;
      });
    const totalTrips = new Set(tripDates).size;

    setTotal({
      totalEarnings,
      totalOffline,
      totalOnline,
      totalPassengers,
      totalTrips,
    });
  }, [dataQuery]);

  const dataFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();
  return (
    <>
      <Helmet>
        <title>Report | Admin</title>
      </Helmet>
      <h1 className="text-lg font-semibold">Report Overview</h1>
      <div className="my-8 grid grid-cols-12 gap-5 w-full ">
        <div className="col-start-1 col-span-8 row-start-1 row-span-1 bg-white rounded-lg p-5 ">
          <ul className="border rounded-lg p-5 flex flex-wrap gap-5 justify-between items-center min-h-[100px] [&_li]:min-w-[25%]  [&_li:not(:first-of-type)]:pl-7 divide-x ">
            <li className="item flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <WalletIcon />
              </div>
              <div>
                <p className="text-xs text-[#7F7F7F] ">Total Earnings (MRR)</p>
                <p className="text-base">
                  <strong>
                    {formatValue({
                      value: String(total.totalEarnings),
                      prefix: "₦",
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
                <p className="text-xs text-[#7F7F7F] ">Total Trips</p>
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
          {/* <div className="bg-[url(https://i.ibb.co/sCr6jMM/Chart.png)] bg-contain bg-no-repeat bg-center h-[400px]" /> */}
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
          {/* <div className="bg-[url(https://i.ibb.co/km0dbXQ/today-booking.png)] bg-contain bg-no-repeat bg-center h-[400px]" /> */}
          <div className="rounded-lg border h-full p-5 space-y-5">
            <h3 className="font-semibold">Booking Overview</h3>
            <div className="relative !mt-10">
              <div className="arc" />
              <div className="w-fit absolute top-24 left-1/2 right-1/2 -translate-x-1/2 space-y-3">
                <p className="text-center flex flex-col">
                  <b className=" text-3xl font-semibold">{dataQuery.length}</b>
                  <span className="text-[#7F7F7F] text-base">
                    Total Bookings
                  </span>
                </p>
                <p className=" !mt-16 text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-blue-500 before:mr-3 text-nowrap">
                  {total.totalOffline} Offline Booking
                </p>
                <p className=" text-[#7F7F7F] before:content-[''] before:px-3 before:rounded-full before:bg-green-500 before:mr-3 text-nowrap">
                  {total.totalOnline} Online Booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
