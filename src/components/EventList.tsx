import prisma from "@/lib/prisma";

// Function to parse a DD/MM/YYYY formatted string into a Date object
const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);
  // Check if the date format is valid
  if (year && month && day) {
    return new Date(year, month - 1, day); // JavaScript months are 0-based
  }
  return null; // Return null if the format is invalid
};

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  // Ensure the date is valid, if not fallback to the current date
  let date = new Date();
  if (dateParam) {
    const parsedDate = parseDate(dateParam); // Try parsing the date
    if (parsedDate && !isNaN(parsedDate.getTime())) {
      date = parsedDate; // Only use the parsed date if it's valid
    } else {
      console.warn(`Invalid date format: ${dateParam}. Falling back to current date.`);
    }
  }

  // Adjust the date to the start of the day (00:00:00) and end of the day (23:59:59)
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {event.startTime.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
          -
          {event.endTime.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
    </div>
  ));
};

export default EventList;
