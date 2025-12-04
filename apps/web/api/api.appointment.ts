import { AppointmentFormData } from "@/interfaces/appointment.interface";
import { useSession } from "@dentora/auth/client";
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

export const getAllAppointments = async () => {
  console.log("<><><><><><<><<><><><><> calleddddddddddddddd")
  try {
    // const session = await useSession();
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>.session", session);
    const token = "uFgWLoOSr8kUHdzvRxP2ccPJNyHbMe8z.N9Os1oHUQGxegqhXNAMgDRazU2og7B9BbHmJEbE5v8w%3D";
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>.token", token);

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/appointment`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (err: any) {
    return err;
  }
};

