/* eslint-disable react/prop-types */
import { BoatPart2, BoatPart1, UsersIcon, ChairIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import Button from "../custom/Button";

const Seats = () => {
  const seats = Array.from({ length: 16 }, (_, i) => i + 1);
  const seats2 = Array.from({ length: 14 }, (_, i) => i + 17);
  console.log(seats);
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center font-poppins">
      <section className=" w-[1000px] h-[550px] rounded-lg bg-white p-5 flex gap-4 shadow-md">
        <div className="flex-1 flex flex-col gap-y-8 p-2 h-full">
          <hgroup>
            <h1 className="text-blue-500 font-semibold text-2xl">
              Select a Seat
            </h1>
            <p className="text-sm">
              Select a seat that will enhance your experience
            </p>
          </hgroup>
          <ul className="flex gap-8 *:inline-flex *:gap-2 *:items-center">
            <li>
              <SeatButton
                props={{
                  num: 1,
                  status: "taken",
                }}
              />
              <p>Taken</p>
            </li>
            <li>
              <SeatButton
                props={{
                  num: 23,
                  status: "available",
                }}
              />
              <p>Available</p>
            </li>
          </ul>
          <div>
            <h4 className="font-semibold mb-1">Terminals</h4>
            <p className="text-sm">
              Marina Terminal, Calabar <br />
              {"==>"}
              <br /> Nwaniba Timber Beach Terminal, Uyo
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Seat Selection</h4>
            <ul className="flex gap-8 *:inline-flex *:gap-1 *:items-center">
              <li>
                <ChairIcon /> Seats: B2
              </li>
              <li>
                <UsersIcon /> 1 passenger(s)
              </li>
            </ul>
          </div>
          <Button
            text={"Purchase ticket"}
            className="w-56 mt-auto rounded-lg"
          />
        </div>
        <div className="bg-[#E5E5E5] flex-1 rounded-lg flex pt-5">
          <div className="mx-auto relative">
            <BoatPart1 />
            <div className="absolute top-20 ">
              <div className=" w-fit mx-auto">
                <BoatPart2 />
              </div>
              <div className="mt-8 px-10 flex gap-10 items-end text-sm">
                <ul className=" flex-1 flex flex-wrap gap-1 justify-center ">
                  {seats.map((num) => (
                    <li key={num}>
                      <SeatButton
                        props={{
                          num,
                          status: num === 1 ? "taken" : "available",
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <ul className=" flex-1 flex flex-wrap gap-1  justify-center">
                  {seats2.map((num) => (
                    <li key={num}>
                      <SeatButton
                        props={{
                          num,
                          status: num === 24 ? "taken" : "available",
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Seats;

const SeatButton = (props) => {
  const { num, status } = props.props;
  return (
    <button
      className={cn(
        "w-8 h-8 rounded-lg inline-flex items-center justify-center cursor-pointer hover:bg-[#E5E5E5] hover:text-black transition-all ease-in-out",
        { "bg-blue-500 text-white": status === "available" },
        { "bg-black text-white": status === "taken" }
      )}
    >
      {num}
    </button>
  );
};
