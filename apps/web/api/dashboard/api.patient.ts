import { handleApiError } from "@/lib/error-handler";
import axios from "axios";

export const getAllPatientAppointment = async (timeline: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment/patient?timeline=${timeline}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (err: any) {
    handleApiError(err, "error getting patient appointments!!");
    throw err;
  }
};

export const editPatientAppointment = async (cancelId: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment/patient`,
      { cancelId: cancelId },
      { withCredentials: true },
    );

    return response.data;
  } catch (err: any) {
    handleApiError(err, "error getting patient appointments!!");
    throw err;
  }
};
