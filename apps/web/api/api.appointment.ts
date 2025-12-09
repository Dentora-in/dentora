import { AppointmentFormData } from "@/interfaces/appointment.interface";
import { useSession } from "@dentora/auth/client";
import axios from "axios";

export const resetPassword = async (email: string) => {
    try {
        const response = await axios.post("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email
        }),
      });

        return response.data;
    } catch (e) {
        console.error(e);
        return e;
    }
};

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

export const getAllAppointments = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (err: any) {
    console.error(err);
    return err;
  }
};

