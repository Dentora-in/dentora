import axios from "axios";
import { handleApiError } from "@/lib/error-handler";

// TODO: @anmole move this interface to shared folder. and import here
export interface AvailabilityInterface {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export const addDoctorAvailability = async (data: AvailabilityInterface) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/slotes/weekly`,
      data,
      { withCredentials: true },
    );
    return response.data;
  } catch (err: any) {
    handleApiError(err, "add availability", { showToast: false });
    return err;
  }
};
