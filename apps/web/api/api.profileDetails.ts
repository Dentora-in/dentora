import axios from "axios";

export type EditProfileBody = {
  first_name?: string;
  last_name?: string;
  specialization?: string;
  experienceYears?: number;
  place?: string;
  phoneNo?: string;
  email?: string;
  created_at?: string;
};

export const getProfileDetails = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/profile`,
    { withCredentials: true },
  );

  return data;
};

export const updateProfileDetails = async (editData: EditProfileBody) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v0/profile`,
    editData,
    { withCredentials: true },
  );

  return data;
};
