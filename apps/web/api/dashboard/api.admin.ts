import { handleApiError } from "@/lib/error-handler";
import axios from "axios";

export const getControlCenterData = async ({
  page,
  limit,
  role,
}: {
  page: number;
  limit: number;
  role?: string;
}) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/admin/control-center`,
      {
        params: {
          page,
          limit,
          role,
        },
        withCredentials: true,
      },
    );

    return response.data;
  } catch (err: any) {
    handleApiError(err, "fetch control center data");
    throw err;
  }
};

export const updateControlCenterData = async (ids: string[], role: string) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/admin/control-center`,
      {
        ids: ids.map((id) => ({ id })),
        role,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (err: any) {
    handleApiError(err, "update control center data");
    throw err;
  }
};
