import { AppointmentFormData } from "@/interfaces/appointment.interface";
import axios from "axios";
import { handleApiError } from "@/lib/error-handler";

export const resetPassword = async (email: string) => {
  try {
    const response = await axios.post("/api/auth/request-password-reset", {
      email,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (e) {
    handleApiError(e, "reset password", { showToast: false });
    return e;
  }
};

export const getAllSlotes = async (date: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/slotes`,
      {
        params: { date },
      },
    );

    return response.data;
  } catch (e) {
    handleApiError(e, "fetch available slots", { showToast: false });
    return e;
  }
};

export const newAppointment = async (data: AppointmentFormData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment`,
      data,
    );
    return response.data;
  } catch (err: any) {
    handleApiError(err, "create appointment", { showToast: false });
    return err;
  }
};

export const getAllAppointments = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: string;
}) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment`,
      {
        params: {
          page,
          limit,
          status,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (err: any) {
    handleApiError(err, "fetch appointments");
    throw err;
  }
};

export const updateAppointments = async (ids: string[], status: string) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment`,
      {
        ids: ids.map((id) => ({ id })),
        status,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (err: any) {
    handleApiError(err, "update appointments");
    throw err;
  }
};
