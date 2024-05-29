import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import {Request, Response} from 'express';

const customerCaller = async (req: Request, res: Response) => {
  const config: AxiosRequestConfig = {
    method: req.method,
    url: `http://${process.env.CUSTOMER_ALB_NAME}${req.originalUrl}`,
    headers: {},
    data: req.body,
  };
  try {
    const response: AxiosResponse = await axios(config);
    const body = response.data;
    const status = response.status;

    return res.status(status).send(response.data);
  } catch (e: any) {
    if (e.response) {
      const errorStatus = e.response.status;
      if (errorStatus >= 400 && errorStatus < 500)
        return res.status(e.response.status).json(e.response.data);
      return res.status(500).json({message: 'Server error :('});
    }
    return res.status(500).json({message: 'Server error :('});
  }
};

export default customerCaller;
