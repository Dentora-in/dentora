import { AppointmentFormData } from "@/interfaces/appointment.interface";
import axios from "axios";

export const getAllSlotes = async (date: string) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/slotes`,
            {
                params: { date }
            }
        );

        return response.data;
    } catch (e) {
        console.error(e);
        return e;
    }
};

export const newAppointment = async (data: AppointmentFormData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment`,
      data
    );
    return response.data;
  } catch (err: any) {
    return err;
  }
};
