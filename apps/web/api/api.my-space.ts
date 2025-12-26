import axios from "axios";
import { handleApiError } from "@/lib/error-handler";
import { toastService } from "@/lib/toast";

// TODO: @anmole move this interface to shared folder. and import here
export interface AvailabilityInterface {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export const getMySpaceData = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/slotes/doctor/my-space`,
      { withCredentials: true },
    );
    return response.data;
  } catch (err: any) {
    handleApiError(err, "add availability", { showToast: false });
    return err;
  }
};

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

export const deleteDoctorAvailability = async (id: string) => {
  try {
    if (!id) {
      toastService.error("ID not found!");
    }
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/slotes/weekly/${id}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (err: any) {
    handleApiError(err, "add availability", { showToast: false });
    return err;
  }
};
