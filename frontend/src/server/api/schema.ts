import { z } from "zod";
import { isValid, parse } from "date-fns";

// Define the expected date format
export const DATE_FORMAT = "yyyy-MM-dd";

// Create a Zod schema for date validation
export const DateSchema = z.string().refine(
  (value) => {
    // Parse the input string using the specified format
    const parsedDate = parse(value, DATE_FORMAT, new Date());
    // Check if the parsed date is valid
    return isValid(parsedDate);
  },
  {
    message: `Date must be in the format ${DATE_FORMAT}`,
  }
);

export const IdSchema = z.object({
  id: z.number(),
});
