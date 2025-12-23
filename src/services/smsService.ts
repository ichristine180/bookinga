import axios from 'axios';
export const sendSms = async (to: string, message: string) => {
  try {
    const response = await axios.post('https://api.pindo.io/v1/sms/', {
      to,
      sender: 'Bookinga',
      text: message,
    }, {
      headers: {
        Authorization: `${import.meta.env.VITE_PINDO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (err: any) {
    console.error('Failed to send SMS:', err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data || err.message,
    };
  }
};