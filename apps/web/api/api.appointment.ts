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
